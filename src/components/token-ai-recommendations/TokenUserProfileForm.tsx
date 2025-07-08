import {
    Box,
    Button,
    Chip,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Slider,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import { useState } from 'react';
import { TokenUserProfile } from '../../utils/token-ai-recommendations';

interface TokenUserProfileFormProps {
  onSubmit: (profile: TokenUserProfile) => void;
}

const RISK_TOLERANCE_OPTIONS = [
  { value: 'CONSERVATIVE', label: 'Conservative', description: 'Prefer stable, low-risk token investments' },
  { value: 'MODERATE', label: 'Moderate', description: 'Balance between risk and return' },
  { value: 'AGGRESSIVE', label: 'Aggressive', description: 'Seek higher returns, accept higher risk' }
];

const INVESTMENT_HORIZON_OPTIONS = [
  { value: 'SHORT_TERM', label: 'Short Term (1-6 months)', description: 'Quick returns, high liquidity' },
  { value: 'MEDIUM_TERM', label: 'Medium Term (6-24 months)', description: 'Balanced growth and liquidity' },
  { value: 'LONG_TERM', label: 'Long Term (2+ years)', description: 'Maximum growth potential' }
];

const LIQUIDITY_NEEDS_OPTIONS = [
  { value: 'HIGH', label: 'High', description: 'Need frequent access to funds' },
  { value: 'MEDIUM', label: 'Medium', description: 'Some flexibility needed' },
  { value: 'LOW', label: 'Low', description: 'Can lock funds for extended periods' }
];

const EXPERIENCE_OPTIONS = [
  { value: 'BEGINNER', label: 'Beginner', description: 'New to DeFi and token staking' },
  { value: 'INTERMEDIATE', label: 'Intermediate', description: 'Some experience with DeFi' },
  { value: 'EXPERT', label: 'Expert', description: 'Experienced DeFi user' }
];

const GOAL_OPTIONS = [
  'Passive Income',
  'Token Appreciation',
  'Capital Preservation',
  'Diversification',
  'High Returns',
  'Learning DeFi',
  'Liquidity Provision',
  'Yield Farming'
];

const POPULAR_TOKENS = [
  'USDC', 'USDT', 'ETH', 'BTC', 'BLND', 'DAI', 'WETH', 'WBTC', 'UNI', 'AAVE'
];

export const TokenUserProfileForm: React.FC<TokenUserProfileFormProps> = ({ onSubmit }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<Partial<TokenUserProfile>>({
    riskTolerance: 'MODERATE',
    investmentHorizon: 'MEDIUM_TERM',
    liquidityNeeds: 'MEDIUM',
    experience: 'INTERMEDIATE',
    portfolioSize: 10000,
    goals: [],
    preferredTokens: [],
    maxImpermanentLoss: 5,
    yieldTarget: 15
  });

  const handleInputChange = (field: keyof TokenUserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFormData(prev => ({ 
      ...prev, 
      goals: typeof value === 'string' ? value.split(',') : value 
    }));
  };

  const handleTokenChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFormData(prev => ({ 
      ...prev, 
      preferredTokens: typeof value === 'string' ? value.split(',') : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.riskTolerance && formData.investmentHorizon && 
        formData.liquidityNeeds && formData.experience && 
        formData.portfolioSize && formData.goals && 
        formData.goals.length > 0) {
      onSubmit(formData as TokenUserProfile);
    }
  };

  const isFormValid = formData.riskTolerance && formData.investmentHorizon && 
                     formData.liquidityNeeds && formData.experience && 
                     formData.portfolioSize && formData.goals && 
                     formData.goals.length > 0;

  return (
    <Box sx={{
      backgroundColor: theme.palette.background.paper,
      borderRadius: '12px',
      padding: '32px',
      border: `1px solid ${theme.palette.divider}`,
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <Typography variant="h3" sx={{ marginBottom: '24px', textAlign: 'center' }}>
        Your Token Investment Profile
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '32px', textAlign: 'center' }}>
        Help our AI understand your token investment preferences for personalized recommendations.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Risk Tolerance */}
        <FormControl fullWidth>
          <InputLabel>Risk Tolerance</InputLabel>
          <Select
            value={formData.riskTolerance || ''}
            label="Risk Tolerance"
            onChange={(e) => handleInputChange('riskTolerance', e.target.value)}
          >
            {RISK_TOLERANCE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box>
                  <Typography variant="body1">{option.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Investment Horizon */}
        <FormControl fullWidth>
          <InputLabel>Investment Horizon</InputLabel>
          <Select
            value={formData.investmentHorizon || ''}
            label="Investment Horizon"
            onChange={(e) => handleInputChange('investmentHorizon', e.target.value)}
          >
            {INVESTMENT_HORIZON_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box>
                  <Typography variant="body1">{option.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Liquidity Needs */}
        <FormControl fullWidth>
          <InputLabel>Liquidity Needs</InputLabel>
          <Select
            value={formData.liquidityNeeds || ''}
            label="Liquidity Needs"
            onChange={(e) => handleInputChange('liquidityNeeds', e.target.value)}
          >
            {LIQUIDITY_NEEDS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box>
                  <Typography variant="body1">{option.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Experience Level */}
        <FormControl fullWidth>
          <InputLabel>Experience Level</InputLabel>
          <Select
            value={formData.experience || ''}
            label="Experience Level"
            onChange={(e) => handleInputChange('experience', e.target.value)}
          >
            {EXPERIENCE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box>
                  <Typography variant="body1">{option.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Portfolio Size */}
        <TextField
          fullWidth
          label="Portfolio Size (USD)"
          type="number"
          value={formData.portfolioSize || ''}
          onChange={(e) => handleInputChange('portfolioSize', Number(e.target.value))}
          inputProps={{ min: 100, step: 100 }}
          helperText="Total value of your crypto portfolio"
        />

        {/* Investment Goals */}
        <FormControl fullWidth>
          <InputLabel>Investment Goals</InputLabel>
          <Select
            multiple
            value={formData.goals || []}
            onChange={handleGoalChange}
            input={<OutlinedInput label="Investment Goals" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {GOAL_OPTIONS.map((goal) => (
              <MenuItem key={goal} value={goal}>
                {goal}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Preferred Tokens */}
        <FormControl fullWidth>
          <InputLabel>Preferred Tokens</InputLabel>
          <Select
            multiple
            value={formData.preferredTokens || []}
            onChange={handleTokenChange}
            input={<OutlinedInput label="Preferred Tokens" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {POPULAR_TOKENS.map((token) => (
              <MenuItem key={token} value={token}>
                {token}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Select tokens you prefer to invest in</FormHelperText>
        </FormControl>

        {/* Max Impermanent Loss Tolerance */}
        <Box>
          <Typography variant="body2" gutterBottom>
            Max Impermanent Loss Tolerance: {formData.maxImpermanentLoss || 5}%
          </Typography>
          <Slider
            value={formData.maxImpermanentLoss || 5}
            onChange={(_, value) => handleInputChange('maxImpermanentLoss', value)}
            min={0}
            max={20}
            step={1}
            marks={[
              { value: 0, label: '0%' },
              { value: 10, label: '10%' },
              { value: 20, label: '20%' }
            ]}
            valueLabelDisplay="auto"
          />
          <FormHelperText>Maximum acceptable impermanent loss for liquidity provision</FormHelperText>
        </Box>

        {/* Yield Target */}
        <Box>
          <Typography variant="body2" gutterBottom>
            Yield Target: {formData.yieldTarget || 15}%
          </Typography>
          <Slider
            value={formData.yieldTarget || 15}
            onChange={(_, value) => handleInputChange('yieldTarget', value)}
            min={5}
            max={50}
            step={5}
            marks={[
              { value: 5, label: '5%' },
              { value: 25, label: '25%' },
              { value: 50, label: '50%' }
            ]}
            valueLabelDisplay="auto"
          />
          <FormHelperText>Target annual percentage yield</FormHelperText>
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!isFormValid}
          sx={{ 
            marginTop: 2,
            padding: '12px 24px',
            fontSize: '16px'
          }}
        >
          Generate Token AI Recommendations
        </Button>
      </Box>
    </Box>
  );
}; 