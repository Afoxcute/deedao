import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, IconButton, NoSsr, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Networks } from '@stellar/stellar-sdk';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { FaucetBanner } from '../components/common/FaucetBanner';
import { OverlayModal } from '../components/common/OverlayModal';
import { OverlayModalTOS } from '../components/common/OverlayModalTOS';
import { Row } from '../components/common/Row';
import { WalletWarning } from '../components/common/WalletWarning';
import { SideBar } from '../components/nav/SideBar';
import { useSettings, ViewType } from '../contexts';
import { useWallet } from '../contexts/wallet';
import { useBackstop, useFeeStats, usePoolMeta } from '../hooks/api';

export default function DefaultLayout({ children }: { children: ReactNode }) {
  const { viewType, trackPool, setLastPool, setMobileOpen, mobileOpen } = useSettings();
  const { txInclusionFee, setTxInclusionFee } = useWallet();
  const router = useRouter();
  const { poolId } = router.query;
  const safePoolId =
    typeof poolId == 'string' && /^[0-9A-Z]{56}$/.test(poolId) ? poolId : undefined;
  const isTestnet = process.env.NEXT_PUBLIC_PASSPHRASE === Networks.TESTNET;

  const { data: poolMeta } = usePoolMeta(safePoolId as string, safePoolId !== undefined);
  const { data: backstop } = useBackstop(poolMeta?.version);
  const { data: feeStats } = useFeeStats();

  const theme = useTheme();

  useEffect(() => {
    if (poolMeta !== undefined) {
      trackPool(poolMeta);
      setLastPool(poolMeta);
    }
  }, [poolMeta, trackPool]);

  useEffect(() => {
    if (feeStats !== undefined) {
      switch (txInclusionFee.type) {
        case 'Low':
          if (feeStats.low !== txInclusionFee.fee) {
            setTxInclusionFee({ type: 'Low', fee: feeStats.low });
          }
          break;
        case 'Medium':
          if (feeStats.medium !== txInclusionFee.fee) {
            setTxInclusionFee({ type: 'Medium', fee: feeStats.medium });
          }
          break;
        case 'High':
          if (feeStats.high !== txInclusionFee.fee) {
            setTxInclusionFee({ type: 'High', fee: feeStats.high });
          }
          break;
      }
    }
  }, [feeStats]);

  // get the last (oldest) pool in the reward zone
  const faucet_pool =
    backstop !== undefined && backstop.config.rewardZone.length > 0
      ? backstop.config.rewardZone[backstop.config.rewardZone.length - 1]
      : undefined;

  const mainWidth = viewType <= ViewType.COMPACT ? '100%' : 'calc(886px - 240px)';
  const mainMargin = viewType <= ViewType.COMPACT ? '0px' : '62px';
  return (
    <Box sx={{ display: 'flex' }}>
      <NoSsr>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - 240px)` },
            ml: { sm: `240px` },
            display: { xs: 'block', md: 'none' },
            backgroundColor: 'transparent',
            boxShadow: 'none',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon sx={{ color: theme.palette.text.primary }} />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
          </Toolbar>
        </AppBar>
      </NoSsr>
      <SideBar />
      <Box sx={{ height: '30px' }} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          mt: { xs: '64px', md: '0px' },
        }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Box />
          <Box component="div" sx={{ width: mainWidth, minWidth: '350px' }}>
            <Box sx={{ marginLeft: mainMargin, marginRight: mainMargin }}>
              <Row>
                <WalletWarning />
              </Row>
              {faucet_pool !== undefined && isTestnet && (
                <Row>
                  <FaucetBanner poolId={faucet_pool} />
                </Row>
              )}
              {children}
              <OverlayModal />
              <OverlayModalTOS />
            </Box>
          </Box>
          <Box />
        </Box>
      </Box>
    </Box>
  );
}
