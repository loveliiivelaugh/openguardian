// @components/GuardianUI/tiles/LLMUsageTile.tsx

import TileCard from './TileCard'
import { Typography, Stack, Chip, Tooltip, Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { queries } from '@api/index'
import { LineChart } from '@mui/x-charts/LineChart'

export default function LLMUsageTile() {
  const { data } = useQuery({
    ...queries.query("/api/v1/guardian/llm/usage_today"),
    refetchInterval: 10000
  })

  const model = data?.last_model_used || 'unknown'
  const tokens = data?.token_count || 0
  const errors = data?.error_count || 0
  const total = data?.total_requests || 1 // avoid div by 0
  const fallbackRate = ((errors / total) * 100).toFixed(1)
  const trend = data?.usage_trend || []

  return (
    <TileCard title="LLM Usage">
      <Stack spacing={1} alignItems="center">
        <Chip label={model.toUpperCase()} size="small" color="primary" variant="outlined" />

        <Typography variant="h5" fontWeight="bold">
          {tokens.toLocaleString()}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Tokens Today
        </Typography>

        <Tooltip title={`${errors} errors (${fallbackRate}%)`}>
          <Typography variant="caption" color="text.secondary">
            Fallback Rate: {fallbackRate}%
          </Typography>
        </Tooltip>

        {trend.length > 1 && (
          <Box width="100%" mt={1}>
            {/* @ts-ignore */}
            <LineChart
              height={80}
              series={[{ data: trend, showMark: false, label: 'Tokens' }]}
              xAxis={[{ scaleType: 'point', data: Array(trend.length).fill('') }]}
              grid={{ vertical: false, horizontal: false }}
              margin={{ top: 5, bottom: 0, left: 0, right: 0 }}
            />
          </Box>
        )}
      </Stack>
    </TileCard>
  )
}
