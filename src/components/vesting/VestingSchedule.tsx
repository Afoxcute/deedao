import { Box, LinearProgress, Typography } from '@mui/material';
import theme from '../../theme';
import { Row } from '../common/Row';

interface VestingScheduleProps {
  schedules: Array<{
    amount: string;
    startTime: number;
    endTime: number;
    claimed: boolean;
  }>;
}

export const VestingSchedule: React.FC<VestingScheduleProps> = ({ schedules }) => {
  const calculateProgress = (startTime: number, endTime: number) => {
    const now = Date.now();
    if (now >= endTime) return 100;
    if (now <= startTime) return 0;
    return ((now - startTime) / (endTime - startTime)) * 100;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Box sx={{ marginTop: '24px' }}>
      <Typography variant="h2" sx={{ marginBottom: '16px' }}>Vesting Schedule</Typography>
      {schedules.map((schedule, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: theme.palette.background.paper,
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}
        >
          <Row sx={{ justifyContent: 'space-between', marginBottom: '8px' }}>
            <Typography variant="h3">{schedule.amount} BLND</Typography>
            <Typography
              variant="body1"
              sx={{
                color: schedule.claimed
                  ? theme.palette.success.main
                  : theme.palette.text.secondary
              }}
            >
              {schedule.claimed ? 'Claimed' : 'Vesting'}
            </Typography>
          </Row>
          <LinearProgress
            variant="determinate"
            value={calculateProgress(schedule.startTime, schedule.endTime)}
            sx={{
              marginY: '12px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: theme.palette.background.default,
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.palette.primary.main,
              }
            }}
          />
          <Row sx={{ justifyContent: 'space-between', marginTop: '8px' }}>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Start: {formatDate(schedule.startTime)}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              End: {formatDate(schedule.endTime)}
            </Typography>
          </Row>
        </Box>
      ))}
    </Box>
  );
}; 