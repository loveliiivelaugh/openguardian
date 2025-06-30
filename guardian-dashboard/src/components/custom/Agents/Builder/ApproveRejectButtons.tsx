import { Box, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

const AnimatedApproveRejectButtons = (
    { onApprove, onReject, waiting = true, approveIsLoading = false }: 
    { onApprove: () => void, onReject: () => void, waiting: boolean, approveIsLoading: boolean }
) => {
  return (
    <>
      <MotionButton
        variant="outlined"
        onClick={onReject}
        whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(255,0,0,0.5)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        color="error"
        sx={{ mr: 2 }}
      >
        ❌ Reject
      </MotionButton>

      <MotionButton
        variant="outlined"
        onClick={onApprove}
        whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(0,255,128,0.5)" }}
        whileTap={{ scale: 0.95 }}
        color="success"
        animate={waiting ? { scale: [1, 1.05, 1] } : false}
        transition={waiting 
            ? { duration: 1, repeat: Infinity } 
            : { type: "spring", stiffness: 300 }
        }
      >
        ✅ Approve {approveIsLoading && <Box px={2}><CircularProgress size={12} /></Box>}
      </MotionButton>
    </>
  );
};

export default AnimatedApproveRejectButtons;
