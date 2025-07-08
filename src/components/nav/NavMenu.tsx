import { Version } from '@blend-capital/blend-sdk';
import MenuIcon from '@mui/icons-material/Menu';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Alert, IconButton, Menu, MenuItem, Snackbar, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { useSettings, ViewType } from '../../contexts';
import { useBackstop } from '../../hooks/api';
import { NavItem } from './NavItem';

export const NavMenu = () => {
  const theme = useTheme();
  const { viewType, lastPool } = useSettings();

  const { data: backstop } = useBackstop(Version.V1, lastPool == undefined);
  const poolId = (lastPool ? lastPool.id : backstop?.config?.rewardZone[0]) ?? '';
  const safePoolId = typeof poolId == 'string' && /^[0-9A-Z]{56}$/.test(poolId) ? poolId : '';

  const [openCon, setOpenCon] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSnackClose = () => {
    setOpenCon(false);
  };

  return (
    <>
      <IconButton
        id="nav-dropdown-button"
        onClick={handleClick}
        sx={{ width: '100%', height: '100%', color: theme.palette.text.secondary }}
      >
        <MenuIcon />
      </IconButton>
      {viewType === ViewType.REGULAR && (
        <Menu
          id="nav-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'pool-dropdown-button',
          }}
          PaperProps={{
            // @ts-ignore - TODO: Figure out why typing is broken
            backgroundColor: theme.palette.menu.main,
          }}
        >
          <Link href={{ pathname: '/auction', query: { poolId: safePoolId } }}>
            <MenuItem onClick={handleClose} sx={{ color: '#FFFFFF' }}>
              Auctions
            </MenuItem>
          </Link>
          <Link href="/nft-staking">
            <MenuItem onClick={handleClose} sx={{ color: '#FFFFFF' }}>
              NFT Staking
            </MenuItem>
          </Link>
          <Link href="/nft-vesting">
            <MenuItem onClick={handleClose} sx={{ color: '#FFFFFF' }}>
              NFT Vesting
            </MenuItem>
          </Link>
          <Link href="/ai-recommendations">
            <MenuItem onClick={handleClose} sx={{ color: '#FFFFFF' }}>
              🤖 AI Advisor
            </MenuItem>
          </Link>
          <Link href="/nft-ai-recommendations">
            <MenuItem onClick={handleClose} sx={{ color: '#FFFFFF' }}>
              🎨 NFT AI Advisor
            </MenuItem>
          </Link>
          <Link href="/distribute-nfts">
            <MenuItem onClick={handleClose} sx={{ color: '#FFFFFF' }}>
              Distribute NFTs
            </MenuItem>
          </Link>
          <a href="https://core.allbridge.io/" target="_blank" rel="noreferrer">
            <MenuItem
              onClick={handleClose}
              sx={{ color: '#FFFFFF', justifyContent: 'space-between' }}
            >
              <Typography>Bridge USDC</Typography>
              <OpenInNewIcon fontSize="inherit" />
            </MenuItem>
          </a>
          <Link href="/settings">
            <MenuItem onClick={handleClose} sx={{ color: '#FFFFFF' }}>
              Settings
            </MenuItem>
          </Link>
          <Link href="/distribute-tokens">
            <MenuItem onClick={handleClose} sx={{ color: '#FFFFFF' }}>
              Distribute Tokens
            </MenuItem>
          </Link>
          <a href="https://docs.blend.capital/" target="_blank" rel="noreferrer">
            <MenuItem
              onClick={handleClose}
              sx={{ color: '#FFFFFF', justifyContent: 'space-between' }}
            >
              <Typography>Docs</Typography>
              <OpenInNewIcon fontSize="inherit" />
            </MenuItem>
          </a>
          <a href="https://github.com/blend-capital" target="_blank" rel="noreferrer">
            <MenuItem
              onClick={handleClose}
              sx={{ color: '#FFFFFF', justifyContent: 'space-between' }}
            >
              <Typography>Github</Typography>
              <OpenInNewIcon fontSize="inherit" />
            </MenuItem>
          </a>
          <Link href="/termsofservice">
            <MenuItem onClick={handleClose} sx={{ color: '#FFFFFF' }}>
              Terms of Service
            </MenuItem>
          </Link>
        </Menu>
      )}
      {viewType !== ViewType.REGULAR && (
        <Menu
          id="nav-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'pool-dropdown-button',
          }}
          PaperProps={{
            // @ts-ignore - TODO: Figure out why typing is broken
            backgroundColor: theme.palette.menu.main,
          }}
        >
          <NavItem
            onClick={handleClose}
            to={{ pathname: '/' }}
            title="Markets"
            sx={{ width: '90%', justifyContent: 'left', marginBottom: '6px' }}
          />
          <NavItem
            onClick={handleClose}
            to={{ pathname: '/dashboard', query: { poolId: poolId } }}
            title="Dashboard"
            sx={{ width: '90%', justifyContent: 'left', marginBottom: '6px' }}
          />
          <NavItem
            onClick={handleClose}
            to={{ pathname: '/backstop', query: { poolId: poolId } }}
            title="Backstop"
            sx={{ width: '90%', justifyContent: 'left', marginBottom: '6px' }}
          />
          <NavItem
            onClick={handleClose}
            to={{ pathname: '/auction', query: { poolId: poolId } }}
            title="Auctions"
            sx={{ width: '90%', justifyContent: 'left', marginBottom: '6px' }}
          />
          <NavItem
            onClick={handleClose}
            to={{ pathname: '/nft-staking' }}
            title="NFT Staking"
            sx={{ width: '90%', justifyContent: 'left', marginBottom: '6px' }}
          />
          <NavItem
            onClick={handleClose}
            to={{ pathname: '/nft-vesting' }}
            title="NFT Vesting"
            sx={{ width: '90%', justifyContent: 'left', marginBottom: '6px' }}
          />
          <NavItem
            onClick={handleClose}
            to={{ pathname: '/ai-recommendations' }}
            title="🤖 AI Advisor"
            sx={{ width: '90%', justifyContent: 'left', marginBottom: '6px' }}
          />
          <NavItem
            onClick={handleClose}
            to={{ pathname: '/nft-ai-recommendations' }}
            title="🎨 NFT AI Advisor"
            sx={{ width: '90%', justifyContent: 'left', marginBottom: '6px' }}
          />
          <NavItem
            onClick={handleClose}
            to={{ pathname: '/distribute-nfts' }}
            title="Distribute NFTs"
            sx={{ width: '90%', justifyContent: 'left', marginBottom: '6px' }}
          />
          <a href="https://core.allbridge.io/" target="_blank" rel="noreferrer">
            <MenuItem
              onClick={handleClose}
              sx={{ color: '#FFFFFF', justifyContent: 'space-between' }}
            >
              <Typography>Bridge USDC</Typography>
              <OpenInNewIcon fontSize="inherit" />
            </MenuItem>
          </a>
          <Link href="/settings">
            <MenuItem onClick={handleClose} sx={{ color: '#FFFFFF' }}>
              Settings
            </MenuItem>
          </Link>
          <Link href="/distribute-tokens">
            <MenuItem onClick={handleClose} sx={{ color: '#FFFFFF' }}>
              Distribute Tokens
            </MenuItem>
          </Link>
          <a href="https://docs.blend.capital/" target="_blank" rel="noreferrer">
            <MenuItem
              onClick={handleClose}
              sx={{ color: '#FFFFFF', justifyContent: 'space-between' }}
            >
              <Typography>Docs</Typography>
              <OpenInNewIcon fontSize="inherit" />
            </MenuItem>
          </a>
          <a href="https://github.com/blend-capital" target="_blank" rel="noreferrer">
            <MenuItem
              onClick={handleClose}
              sx={{ color: '#FFFFFF', justifyContent: 'space-between' }}
            >
              <Typography>Github</Typography>
              <OpenInNewIcon fontSize="inherit" />
            </MenuItem>
          </a>
          <Link href="/termsofservice">
            <MenuItem onClick={handleClose} sx={{ color: '#FFFFFF' }}>
              Terms of Service
            </MenuItem>
          </Link>
        </Menu>
      )}

      <Snackbar
        open={openCon}
        autoHideDuration={4000}
        onClose={handleSnackClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Alert
          onClose={handleSnackClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          Connected to {lastPool?.name ?? 'pool'}
        </Alert>
      </Snackbar>
    </>
  );
};
