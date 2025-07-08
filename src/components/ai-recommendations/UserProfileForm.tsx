import {
    Box,
    Button,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import { useState } from 'react';
import { UserProfile } from '../../utils/ai-recommendations';

interface UserProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
}

const RISK_TOLERANCE_OPTIONS = [
  { value: 'CONSERVATIVE', label: 'Conservative', description: 'Prefer stable, low-risk investments' },
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
  { value: 'BEGINNER', label: 'Beginner', description: 'New to DeFi and NFT staking' },
  { value: 'INTERMEDIATE', label: 'Intermediate', description: 'Some experience with DeFi' },
  { value: 'EXPERT', label: 'Expert', description: 'Experienced DeFi user' }
];

const GOAL_OPTIONS = [
  'Passive Income',
  'Portfolio Growth',
  'Capital Preservation',
  'Diversification',
  'High Returns',
  'Learning DeFi',
  'Community Participation'
];

export const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    riskTolerance: 'MODERATE',
    investmentHorizon: 'MEDIUM_TERM',
    liquidityNeeds: 'MEDIUM',
    experience: 'INTERMEDIATE',
    portfolioSize: 10000,
    goals: []
  });

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFormData(prev => ({ 
      ...prev, 
      goals: typeof value === 'string' ? value.split(',') : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.riskTolerance && formData.investmentHorizon && 
        formData.liquidityNeeds && formData.experience && 
        formData.portfolioSize && formData.goals) {
      onSubmit(formData as UserProfile);
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
        Your Investment Profile
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '32px', textAlign: 'center' }}>
        Help our AI understand your investment preferences to provide personalized recommendations.
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
          Generate AI Recommendations
        </Button>
      </Box>
    </Box>
  );
}; 