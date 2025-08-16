import { colors } from "@mui/material";
import { alpha } from "@mui/material/styles";

// Theme Configuration file to be used in multiple front end ...
// ... microservices applications to maintain consistent theme ...
// ... across all applications. 

const themeConfig = {
    // Light theme
    light: {
        palette: {
            type: "light",
            primary: {
                main: "#4A90E2", // bright blue for brand
                light: "#7AB8F5",
                dark: "#2C6BB2",
            },
            secondary: {
                main: "#FFC107", // warm accent (amber)
            },
            background: {
                default: "#eee",
                paper: "#ffffff",
            },
            text: {
                primary: "#1a1a1a",
                secondary: colors.grey[700],
                disabled: colors.grey[400],
            },
            divider: alpha("#000", 0.1),
            action: {
                active: alpha("#000", 0.54),
                hover: alpha("#000", 0.04),
                selected: alpha("#000", 0.08),
                disabled: alpha("#000", 0.26),
                disabledBackground: alpha("#000", 0.12),
            },
            contrastThreshold: 3,
            info: {
                main: "#50AAFF",
                contrastText: "#fff",
            },
        },
    },

    // Dark theme
    dark: {
        border: {
            default: "1px solid #333",
            hover: "1px solid #777",
            active: "1px solid #999",
            main: "1px solid rgba(80, 170, 255, 0.8)",
        },
        palette: {
            type: "dark",
            divider: alpha("#fff", 0.1),
            primary: {
                main: "#50AAFF", // bright cyan for branding
            },
            secondary: {
                main: "#FFD54F", // gold-yellow highlight
            },
            tertiary: {
                main: "rgba(80, 170, 255, 0.8)",
            },
            background: {
                default: "#121212",
                paper: "#1e1e1e",
            },
            text: {
                primary: "#ffffff",
                secondary: colors.grey[500],
                disabled: colors.grey[700],
            },
            button: {
                primary: colors.grey[100],
                secondary: colors.grey[500],
                disabled: colors.grey[700],
            },
            info: {
                main: "#50AAFF",
                contrastText: "#fff",
            },
        },
    },

    // Values for both themes
    common: {
        typography: {
            fontSize: 15,
            fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", sans-serif',
        },
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 960,
                lg: 1200,
                xl: 1920,
            },
        },
        overrides: {
            MuiCssBaseline: {
                "@global": {
                    "#root": {
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        "& > *": {
                            flexShrink: 0,
                        },
                    },
                },
            },
        },
    },
};

export { themeConfig };