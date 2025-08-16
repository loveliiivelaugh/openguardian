import React from 'react';
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridRowSelectionModel } from "@mui/x-data-grid";

interface ReusableTableProps { 
    title: string;
    rows: any[];
    columns: any[];
    setSelected?: (selection: any) => void;
}

const ReusableTable = ({ title, rows, columns, setSelected }: ReusableTableProps) => {
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
    return (
        <Box sx={{ height: 400, width: '100%', my: 4 }}>
            <Typography variant="h6">{title}</Typography>
                <DataGrid
                    rows={rows}
                    columns={columns.map((field: any) => ({
                        // ...field,
                        field: field.name,
                        headerName: field.name,
                        width: 150,
                        editable: true,
                        // ...(field.name === "messages") && {
                        //     renderCell: (params) => <ReusablePopover params={params} />
                        // }
                    }))}
                    // pageSize={5}
                    // rowsPerPageOptions={[5]}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        const index = ((newRowSelectionModel[0] as number) - 1);
                        const row = rows[index as keyof typeof rows];

                        setRowSelectionModel(newRowSelectionModel);
                        if (setSelected) setSelected(row);
                    }}
                    rowSelectionModel={rowSelectionModel}
                    sx={{ height: 400, width: '100%' }}
                />
        </Box>
    );
};

export default ReusableTable;