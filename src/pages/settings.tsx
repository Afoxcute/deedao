import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
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
    removeCustomPool
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

        {/* Custom Pools Section */}
        <Box>
          <Row sx={{ 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px' 
          }}>
            <Typography variant="h2">Custom Pools</Typography>
            <OpaqueButton 
              onClick={handleAddCustomPool}
              palette={theme.palette.primary}
            >
              Add Custom Pool
            </OpaqueButton>
          </Row>

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
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Pool Contract ID
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {pool.poolContractId}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', marginTop: '8px' }}>
                      Oracle Contract ID
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {pool.oracleContractId}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', marginTop: '8px' }}>
                      Admin Contract ID
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {pool.adminContractId}
                    </Typography>
                  </Box>
                  <IconButton 
                    onClick={() => removeCustomPool(pool.poolContractId)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Section>
    </Row>
  );
}
