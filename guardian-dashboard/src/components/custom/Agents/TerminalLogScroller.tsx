import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import useUtilityStore from '@store/utilityStore';

const MAX_LINES = 20;

interface TerminalLogScrollerProps {
    logStream: string[];
    noInfo?: boolean;
    sx?: any;
}

const getColorByLevel = (line: string): string => {
    if (/error/i.test(line)) return '#f44336';
    if (/warn/i.test(line)) return '#ff9800';
    if (/debug/i.test(line)) return '#ab47bc';
    if (/info/i.test(line)) return '#29b6f6';
    return '#90caf9';
};

const formatLineWithTimestamp = (line: string): string => {
    const now = new Date().toLocaleTimeString();
    return `[${now}] ${line}`;
};

export const getLogMetadata = (line: string) => {
    if (/error/i.test(line)) return { color: '#f44336', icon: '❌', level: 'error' };
    if (/warn/i.test(line)) return { color: '#ff9800', icon: '⚠️', level: 'warn' };
    if (/debug/i.test(line)) return { color: '#ab47bc', icon: '🐛', level: 'debug' };
    if (/info/i.test(line)) return { color: '#29b6f6', icon: 'ℹ️', level: 'info' };
    return { color: '#90caf9', icon: '✅', level: 'default' };
};


// export function TerminalLogScroller({ logStream, noInfo, sx }: TerminalLogScrollerProps) {
//     if (!logStream || !logStream.length) return null;

//     const utilityStore = useUtilityStore();
//     const containerRef = useRef<HTMLDivElement>(null);
//     const [logs, setLogs] = useState<string[]>([]);
//     const [query, setQuery] = useState('');
//     const [autoScroll, setAutoScroll] = useState(true);

//     useEffect(() => {
//         if (logStream.length > 0 && Array.isArray(logStream)) {
//             const timestamped = logStream.map(formatLineWithTimestamp);
//             setLogs(prev => {
//                 const next = [...prev, ...timestamped];
//                 return next.slice(-MAX_LINES);
//             });
//         }
//     }, [logStream]);

//     const filteredLogs = logs.filter(line => line.toLowerCase().includes(query.toLowerCase()));

//     useEffect(() => {
//         const container = containerRef.current;
//         if (!container) return;

//         const handleScroll = () => {
//             const scrollThreshold = 50; // pixels from bottom = "close enough"
//             const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
//             setAutoScroll(distanceFromBottom < scrollThreshold);
//         };

//         container.addEventListener('scroll', handleScroll);

//         return () => {
//             container.removeEventListener('scroll', handleScroll);
//         };
//     }, []);

//     // useEffect(() => {
//     //     const container = containerRef.current;
//     //     if (!container || !autoScroll) return;

//     //     container.scrollTop = container.scrollHeight;
//     // }, [filteredLogs, autoScroll]);

//     const rowVirtualizer = useVirtualizer({
//         count: filteredLogs.length,
//         getScrollElement: () => containerRef.current,
//         estimateSize: () => 24,
//         overscan: 10,
//     });

