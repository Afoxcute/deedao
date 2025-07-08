import { Box, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { AnvilAlert } from '../components/common/AnvilAlert';
import { InputBar } from '../components/common/InputBar';
import { InputButton } from '../components/common/InputButton';
import { OpaqueButton } from '../components/common/OpaqueButton';
import { Row } from '../components/common/Row';
import { Section, SectionSize } from '../components/common/Section';
import { Skeleton } from '../components/common/Skeleton';
import { TxFeeSelector } from '../components/common/TxFeeSelector';
import { TxOverview } from '../components/common/TxOverview';
import { toUSDBalance } from '../components/common/USDBalance';
import { Value } from '../components/common/Value';
import { useSettings, ViewType } from '../contexts';
import { TxStatus, TxType, useWallet } from '../contexts/wallet';
import {
    useHorizonAccount,
    usePool,
    usePoolMeta,
    usePoolOracle,
    useTokenBalance,
    useTokenMetadata,
} from '../hooks/api';
import { RPC_DEBOUNCE_DELAY, useDebouncedState } from '../hooks/debounce';
import { getErrorFromSim } from '../utils/txSim';

export default function UnstakePage() {
  const theme = useTheme();
  const router = useRouter();
  const { viewType } = useSettings();
  const { connected, walletAddress, txStatus, txType, isLoading } = useWallet();

  const safePoolId = router.query.poolId as string;
  const { data: poolMeta } = usePoolMeta(safePoolId, safePoolId !== undefined && safePoolId !== '');
  const { data: pool } = usePool(poolMeta);
  const { data: poolOracle } = usePoolOracle(pool);

  // Hardcoded BLND token address for testnet
  const BLND_TOKEN_ADDRESS = 'CDJEHTBE6ZHUXSWFI642DCGLUOECLHPF3KSXHPXTSTJ7E3JF6MQ5EZYY';

  const { data: tokenMetadata } = useTokenMetadata(BLND_TOKEN_ADDRESS);
  const { data: horizonAccount } = useHorizonAccount();
  const { data: tokenBalance } = useTokenBalance(
    BLND_TOKEN_ADDRESS,
    tokenMetadata?.asset,
    horizonAccount
  );

  const [toUnstake, setToUnstake] = useState<string>('');
  const [loadingEstimate, setLoadingEstimate] = useState<boolean>(false);

  const loading = isLoading || loadingEstimate;
  const decimals = 7; // BLND token decimals
  const symbol = tokenMetadata?.symbol ?? 'BLND';

  if (txStatus === TxStatus.SUCCESS && txType === TxType.CONTRACT && Number(toUnstake) != 0) {
    setToUnstake('');
  }

  // TODO: Get staked balance instead of wallet balance
  const stakedBalance = 1000; // Replace with actual staked balance
  const freeUserBalanceScaled = stakedBalance;

  const { isSubmitDisabled, isMaxDisabled, reason, disabledType, isError } = useMemo(
    () => getErrorFromSim(toUnstake, decimals, loading, undefined, undefined),
    [freeUserBalanceScaled, toUnstake, loading]
  );

  const handleSubmitTransaction = async () => {
    if (toUnstake && connected && poolMeta) {
      // TODO: Implement unstaking transaction
      console.log('Unstaking:', toUnstake);
      router.push('/staking');
    }
  };

  useDebouncedState(toUnstake, RPC_DEBOUNCE_DELAY, txType, async () => {
    // TODO: Implement unstaking simulation
    setLoadingEstimate(false);
  });

  if (pool === undefined) {
    return <Skeleton />;
  }

  const handleUnstakeMax = () => {
    if (freeUserBalanceScaled > 0) {
      setToUnstake(freeUserBalanceScaled.toFixed(decimals));
      setLoadingEstimate(true);
    }
  };

  return (
    <Row>
      <Section
        width={SectionSize.FULL}
        sx={{ padding: '0px', display: 'flex', flexDirection: 'column' }}
      >
        <Box
          sx={{
            background: theme.palette.warning.main,
            width: '100%',
            borderRadius: '5px',
            padding: '12px',
            marginBottom: '12px',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          }}
        >
          <Typography variant="body2" sx={{ marginLeft: '12px', marginBottom: '12px' }}>
            Amount to unstake
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: '35px',
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '6px',
            }}
          >
            <InputBar
              symbol={symbol}
              value={toUnstake}
              onValueChange={(v) => {
                setToUnstake(v);
                setLoadingEstimate(true);
              }}
              sx={{ width: '100%' }}
              palette={theme.palette.warning}
            >
              <InputButton
                palette={theme.palette.warning}
                onClick={handleUnstakeMax}
                disabled={isMaxDisabled}
                text="MAX"
              />
            </InputBar>
            {viewType !== ViewType.MOBILE && (
              <OpaqueButton
                onClick={handleSubmitTransaction}
                palette={theme.palette.warning}
                sx={{ minWidth: '108px', marginLeft: '12px', padding: '6px' }}
                disabled={isSubmitDisabled}
              >
                Unstake
              </OpaqueButton>
            )}
          </Box>
          <Box
            sx={{
              marginLeft: '6px',
              display: 'flex',
              flexDirection: 'row',
              gap: '12px',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" sx={{ color: theme.palette.text.secondary }}>
              {toUSDBalance(1, Number(toUnstake ?? 0))} {/* Using 1 as price temporarily */}
            </Typography>
            <TxFeeSelector />
          </Box>
          {viewType === ViewType.MOBILE && (
            <OpaqueButton
              onClick={handleSubmitTransaction}
              palette={theme.palette.warning}
              sx={{ minWidth: '108px', width: '100%', padding: '6px', marginTop: '6px' }}
              disabled={isSubmitDisabled}
            >
              Unstake
            </OpaqueButton>
          )}
        </Box>
        {!isError && (
          <TxOverview>
            <Value title="Amount to unstake" value={`${toUnstake ?? '0'} ${symbol}`} />
          </TxOverview>
        )}
        {reason && <AnvilAlert severity={disabledType} message={reason} />}
      </Section>
    </Row>
  );
} 