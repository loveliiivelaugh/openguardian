import { Grid, IconButton, Typography } from "@mui/material";

const FilterButtons = (props: any) => {

    const filterButtons = ["Today", "Yesterday", "Last Week", "Last 30 Days", "All Time"];
    return (
        <Grid container>
            {filterButtons.map((button) => (
                <Grid key={`${button}-filter-button`}>
                    <IconButton
                        key={`${button}-filter-button`}
                        color="inherit"
                        size="small"
                        onClick={() => props.setFilter(button)}
                    >
                        <Typography variant="caption">{button}</Typography>
                    </IconButton>
                </Grid>
            ))}
        </Grid>
    )
};

export default FilterButtons;