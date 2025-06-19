// Packages
import { ReactNode, useMemo } from 'react';
import { createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@emotion/react';
import { motion } from "framer-motion"

import { themeConfig } from './themeConfig';
import { useUtilityStore } from '@store/index';
import IconButton from "@mui/material/IconButton";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Tooltip from "@mui/material/Tooltip";

// @ts-ignore
const useTheme = ({ mode }: { mode: string }) => useMemo(() => createTheme({
  ...themeConfig.common,
  ...themeConfig[mode as keyof typeof themeConfig],
}), [mode])

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { colorMode } = useUtilityStore();
  const theme = useTheme({ mode: colorMode });
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
        {children}
    </MuiThemeProvider>
  )
};

export const ThemeToggleButton: React.FC = () => {
  const { colorMode, setColorMode } = useUtilityStore();
  const toggleTheme = () => setColorMode(colorMode === "light" ? "dark" : "light");
  return (
    <Tooltip title={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}>
      <IconButton onClick={toggleTheme} color="inherit">
        {colorMode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export const PageTransitionWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { 
          opacity: 0,
          transition: { duration: 0.35 }
        }
      }}
    >
      {children}
    </motion.div>
  )
};
