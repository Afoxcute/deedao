import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
    Box,
    Chip,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import { useEffect, useState } from 'react';
import { AnvilAlert } from '../components/common/AnvilAlert';
import { OpaqueButton } from '../components/common/OpaqueButton';
import { Row } from '../components/common/Row';
import { Section, SectionSize } from '../components/common/Section';
import { useSettings } from '../contexts';
import { useWallet } from '../contexts/wallet';
import {
    NFTRecipient,
    parseCSVToNFTRecipients,
    prepareNFTDistribution,
    validateNFTRecipients
} from '../utils/nft';

interface RecipientWithId extends NFTRecipient {
  id: string;
}

export default function DistributeNFTsPage() {
  const theme = useTheme();
  const { connected, walletAddress } = useWallet();
  const { customPools, network, getRPCServer } = useSettings();

  // State for collection selection
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [availableCollections, setAvailableCollections] = useState<{id: string, name: string}[]>([]);
  
  // State for recipients
  const [recipients, setRecipients] = useState<RecipientWithId[]>([]);
  const [newRecipient, setNewRecipient] = useState<{ address: string; tokenId: string }>({
    address: '',
    tokenId: ''
  });
  
  // State for validation
  const [validationResults, setValidationResults] = useState<{
    valid: boolean;
    validCount: number;
    invalidCount: number;
    invalidRecipients: { recipient: NFTRecipient; reason: string }[];
  } | undefined>(undefined);
  
  // State for form
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load available collections
  useEffect(() => {
    // For demonstration, using hardcoded collections
    // In a real implementation, you would fetch these from the blockchain
    setAvailableCollections([
      { id: 'CDJEHTBE6ZHUXSWFI642DCGLUOECLHPF3KSXHPXTSTJ7E3JF6MQ5EZYY', name: 'Blend Punks' },
      { id: 'CCOQM6S7ICIUWA225O5PSJWUBEMXGFSSW2PQFO6FP4DQEKMS5DASRGRR', name: 'Stellar Apes' },
      { id: 'CAQQR5SWBXKIGZKPBZDH3KM5GQ5GUTPKB7JAFCINLZBC5WXPJKRG3IM7', name: 'Space Cats' },
    ]);
  }, []);

  // Validate recipients whenever they change
  useEffect(() => {
    if (recipients.length > 0) {
      const results = validateNFTRecipients(recipients);
      setValidationResults(results);
    } else {
      setValidationResults(undefined);
    }
  }, [recipients]);

  const validateStellarAddress = (address: string) => {
    // Basic Stellar address validation (starts with 'G' and is 56 characters long)
    return address.startsWith('G') && address.length === 56;
  };

  const handleAddRecipient = () => {
    if (newRecipient.address && newRecipient.tokenId && validateStellarAddress(newRecipient.address)) {
      setRecipients([
        ...recipients, 
        { 
          ...newRecipient, 
          id: Math.random().toString(36).substring(2, 9) 
        }
      ]);
      setNewRecipient({ address: '', tokenId: '' });
      setError(null);
    } else {
      setError('Please enter a valid Stellar address and token ID');
    }
  };

  const handleRemoveRecipient = (id: string) => {
    setRecipients(recipients.filter(recipient => recipient.id !== id));
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Use the utility function to parse CSV
      const parsedRecipients = parseCSVToNFTRecipients(content);
      
      if (parsedRecipients.length > 0) {
        // Add unique IDs to the parsed recipients
        const newRecipients = parsedRecipients.map(recipient => ({
          ...recipient,
          id: `csv-${Math.random().toString(36).substring(2, 9)}`
        }));
        
        setRecipients([...recipients, ...newRecipients]);
        setSuccess(`Added ${parsedRecipients.length} recipients from CSV`);
      } else {
        setError('No valid recipients found in CSV');
      }
      
      // Reset file input
      event.target.value = '';
    };
    
    reader.readAsText(file);
  };

  const handleDistribute = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (!selectedCollectionId) {
        throw new Error('Please select a collection to distribute');
      }
      
      if (recipients.length === 0) {
        throw new Error('Please add at least one recipient');
      }
      
      // Validate recipients
      const validationResult = validateNFTRecipients(recipients);
      if (!validationResult.valid) {
        throw new Error(`Invalid recipients: ${validationResult.invalidCount} recipients have issues`);
      }
      
      // Prepare distribution data
      const distributionData = prepareNFTDistribution(selectedCollectionId, recipients);
      
      // In a real implementation, you would use the Blend SDK to distribute NFTs
      // For now, we'll simulate the distribution
      
      console.log('NFT Distribution data prepared:', distributionData);
      
      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      setSuccess(`Successfully distributed ${recipients.length} NFTs to ${recipients.length} recipients`);
      
      // In a real implementation, you might want to clear the recipients after successful distribution
      // setRecipients([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to distribute NFTs');
    } finally {
      setIsLoading(false);
    }
  };

  if (!connected) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        marginTop: '48px',
        backgroundColor: theme.palette.background.paper,
        padding: '24px',
        borderRadius: '8px'
      }}>
        <Typography variant="h2">Connect your wallet to distribute NFTs</Typography>
      </Box>
    );
  }

  return (
    <Row>
      <Section
        width={SectionSize.FULL}
        sx={{ 
          padding: '24px', 
          display: 'flex', 
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <Typography variant="h1" sx={{ marginBottom: '16px' }}>
          Distribute NFTs
        </Typography>

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="collection-select-label">Select Collection</InputLabel>
            <Select
              labelId="collection-select-label"
              value={selectedCollectionId}
              label="Select Collection"
              onChange={(e) => setSelectedCollectionId(e.target.value)}
            >
              {availableCollections.map((collection) => (
                <MenuItem key={collection.id} value={collection.id}>
                  {collection.name} ({collection.id.substring(0, 8)}...{collection.id.substring(collection.id.length - 8)})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Recipient Address"
              variant="outlined"
              value={newRecipient.address}
              onChange={(e) => setNewRecipient({ ...newRecipient, address: e.target.value })}
              error={!!newRecipient.address && !validateStellarAddress(newRecipient.address)}
              helperText={
                newRecipient.address && !validateStellarAddress(newRecipient.address)
                  ? 'Invalid Stellar address'
                  : 'Enter a valid Stellar address'
              }
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Token ID"
              variant="outlined"
              value={newRecipient.tokenId}
              onChange={(e) => setNewRecipient({ ...newRecipient, tokenId: e.target.value })}
              helperText="Enter the NFT token ID"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <OpaqueButton
                onClick={handleAddRecipient}
                palette={theme.palette.primary}
                disabled={!newRecipient.address || !newRecipient.tokenId || !validateStellarAddress(newRecipient.address)}
                sx={{ flex: 1 }}
              >
                <AddIcon />
              </OpaqueButton>
              <Box sx={{ position: 'relative', flex: 1 }}>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    opacity: 0, 
                    width: '100%', 
                    height: '100%', 
                    cursor: 'pointer' 
                  }}
                />
                <OpaqueButton
                  palette={theme.palette.primary}
                  sx={{ width: '100%', height: '100%' }}
                >
                  <FileUploadIcon />
                </OpaqueButton>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Upload a CSV file with addresses and token IDs (format: address,tokenId)
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h2">Recipients</Typography>
          {validationResults && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label={`Valid: ${validationResults.validCount}`} 
                color="success" 
                size="small" 
                variant="outlined"
              />
              {validationResults.invalidCount > 0 && (
                <Chip 
                  label={`Invalid: ${validationResults.invalidCount}`} 
                  color="error" 
                  size="small" 
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </Box>
        
        {recipients.length === 0 ? (
          <Box 
            sx={{ 
              backgroundColor: theme.palette.background.paper,
              padding: '16px',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <Typography variant="body1">
              No recipients added yet
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>Token ID</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recipients.map((recipient) => (
                  <TableRow 
                    key={recipient.id}
                    sx={{ 
                      backgroundColor: validationResults?.invalidRecipients.some(
                        invalid => invalid.recipient.address === recipient.address
                      ) ? theme.palette.error.light : undefined 
                    }}
                  >
                    <TableCell>
                      {recipient.address.substring(0, 8)}...{recipient.address.substring(recipient.address.length - 8)}
                    </TableCell>
                    <TableCell>{recipient.tokenId}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleRemoveRecipient(recipient.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell><strong>Total</strong></TableCell>
                  <TableCell>
                    <strong>{recipients.length} NFTs</strong>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <OpaqueButton
          onClick={handleDistribute}
          palette={theme.palette.primary}
          disabled={
            isLoading || 
            recipients.length === 0 || 
            !selectedCollectionId || 
            (validationResults ? !validationResults.valid : false)
          }
          sx={{ mt: 3 }}
        >
          {isLoading ? 'Distributing...' : `Distribute ${recipients.length} NFTs to ${recipients.length} Recipients`}
        </OpaqueButton>

        {error && (
          <AnvilAlert 
            severity="error" 
            message={error} 
          />
        )}
        {success && (
          <AnvilAlert 
            severity="success" 
            message={success} 
          />
        )}
      </Section>
    </Row>
  );
} 