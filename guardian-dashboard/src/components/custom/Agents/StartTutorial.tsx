import { Box, Button, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import ReusablePopover from "../ReusablePopover/ReusablePopover";

const TutorialPopoverContent = ({ message, incrementStep, resetStep }: { message: string, incrementStep: () => void, resetStep: () => void }) => (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
            borderRadius: 2,
            p: 0.4, // padding to show the border
            background: `linear-gradient(135deg, #ff00cc, #3333ff, #00ffcc, #ffcc00)`,
            backgroundSize: '400% 400%',
            animation: 'borderGradient 8s ease infinite',
        }}
        >
        <Box
            sx={{
                borderRadius: 1.5,
                backgroundColor: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(10px)",
                p: 2,
                color: "#fff",
            }}
        >
        {/* Arrow pointing to target */}
        <Box
          sx={{
            position: "absolute",
            top: -8,
            left: 20,
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: "8px solid rgba(0,200,0, 0.4)",
            filter: "drop-shadow(0 0 4px rgba(0,200,0,0.5))"
          }}
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {message}
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button size="small" onClick={() => resetStep()} color="inherit" sx={{ textTransform: 'none' }}>
                Skip
            </Button>
            <Button size="small" onClick={() => incrementStep()} variant="outlined" sx={{ textTransform: 'none' }}>
                Got it
            </Button>
        </Stack>
      </Box>
    </Box>
    {/* Add this globally or in a styled component */}
    <style>{`
        @keyframes borderGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `}</style>
    </motion.div>
);

let activeStep = 0;
const startTutorialPopover = (step: number, content: React.ReactNode) => {
    const stepMessages = [
        "Click here to create your first flow",
        "Select a trigger from the 'Triggers' category",
        "Select the manual trigger",
        "Your new trigger appears on the canvas",
        "Click here to add another node",
        "Select a node from the 'Core' category",
        "Your new node appears on the canvas",
        "Connect the nodes by clicking on the output of one and the input of another",
        "Click here to save your flow",
        "Your new flow is saved",
        "Click here to run your flow",
        "Your flow is running",
        "Click here to stop your flow",
        "Your flow is stopped"
    ]

    const incrementStep = () => {
        activeStep++;
    };

    const resetStep = () => activeStep = 0;

    return (
        <ReusablePopover
            isOpen={activeStep === step}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center'
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            popoverContent={() => <TutorialPopoverContent message={stepMessages[step - 1]} incrementStep={incrementStep} resetStep={resetStep} />}
        >
            {() => content}
        </ReusablePopover>
    )
}

export default startTutorialPopover;
export { startTutorialPopover };