import { parseResult, PoolContractV1, Positions, RequestType, SubmitArgs } from '@blend-capital/blend-sdk';
import { Box, Typography, useTheme } from '@mui/material';
import { rpc } from '@stellar/stellar-sdk';
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
import { toCompactAddress } from '../utils/formatter';
import { getAssetReserve } from '../utils/horizon';
import { scaleInputToBigInt } from '../utils/scval';
import { getErrorFromSim } from '../utils/txSim';

export default function StakePage() {
  const theme = useTheme();
  const router = useRouter();
  const { viewType } = useSettings();
  const { connected, walletAddress, poolSubmit, txStatus, txType, isLoading } = useWallet();

  const { data: poolMeta } = usePoolMeta(router.query.poolId as string);
  const { data: pool } = usePool(poolMeta);
  const { data: poolOracle } = usePoolOracle(pool);
  const assetId = router.query.assetId as string;
  const reserve = pool?.reserves.get(assetId);
  const { data: tokenMetadata } = useTokenMetadata(assetId);
  const { data: horizonAccount } = useHorizonAccount();
  const { data: tokenBalance } = useTokenBalance(
    assetId,
    tokenMetadata?.asset,
    horizonAccount
  );

  const [toStake, setToStake] = useState<string>('');
  const [simResponse, setSimResponse] = useState<rpc.Api.SimulateTransactionResponse>();
  const [parsedSimResult, setParsedSimResult] = useState<Positions>();
  const [loadingEstimate, setLoadingEstimate] = useState<boolean>(false);

  const loading = isLoading || loadingEstimate;
  const decimals = reserve?.config.decimals ?? 7;
  const symbol = tokenMetadata?.symbol ?? toCompactAddress(assetId);

  if (txStatus === TxStatus.SUCCESS && txType === TxType.CONTRACT && Number(toStake) != 0) {
    setToStake('');
  }

  // calculate current wallet state
  const stellar_reserve_amount = getAssetReserve(horizonAccount, tokenMetadata?.asset);
  const freeUserBalanceScaled = tokenBalance ? Number(tokenBalance) / Math.pow(10, decimals) : 0;

  const { isSubmitDisabled, isMaxDisabled, reason, disabledType, isError } = useMemo(
    () => getErrorFromSim(toStake, decimals, loading, simResponse, undefined),
    [freeUserBalanceScaled, toStake, loading, simResponse]
  );

  const handleSubmitTransaction = async (sim: boolean) => {
    if (toStake && connected && poolMeta && reserve) {
      let submitArgs: SubmitArgs = {
        from: walletAddress,
        spender: walletAddress,
        to: walletAddress,
        requests: [
          {
            amount: scaleInputToBigInt(toStake, reserve.config.decimals),
            request_type: RequestType.SupplyCollateral, // Staking uses SupplyCollateral request type
            address: reserve.assetId,
          },
        ],
      };
      let response = await poolSubmit(poolMeta, submitArgs, sim);
      if (response && sim) {
        setSimResponse(response);
        if (rpc.Api.isSimulationSuccess(response)) {
          setParsedSimResult(parseResult(response, PoolContractV1.parsers.submit));
        } else {
          console.error('Simulation failed', response);
        }
      }
      return response;
    }
  };

  useDebouncedState(toStake, RPC_DEBOUNCE_DELAY, txType, async () => {
    setSimResponse(undefined);
    setParsedSimResult(undefined);
    let response = await handleSubmitTransaction(true);
    if (response) {
      setSimResponse(response);
      if (rpc.Api.isSimulationSuccess(response)) {
        setParsedSimResult(parseResult(response, PoolContractV1.parsers.submit));
      }
    }
    setLoadingEstimate(false);
  });

  if (pool === undefined || !assetId || !reserve) {
    return <Skeleton />;
  }

  const handleStakeMax = () => {
    if (freeUserBalanceScaled > 0) {
      setToStake(freeUserBalanceScaled.toFixed(decimals));
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
            background: theme.palette.primary.main,
            width: '100%',
            borderRadius: '5px',
            padding: '12px',
            marginBottom: '12px',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          }}
        >
          <Typography variant="body2" sx={{ marginLeft: '12px', marginBottom: '12px' }}>
            Amount to stake
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
              value={toStake}
              onValueChange={(v) => {
                setToStake(v);
                setLoadingEstimate(true);
              }}
              sx={{ width: '100%' }}
              palette={theme.palette.primary}
            >
              <InputButton
                palette={theme.palette.primary}
                onClick={handleStakeMax}
                disabled={isMaxDisabled}
                text="MAX"
              />
            </InputBar>
            {viewType !== ViewType.MOBILE && (
              <OpaqueButton
                onClick={async () => {
                  const response = await handleSubmitTransaction(false);
                  if (response && rpc.Api.isSimulationSuccess(response)) {
                    router.push('/staking');
                  } else if (response) {
                    console.error('Transaction failed', response);
                  }
                }}
                palette={theme.palette.primary}
                sx={{ minWidth: '108px', marginLeft: '12px', padding: '6px' }}
                disabled={isSubmitDisabled}
              >
                Stake
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
              {toUSDBalance(poolOracle?.getPriceFloat(assetId) ?? 1, Number(toStake ?? 0))}
            </Typography>
            <TxFeeSelector />
          </Box>
          {viewType === ViewType.MOBILE && (
            <OpaqueButton
              onClick={async () => {
                const response = await handleSubmitTransaction(false);
                if (response && rpc.Api.isSimulationSuccess(response)) {
                  router.push('/staking');
                } else if (response) {
                  console.error('Transaction failed', response);
                }
              }}
              palette={theme.palette.primary}
              sx={{ minWidth: '108px', width: '100%', padding: '6px', marginTop: '6px' }}
              disabled={isSubmitDisabled}
            >
              Stake
            </OpaqueButton>
          )}
        </Box>
        {!isError && (
          <TxOverview>
            <Value title="Amount to stake" value={`${toStake ?? '0'} ${symbol}`} />
          </TxOverview>
        )}
        {reason && <AnvilAlert severity={disabledType} message={reason} />}
      </Section>
    </Row>
  );
} 