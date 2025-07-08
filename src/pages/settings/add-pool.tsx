import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AnvilAlert } from '../../components/common/AnvilAlert';
import { OpaqueButton } from '../../components/common/OpaqueButton';
import { Row } from '../../components/common/Row';
import { Section, SectionSize } from '../../components/common/Section';
import { useSettings } from '../../contexts';
import { useWallet } from '../../contexts/wallet';

export default function AddCustomPoolPage() {
  const theme = useTheme();
  const router = useRouter();
  const { connected, walletAddress } = useWallet();
  const { addCustomPool } = useSettings();

  // Basic pool information
  const [poolName, setPoolName] = useState('');
  const [poolContractId, setPoolContractId] = useState('');
  const [oracleContractId, setOracleContractId] = useState('');
  const [adminContractId, setAdminContractId] = useState('');
  
  // Advanced pool settings
  const [apy, setApy] = useState<string>('');
  const [fee, setFee] = useState<string>('');
  const [referralAddress, setReferralAddress] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [additionalAdmins, setAdditionalAdmins] = useState<string[]>([]);
  const [newAdmin, setNewAdmin] = useState('');
  
  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateContractId = (id: string) => {
    // Basic Stellar contract ID validation (starts with 'C' and is 56 characters long)
    return id.startsWith('C') && id.length === 56;
  };

  const validateStellarAddress = (address: string) => {
    // Basic Stellar address validation (starts with 'G' and is 56 characters long)
    return address.startsWith('G') && address.length === 56;
  };

  const handleAddAdmin = () => {
    if (newAdmin && validateStellarAddress(newAdmin)) {
      if (!additionalAdmins.includes(newAdmin)) {
        setAdditionalAdmins([...additionalAdmins, newAdmin]);
      }
      setNewAdmin('');
    }
  };

  const handleRemoveAdmin = (adminToRemove: string) => {
    setAdditionalAdmins(additionalAdmins.filter(admin => admin !== adminToRemove));
  };

  const handleAddPool = async () => {
    // Reset previous messages
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Validate inputs
    if (!connected) {
      setError('Wallet not connected');
      setIsLoading(false);
      return;
    }

    if (!poolName) {
      setError('Pool name is required');
      setIsLoading(false);
      return;
    }

    if (!validateContractId(poolContractId)) {
      setError('Invalid Pool Contract ID');
      setIsLoading(false);
      return;
    }

    if (!validateContractId(oracleContractId)) {
      setError('Invalid Oracle Contract ID');
      setIsLoading(false);
      return;
    }

    if (!validateContractId(adminContractId)) {
      setError('Invalid Admin Contract ID');
      setIsLoading(false);
      return;
    }

    if (referralAddress && !validateStellarAddress(referralAddress)) {
      setError('Invalid Referral Address');
      setIsLoading(false);
      return;
    }

    try {
      await addCustomPool({
        poolContractId,
        oracleContractId,
        adminContractId,
        poolName,
        apy: apy ? parseFloat(apy) : undefined,
        fee: fee ? parseFloat(fee) : undefined,
        referralAddress: referralAddress || undefined,
        rewardAmount: rewardAmount || undefined,
        claimAmount: claimAmount || undefined,
        additionalAdmins: additionalAdmins.length > 0 ? additionalAdmins : undefined,
        addedBy: walletAddress
      });

      setSuccess('Pool added successfully');
      
      // Redirect to pools or settings page after successful addition
      setTimeout(() => {
        router.push('/settings');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add pool');
    } finally {
      setIsLoading(false);
    }
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
        <Typography variant="h2">Connect your wallet to add a custom pool</Typography>
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
          gap: '16px'
        }}
      >
        <Typography variant="h1" sx={{ marginBottom: '24px' }}>
          Add Custom Pool
        </Typography>

        <Typography variant="h2" sx={{ marginBottom: '16px' }}>
          Basic Pool Information
        </Typography>

        <TextField
          fullWidth
          label="Pool Name"
          variant="outlined"
          value={poolName}
          onChange={(e) => setPoolName(e.target.value)}
          required
          helperText="Enter a name for this pool"
        />

        <TextField
          fullWidth
          label="Pool Contract ID"
          variant="outlined"
          value={poolContractId}
          onChange={(e) => setPoolContractId(e.target.value)}
          error={!!poolContractId && !validateContractId(poolContractId)}
          required
          helperText={
            poolContractId && !validateContractId(poolContractId) 
              ? 'Invalid Pool Contract ID' 
              : 'Enter the Stellar contract ID for the pool'
          }
        />

        <TextField
          fullWidth
          label="Oracle Contract ID"
          variant="outlined"
          value={oracleContractId}
          onChange={(e) => setOracleContractId(e.target.value)}
          error={!!oracleContractId && !validateContractId(oracleContractId)}
          required
          helperText={
            oracleContractId && !validateContractId(oracleContractId) 
              ? 'Invalid Oracle Contract ID' 
              : 'Enter the Stellar contract ID for the oracle'
          }
        />

        <TextField
          fullWidth
          label="Admin Contract ID"
          variant="outlined"
          value={adminContractId}
          onChange={(e) => setAdminContractId(e.target.value)}
          error={!!adminContractId && !validateContractId(adminContractId)}
          required
          helperText={
            adminContractId && !validateContractId(adminContractId) 
              ? 'Invalid Admin Contract ID' 
              : 'Enter the Stellar contract ID for the pool admin'
          }
        />

        <Divider sx={{ my: 2 }} />

        <Accordion sx={{ backgroundColor: theme.palette.background.paper }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h2">Advanced Pool Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="APY (%)"
                  variant="outlined"
                  type="number"
                  value={apy}
                  onChange={(e) => setApy(e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  helperText="Annual Percentage Yield"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fee (%)"
                  variant="outlined"
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  helperText="Transaction fee percentage"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Referral Address"
                  variant="outlined"
                  value={referralAddress}
                  onChange={(e) => setReferralAddress(e.target.value)}
                  error={!!referralAddress && !validateStellarAddress(referralAddress)}
                  helperText={
                    referralAddress && !validateStellarAddress(referralAddress)
                      ? 'Invalid Stellar address'
                      : 'Stellar address for referral rewards'
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Reward Amount"
                  variant="outlined"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value)}
                  helperText="Amount of tokens for rewards"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Claim Amount"
                  variant="outlined"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  helperText="Amount of tokens that can be claimed"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h3" sx={{ mb: 2 }}>Additional Admins</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Admin Address"
                    variant="outlined"
                    value={newAdmin}
                    onChange={(e) => setNewAdmin(e.target.value)}
                    error={!!newAdmin && !validateStellarAddress(newAdmin)}
                    helperText={
                      newAdmin && !validateStellarAddress(newAdmin)
                        ? 'Invalid Stellar address'
                        : 'Stellar address for additional admin'
                    }
                  />
                  <IconButton 
                    color="primary" 
                    onClick={handleAddAdmin}
                    disabled={!newAdmin || !validateStellarAddress(newAdmin)}
                    sx={{ ml: 1 }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                {additionalAdmins.length > 0 && (
                  <Box sx={{ 
                    backgroundColor: theme.palette.background.default,
                    borderRadius: '4px',
                    p: 2
                  }}>
                    {additionalAdmins.map((admin, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: index < additionalAdmins.length - 1 ? 1 : 0,
                          p: 1,
                          borderRadius: '4px',
                          backgroundColor: theme.palette.background.paper
                        }}
                      >
                        <Typography variant="body2">{admin}</Typography>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleRemoveAdmin(admin)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <OpaqueButton
          onClick={handleAddPool}
          palette={theme.palette.primary}
          disabled={
            isLoading ||
            !poolName ||
            !poolContractId || 
            !oracleContractId || 
            !adminContractId || 
            !validateContractId(poolContractId) ||
            !validateContractId(oracleContractId) ||
            !validateContractId(adminContractId) ||
            (!!referralAddress && !validateStellarAddress(referralAddress))
          }
          sx={{ marginTop: '24px' }}
        >
          {isLoading ? 'Adding Pool...' : 'Add Pool'}
        </OpaqueButton>

        {error && (
          <AnvilAlert 
            severity="error" 
            message={error} 
          />
        )}
        {success && (
          <AnvilAlert 
            severity="success" 
            message={success} 
          />
        )}
      </Section>
    </Row>
  );
} 