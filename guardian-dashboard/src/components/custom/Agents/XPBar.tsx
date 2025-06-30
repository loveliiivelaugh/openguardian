import LinearBuffer from '@components/Mui/LinearBuffer/LinearBuffer';
import { Box } from '@mui/material';
import { useXPStore } from '@store/achievementStore';
import { motion } from 'framer-motion';

export function XPInlineProgress() {
    const { xp, level } = useXPStore();
    // const level = Math.floor(xp / 100);
    const progress = (xp % 100) / 100;

    return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {/* <span>Level {level} / {xp % 100} XP</span> */}
            <span>Level {level}</span>
            <span>{xp % 100} / 100 XP</span>
            <div className="w-20 h-[6px] bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                <motion.div
                    className="h-full bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
                <LinearBuffer />
            </div>
        </div>
    );
}

export function XPBarCore() {
    const { xp, level } = useXPStore();
    const progress = (xp % 100) / 100;

    return (
        <div className="w-full px-4 py-2">
            <div className="flex items-center justify-between mb-1 text-sm">
                <span>Level {level}</span>
                <span>{xp % 100} / 100 XP</span>
            </div>
            <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ type: "spring", stiffness: 200 }}
                />
            </div>
        </div>
    );
}

export function XPBar() {
    return (
        <Box sx={{ display: "flex" }}>
            {/* <XPBarCore /> */}
            <XPInlineProgress />
        </Box>
    )
}