import * as React from 'react';
import { 
    ArrowLeft, 
    ArrowRight, 
    BarChartOutlined, 
    Expand, 
    LineAxisOutlined, 
    PieChartOutline, 
    TableChart,
    Download,
    Upload
} from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";


const ChartButtons = (props: any) => {
    const [showButtons, setShowButtons] = React.useState(false);
    const buttons = [
        {
            label: "Bar",
            value: "bar",
            icon: <BarChartOutlined />
        },
        {
            label: "Line",
            value: "line",
            icon: <LineAxisOutlined />
        },
        {
            label: "Pie",
            value: "pie",
            icon: <PieChartOutline />
        },
        {
            label: "Table",
            value: "table",
            icon: <TableChart />
        },
        {
            label: "Expand",
            value: "expand",
            icon: <Expand />
        },
        {
            label: "Export",
            value: "export",
            icon: <Download />
        },
        {
            label: "Import",
            value: "import",
            icon: <Upload />
        }
    ];

    return (
        <Box sx={{ display:"flex", justifyContent: "space-between", gap: 1 }}>
            <IconButton color="inherit" onClick={() => setShowButtons(!showButtons)}>
                {showButtons ? <ArrowRight /> : <ArrowLeft />}
            </IconButton>
            {showButtons && buttons.map((button) => (
                <IconButton
                    key={`${button.value}-chart-button`}
                    color="inherit"
                    onClick={() => props.setActiveChart(button.value)}
                >
                    {button.icon || button.label}
                </IconButton>
            ))}
        </Box>
    );
};

export default ChartButtons;