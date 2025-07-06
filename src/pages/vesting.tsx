import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Divider } from '../components/common/Divider';
import { Row } from '../components/common/Row';
import { VestingClaim } from '../components/vesting/VestingClaim';
import { VestingSchedule } from '../components/vesting/VestingSchedule';
import { useSettings } from '../contexts';
import { useWallet } from '../contexts/wallet';
import theme from '../theme';

export default function VestingPage() {
  const { walletId } = useWallet();
  const { lastPool } = useSettings();
  const [totalVested, setTotalVested] = useState<string>('0');
  const [claimableAmount, setClaimableAmount] = useState<string>('0');
  const [vestingSchedules, setVestingSchedules] = useState<Array<{
    amount: string;
    startTime: number;
    endTime: number;
    claimed: boolean;
  }>>([]);

  useEffect(() => {
    // TODO: Fetch vesting data from contract
    if (walletId && lastPool) {
      // Example data - replace with actual contract calls
      setVestingSchedules([
        {
          amount: '1000',
          startTime: Date.now(),
          endTime: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
          claimed: false
        },
        {
          amount: '2000',
          startTime: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
          endTime: Date.now() + 15 * 24 * 60 * 60 * 1000, // 15 days more
          claimed: false
        }
      ]);
      setTotalVested('3000');
      setClaimableAmount('1500');
    }
  }, [walletId, lastPool]);

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <Row sx={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Typography variant="h1">Token Vesting</Typography>
      </Row>
      <Divider />
      
      <Row sx={{ marginTop: '24px', gap: '24px' }}>
        <Box sx={{ 
          flex: 1, 
          backgroundColor: theme.palette.background.paper,
          padding: '24px',
          borderRadius: '8px'
        }}>
          <Typography variant="h2">Total Vested</Typography>
          <Typography variant="h1" sx={{ color: theme.palette.primary.main }}>
            {totalVested} BLND
          </Typography>
        </Box>
        <Box sx={{ 
          flex: 1, 
          backgroundColor: theme.palette.background.paper,
          padding: '24px',
          borderRadius: '8px'
        }}>
          <Typography variant="h2">Claimable Amount</Typography>
          <Typography variant="h1" sx={{ color: theme.palette.success.main }}>
            {claimableAmount} BLND
          </Typography>
        </Box>
      </Row>

      <VestingSchedule schedules={vestingSchedules} />
      <VestingClaim claimableAmount={claimableAmount} />
    </Box>
  );
} 