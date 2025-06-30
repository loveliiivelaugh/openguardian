import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

export const GlowingNode = ({ data }: any) => {
  const width = 150;
  const height = 80;
  const radius = 12;

  return (
    <Box position="relative" width={width} height={height} borderRadius={radius} overflow="hidden">
      {/* Glow border */}
      <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        <motion.rect
          x="0" y="0"
          rx={radius}
          ry={radius}
          width={width}
          height={height}
          fill="transparent"
          stroke="#9f6aff"
          strokeWidth={2}
          strokeDasharray="300"
          strokeDashoffset="300"
          animate={{
            strokeDashoffset: [300, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>

      {/* Node content */}
      <Box
        position="relative"
        zIndex={1}
        width="100%"
        height="100%"
        bgcolor="#121212"
        borderRadius={radius}
        p={1.5}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Typography variant="subtitle2" fontWeight={600}>
          ⚙️ {data.label || "Step"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {data.description || "Running..."}
        </Typography>
      </Box>

      {/* ReactFlow handles */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Box>
  );
};
