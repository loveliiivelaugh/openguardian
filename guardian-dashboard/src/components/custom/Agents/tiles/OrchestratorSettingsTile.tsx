// src/components/Dashboard/OrchestratorSettingsTile.tsx
import { Card, CardHeader, CardContent, FormGroup, FormControlLabel, Switch, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queries } from '@api/index';

const defaultFeatures = [
  'slack_hitl',
  'github_ops',
  'llm_enabled',
  'memory_enabled',
  'auto_assign'
];

export const OrchestratorSettingsTile = () => {
    const { data: features, isLoading: loading } = useQuery(queries.query('/api/v1/orchestrator/settings'));
    const settingsMutation = useMutation(queries.mutate('/api/v1/orchestrator/features/toggle'));

  const toggleFeature = async (feature: string) => {
    const newState = !features[feature];
    await settingsMutation.mutate({
      feature,
      enabled: newState
    });
  };

  return (
    <Card sx={{ minWidth: 280 }}>
      <CardHeader title="⚙️ Orchestrator Settings" />
      <CardContent>
        {loading ? (
          <Typography variant="body2">Loading...</Typography>
        ) : (
          <FormGroup>
            {defaultFeatures.map((feature) => (
              <FormControlLabel
                key={feature}
                control={
                  <Switch
                    checked={features[feature] || false}
                    onChange={() => toggleFeature(feature)}
                  />
                }
                label={feature.replace(/_/g, ' ')}
              />
            ))}
          </FormGroup>
        )}
      </CardContent>
    </Card>
  );
};