//     return (
//         <Box
//             sx={{
//                 position: 'relative',
//                 backgroundColor: '#121212',
//                 borderRadius: 2,
//                 height: 120,
//                 overflow: 'hidden',
//                 fontFamily: 'monospace',
//                 color: '#90caf9',
//                 fontSize: '0.8rem',
//                 px: 2,
//                 py: 1,
//                 ...sx,
//             }}
//         >
//             {!noInfo && (
//                 <Tooltip title="Expand Logs">
//                     <IconButton
//                         size="small"
//                         sx={{ position: 'absolute', top: 4, right: 4, zIndex: 2, color: '#90caf9', p: 0.5 }}
//                         onClick={() => {
//                             utilityStore.setModal({
//                                 open: true,
//                                 title: "Logs",
//                                 sx: {
//                                     slots: {
//                                         box: {
//                                             height: sx?.height ?? 800,
//                                             maxHeight: 800,
//                                             width: 600,
//                                             overflow: 'auto',
//                                             fontFamily: 'monospace',
//                                             px: 2,
//                                             py: 1,
//                                         },
//                                     },
//                                 },
//                                 content: (
//                                     <>
//                                         <TextField
//                                             placeholder="Search logs 🔍"
//                                             variant="outlined"
//                                             size="small"
//                                             fullWidth
//                                             sx={{ mb: 1, backgroundColor: '#1e1e1e' }}
//                                             value={query}
//                                             onChange={(e) => setQuery(e.target.value)}
//                                         />
//                                         <TerminalLogScroller logStream={filteredLogs} noInfo sx={{ height: "100%" }} />
//                                     </>
//                                 ),
//                             });
//                         }}
//                     >
//                         <InfoOutlinedIcon fontSize="small" />
//                     </IconButton>
//                 </Tooltip>
//             )}

//             {/* Fading overlays */}
//             <Box
//                 sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 20, background: 'linear-gradient(to bottom, #121212, transparent)', zIndex: 1 }}
//             />
//             <Box
//                 sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 20, background: 'linear-gradient(to top, #121212, transparent)', zIndex: 1 }}
//             />

//             {/* Virtualized Scrollable terminal text */}
//             <Box
//                 ref={containerRef}
//                 sx={{
//                     height: '100%',
//                     overflowY: 'auto',
//                     pr: 1,
//                     scrollbarWidth: 'none',
//                     '&::-webkit-scrollbar': { display: 'none' },
//                 }}
//             >
//                 <Box
//                     sx={{
//                         height: `${rowVirtualizer.getTotalSize()}px`,
//                         width: '100%',
//                         position: 'relative',
//                     }}
//                 >
//                     {rowVirtualizer.getVirtualItems().map((virtualRow) => {
//                         const line = filteredLogs[virtualRow.index];
//                         return (
//                             <motion.div
//                                 key={virtualRow.key}
//                                 ref={rowVirtualizer.measureElement}
//                                 initial={{ opacity: 0, y: 5 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.3 }}
//                                 style={{
//                                     position: 'absolute',
//                                     left: 0,
//                                     width: '100%',
//                                     transform: `translateY(${virtualRow.start}px)`,
//                                     display: "flex",
//                                 }}
//                             >
//                                 <Tooltip title="Copy to clipboard">
//                                     <Typography
//                                         variant="body2"
//                                         onClick={() => navigator.clipboard.writeText(line)}
//                                         sx={{
//                                             color: getColorByLevel(line),
//                                             whiteSpace: 'pre-wrap',
//                                             cursor: "pointer",
//                                         }}
//                                     >
//                                         {line}
//                                     </Typography>
//                                 </Tooltip>
//                             </motion.div>
//                         );
//                     })}
//                 </Box>
//             </Box>
//         </Box>
//     );
// }


// *** LEGACY ***
// import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import { motion } from 'framer-motion';
// import { useEffect, useRef, useState } from 'react';
// import useUtilityStore from '@store/utilityStore';
// import { ContentCopy } from '@mui/icons-material';
// import { WebsocketProvider } from '../providers/WebsocketProvider';

// const MAX_LINES = 20;

// interface TerminalLogScrollerProps {
//     logStream: string[];
//     noInfo?: boolean;
//     sx?: any;
// }


// const getColorByLevel = (line: string): string => {
//     if (/error/i.test(line)) return '#f44336';      // red
//     if (/warn/i.test(line)) return '#ff9800';       // orange
//     if (/debug/i.test(line)) return '#ab47bc';      // purple
//     if (/info/i.test(line)) return '#29b6f6';        // blue
//     return '#90caf9';                                // default cyan
// };

// const formatLineWithTimestamp = (line: string): string => {
//     const now = new Date().toLocaleTimeString();
//     return `[${now}] ${line}`;
// };

