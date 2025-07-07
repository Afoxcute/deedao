import { Network, Version } from '@blend-capital/blend-sdk';
import { useMediaQuery, useTheme } from '@mui/material';
import { Horizon, rpc } from '@stellar/stellar-sdk';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useLocalStorageState } from '../hooks';
import { PoolMeta } from '../hooks/types';

const DEFAULT_RPC = process.env.NEXT_PUBLIC_RPC_URL || 'https://soroban-testnet.stellar.org';
const DEFAULT_HORIZON =
  process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const DEFAULT_PASSPHRASE =
  process.env.NEXT_PUBLIC_PASSPHRASE || 'Test SDF Network ; September 2015';

export enum ViewType {
  MOBILE,
  COMPACT,
  REGULAR,
}

export interface TrackedPool {
  id: string;
  name: string;
  version: Version;
  customAssetIds?: string[];
}

export interface NetworkUrls {
  horizonUrl: string;
  rpc: string;
  opts?: Horizon.Server.Options;
}

export interface CustomPool {
  poolContractId: string;
  oracleContractId: string;
  adminContractId: string;
  addedBy: string;
  addedAt: number;
}

export interface ISettingsContext {
  viewType: ViewType;
  network: Network & { horizonUrl: string };
  setNetwork: (rpcUrl: string, newHorizonUrl: string, opts?: rpc.Server.Options) => void;
  setDefaultNetwork: () => void;
  getRPCServer: () => rpc.Server;
  getHorizonServer: () => rpc.Server;
  lastPool: TrackedPool | undefined;
  setLastPool: (poolMeta: PoolMeta) => void;
  trackedPools: TrackedPool[];
  trackPool: (poolMeta: PoolMeta) => void;
  untrackPool: (id: string) => void;
  addCustomAssetToPool: (poolId: string, assetId: string) => void;
  removeCustomAssetFromPool: (poolId: string, assetId: string) => void;
  showLend: boolean;
  setShowLend: (showLend: boolean) => void;
  showJoinPool: boolean;
  setShowJoinPool: (showJoinPool: boolean) => void;
  blockedPools: string[];
  isV2Enabled: boolean;
  mobileOpen: boolean;
  setMobileOpen: (mobileOpen: boolean) => void;
  customPools: CustomPool[];
  addCustomPool: (pool: Omit<CustomPool, 'addedAt'>) => Promise<void>;
  removeCustomPool: (poolContractId: string) => void;
}

const SettingsContext = React.createContext<ISettingsContext | undefined>(undefined);

