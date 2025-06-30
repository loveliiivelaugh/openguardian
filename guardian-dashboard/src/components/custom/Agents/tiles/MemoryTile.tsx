// @components/GuardianUI/tiles/MemoryTile.tsx

import TileCard from './TileCard'
import { Typography, Stack, Chip, LinearProgress, Tooltip } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { queries } from '@api/index'    
import { formatDistanceToNow } from 'date-fns'

export default function MemoryTile() {
  const { data } = useQuery({
    ...queries.query("/api/v1/memory"),
    refetchInterval: 10000
  })

  const status = data?.qdrant_status || 'offline'
  const vectorCount = data?.qdrant_vector_count || 0
  const memoryRows = data?.supabase_memory_rows || 0
  const lastCheck = data?.last_check

  // For example purpose only — set quota realistically or remove it
  const maxVectors = 100_000
  const usagePercent = Math.min((vectorCount / maxVectors) * 100, 100)

  return (
    <TileCard title="Memory">
      <Stack spacing={1}>
        <Tooltip title={`Checked ${lastCheck ? formatDistanceToNow(new Date(lastCheck)) + ' ago' : 'N/A'}`}>
          <Chip
            label={`Qdrant: ${status.toUpperCase()}`}
            color={status === 'online' ? 'success' : 'error'}
            size="small"
            variant="outlined"
          />
        </Tooltip>

        <Typography variant="body2">
          Vectors: <strong>{vectorCount.toLocaleString()}</strong>
        </Typography>
        <LinearProgress
          variant="determinate"
          value={usagePercent}
          sx={{ height: 6, borderRadius: 3 }}
        />

        <Typography variant="body2">
          Supabase Memory Rows: <strong>{memoryRows.toLocaleString()}</strong>
        </Typography>
      </Stack>
    </TileCard>
  )
}
