// @components/GuardianUI/tiles/HeartbeatTile.tsx

import { useEffect, useState } from 'react'
import { Typography, Box, Tooltip } from '@mui/material'
import { motion } from 'framer-motion'
import TileCard from './TileCard'
import { differenceInSeconds } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { queries } from '@api/index'

export default function HeartbeatTile() {
  const [pingAge, setPingAge] = useState<number>(0)
  const { data } = useQuery({
    // /api/v1/guardian/orchestrator/status
    ...queries.query("/api/v1/guardian/orchestrator/status"),
    refetchInterval: 3000
  })

  useEffect(() => {
    if (data?.last_heartbeat) {
      const seconds = differenceInSeconds(new Date(), new Date(data.last_heartbeat))
      setPingAge(seconds)
    }
  }, [data])

  const color = pingAge < 5 ? '#4caf50' : pingAge < 15 ? '#ff9800' : '#f44336'

  return (
    <TileCard title="Heartbeat">
      <Tooltip title={`Last ping: ${pingAge}s ago`}>
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.15, 1],
            boxShadow: [`0 0 0px ${color}`, `0 0 20px ${color}`, `0 0 0px ${color}`]
          }}
          transition={{
            duration: 1,
            repeat: Infinity
          }}
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: color,
            mx: 'auto',
            my: 1
          }}
        />
      </Tooltip>
      <Typography align="center" variant="caption" color="text.secondary">
        {pingAge < 15 ? 'Live' : 'Disconnected'}
      </Typography>
    </TileCard>
  )
}