export function TerminalLogScroller({ logStream, noInfo, sx }: TerminalLogScrollerProps) {
    if (!logStream || !logStream.length) return null;
    console.log("👉 TerminalLogScroller: ", logStream)

    const utilityStore = useUtilityStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [query, setQuery] = useState('');

    // Append new logs from stream
    useEffect(() => {
        if (logStream && logStream.length > 0 && Array.isArray(logStream)) {
            const timestamped = logStream.map(formatLineWithTimestamp);
            setLogs(prev => {
                const next = [...prev, ...timestamped];
                return next.slice(-MAX_LINES); // only keep latest lines
            });
        }
    }, [logStream]);

    // Scroll to bottom on new logs
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [logs]);

    const filteredLogs = logs.filter(line => line.toLowerCase().includes(query.toLowerCase()));

    return (
        <Box
            sx={{
                position: 'relative',
                backgroundColor: '#121212',
                borderRadius: 2,
                height: 280,
                overflow: 'hidden',
                fontFamily: 'monospace',
                color: '#90caf9',
                fontSize: '0.8rem',
                px: 2,
                py: 1,
                ...sx
            }}
        >
            {/* Info Icon */}
            {!noInfo && (
                <Tooltip title="Expand Logs">
                    <IconButton
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            zIndex: 2,
                            color: '#90caf9',
                            p: 0.5,
                        }}
                        onClick={() => {
                            // TODO: Open modal logic here
                            console.log("Expand logs modal coming soon!");
                            utilityStore.setModal({
                                open: true,
                                title: "Logs",
                                sx: {
                                    slots: {
                                        box: {
                                            height: sx?.height ? sx.height : 800,
                                            maxHeight: 800,
                                            width: 600,
                                            overflow: 'auto',
                                            fontFamily: 'monospace',
                                            // color: '#90caf9',
                                            // fontSize: '0.8rem',
                                            px: 2,
                                            py: 1
                                        }
                                    }
                                },
                                content: (
                                    <>
                                        <TextField
                                            placeholder="Search logs 🔍"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            sx={{ mb: 1, backgroundColor: '#1e1e1e' }}
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                        />
                                        <TerminalLogScroller logStream={filteredLogs} noInfo sx={{ height: "100%" }} />
                                    </>
                                ),
                            });
                        }}
                    >
                        <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}

            {/* Fading overlays */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 20,
                    background: 'linear-gradient(to bottom, #121212, transparent)',
                    zIndex: 1,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 20,
                    background: 'linear-gradient(to top, #121212, transparent)',
                    zIndex: 1,
                }}
            />

            {/* Scrollable terminal text */}
            <Box
                ref={containerRef}
                sx={{
                    height: '100%',
                    overflowY: 'auto',
                    pr: 1,
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}
            >
                {logs.map((line, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            display: "flex"
                        }}
                    >
                        <Tooltip title="Copy to clipboard">
                            {/* <IconButton
                                size="small"
                                onClick={() => navigator.clipboard.writeText(line)}
                                sx={{ color: '#888' }}
                            >
                                <ContentCopy fontSize="inherit" />
                            </IconButton> */}
                            <Typography
                                variant="body2"
                                onClick={() => navigator.clipboard.writeText(line)}
                                sx={{
                                    color: getColorByLevel(line),
                                    whiteSpace: 'pre-wrap',
                                    cursor: "pointer"
                                }}
                            >
                                {line}
                                {/* {formatLineWithTimestamp(line)} */}
                            </Typography>
                        </Tooltip>
                    </motion.div>
                ))}
            </Box>
        </Box>
    );
}


// export const TerminalLogScrollerWrapper = () => {
//     return (
//         <WebsocketProvider>
//             {(socketProps) => <TerminalLogScroller {...socketProps} logStream={socketProps.logs} />}
//         </WebsocketProvider>
//     )
// }