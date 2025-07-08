import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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

export default function AddNFTPoolPage() {
  const theme = useTheme();
  const router = useRouter();
  const { connected, walletAddress } = useWallet();
  const { addNFTCustomPool } = useSettings();

  const [formData, setFormData] = useState({
    poolContractId: '',
    collectionContractId: '',
    stakingContractId: '',
    vestingContractId: '',
    poolName: '',
    collectionName: '',
    stakingApr: '',
    vestingDuration: '',
    maxStakingAmount: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateContractId = (contractId: string) => {
    return contractId.startsWith('C') && contractId.length === 56;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required fields
      if (!formData.poolContractId || !formData.collectionContractId || 
          !formData.stakingContractId || !formData.vestingContractId ||
          !formData.poolName || !formData.collectionName) {
        throw new Error('Please fill in all required fields');
      }

      // Validate contract IDs
      if (!validateContractId(formData.poolContractId)) {
        throw new Error('Invalid pool contract ID');
      }
      if (!validateContractId(formData.collectionContractId)) {
        throw new Error('Invalid collection contract ID');
      }
      if (!validateContractId(formData.stakingContractId)) {
        throw new Error('Invalid staking contract ID');
      }
      if (!validateContractId(formData.vestingContractId)) {
        throw new Error('Invalid vesting contract ID');
      }

      // Validate numeric fields
      const stakingApr = formData.stakingApr ? parseFloat(formData.stakingApr) : undefined;
      const vestingDuration = formData.vestingDuration ? parseInt(formData.vestingDuration) : undefined;
      const maxStakingAmount = formData.maxStakingAmount ? parseInt(formData.maxStakingAmount) : undefined;

      if (stakingApr !== undefined && (stakingApr < 0 || stakingApr > 1)) {
        throw new Error('Staking APR must be between 0 and 1 (0% to 100%)');
      }
      if (vestingDuration !== undefined && vestingDuration <= 0) {
        throw new Error('Vesting duration must be positive');
      }
      if (maxStakingAmount !== undefined && maxStakingAmount <= 0) {
        throw new Error('Max staking amount must be positive');
      }

      // Add the NFT pool
      await addNFTCustomPool({
        poolContractId: formData.poolContractId,
        collectionContractId: formData.collectionContractId,
        stakingContractId: formData.stakingContractId,
        vestingContractId: formData.vestingContractId,
        poolName: formData.poolName,
        collectionName: formData.collectionName,
        stakingApr,
        vestingDuration,
        maxStakingAmount,
        addedBy: walletAddress || 'unknown'
      });

      setSuccess('NFT Pool added successfully!');
      
      // Reset form
      setFormData({
        poolContractId: '',
        collectionContractId: '',
        stakingContractId: '',
        vestingContractId: '',
        poolName: '',
        collectionName: '',
        stakingApr: '',
        vestingDuration: '',
        maxStakingAmount: ''
      });

      // Redirect to settings after a delay
      setTimeout(() => {
        router.push('/settings');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add NFT pool');
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
        <Typography variant="h2">Connect your wallet to add NFT pools</Typography>
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
        <Typography variant="h1" sx={{ marginBottom: '16px' }}>
          Add NFT Custom Pool
        </Typography>

        <Paper sx={{ padding: '24px', marginBottom: '24px' }}>
          <Typography variant="h2" sx={{ marginBottom: '16px' }}>
            Pool Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Pool Contract ID *"
                variant="outlined"
                value={formData.poolContractId}
                onChange={(e) => handleInputChange('poolContractId', e.target.value)}
                error={!!formData.poolContractId && !validateContractId(formData.poolContractId)}
                helperText={
                  formData.poolContractId && !validateContractId(formData.poolContractId)
                    ? 'Invalid contract ID format'
                    : 'Enter the pool contract ID (starts with C, 56 characters)'
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Pool Name *"
                variant="outlined"
                value={formData.poolName}
                onChange={(e) => handleInputChange('poolName', e.target.value)}
                helperText="Enter a descriptive name for the pool"
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ padding: '24px', marginBottom: '24px' }}>
          <Typography variant="h2" sx={{ marginBottom: '16px' }}>
            Collection Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Collection Contract ID *"
                variant="outlined"
                value={formData.collectionContractId}
                onChange={(e) => handleInputChange('collectionContractId', e.target.value)}
                error={!!formData.collectionContractId && !validateContractId(formData.collectionContractId)}
                helperText={
                  formData.collectionContractId && !validateContractId(formData.collectionContractId)
                    ? 'Invalid contract ID format'
                    : 'Enter the NFT collection contract ID'
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Collection Name *"
                variant="outlined"
                value={formData.collectionName}
                onChange={(e) => handleInputChange('collectionName', e.target.value)}
                helperText="Enter the name of the NFT collection"
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ padding: '24px', marginBottom: '24px' }}>
          <Typography variant="h2" sx={{ marginBottom: '16px' }}>
            Staking Configuration
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Staking Contract ID *"
                variant="outlined"
                value={formData.stakingContractId}
                onChange={(e) => handleInputChange('stakingContractId', e.target.value)}
                error={!!formData.stakingContractId && !validateContractId(formData.stakingContractId)}
                helperText={
                  formData.stakingContractId && !validateContractId(formData.stakingContractId)
                    ? 'Invalid contract ID format'
                    : 'Enter the staking contract ID'
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Staking APR (optional)"
                variant="outlined"
                type="number"
                value={formData.stakingApr}
                onChange={(e) => handleInputChange('stakingApr', e.target.value)}
                InputProps={{
                  inputProps: { min: 0, max: 1, step: 0.01 }
                }}
                helperText="Annual percentage rate as decimal (e.g., 0.05 for 5%)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Max Staking Amount (optional)"
                variant="outlined"
                type="number"
                value={formData.maxStakingAmount}
                onChange={(e) => handleInputChange('maxStakingAmount', e.target.value)}
                InputProps={{
                  inputProps: { min: 1 }
                }}
                helperText="Maximum number of NFTs that can be staked"
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ padding: '24px', marginBottom: '24px' }}>
          <Typography variant="h2" sx={{ marginBottom: '16px' }}>
            Vesting Configuration
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vesting Contract ID *"
                variant="outlined"
                value={formData.vestingContractId}
                onChange={(e) => handleInputChange('vestingContractId', e.target.value)}
                error={!!formData.vestingContractId && !validateContractId(formData.vestingContractId)}
                helperText={
                  formData.vestingContractId && !validateContractId(formData.vestingContractId)
                    ? 'Invalid contract ID format'
                    : 'Enter the vesting contract ID'
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vesting Duration (days, optional)"
                variant="outlined"
                type="number"
                value={formData.vestingDuration}
                onChange={(e) => handleInputChange('vestingDuration', e.target.value)}
                InputProps={{
                  inputProps: { min: 1 }
                }}
                helperText="Duration of the vesting period in days"
              />
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/settings')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <OpaqueButton
            onClick={handleSubmit}
            palette={theme.palette.primary}
            disabled={isLoading}
          >
            {isLoading ? 'Adding Pool...' : 'Add NFT Pool'}
          </OpaqueButton>
        </Box>

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