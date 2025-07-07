import { Box, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Row } from '../../components/common/Row';
import { Section, SectionSize } from '../../components/common/Section';
import { VestingClaim } from '../../components/vesting/VestingClaim';
import { VestingSchedule } from '../../components/vesting/VestingSchedule';
import { useSettings } from '../../contexts';
import { useWallet } from '../../contexts/wallet';
import { usePool, usePoolMeta, useTokenMetadata } from '../../hooks/api';

export default function VestingDetailsPage() {
  const theme = useTheme();
  const router = useRouter();
  const { walletId } = useWallet();
  const { lastPool } = useSettings();

  const poolId = (router.query.poolId as string) || lastPool?.id || '';
  const assetId = router.query.assetId as string;

  const { data: poolMeta } = usePoolMeta(poolId);
  const { data: pool } = usePool(poolMeta);
  const { data: tokenMetadata } = useTokenMetadata(assetId);

  // Vesting schedule configuration
  const vestingConfig = useMemo(() => {
    const totalAmount = 10000; // Total tokens to vest
    const cliffMonths = 6; // 6-month cliff
    const vestingMonths = 24; // Total vesting period of 2 years
    const now = Date.now();

    // Cliff end date
    const cliffEndDate = now + (cliffMonths * 30 * 24 * 60 * 60 * 1000);

    // Create 4 equal vesting schedules after cliff period
    const schedules = [
      {
        amount: (totalAmount * 0.25).toFixed(2),
        startTime: cliffEndDate,
        endTime: cliffEndDate + (vestingMonths / 4 * 30 * 24 * 60 * 60 * 1000),
        claimed: false
      },
      {
        amount: (totalAmount * 0.25).toFixed(2),
        startTime: cliffEndDate + (vestingMonths / 4 * 30 * 24 * 60 * 60 * 1000),
        endTime: cliffEndDate + (vestingMonths / 2 * 30 * 24 * 60 * 60 * 1000),
        claimed: false
      },
      {
        amount: (totalAmount * 0.25).toFixed(2),
        startTime: cliffEndDate + (vestingMonths / 2 * 30 * 24 * 60 * 60 * 1000),
        endTime: cliffEndDate + (vestingMonths * 3 / 4 * 30 * 24 * 60 * 60 * 1000),
        claimed: false
      },
      {
        amount: (totalAmount * 0.25).toFixed(2),
        startTime: cliffEndDate + (vestingMonths * 3 / 4 * 30 * 24 * 60 * 60 * 1000),
        endTime: cliffEndDate + (vestingMonths * 30 * 24 * 60 * 60 * 1000),
        claimed: false
      }
    ];

    return {
      totalAmount: totalAmount.toFixed(2),
      cliffEndDate,
      schedules
    };
  }, []);

  // Calculate claimable amount
  const claimableAmount = useMemo(() => {
    const now = Date.now();
    return vestingConfig.schedules
      .filter(schedule => now >= schedule.startTime && !schedule.claimed)
      .reduce((sum, schedule) => sum + parseFloat(schedule.amount), 0)
      .toFixed(2);
  }, [vestingConfig]);

  if (!walletId) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        marginTop: '48px',
        backgroundColor: theme.palette.background.paper,
        padding: '24px',
        borderRadius: '8px'
      }}>
        <Typography variant="h2">Connect your wallet to view vesting details</Typography>
      </Box>
    );
  }

  return (
    <Row>
      <Section
        width={SectionSize.FULL}
        sx={{ padding: '24px', display: 'flex', flexDirection: 'column' }}
      >
        <Typography variant="h1" sx={{ marginBottom: '24px' }}>
          {tokenMetadata?.symbol || 'Token'} Vesting Details
        </Typography>

        <VestingSchedule schedules={vestingConfig.schedules} />
        <VestingClaim claimableAmount={claimableAmount} />
      </Section>
    </Row>
  );
} 