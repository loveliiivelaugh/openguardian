
import { Box, IconButton, Typography } from "@mui/material";
import AttachmentIcon from '@mui/icons-material/Attachment';

export const Attachment = () => (
    <Box sx={{}}>
        <Typography id="demo-simple-select-label" variant="body1">
            Progress Photo
        </Typography>
        <IconButton>
            <AttachmentIcon />
            {/* <attachment /> */}
        </IconButton>
    </Box>
);

