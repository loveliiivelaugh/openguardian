
const defaults = {
    bar: {
        series: [
            { data: [35, 44, 24, 34] },
            { data: [51, 6, 49, 30] },
            { data: [15, 25, 30, 50] },
            { data: [60, 50, 15, 25] },
        ],
        xAxis: [{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]
    },
    line: {
        series: [
            {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
            },
        ],
        xAxis: [{ data: [1, 2, 3, 5, 8, 10] }]
    },
    pie: {
        data: [
            { id: 0, value: 10, label: 'series A' },
            { id: 1, value: 15, label: 'series B' },
            { id: 2, value: 20, label: 'series C' },
        ]
    },
}

const rows = [
    { id: 1, col1: 'Hello', col2: 'World' },
    { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 3, col1: 'MUI', col2: 'is Amazing' },
];

const columns = [
    { field: 'col1', headerName: 'Column 1', width: 150 },
    { field: 'col2', headerName: 'Column 2', width: 150 },
];

export { defaults, rows, columns };