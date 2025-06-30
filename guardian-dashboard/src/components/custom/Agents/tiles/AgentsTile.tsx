// @components/GuardianUI/tiles/AgentsTile.tsx

import TileCard from './TileCard'
import { Typography, Box, Stack, Chip, Tooltip } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { queries } from '@api/index'
import { LineChart } from '@mui/x-charts/LineChart'

const statusColors = {
  online: 'success',
  idle: 'info',
  executing: 'warning',
  error: 'error'
}

export default function AgentsTile() {
  const { data } = useQuery({
    ...queries.query("/api/v1/guardian/agents/status"), // ← backend route that returns all agent statuses
    refetchInterval: 5000
  })

  console.log(data)

  const agentStats = {
    total: data?.length || 0,
    online: [],
    idle: [],
    executing: [],
    error: []
    // online: data?.filter((a: any) => a.status === 'online').length || 0,
    // idle: data?.filter((a: any) => a.status === 'idle').length || 0,
    // executing: data?.filter((a: any) => a.status === 'executing').length || 0,
    // error: data?.filter((a: any) => a.status === 'error').length || 0
  }

  // Sparkline Mock (replace with real backend if you track agent activity counts over time)
  const sparklineData = [3, 5, 4, 6, 8, 6, 7, agentStats.online]

  return (
    <TileCard title="Agents">
      <Stack spacing={1}>
        <Typography variant="h5" fontWeight="bold">
          {agentStats.total} Total
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {(['online', 'idle', 'executing', 'error'] as const).map((status) => (
            <Chip
              key={status}
              label={`${agentStats[status]} ${status}`}
              // @ts-ignore
              color={statusColors[status]}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>

        <Tooltip title="Agent activity over time">
          <Box>
            {/* @ts-ignore */}
            <LineChart
              height={80}
              series={[{ data: sparklineData as (number | null)[], showMark: false }]}
              xAxis={[{ scaleType: 'point', data: Array(sparklineData.length).fill('') }]}
              sx={{ mt: 1 }}
              grid={{ vertical: false, horizontal: false }}
              margin={{ top: 5, bottom: 0, left: 0, right: 0 }}
            />
          </Box>
        </Tooltip>
      </Stack>
    </TileCard>
  )
}
