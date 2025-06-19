import { useState, useMemo, useEffect } from "react";
// import { useNavigate } from "react-router";
import { useFuse } from '@helpers/fuse';
import { Autocomplete, Avatar, Box, InputAdornment, Button, TextField, Typography } from '@mui/material';
// import { postsData } from "./postsData";

const fuseOptions = {
    keys: ["first_name", "last_name", "phone", "email", "job_title"],
    threshold: 0.3,
    ignoreLocation: true,
};

export default function PostSearch({
    searchData,
    selected,//may not need
    setSelected
}: any) {
    console.log("PAOSTSEARCH/LOST: ", searchData)
    // const navigate = useNavigate();
    const { fuse } = useFuse({ list: searchData, fuseOptions });

    const [input, setInput] = useState("");

    let filteredPosts = useMemo(() => {
        if (!input) return [];
        return fuse.search(input).map((result: { item: any }) => result.item);
    }, [input]);

    useEffect(() => {
        filteredPosts = !selected ? []: [selected];
    }, [selected]);

    return (
        <Autocomplete
            freeSolo
            options={filteredPosts}
            getOptionLabel={(option: any) => option.first_name}
            onInputChange={(_, value) => setInput(value)}
            clearIcon={(
                <InputAdornment position="end">
                    <Button color="error" onClick={() => {
                            setSelected(null);
                            setInput('');
                        }}
                    >
                        Clear
                    </Button>
                </InputAdornment>
            )}
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    label="Search Instructors"
                    variant="outlined"
                    fullWidth
                />
            )}
            renderOption={(props, option) => (
                <Box
                    component="li"
                    sx={{ display: "flex", alignItems: "center", gap: 2, p: 1 }}
                    {...props}
                >
                    <Avatar
                        src={"#"}
                        alt={option.first_name}
                        variant="rounded"
                        sx={{ width: 48, height: 48 }}
                    />
                    <Box>
                        <Typography fontWeight={500}>{option.first_name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {option.last_name}
                        </Typography>
                    </Box>
                </Box>
            )}
            onChange={(_, selected) => {
                if (selected) {
                    // You can route to the blog post or display its content
                    console.log("Selected post:", selected);
                    setSelected(selected)
                }
            }}
        />
    );
}