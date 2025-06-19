import { Card, CardContent, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

type MessageType = {
  id: string;
  sender: "user" | "assistant";
  message: string;
  created_at: string;
  metadata?: Record<string, any>;
};

export const MessageCard = ({ msg }: { msg: MessageType }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          p: 2,
          backgroundColor: msg.sender === "assistant" ? "#f5f5f5" : "#e3f2fd",
          borderLeft: `4px solid ${msg.sender === "assistant" ? "#9e9e9e" : "#1976d2"}`,
        }}
      >
        <CardContent sx={{ p: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color={msg.sender === "assistant" ? "text.secondary" : "primary"}
            >
              {msg.sender === "assistant" ? "Guardian" : "You"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
            </Typography>
          </Box>
          <Typography variant="body1" whiteSpace="pre-line">
            {msg.message}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};
