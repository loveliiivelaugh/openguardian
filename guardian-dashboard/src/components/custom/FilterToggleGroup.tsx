import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const categories = [
  { label: 'All', value: 'all' },
  { label: 'AI-Gen', value: 'ai' },
  { label: 'Guides', value: 'guide' },
  { label: 'Tutorials', value: 'tutorial' },
  { label: 'White Papers', value: 'whitepaper' },
  { label: 'Daily Blog', value: 'daily' },
  { label: 'Research', value: 'research' },
  { label: 'Random', value: 'random' },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function FilterToggleGroup({ value, onChange }: Props) {
  const handleChange = (_: any, newValue: string) => {
    if (newValue !== null) onChange(newValue);
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      color="primary"
      sx={{
        flexWrap: 'wrap',
        gap: 1,
        mb: 3,
        '& .MuiToggleButton-root': {
          color: 'white',
          borderColor: 'gray',
          '&.Mui-selected': {
            backgroundColor: '#3f3f46',
            color: '#00e5ff',
          },
        },
      }}
    >
      {categories.map((cat) => (
        <ToggleButton key={cat.value} value={cat.value}>
          {cat.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
