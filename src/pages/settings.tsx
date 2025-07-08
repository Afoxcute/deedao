import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, Chip, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { Horizon, rpc } from '@stellar/stellar-sdk';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { OpaqueButton } from '../components/common/OpaqueButton';
import { Row } from '../components/common/Row';
import { Section, SectionSize } from '../components/common/Section';
import { useSettings } from '../contexts';
import { useWallet } from '../contexts/wallet';
import { usePoolMeta } from '../hooks/api';

export default function SettingsPage() {
  const { getNetworkDetails, walletId, connected } = useWallet();
  const {
    network,
    setNetwork,
    setDefaultNetwork,
    trackPool,
    untrackPool,
    trackedPools,
    addCustomAssetToPool,
    removeCustomAssetFromPool,
    customPools,
    removeCustomPool,
    nftCustomPools,
    removeNFTCustomPool
  } = useSettings();
  const theme = useTheme();
  const router = useRouter();

  const [newNetworkRPCUrl, setNewNetworkRPCUrl] = useState<string>('');
  const [newHorizonUrl, setNewHorizonUrl] = useState<string>('');
  const [safeRpcUrl, setSafeRpcUrl] = useState<string>('');
  const [safeHorizonUrl, setSafeHorizonUrl] = useState<string>('');
  const [canUpdateNetwork, setCanUpdateNetwork] = useState(false);
  const [updateNetworkMessage, setUpdateNetworkMessage] = useState<string>('');
  const [loadingNewNetwork, setLoadingNewNetwork] = useState(false);
  const [newOpts, setNewOpts] = useState<rpc.Server.Options | undefined>(undefined);
  const [poolToAdd, setPoolToAdd] = useState<string>('');
  const [poolIdError, setPoolIdError] = useState('');
  const { data: poolMeta } = usePoolMeta(poolToAdd, poolToAdd.length > 0);

  const [customAssetPoolId, setCustomAssetPoolId] = useState<string>('');
  const [customAssetId, setCustomAssetId] = useState<string>('');
  const [customAssetError, setCustomAssetError] = useState<string>('');
  const { data: customAssetPoolMeta } = usePoolMeta(customAssetPoolId, customAssetPoolId.length > 0);

  function fetchFromWallet() {
    getNetworkDetails().then((networkDetails) => {
      if (networkDetails.rpc) {
        handleChangeRpcUrl(networkDetails.rpc);
        setNewHorizonUrl(networkDetails.horizonUrl);
      }
    });
  }

  function handleUpdateNetworkClick() {
    if (safeRpcUrl && safeHorizonUrl) {
      setNetwork(safeRpcUrl, safeHorizonUrl, newOpts);
      setNewHorizonUrl('');
      setNewNetworkRPCUrl('');
      setLoadingNewNetwork(false);
      setCanUpdateNetwork(false);
      setNewOpts(undefined);
    }
  }

  function handleChangeRpcUrl(rpcUrl: string) {
    setNewNetworkRPCUrl(rpcUrl);
  }

  function handleAddTrackedPool(poolId: string) {
    if (poolMeta && poolMeta.id === poolId) {
      trackPool(poolMeta);
      setPoolToAdd('');
    } else {
      setPoolIdError('Pool not found.');
    }
  }

  function handleChangePoolToAdd(poolId: string) {
    setPoolToAdd(poolId);
  }

  function handleAddCustomAsset() {
    if (!customAssetPoolMeta || customAssetPoolMeta.version !== 'V2') {
      setCustomAssetError('Invalid Pool ID: Must be a V2 pool.');
      return;
    }
    if (!/^[A-Z0-9]{1,12}:[A-Z0-9]{56}$/.test(customAssetId) && !/^[A-Z0-9]{56}$/.test(customAssetId)) {
      setCustomAssetError('Invalid Asset ID: Must be a valid Stellar asset code (e.g., USD) or contract ID.');
      return;
    }

    addCustomAssetToPool(customAssetPoolId, customAssetId);
    setCustomAssetPoolId('');
    setCustomAssetId('');
    setCustomAssetError('');
  }

  const validatePoolId = (poolId: string) => {
    const safePoolId =
      typeof poolId == 'string' && /^[0-9A-Z]{56}$/.test(poolId) ? poolId : undefined;
    if (poolId.length === 0) {
      setPoolIdError('');
      return;
    }

    if (!safePoolId) {
      setPoolIdError(
        'Invalid contract address. Contract addresses begin with "C" and are 56 characters long.'
      );
    } else if (trackedPools.find((pool) => pool.id === safePoolId)) {
      setPoolIdError('Pool is already tracked.');
      return;
    } else {
      setPoolIdError('');
    }
  };

  const validateURLInputs = async (rpcUrl: string, horizonUrl: string) => {
    setLoadingNewNetwork(true);
    if (rpcUrl === '' || horizonUrl === '') {
      setCanUpdateNetwork(false);
      setUpdateNetworkMessage('');
      setLoadingNewNetwork(false);
      return;
    }
    let opts = undefined;
    if (rpcUrl.startsWith('http://')) {
      opts = { allowHttp: true };
    }

    // validate RPC URL
    let sanitizedRpcUrl = rpcUrl;
    try {
      const url = new URL(rpcUrl);
      sanitizedRpcUrl = url.toString();
      const rpcServer = new rpc.Server(sanitizedRpcUrl, opts);
      const defaultInfo = await rpcServer.getNetwork();
      if (defaultInfo.passphrase !== network.passphrase) {
        setCanUpdateNetwork(false);
        setUpdateNetworkMessage('The RPC server does not use the same network.');
        setLoadingNewNetwork(false);
        return;
      }
    } catch (e) {
      setCanUpdateNetwork(false);
      setUpdateNetworkMessage('Failed to validate RPC URL.');
      setLoadingNewNetwork(false);
      return;
    }

    // validate Horizon URL
    let sanitizedHorizonUrl = horizonUrl;
    try {
      const url = new URL(horizonUrl);
      sanitizedHorizonUrl = url.toString();
      const horizonServer = new Horizon.Server(sanitizedHorizonUrl, opts);
      const defaultInfo = await horizonServer.root();
      if (defaultInfo.network_passphrase !== network.passphrase) {
        setCanUpdateNetwork(false);
        setUpdateNetworkMessage('The Horizon server does not use the same network.');
        setLoadingNewNetwork(false);
        return;
      }
    } catch (e) {
      setCanUpdateNetwork(false);
      setUpdateNetworkMessage('Failed to validate Horizon URL.');
      setLoadingNewNetwork(false);
      return;
    }

    // both URLs valid
    setNewOpts(opts);
    setSafeRpcUrl(sanitizedRpcUrl);
    setSafeHorizonUrl(sanitizedHorizonUrl);
    setCanUpdateNetwork(true);
    setUpdateNetworkMessage('');
    setLoadingNewNetwork(false);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      validatePoolId(poolToAdd);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [poolToAdd, trackedPools]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      await validateURLInputs(newNetworkRPCUrl, newHorizonUrl);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [newNetworkRPCUrl, newHorizonUrl]);

  const handleAddCustomPool = () => {
    router.push('/settings/add-pool');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (!connected) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        marginTop: '48px',
        backgroundColor: theme.palette.background.paper,
        padding: '24px',
        borderRadius: '8px'
      }}>
        <Typography variant="h2">Connect your wallet to view settings</Typography>
      </Box>
    );
  }

  return (
    <Row>
      <Section
        width={SectionSize.FULL}
          sx={{
          padding: '24px', 
          display: 'flex', 
            flexDirection: 'column',
          gap: '24px'
        }}
      >
        <Typography variant="h1">Settings</Typography>

        {/* Quick Actions Section */}
        <Box>
          <Typography variant="h2" sx={{ marginBottom: '16px' }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <OpaqueButton
              onClick={() => router.push('/distribute-tokens')}
              palette={theme.palette.primary}
            >
              Distribute Tokens
              </OpaqueButton>
            <OpaqueButton
              onClick={handleAddCustomPool}
              palette={theme.palette.primary}
            >
              Add Custom Pool
            </OpaqueButton>
            <OpaqueButton
              onClick={() => router.push('/settings/add-nft-pool')}
              palette={theme.palette.primary}
            >
              Add NFT Pool
            </OpaqueButton>
          </Box>
        </Box>

        {/* Custom Pools Section */}
        <Box>
          <Typography variant="h2" sx={{ marginBottom: '16px' }}>
            Custom Pools
          </Typography>

          {customPools.length === 0 ? (
            <Box 
              sx={{
                backgroundColor: theme.palette.background.paper,
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <Typography variant="body1">
                No custom pools added yet
              </Typography>
            </Box>
          ) : (
            <Box>
              {customPools.map((pool, index) => (
                <Box
                  key={index}
          sx={{
                    backgroundColor: theme.palette.background.paper,
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 1 }}>
                        <Typography variant="h3">{pool.poolName || 'Unnamed Pool'}</Typography>
                        {pool.isValidated ? (
                          <Tooltip title="Pool validated">
                            <VerifiedIcon color="success" fontSize="small" />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Pool not validated">
                            <WarningIcon color="warning" fontSize="small" />
                          </Tooltip>
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Added on {formatDate(pool.addedAt)}
                      </Typography>
                    </Box>
                    <IconButton 
                      onClick={() => removeCustomPool(pool.poolContractId)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Pool Contract ID
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                      {pool.poolContractId}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
                      Oracle Contract ID
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                      {pool.oracleContractId}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
                      Admin Contract ID
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                      {pool.adminContractId}
                    </Typography>
                  </Box>

                  {/* Display additional pool information if available */}
                  {(pool.apy !== undefined || 
                    pool.fee !== undefined || 
                    pool.referralAddress || 
                    pool.rewardAmount || 
                    pool.claimAmount || 
                    (pool.additionalAdmins && pool.additionalAdmins.length > 0)) && (
                    <Box sx={{ 
                      mt: 2, 
                      pt: 2, 
                      borderTop: `1px solid ${theme.palette.divider}` 
                    }}>
                      <Typography variant="h4" sx={{ mb: 1 }}>Additional Settings</Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {pool.apy !== undefined && (
                          <Chip 
                            label={`APY: ${pool.apy}%`} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        )}
                        
                        {pool.fee !== undefined && (
                          <Chip 
                            label={`Fee: ${pool.fee}%`} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        )}
                        
                        {pool.rewardAmount && (
                          <Chip 
                            label={`Reward: ${pool.rewardAmount}`} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        )}
                        
                        {pool.claimAmount && (
                          <Chip 
                            label={`Claim: ${pool.claimAmount}`} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        )}
                      </Box>
                      
                      {pool.referralAddress && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Referral Address:
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                            {pool.referralAddress}
              </Typography>
                        </Box>
                      )}
                      
                      {pool.additionalAdmins && pool.additionalAdmins.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Additional Admins:
                          </Typography>
                          {pool.additionalAdmins.map((admin, idx) => (
                            <Typography 
                              key={idx} 
                              variant="caption" 
                              color="text.secondary" 
                              sx={{ 
                                display: 'block',
                                wordBreak: 'break-all' 
                              }}
                            >
                              {admin}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* NFT Custom Pools Section */}
        <Box>
          <Typography variant="h2" sx={{ marginBottom: '16px' }}>
            NFT Custom Pools
          </Typography>

          {nftCustomPools.length === 0 ? (
            <Box 
              sx={{
                backgroundColor: theme.palette.background.paper,
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <Typography variant="body1">
                No NFT custom pools added yet
              </Typography>
            </Box>
          ) : (
            <Box>
              {nftCustomPools.map((pool, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 1 }}>
                        <Typography variant="h3">{pool.poolName || 'Unnamed NFT Pool'}</Typography>
                        {pool.isValidated ? (
                          <Tooltip title="NFT Pool validated">
                            <VerifiedIcon color="success" fontSize="small" />
                          </Tooltip>
                        ) : (
                          <Tooltip title="NFT Pool not validated">
                            <WarningIcon color="warning" fontSize="small" />
                          </Tooltip>
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Collection: {pool.collectionName} • Added on {formatDate(pool.addedAt)}
                      </Typography>
                    </Box>
                    <IconButton 
                      onClick={() => removeNFTCustomPool(pool.poolContractId)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Pool Contract ID
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                      {pool.poolContractId}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
                      Collection Contract ID
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                      {pool.collectionContractId}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
                      Staking Contract ID
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                      {pool.stakingContractId}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
                      Vesting Contract ID
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                      {pool.vestingContractId}
                    </Typography>
                  </Box>

                  {/* Display additional NFT pool information if available */}
                  {(pool.stakingApr !== undefined || 
                    pool.vestingDuration !== undefined || 
                    pool.maxStakingAmount !== undefined) && (
                    <Box sx={{ 
                      mt: 2, 
                      pt: 2, 
                      borderTop: `1px solid ${theme.palette.divider}` 
                    }}>
                      <Typography variant="h4" sx={{ mb: 1 }}>NFT Settings</Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {pool.stakingApr !== undefined && (
                          <Chip 
                            label={`Staking APR: ${(pool.stakingApr * 100).toFixed(2)}%`} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        )}
                        
                        {pool.vestingDuration !== undefined && (
                          <Chip 
                            label={`Vesting: ${pool.vestingDuration} days`} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        )}
                        
                        {pool.maxStakingAmount !== undefined && (
                          <Chip 
                            label={`Max Staking: ${pool.maxStakingAmount} NFTs`} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Section>
    </Row>
  );
}
