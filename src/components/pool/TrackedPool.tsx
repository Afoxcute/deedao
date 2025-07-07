import { Version } from '@blend-capital/blend-sdk';
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline';
import { Box, BoxProps, Typography } from '@mui/material';
import { useSettings } from '../../contexts';
import theme from '../../theme';
import { OpaqueButton } from '../common/OpaqueButton';
import { Row } from '../common/Row';
import { VersionTag } from '../common/VersionTag';
import { PoolIcon } from './PoolIcon';

export interface TrackedPoolProps extends BoxProps {
  pool: {
  name: string;
  id: string;
  version: Version;
    customAssetIds?: string[];
  };
  onRemove: () => void;
}

export const TrackedPool: React.FC<TrackedPoolProps> = ({ pool, onRemove, sx, ...props }) => {
  const { isV2Enabled } = useSettings();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '5px',
        padding: '12px',
        width: '100%',
        ...sx,
      }}
      {...props}
    >
      <Row sx={{ alignItems: 'center' }}>
        <PoolIcon name={pool.name} sx={{ height: '30px', width: '30px', borderRadius: '50%' }} />
        <Row sx={{ flexDirection: 'column', marginLeft: '6px' }}>
          <Row sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
            <Typography variant="h3">
              {`${pool.name} Pool`}
            </Typography>
            {isV2Enabled && <VersionTag version={pool.version} sx={{ marginLeft: '6px' }} />}
          </Row>
          <Typography variant="h3" sx={{ wordBreak: 'break-word' }}>
            {pool.id}
          </Typography>
        </Row>
      </Row>
      <OpaqueButton
        palette={theme.palette.warning}
        onClick={onRemove}
        sx={{ minWidth: 'auto' }}
      >
        <RemoveCircleOutline />
      </OpaqueButton>
    </Box>
  );
};
