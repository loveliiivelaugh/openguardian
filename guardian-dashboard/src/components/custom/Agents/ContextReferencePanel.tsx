// ContextReferencePanel.tsx
import React from 'react';
import { Box, Typography, Divider, Accordion, AccordionSummary, AccordionDetails, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const Section = ({ title, items }: { title: string; items: string[] }) => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight={600}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {items.length ? items.map((item, index) => (
          <Box
            key={index}
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
          >
            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{item}</Typography>
            <IconButton onClick={() => navigator.clipboard.writeText(item)}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
        )) : <Typography variant="body2" color="text.secondary">No items available.</Typography>}
      </AccordionDetails>
    </Accordion>
  );
};

export const ContextReferencePanel = ({
  context = {},
  memories = [],
  globalVars = [],
  snippets = []
}: {
  context?: Record<string, any>;
  memories?: { key: string }[];
  globalVars?: string[];
  snippets?: { name: string; snippet: string }[];
}) => {
  const contextKeys = Object.keys(context).map(key => `{{${key}}}`);
  const memoryKeys = memories.map(m => `{{memory.${m.key}}}`);

  return (
    <Box sx={{ p: 2, overflowY: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        🔍 Context Reference
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Section title="🧠 Context Variables" items={contextKeys} />
      <Section title="💾 Memory References" items={memoryKeys} />
      <Section title="🌐 Global Variables" items={globalVars} />
      <Section title="✨ Snippets" items={snippets.map(s => `${s.name}: ${s.snippet}`)} />
    </Box>
  );
};
