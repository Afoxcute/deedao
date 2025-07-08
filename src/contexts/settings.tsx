import { Network, Version } from '@blend-capital/blend-sdk';
import { useMediaQuery, useTheme } from '@mui/material';
import { Horizon, rpc, xdr } from '@stellar/stellar-sdk';
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
  poolName: string;
  apy?: number;
  fee?: number;
  referralAddress?: string;
  rewardAmount?: string;
  claimAmount?: string;
  additionalAdmins?: string[];
  isValidated?: boolean;
  addedBy: string;
  addedAt: number;
}

export interface NFTCustomPool {
  poolContractId: string;
  collectionContractId: string;
  stakingContractId: string;
  vestingContractId: string;
  poolName: string;
  collectionName: string;
  stakingApr?: number;
  vestingDuration?: number; // in days
  maxStakingAmount?: number;
  isValidated?: boolean;
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
  addCustomPool: (pool: Omit<CustomPool, 'addedAt' | 'isValidated'>) => Promise<void>;
  removeCustomPool: (poolContractId: string) => void;
  nftCustomPools: NFTCustomPool[];
  addNFTCustomPool: (pool: Omit<NFTCustomPool, 'addedAt' | 'isValidated'>) => Promise<void>;
  removeNFTCustomPool: (poolContractId: string) => void;
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
  const [nftCustomPools, setNFTCustomPools] = useState<NFTCustomPool[]>([]);

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

  useEffect(() => {
    const storedNFTPools = localStorage.getItem('nftCustomPools');
    if (storedNFTPools) {
      try {
        setNFTCustomPools(JSON.parse(storedNFTPools));
      } catch (error) {
        console.error('Failed to parse NFT custom pools', error);
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

  const addCustomPool = async (poolData: Omit<CustomPool, 'addedAt' | 'isValidated'>) => {
    const existingPool = customPools.find(
      pool => pool.poolContractId === poolData.poolContractId
    );

    if (existingPool) {
      throw new Error('Pool with this contract ID already exists');
    }

    // Validate pool with Blend SDK
    try {
      const rpcServer = getRPCServer();
      
      // Check if the pool contract exists
      try {
        await rpcServer.getContractData(poolData.poolContractId, xdr.ScVal.scvSymbol('admin'));
      } catch (error) {
        throw new Error('Invalid pool contract ID: Contract does not exist');
      }

      // Check if the oracle contract exists
      try {
        await rpcServer.getContractData(poolData.oracleContractId, xdr.ScVal.scvSymbol('admin'));
      } catch (error) {
        throw new Error('Invalid oracle contract ID: Contract does not exist');
      }

      // Check if the admin contract exists
      try {
        await rpcServer.getContractData(poolData.adminContractId, xdr.ScVal.scvSymbol('admin'));
      } catch (error) {
        throw new Error('Invalid admin contract ID: Contract does not exist');
      }

      // Validate additional admins if provided
      if (poolData.additionalAdmins && poolData.additionalAdmins.length > 0) {
        for (const admin of poolData.additionalAdmins) {
          if (!admin.startsWith('G') || admin.length !== 56) {
            throw new Error(`Invalid admin address: ${admin}`);
          }
        }
      }

      const newPool: CustomPool = {
        ...poolData,
        isValidated: true,
        addedAt: Date.now()
      };

      const updatedPools = [...customPools, newPool];
      
      localStorage.setItem('customPools', JSON.stringify(updatedPools));
      
      setCustomPools(updatedPools);
    } catch (error) {
      console.error('Pool validation error:', error);
      throw error;
    }
  };

  const removeCustomPool = (poolContractId: string) => {
    const updatedPools = customPools.filter(
      pool => pool.poolContractId !== poolContractId
    );

    localStorage.setItem('customPools', JSON.stringify(updatedPools));
    
    setCustomPools(updatedPools);
  };

  const addNFTCustomPool = async (poolData: Omit<NFTCustomPool, 'addedAt' | 'isValidated'>) => {
    const existingPool = nftCustomPools.find(
      pool => pool.poolContractId === poolData.poolContractId
    );

    if (existingPool) {
      throw new Error('NFT Pool with this contract ID already exists');
    }

    // Validate pool with Blend SDK
    try {
      const rpcServer = getRPCServer();
      
      // Check if the pool contract exists
      try {
        await rpcServer.getContractData(poolData.poolContractId, xdr.ScVal.scvSymbol('admin'));
      } catch (error) {
        throw new Error('Invalid pool contract ID: Contract does not exist');
      }

      // Check if the collection contract exists
      try {
        await rpcServer.getContractData(poolData.collectionContractId, xdr.ScVal.scvSymbol('admin'));
      } catch (error) {
        throw new Error('Invalid collection contract ID: Contract does not exist');
      }

      // Check if the staking contract exists
      try {
        await rpcServer.getContractData(poolData.stakingContractId, xdr.ScVal.scvSymbol('admin'));
      } catch (error) {
        throw new Error('Invalid staking contract ID: Contract does not exist');
      }

      // Check if the vesting contract exists
      try {
        await rpcServer.getContractData(poolData.vestingContractId, xdr.ScVal.scvSymbol('admin'));
      } catch (error) {
        throw new Error('Invalid vesting contract ID: Contract does not exist');
      }

      const newPool: NFTCustomPool = {
        ...poolData,
        isValidated: true,
        addedAt: Date.now()
      };

      const updatedPools = [...nftCustomPools, newPool];
      
      localStorage.setItem('nftCustomPools', JSON.stringify(updatedPools));
      
      setNFTCustomPools(updatedPools);
    } catch (error) {
      console.error('NFT Pool validation error:', error);
      throw error;
    }
  };

  const removeNFTCustomPool = (poolContractId: string) => {
    const updatedPools = nftCustomPools.filter(
      pool => pool.poolContractId !== poolContractId
    );

    localStorage.setItem('nftCustomPools', JSON.stringify(updatedPools));
    
    setNFTCustomPools(updatedPools);
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
        nftCustomPools,
        addNFTCustomPool,
        removeNFTCustomPool,
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
