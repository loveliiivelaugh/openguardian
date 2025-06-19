import * as React from 'react';
import { Box, Tabs, Tab } from '@mui/material';


function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};

export default function BasicTabs(props: { tabs: any[], [key: string]: any }) {
    const [value, setValue] = React.useState(props?.tabs[0].value || 0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        if (props?.onChange) props.onChange(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {props?.tabs && props.tabs.map((tab: any, index: number) => (
                        <Tab key={index} {...tab} {...a11yProps(index)} />
                    ))}
                    {/* <Tab label="Item One" {...a11yProps(0)} /> */}
                </Tabs>
            </Box>
            {props?.renderContent && props.renderContent(value)}
        </Box>
    );
};