export const SettingsProvider = ({ children = null as any }) => {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('lg')); // hook causes refresh on change
  const mobile = useMediaQuery(theme.breakpoints.down('sm')); // hook causes refresh on change

  const [lastPoolString, setLastPoolString] = useLocalStorageState('lastPool', undefined);
  const [trackedPoolsString, setTrackedPoolsString] = useLocalStorageState(
    'trackedPools',
    undefined
  );
  const [networkString, setNetworkString] = useLocalStorageState('network', undefined);
  const [customPoolsString, setCustomPoolsString] = useLocalStorageState('customPools', undefined);

  const [showLend, setShowLend] = useState<boolean>(true);
  const [showJoinPool, setShowJoinPool] = useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const lastPool = useMemo(() => {
    try {
      return lastPoolString ? (JSON.parse(lastPoolString) as TrackedPool) : undefined;
    } catch (e) {
      console.warn('Failed to parse lastPool:', e);
      return undefined;
    }
  }, [lastPoolString]);
  const trackedPools = useMemo(() => {
    try {
      return JSON.parse(trackedPoolsString ?? '[]') as TrackedPool[];
    } catch (e) {
      console.warn('Failed to parse trackedPools:', e);
      return [];
    }
  }, [trackedPoolsString]);
  const network = useMemo(() => {
    try {
      let urls = JSON.parse(networkString ?? '{}') as NetworkUrls;
      return {
        rpc: urls.rpc ?? DEFAULT_RPC,
        passphrase: DEFAULT_PASSPHRASE,
        opts: urls.opts,
        horizonUrl: urls.horizonUrl ?? DEFAULT_HORIZON,
      };
    } catch (e) {
      console.warn('Failed to parse urls:', e);
      return {
        rpc: DEFAULT_RPC,
        horizonUrl: DEFAULT_HORIZON,
        passphrase: DEFAULT_PASSPHRASE,
        opts: undefined,
      };
    }
  }, [networkString]);

  const [blockedPools, _] = useState<string[]>(
    (process.env.NEXT_PUBLIC_BLOCKED_POOLS || '').split(',')
  );

  const isV2Enabled = process.env.NEXT_PUBLIC_BACKSTOP_V2 !== undefined;

  let viewType: ViewType;
  if (mobile) viewType = ViewType.MOBILE;
  else if (compact) viewType = ViewType.COMPACT;
  else viewType = ViewType.REGULAR;

  const [customPools, setCustomPools] = useState<CustomPool[]>([]);

  useEffect(() => {
    const storedPools = localStorage.getItem('customPools');
    if (storedPools) {
      try {
        setCustomPools(JSON.parse(storedPools));
      } catch (error) {
        console.error('Failed to parse custom pools', error);
      }
    }
  }, []);

  function handleSetNetwork(newRpcUrl: string, newHorizonUrl: string, opts?: rpc.Server.Options) {
    if (newRpcUrl === DEFAULT_RPC && newHorizonUrl === DEFAULT_HORIZON) {
      handleSetDefaultNetwork();
    } else {
      setNetworkString(JSON.stringify({ rpc: newRpcUrl, horizonUrl: newHorizonUrl, opts }));
    }
  }

  function handleSetDefaultNetwork() {
    setNetworkString(undefined);
  }

  function getRPCServer() {
    return new rpc.Server(network.rpc, network.opts);
  }

  function getHorizonServer() {
    return new rpc.Server(network.horizonUrl, network.opts);
  }

  function trackPool(poolMeta: PoolMeta) {
    let index = trackedPools.findIndex((pool) => pool.id === poolMeta.id);
    if (index !== -1) {
      if (
        trackedPools[index].version !== poolMeta.version ||
        trackedPools[index].name !== poolMeta.name
      ) {
        trackedPools[index].version = poolMeta.version;
        trackedPools[index].name = poolMeta.name;
        setTrackedPoolsString(JSON.stringify(trackedPools));
      }
    } else {
      setTrackedPoolsString(
        JSON.stringify([
          ...trackedPools,
          { id: poolMeta.id, name: poolMeta.name, version: poolMeta.version, customAssetIds: [] },
        ])
      );
    }
  }

  function addCustomAssetToPool(poolId: string, assetId: string) {
    const poolIndex = trackedPools.findIndex((pool) => pool.id === poolId);
    if (poolIndex !== -1 && trackedPools[poolIndex].version === 'V2') {
      const updatedPools = [...trackedPools];
      if (!updatedPools[poolIndex].customAssetIds) {
        updatedPools[poolIndex].customAssetIds = [];
      }
      if (!updatedPools[poolIndex].customAssetIds?.includes(assetId)) {
        updatedPools[poolIndex].customAssetIds?.push(assetId);
        setTrackedPoolsString(JSON.stringify(updatedPools));
      }
    }
  }

  function removeCustomAssetFromPool(poolId: string, assetId: string) {
    const poolIndex = trackedPools.findIndex((pool) => pool.id === poolId);
    if (poolIndex !== -1 && trackedPools[poolIndex].customAssetIds) {
      const updatedPools = [...trackedPools];
      const assetIndex = updatedPools[poolIndex].customAssetIds?.indexOf(assetId);
      if (assetIndex !== undefined && assetIndex !== -1) {
        updatedPools[poolIndex].customAssetIds?.splice(assetIndex, 1);
        setTrackedPoolsString(JSON.stringify(updatedPools));
      }
    }
  }

  function untrackPool(id: string) {
    const index = trackedPools.findIndex((pool) => pool.id === id);
    if (index !== -1) {
      trackedPools.splice(index, 1);
      setTrackedPoolsString(JSON.stringify(trackedPools));
    }
  }

  function setLastPool(poolMeta: PoolMeta) {
    setLastPoolString(
      JSON.stringify({ id: poolMeta.id, name: poolMeta.name, version: poolMeta.version, customAssetIds: [] })
    );
  }

  const addCustomPool = async (poolData: Omit<CustomPool, 'addedAt'>) => {
    const existingPool = customPools.find(
      pool => pool.poolContractId === poolData.poolContractId
    );

    if (existingPool) {
      throw new Error('Pool with this contract ID already exists');
    }

    const newPool: CustomPool = {
      ...poolData,
      addedAt: Date.now()
    };

    const updatedPools = [...customPools, newPool];
    
    localStorage.setItem('customPools', JSON.stringify(updatedPools));
    
    setCustomPools(updatedPools);
  };

  const removeCustomPool = (poolContractId: string) => {
    const updatedPools = customPools.filter(
      pool => pool.poolContractId !== poolContractId
    );

    localStorage.setItem('customPools', JSON.stringify(updatedPools));
    
    setCustomPools(updatedPools);
  };

  return (
    <SettingsContext.Provider
      value={{
        viewType,
        network,
        setNetwork: handleSetNetwork,
        setDefaultNetwork: handleSetDefaultNetwork,
        getRPCServer,
        getHorizonServer,
        lastPool,
        setLastPool,
        trackedPools,
        trackPool,
        untrackPool,
        addCustomAssetToPool,
        removeCustomAssetFromPool,
        showLend,
        setShowLend,
        showJoinPool,
        setShowJoinPool,
        blockedPools,
        isV2Enabled,
        mobileOpen,
        setMobileOpen,
        customPools,
        addCustomPool,
        removeCustomPool,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('Component rendered outside the provider tree');
  }

  return context;
};
