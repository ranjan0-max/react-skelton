import { Box, Button, Typography } from '@mui/material';
import MainCard from '../MainCard';
import theme from '../Theme';

const LogViewer = ({ logDetail, onCancel }) => (
    <MainCard
        title={
            <Typography color={theme.typography.themeColor} sx={{ fontSize: '32px', fontWeight: 600 }}>
                {logDetail?.date}
            </Typography>
        }
    >
        <Box sx={{ margin: 'auto', mt: 4, maxHeight: 400, overflow: 'auto', p: 2, border: '1px solid #ccc' }}>
            {logDetail?.logs?.map((log, idx) => (
                <Box
                    key={idx}
                    sx={{
                        padding: '8px',
                        borderRadius: '4px',
                        backgroundColor: log.level === 'ERROR' ? '#FFEBEE' : '#E3F2FD',
                        marginBottom: '6px'
                    }}
                >
                    <Typography variant="subtitle2" color="textSecondary" fontWeight="bolder">
                        {log?.timestamp}
                    </Typography>
                    <Typography sx={{ fontWeight: 'bold', color: log?.level === 'ERROR' ? 'red' : 'blue' }}>{log?.level}</Typography>
                    <Typography variant="body2">
                        <span style={{ fontWeight: 'bolder' }}>Message :-</span> {log?.message}
                    </Typography>
                </Box>
            ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button type="button" variant="outlined" onClick={onCancel}>
                Close
            </Button>
        </Box>
    </MainCard>
);

export default LogViewer;
