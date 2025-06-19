import { Box, SwipeableDrawer } from '@mui/material'
import { useWindowSize } from 'usehooks-ts'
import { DrawerType, useUtilityStore } from '@store/utilityStore';


const formatSize = (windowSize: { height: number, width: number }) => {
    if (windowSize.width < 320) return "xs";
    if (windowSize.width < 600) return "sm";
    if (windowSize.width < 960) return "md";
    if (windowSize.width < 1280) return "lg";
    return "xl";
};

const Drawer = ({ children, ...props }: DrawerType) => {
    const { drawer, setDrawer } = useUtilityStore();
    const windowSize = useWindowSize();
    return (
        // @ts-ignore
        <SwipeableDrawer
            {...props}
            {...drawer}
            {...(typeof(props.anchor) === "object") && {
                anchor: props.anchor[formatSize(windowSize) as keyof typeof props.anchor]
            }}
            {...(typeof(props?.variant) === "object") && {
                variant: props.variant[formatSize(windowSize) as keyof typeof props.variant]
            }}
            onClose={() => setDrawer({ open: false })}
        >
            <Box sx={{ minWidth: 200, height: '100%', mt: 0, ...(drawer as any)?.boxStyle }}>
                {drawer?.content && drawer.content}
                {children}
            </Box>
        </SwipeableDrawer>
    );
};

export default Drawer;
export { formatSize };

// ?? USAGE
// import { useUtilityStore } from '@store/index';
// const Drawer = React.lazy(() => import('app/Drawer'));

// const Test = () => {
//     const { drawer, setDrawer } = useUtilityStore();
//     return (
//         <>
//             <button onClick={() => setDrawer({ open: true })}>Open Drawer</button>
//             <Drawer {...drawer}>
//                 <Box sx={{ width: 200, height: '100%', mt: 8 }}>
//                     <h2>Drawer</h2>
//                     {drawer?.content && drawer.content}
//                 </Box>
//             </Drawer>
//         </>
//     )
// }