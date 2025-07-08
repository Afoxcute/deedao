import { Address } from '@stellar/stellar-sdk';
import { scaleInputToBigInt } from './scval';

export interface DistributionRecipient {
  address: string;
  amount: string;
}

/**
 * Prepares token distribution data for the Blend SDK
 * @param tokenId The token contract ID to distribute
 * @param recipients Array of recipients with addresses and amounts
 * @param decimals Token decimals (default: 7)
 * @returns Structured data for token distribution
 */
export function prepareTokenDistribution(
  tokenId: string,
  recipients: DistributionRecipient[],
  decimals: number = 7
) {
  // Validate inputs
  if (!tokenId) {
    throw new Error('Token ID is required');
  }
  
  if (!recipients || recipients.length === 0) {
    throw new Error('At least one recipient is required');
  }
  
  // Format recipients for the SDK
  const formattedRecipients = recipients.map(recipient => ({
    address: new Address(recipient.address),
    amount: scaleInputToBigInt(recipient.amount, decimals)
  }));
  
  return {
    tokenId,
    recipients: formattedRecipients,
    totalAmount: formattedRecipients.reduce(
      (sum, recipient) => sum + recipient.amount, 
      BigInt(0)
    )
  };
}

/**
 * Validates a batch of recipients for token distribution
 * @param recipients Array of recipients to validate
 * @returns Object containing validation results
 */
export function validateRecipients(recipients: DistributionRecipient[]) {
  const validRecipients: DistributionRecipient[] = [];
  const invalidRecipients: { recipient: DistributionRecipient; reason: string }[] = [];
  
  recipients.forEach(recipient => {
    // Validate address format (basic Stellar address validation)
    if (!recipient.address.startsWith('G') || recipient.address.length !== 56) {
      invalidRecipients.push({ 
        recipient, 
        reason: 'Invalid Stellar address format' 
      });
      return;
    }
    
    // Validate amount is a positive number
    const amount = parseFloat(recipient.amount);
    if (isNaN(amount) || amount <= 0) {
      invalidRecipients.push({ 
        recipient, 
        reason: 'Amount must be a positive number' 
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
 * Parses a CSV string into an array of distribution recipients
 * @param csvContent CSV content as a string (format: address,amount)
 * @returns Array of parsed recipients
 */
export function parseCSVToRecipients(csvContent: string): DistributionRecipient[] {
  if (!csvContent) return [];
  
  const lines = csvContent.split('\n');
  const recipients: DistributionRecipient[] = [];
  
  lines.forEach((line, index) => {
    if (!line.trim()) return; // Skip empty lines
    
    const [address, amount] = line.split(',').map(item => item.trim());
    
    // Basic validation before adding to the list
    if (address && amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0) {
      recipients.push({ address, amount });
    }
  });
  
  return recipients;
}

/**
 * Formats a distribution summary for display
 * @param tokenSymbol Symbol of the token being distributed
 * @param recipients Array of recipients
 * @returns Formatted summary string
 */
export function formatDistributionSummary(
  tokenSymbol: string,
  recipients: DistributionRecipient[]
): string {
  const totalAmount = recipients.reduce(
    (sum, recipient) => sum + parseFloat(recipient.amount || '0'), 
    0
  );
  
  return `Distributing ${totalAmount.toFixed(7)} ${tokenSymbol} to ${recipients.length} recipients`;
} 