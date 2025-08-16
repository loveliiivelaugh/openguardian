import React from "react";
import { Box, Stack, Typography } from "@mui/material";

type LegendItem = {
    label: string;
    color: string;
};

type CalendarLegendProps = {
    items: LegendItem[];
};

const Dot = ({ color }: { color: string }) => (
    <Box
        sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: color,
            boxShadow: `0 0 0 1px rgba(0,0,0,0.2)`,
        }}
    />
);

const CalendarLegend: React.FC<CalendarLegendProps> = ({ items }) => {
    return (
        <Stack direction="row" spacing={3} p={2} alignItems="center" flexWrap="wrap">
            {items.map((item, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="center">
                    <Dot color={item.color} />
                    <Typography variant="body2" color="text.secondary">
                        {item.label}
                    </Typography>
                </Stack>
            ))}
        </Stack>
    );
};

export default CalendarLegend;
