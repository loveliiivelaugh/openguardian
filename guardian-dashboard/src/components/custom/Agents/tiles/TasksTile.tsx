// @components/GuardianUI/tiles/TasksTile.tsx

import TileCard from './TileCard'
import { Typography, Box, Stack, Chip } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { queries } from '@api/index'
import { BarChart } from '@mui/x-charts/BarChart'
import { format } from 'date-fns'

export default function TasksTile() {
  const { data } = useQuery({
    ...queries.query("/api/v1/guardian/tasks/today"), // ← backend should return today's tasks
    refetchInterval: 5000
  })

  const taskStats = {
    total: data?.length || 0,
    todo: data?.filter((t: any) => t.status === 'todo').length || 0,
    in_progress: data?.filter((t: any) => t.status === 'in_progress').length || 0,
    done: data?.filter((t: any) => t.status === 'done').length || 0,
    failed: data?.filter((t: any) => t.status === 'failed').length || 0
  }

  const barData = [
    { label: 'To-Do', value: taskStats.todo },
    { label: 'In Progress', value: taskStats.in_progress },
    { label: 'Done', value: taskStats.done },
    { label: 'Failed', value: taskStats.failed }
  ]

  return (
    <TileCard title="Tasks">
      <Stack spacing={1}>
        <Typography variant="h5" fontWeight="bold">
          {taskStats.total}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Created {format(new Date(), 'MMM d')}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {Object.entries({
            todo: 'default',
            in_progress: 'info',
            done: 'success',
            failed: 'error'
          }).map(([key, color]) => (
            <Chip
              key={key}
              label={`${taskStats[key as keyof typeof taskStats]} ${key.replace('_', ' ')}`}
              color={color as any}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>

        <Box mt={1}>
            {/* @ts-ignore */}
          <BarChart
            height={100}
            series={[{ data: barData.map((b) => b.value), label: 'Tasks' }]}
            xAxis={[{ data: barData.map((b) => b.label), scaleType: 'band' }]}
            grid={{ horizontal: false, vertical: false }}
            margin={{ top: 10, bottom: 20, left: 0, right: 0 }}
          />
        </Box>
      </Stack>
    </TileCard>
  )
}
