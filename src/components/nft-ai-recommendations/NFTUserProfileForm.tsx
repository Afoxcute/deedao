import {
    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import { useState } from 'react';
import { NFTUserProfile } from '../../utils/nft-ai-recommendations';

interface NFTUserProfileFormProps {
  onSubmit: (profile: NFTUserProfile) => void;
}

export const NFTUserProfileForm: React.FC<NFTUserProfileFormProps> = ({ onSubmit }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<Partial<NFTUserProfile>>({
    riskTolerance: 'MODERATE',
    investmentHorizon: 'MEDIUM_TERM',
    liquidityNeeds: 'MEDIUM',
    experience: 'INTERMEDIATE',
    nftKnowledge: 'INTERMEDIATE',
    portfolioSize: 10000,
    maxImpermanentLoss: 10,
    yieldTarget: 15,
    goals: [],
    preferredCollections: []
  });

  const [goals, setGoals] = useState<string>('');
  const [collections, setCollections] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profile: NFTUserProfile = {
      riskTolerance: formData.riskTolerance!,
      investmentHorizon: formData.investmentHorizon!,
      liquidityNeeds: formData.liquidityNeeds!,
      experience: formData.experience!,
      nftKnowledge: formData.nftKnowledge!,
      portfolioSize: formData.portfolioSize!,
      maxImpermanentLoss: formData.maxImpermanentLoss!,
      yieldTarget: formData.yieldTarget!,
      goals: goals.split(',').map(g => g.trim()).filter(g => g.length > 0),
      preferredCollections: collections.split(',').map(c => c.trim()).filter(c => c.length > 0)
    };

    onSubmit(profile);
  };

  const handleInputChange = (field: keyof NFTUserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: '12px',
        padding: '32px',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto'
      }}
    >
      <Typography variant="h3" sx={{ marginBottom: '24px', textAlign: 'center' }}>
        🎨 NFT Investment Profile
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '32px', textAlign: 'center' }}>
        Help us understand your NFT investment preferences to provide personalized recommendations.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
        {/* Risk Tolerance */}
        <FormControl fullWidth>
          <InputLabel>Risk Tolerance</InputLabel>
          <Select
            value={formData.riskTolerance}
            label="Risk Tolerance"
            onChange={(e) => handleInputChange('riskTolerance', e.target.value)}
          >
            <MenuItem value="CONSERVATIVE">Conservative</MenuItem>
            <MenuItem value="MODERATE">Moderate</MenuItem>
            <MenuItem value="AGGRESSIVE">Aggressive</MenuItem>
          </Select>
        </FormControl>

        {/* Investment Horizon */}
        <FormControl fullWidth>
          <InputLabel>Investment Horizon</InputLabel>
          <Select
            value={formData.investmentHorizon}
            label="Investment Horizon"
            onChange={(e) => handleInputChange('investmentHorizon', e.target.value)}
          >
            <MenuItem value="SHORT_TERM">Short Term (1-6 months)</MenuItem>
            <MenuItem value="MEDIUM_TERM">Medium Term (6-24 months)</MenuItem>
            <MenuItem value="LONG_TERM">Long Term (2+ years)</MenuItem>
          </Select>
        </FormControl>

        {/* Liquidity Needs */}
        <FormControl fullWidth>
          <InputLabel>Liquidity Needs</InputLabel>
          <Select
            value={formData.liquidityNeeds}
            label="Liquidity Needs"
            onChange={(e) => handleInputChange('liquidityNeeds', e.target.value)}
          >
            <MenuItem value="HIGH">High (Need quick access to funds)</MenuItem>
            <MenuItem value="MEDIUM">Medium (Some flexibility needed)</MenuItem>
            <MenuItem value="LOW">Low (Can lock funds long-term)</MenuItem>
          </Select>
        </FormControl>

        {/* Experience Level */}
        <FormControl fullWidth>
          <InputLabel>DeFi Experience</InputLabel>
          <Select
            value={formData.experience}
            label="DeFi Experience"
            onChange={(e) => handleInputChange('experience', e.target.value)}
          >
            <MenuItem value="BEGINNER">Beginner</MenuItem>
            <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
            <MenuItem value="EXPERT">Expert</MenuItem>
          </Select>
        </FormControl>

        {/* NFT Knowledge */}
        <FormControl fullWidth>
          <InputLabel>NFT Knowledge</InputLabel>
          <Select
            value={formData.nftKnowledge}
            label="NFT Knowledge"
            onChange={(e) => handleInputChange('nftKnowledge', e.target.value)}
          >
            <MenuItem value="NOVICE">Novice</MenuItem>
            <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
            <MenuItem value="EXPERT">Expert</MenuItem>
          </Select>
        </FormControl>

        {/* Portfolio Size */}
        <TextField
          fullWidth
          label="Portfolio Size (USD)"
          type="number"
          value={formData.portfolioSize}
          onChange={(e) => handleInputChange('portfolioSize', Number(e.target.value))}
          inputProps={{ min: 1000, step: 1000 }}
        />
      </Box>

      <Box sx={{ marginTop: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
        {/* Max Impermanent Loss */}
        <TextField
          fullWidth
          label="Max Impermanent Loss Tolerance (%)"
          type="number"
          value={formData.maxImpermanentLoss}
          onChange={(e) => handleInputChange('maxImpermanentLoss', Number(e.target.value))}
          inputProps={{ min: 0, max: 50, step: 1 }}
        />

        {/* Yield Target */}
        <TextField
          fullWidth
          label="Target Annual Yield (%)"
          type="number"
          value={formData.yieldTarget}
          onChange={(e) => handleInputChange('yieldTarget', Number(e.target.value))}
          inputProps={{ min: 5, max: 100, step: 1 }}
        />
      </Box>

      {/* Investment Goals */}
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Investment Goals (comma-separated)
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="e.g., Passive income, Portfolio growth, Community participation"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
        />
      </Box>

      {/* Preferred Collections */}
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Preferred NFT Collections (comma-separated)
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="e.g., Bored Ape Yacht Club, CryptoPunks, Doodles"
          value={collections}
          onChange={(e) => setCollections(e.target.value)}
        />
      </Box>

      {/* Info Alert */}
      <Alert severity="info" sx={{ marginTop: 3 }}>
        <Typography variant="body2">
          <strong>NFT-Specific Considerations:</strong> Our AI will analyze collection rarity, 
          community strength, floor price stability, and smart contract security to provide 
          tailored recommendations for your NFT investment strategy.
        </Typography>
      </Alert>

      {/* Submit Button */}
      <Box sx={{ marginTop: 3, textAlign: 'center' }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{ 
            padding: '12px 32px',
            fontSize: '16px',
            fontWeight: 600
          }}
        >
          Generate NFT Recommendations
        </Button>
      </Box>
    </Box>
  );
}; 