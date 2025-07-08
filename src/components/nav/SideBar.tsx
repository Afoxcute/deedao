import { Version } from '@blend-capital/blend-sdk';
import BarChartIcon from '@mui/icons-material/BarChart';
import CollectionsIcon from '@mui/icons-material/Collections';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LockClockIcon from '@mui/icons-material/LockClock';
import SettingsIcon from '@mui/icons-material/Settings';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StarsIcon from '@mui/icons-material/Stars';
import StorageIcon from '@mui/icons-material/Storage';
import { Box, Drawer, Hidden, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useSettings } from '../../contexts';
import { useBackstop } from '../../hooks/api';
import { SectionBase } from '../common/SectionBase';
import { WalletMenu } from './WalletMenu';

export const SideBar = () => {
  const { lastPool } = useSettings();
  const { data: backstop } = useBackstop(Version.V1, lastPool == undefined);
  const poolId = (lastPool ? lastPool.id : backstop?.config?.rewardZone[0]) ?? '';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <SectionBase sx={{ width: '100%', margin: '6px 0', display: 'flex', justifyContent: 'center' }}>
        <Link href="/" passHref>
          <IconButton sx={{ width: '50px', height: '50px', margin: '6px' }}>
            <Image src="/deedao.svg" layout="fill" alt="DeeDAO Logo" />
          </IconButton>
        </Link>
      </SectionBase>
      <SectionBase sx={{ width: '100%', padding: '6px 0', margin: '6px 0' }}>
        <WalletMenu />
      </SectionBase>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/">
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Markets" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/position-maker">
            <ListItemIcon>
              <ShowChartIcon />
            </ListItemIcon>
            <ListItemText primary="📈 Position Maker" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href={`/dashboard?poolId=${poolId}`}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href={`/staking?poolId=${poolId}`}>
            <ListItemIcon>
              <StarsIcon />
            </ListItemIcon>
            <ListItemText primary="Staking" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href={`/vesting?poolId=${poolId}`}>
            <ListItemIcon>
              <LockClockIcon />
            </ListItemIcon>
            <ListItemText primary="Vesting" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/nft-staking">
            <ListItemIcon>
              <CollectionsIcon />
            </ListItemIcon>
            <ListItemText primary="NFT Staking" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/nft-vesting">
            <ListItemIcon>
              <LockClockIcon />
            </ListItemIcon>
            <ListItemText primary="NFT Vesting" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/ai-recommendations">
            <ListItemIcon>
              <SmartToyIcon />
            </ListItemIcon>
            <ListItemText primary="AI Advisor" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/nft-ai-recommendations">
            <ListItemIcon>
              <SmartToyIcon />
            </ListItemIcon>
            <ListItemText primary="🎨 NFT AI Advisor" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/distribute-nfts">
            <ListItemIcon>
              <CollectionsIcon />
            </ListItemIcon>
            <ListItemText primary="Distribute NFTs" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href={`/backstop?poolId=${poolId}`}>
            <ListItemIcon>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText primary="Backstop" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: isMobile ? 'auto' : 240,
        flexShrink: { md: 0 },
      }}
    >
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden mdDown implementation="css">
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </Box>
  );
}; 