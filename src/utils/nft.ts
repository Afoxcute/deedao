import { Address, xdr } from '@stellar/stellar-sdk';

export interface NFTMetadata {
  id: string;
  name: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  collection?: string;
  rarity?: string;
}

export interface NFTCollection {
  id: string;
  name: string;
  apr: number;
  description?: string;
  totalSupply?: number;
  floorPrice?: number;
  volume24h?: number;
}

export interface NFTRecipient {
  address: string;
  tokenId: string;
  metadata?: NFTMetadata;
}

export interface NFTStakingPosition {
  tokenId: string;
  stakedAt: number;
  stakingRewards: bigint;
  lockPeriod: number;
  isLocked: boolean;
  metadata?: NFTMetadata;
}

export interface NFTVestingSchedule {
  tokenId: string;
  totalAmount: bigint;
  claimedAmount: bigint;
  startTime: number;
  endTime: number;
  cliffTime: number;
  isCliffReached: boolean;
  metadata?: NFTMetadata;
}

export interface NFTDistributionData {
  collectionId: string;
  recipients: NFTRecipient[];
  totalTokens: number;
}

/**
 * Prepares NFT distribution data for the Blend SDK
 * @param collectionId The NFT collection contract ID
 * @param recipients Array of recipients with addresses and token IDs
 * @returns Structured data for NFT distribution
 */
export function prepareNFTDistribution(
  collectionId: string,
  recipients: NFTRecipient[]
) {
  // Validate inputs
  if (!collectionId) {
    throw new Error('Collection ID is required');
  }
  
  if (!recipients || recipients.length === 0) {
    throw new Error('At least one recipient is required');
  }
  
  // Format recipients for the SDK
  const formattedRecipients = recipients.map(recipient => ({
    address: new Address(recipient.address),
    tokenId: recipient.tokenId
  }));
  
  return {
    collectionId,
    recipients: formattedRecipients,
    totalTokens: recipients.length
  };
}

/**
 * Validates a batch of NFT recipients for distribution
 * @param recipients Array of recipients to validate
 * @returns Object containing validation results
 */
export function validateNFTRecipients(recipients: NFTRecipient[]) {
  const validRecipients: NFTRecipient[] = [];
  const invalidRecipients: { recipient: NFTRecipient; reason: string }[] = [];
  
  recipients.forEach(recipient => {
    // Validate address format (basic Stellar address validation)
    if (!recipient.address.startsWith('G') || recipient.address.length !== 56) {
      invalidRecipients.push({ 
        recipient, 
        reason: 'Invalid Stellar address format' 
      });
      return;
    }
    
    // Validate token ID format (basic validation)
    if (!recipient.tokenId || recipient.tokenId.length === 0) {
      invalidRecipients.push({ 
        recipient, 
        reason: 'Token ID is required' 
      });
      return;
    }
    
    // If all validations pass, add to valid recipients
    validRecipients.push(recipient);
  });
  
  return {
    valid: invalidRecipients.length === 0,
    validRecipients,
    invalidRecipients,
    validCount: validRecipients.length,
    invalidCount: invalidRecipients.length
  };
}

/**
 * Parses a CSV string into an array of NFT distribution recipients
 * @param csvContent CSV content as a string (format: address,tokenId)
 * @returns Array of parsed recipients
 */
export function parseCSVToNFTRecipients(csvContent: string): NFTRecipient[] {
  if (!csvContent) return [];
  
  const lines = csvContent.split('\n');
  const recipients: NFTRecipient[] = [];
  
  lines.forEach((line, index) => {
    if (!line.trim()) return; // Skip empty lines
    
    const [address, tokenId] = line.split(',').map(item => item.trim());
    
    // Basic validation before adding to the list
    if (address && tokenId && address.startsWith('G') && address.length === 56) {
      recipients.push({ address, tokenId });
    }
  });
  
  return recipients;
}

/**
 * Formats an NFT distribution summary for display
 * @param collectionName Name of the NFT collection
 * @param recipients Array of recipients
 * @returns Formatted summary string
 */
export function formatNFTDistributionSummary(
  collectionName: string,
  recipients: NFTRecipient[]
): string {
  return `Distributing ${recipients.length} NFTs from ${collectionName} to ${recipients.length} recipients`;
}

/**
 * Calculates NFT staking rewards based on time staked and APR
 * @param stakedAt Timestamp when NFT was staked
 * @param apr Annual percentage rate (as decimal, e.g., 0.05 for 5%)
 * @param currentTime Current timestamp
 * @returns Calculated rewards
 */
export function calculateNFTStakingRewards(
  stakedAt: number,
  apr: number,
  currentTime: number = Date.now()
): bigint {
  const timeStaked = currentTime - stakedAt;
  const timeStakedInYears = timeStaked / (365 * 24 * 60 * 60 * 1000);
  const rewards = timeStakedInYears * apr;
  return BigInt(Math.floor(rewards * 1e7)); // Scale to 7 decimals
}

/**
 * Checks if NFT vesting cliff has been reached
 * @param vestingSchedule The vesting schedule to check
 * @param currentTime Current timestamp
 * @returns True if cliff has been reached
 */
export function isNFTVestingCliffReached(
  vestingSchedule: NFTVestingSchedule,
  currentTime: number = Date.now()
): boolean {
  return currentTime >= vestingSchedule.cliffTime;
}

/**
 * Calculates claimable NFT vesting amount
 * @param vestingSchedule The vesting schedule
 * @param currentTime Current timestamp
 * @returns Claimable amount
 */
export function calculateNFTClaimableAmount(
  vestingSchedule: NFTVestingSchedule,
  currentTime: number = Date.now()
): bigint {
  if (currentTime < vestingSchedule.cliffTime) {
    return BigInt(0);
  }
  
  if (currentTime >= vestingSchedule.endTime) {
    return vestingSchedule.totalAmount - vestingSchedule.claimedAmount;
  }
  
  const totalVestingTime = vestingSchedule.endTime - vestingSchedule.startTime;
  const timeSinceStart = currentTime - vestingSchedule.startTime;
  const vestedRatio = timeSinceStart / totalVestingTime;
  
  const totalVested = vestingSchedule.totalAmount * BigInt(Math.floor(vestedRatio * 1e7)) / BigInt(1e7);
  return totalVested - vestingSchedule.claimedAmount;
}

/**
 * Creates an XDR ScVal for NFT token ID
 * @param tokenId The NFT token ID
 * @returns XDR ScVal representation
 */
export function createNFTTokenIdScVal(tokenId: string): xdr.ScVal {
  return xdr.ScVal.scvString(tokenId);
}

/**
 * Creates an XDR ScVal for NFT collection ID
 * @param collectionId The NFT collection ID
 * @returns XDR ScVal representation
 */
export function createNFTCollectionIdScVal(collectionId: string): xdr.ScVal {
  return xdr.ScVal.scvString(collectionId);
} 