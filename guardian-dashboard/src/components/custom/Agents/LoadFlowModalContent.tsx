import React from 'react';
import { Box, Typography, Card, CardContent, Button, Chip, Grid, Stack, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import PaidIcon from '@mui/icons-material/Paid';

interface AgentFlowCardProps {
  name: string;
  description?: string;
  tags?: string[];
  nodes?: any;
  edges?: any;
  onLoad: (flow: any) => void;
  cpuUsage?: string;
  storage?: string;
  dimension?: string;
  plan?: string;
  features?: string[];
  configuration?: { [key: string]: string | number | boolean };
  created_at: string;
  created_by?: string;
  current_step?: number;
  use_case?: string;
  id?: string;
  is_public?: boolean;
  is_template?: boolean;
  metadata?: any;
  results?: any;
  status?: string;
}

export const LoadFlowModalContent: React.FC<AgentFlowCardProps> = (props) => {
  const {
    name,
    description = 'No description provided.',
    tags = [],
    nodes = [],
    edges = [],
    onLoad,
    cpuUsage,
    storage,
    dimension,
    plan,
    features = [],
    configuration,
    created_at,
    created_by,
    current_step,
    use_case,
    id,
    is_public,
    is_template,
    metadata,
    results,
    status,
  } = props;
  console.log("LOADFLOWMODAL: ", plan, configuration)
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      style={{ width: '100%' }}
    >
      <Card
        elevation={0}
        variant="outlined"
        sx={{
          background: '#1C1C1E', // Dark background
          borderColor: '#303030', // Darker border
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.6)', // Deeper shadow
          color: '#E0E0E0', // Light text
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: '#BB86FC' }}> {/* Purple title */}
            {name}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {description}
            </Typography>
          )}

          {features.length > 0 && (
            <Box mt={2} mb={2}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Features:
              </Typography>
              <Stack direction="column" spacing={0.5}>
                {features.map((feature, idx) => (
                  <Box key={idx} display="flex" alignItems="center" gap={0.5}>
                    <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 'small' }} /> {/* Green check */}
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {tags.length > 0 && (
            <Box display="flex" gap={0.5} flexWrap="wrap" mt={1} mb={2}>
              {tags.map((tag, idx) => (
                <Chip
                  key={idx}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: '#2E3B4E', // Dark chip background
                    color: '#B3E5FC', // Light blue chip text
                    borderColor: '#42A5F5', // Blue chip border
                  }}
                />
              ))}
            </Box>
          )}

          {(nodes.length > 0 || edges.length > 0) && (
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 1 }}>
              <span style={{ marginRight: 4 }}>{nodes.length} nodes</span> • <span>{edges.length} connections</span>
            </Typography>
          )}

          {(cpuUsage || storage || dimension || plan) && (
            <Box mt={2} mb={2}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Requirements:
              </Typography>
              <Grid container spacing={1}>
                {cpuUsage && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <MemoryIcon color="primary" fontSize="small" />
                      <Typography variant="body2">CPU: {cpuUsage}</Typography>
                    </Box>
                  </Grid>
                )}
                {storage && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <StorageIcon color="primary" fontSize="small" />
                      <Typography variant="body2">Storage: {storage}</Typography>
                    </Box>
                  </Grid>
                )}
                {dimension && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <SettingsEthernetIcon color="primary" fontSize="small" />
                      <Typography variant="body2">Dimension: {dimension}</Typography>
                    </Box>
                  </Grid>
                )}
                {plan && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <PaidIcon color="secondary" fontSize="small" />
                      <Typography variant="body2">Plan: {plan}</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {configuration && Object.keys(configuration).length > 0 && (
            <Box mt={2} sx={{ backgroundColor: '#282828', borderRadius: 1, padding: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Configuration:
              </Typography>
              <Typography variant="body2" fontFamily="monospace" color="#A7FFEB">
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(configuration, null, 2)}
                </pre>
              </Typography>
            </Box>
          )}

          <Chip
            label="#Category"
            size="small"
            sx={{
              backgroundColor: '#44FAba',
              color: '#333',
              '&:hover': {
                backgroundColor: '#9C64F4',
              },
            }}
          />

          <Box mt={2} display="flex" justifyContent="space-between">
            <ListItemText 
              primary="Created At"
              secondary={<Typography variant="subtitle1">{new Date(created_at).toLocaleString()}</Typography>}
            />
            <Stack>
              <Button
                variant="contained"
                size="small"
                onClick={() => onLoad(props)}
                sx={{
                  backgroundColor: '#BB86FC', // Purple button
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#9C64F4', // Darker purple on hover
                  },
                }}
              >
                Load Automation
              </Button>
              <Box display="flex" gap={0.5} mt={1}>
                {is_template && <Chip variant="outlined" size="small" label="Template" sx={{ backgroundColor: '#282828', color: '#B3E5FC' }}></Chip>}
                <Chip variant="outlined" size="small" label={is_public ? "Public" : "Private"} sx={{ backgroundColor: '#282828', color: '#B3E5FC' }}></Chip>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};