// @components/GuardianUI/tiles/AutomationsTile.tsx
import TileCard from './TileCard'
import { Typography, Box, Stack, Tooltip } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'
import { useQuery } from '@tanstack/react-query'
import { queries } from '@api/index'
import { formatDistanceToNow } from 'date-fns'
const automations = [
    { id: 1, source: 'slack', name: 'Slack HITL Trigger', triggered_at: '...' },
    { id: 2, source: 'github', name: 'GitHub PR Webhook', triggered_at: '...' },
    // ...
];

export default function AutomationsTile() {
  const { data } = useQuery({
    ...queries.query("/api/v1/guardian/automations/recent"), // ← backend endpoint
    refetchInterval: 10000
  })

  const total = data?.length || 0
  const last = data?.[0]
  const sources = ['slack', 'github', 'n8n', 'email', 'other']

  const sourceCounts = sources.map((source) => ({
    id: source,
    value: data?.filter((a: any) => a.source === source).length || 0,
    label: source.toUpperCase()
  }))

  return (
    <TileCard title="Automations">
      <Stack spacing={1} alignItems="center">
        <Typography variant="h5" fontWeight="bold">
          {total}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Triggered today
        </Typography>

        <Box width="100%" mt={1}>
            {/* @ts-ignore */}
          <PieChart
            height={120}
            series={[{ data: sourceCounts, innerRadius: 25 }]}
            legend={{ hidden: true }}
            slotProps={{
              legend: {
                itemGap: 4,
                labelStyle: { fontSize: 12 }
              }
            }}
          />
        </Box>

        {last && (
          <Tooltip
            title={`Triggered ${formatDistanceToNow(new Date(last.triggered_at))} ago`}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ maxWidth: '90%', textAlign: 'center' }}
            >
              Last: {last.name}
            </Typography>
          </Tooltip>
        )}
      </Stack>
    </TileCard>
  )
}
