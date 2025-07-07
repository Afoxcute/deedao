import { Box, TextField, Typography, useTheme } from '@mui/material';
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

  const [poolContractId, setPoolContractId] = useState('');
  const [oracleContractId, setOracleContractId] = useState('');
  const [adminContractId, setAdminContractId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateContractId = (id: string) => {
    // Basic Stellar contract ID validation (starts with 'C' and is 56 characters long)
    return id.startsWith('C') && id.length === 56;
  };

  const handleAddPool = async () => {
    // Reset previous messages
    setError(null);
    setSuccess(null);

    // Validate inputs
    if (!connected) {
      setError('Wallet not connected');
      return;
    }

    if (!validateContractId(poolContractId)) {
      setError('Invalid Pool Contract ID');
      return;
    }

    if (!validateContractId(oracleContractId)) {
      setError('Invalid Oracle Contract ID');
      return;
    }

    if (!validateContractId(adminContractId)) {
      setError('Invalid Admin Contract ID');
      return;
    }

    try {
      // TODO: Add actual pool validation logic
      await addCustomPool({
        poolContractId,
        oracleContractId,
        adminContractId,
        addedBy: walletAddress
      });

      setSuccess('Pool added successfully');
      
      // Redirect to pools or settings page after successful addition
      router.push('/settings');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add pool');
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

        <TextField
          fullWidth
          label="Pool Contract ID"
          variant="outlined"
          value={poolContractId}
          onChange={(e) => setPoolContractId(e.target.value)}
          error={!!poolContractId && !validateContractId(poolContractId)}
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
          helperText={
            adminContractId && !validateContractId(adminContractId) 
              ? 'Invalid Admin Contract ID' 
              : 'Enter the Stellar contract ID for the pool admin'
          }
        />

        <OpaqueButton
          onClick={handleAddPool}
          palette={theme.palette.primary}
          disabled={
            !poolContractId || 
            !oracleContractId || 
            !adminContractId || 
            !validateContractId(poolContractId) ||
            !validateContractId(oracleContractId) ||
            !validateContractId(adminContractId)
          }
          sx={{ marginTop: '16px' }}
        >
          Add Pool
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