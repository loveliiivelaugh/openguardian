// @components/GuardianUI/tiles/TileCard.tsx

import { Paper, Typography, Box } from '@mui/material'
import { motion } from 'framer-motion'

type TileCardProps = {
  title: string
  children: React.ReactNode
}

const TileCard = ({ title, children }: TileCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 2,
          borderRadius: 4,
          minWidth: 220,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: (theme) => '#242424',
            // theme.palette.mode === 'dark' ? '#1e1e1e' : '#fafafa',
        }}
      >
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Box flex={1} display="flex" flexDirection="column" justifyContent="center">
          {children}
        </Box>
      </Paper>
    </motion.div>
  )
}

export default TileCard
