import { Typography, Paper } from '@mui/material';
import FormContainer from '@components/Custom/forms/FormContainer'; // assuming your path

type NodeLayoutProps = {
    title: string;
    description?: string;
    category: string;
    argsSchema: Record<string, any>;
    onSubmit: (formData: Record<string, any>) => void;
};

export function NodeLayout({ title, description, category, argsSchema, onSubmit, ...args }: NodeLayoutProps) {
    console.log("NODELAYOUT:", title, description, category, argsSchema, onSubmit, args)
    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: 3,
                padding: 2,
                backgroundColor: categoryColorMap[category] || '#1e1e1e',
            }}
        >
            <Typography variant="h6" sx={{ mb: 1 }}>
                {title}
            </Typography>
            {description && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                    {description}
                </Typography>
            )}
            <FormContainer
                schema={{
                    table: title.toLowerCase().replace(/\s+/g, '_'),
                    columns: Object.keys(argsSchema).map((key) => ({
                        name: key,
                        dataType: argsSchema[key].type,
                        enumValues: argsSchema[key].enumValues || undefined,
                    })),
                }}
                handleSubmit={onSubmit}
                handleCancelClick={() => { }}
            />
        </Paper>
    );
}

const categoryColorMap: Record<string, string> = {
    Communication: '#1565c0',
    'Control Flow': '#4527a0',
    'Data Operations': '#2e7d32',
    Integrations: '#ad1457',
    'System Utilities': '#37474f',
};
