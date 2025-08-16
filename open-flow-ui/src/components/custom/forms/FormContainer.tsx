import React from 'react';
import {
    Box, Button, Grid, TextField, 
    Typography, MenuItem, Select, InputLabel,
    IconButton, FormControl
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Attachment as AttachmentIcon } from '@mui/icons-material';
import { useForm } from '@tanstack/react-form'; 

import { BasicDatePicker, BasicTimePicker } from './BasicDatePicker';
import { useUtilityStore } from '@store/index';


const Attachment = () => (
    <Box sx={{}}>
        <Typography id="demo-simple-select-label" variant="body1">
            Progress Photo
        </Typography>
        <IconButton>
            <AttachmentIcon />
        </IconButton>
    </Box>
);

interface SelectProps { 
    label: string, 
    enumValues: { 
        value?: string | number, 
        label?: string 
    }[] | string[] 
}

const SelectWrapper = (props: SelectProps) => {
    let options = (props?.enumValues || []);
    return (
        <FormControl fullWidth>
            <InputLabel id={props?.label}>
                {props?.label}
            </InputLabel>
            <Select {...props}>
                {options.map((option: any, index: number) => (
                    <MenuItem key={index} value={(option?.value || option)}>
                        {(option?.label || (option.slice(0, 1).toUpperCase() + option.slice(1)))}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};


const buildFields: any = (fieldsArray: any[], formState: any) => fieldsArray
    .map((field) => {

        // Define common properties for all fields
        const commonProperties = {
            key: field.name,
            id: field.name,
            ...field,
            fullWidth: true
        };

        // console.log("buildFields: ", field, formState);
        // Define properties specific to the field type
        const FieldsProps = {
            TextField: { ...commonProperties },
            Select: {
                ...commonProperties,
                options: (field?.enumValues || []),
                SelectProps: { native: true }
                // defaultValue: formState.state.values[field.name],
                // value: formState.state.values[field.name]
            },
            Date: {
                ...commonProperties,
                // value: moment(new Date()).format("YYYY-MM-DD"),
                // placeholder: new Date().toLocaleDateString(),
            },
            Time: {
                ...commonProperties,
                // value: new Date(field.value).toLocaleTimeString(),
                // placeholder: new Date().toLocaleTimeString(),
            },
            Json: {
                ...commonProperties,
                value: JSON.stringify(field.value),
                type: "text",
                multiline: true,
                minRows: 4,
            },
        };

        let type = field?.enumValues ? "select" : field?.type;

        // if (field?.columnType.includes("PgDateString")) type = "date";
        // if (field?.columnType.includes("PgTime")) type = "time";

        //@ts-ignore
        return ({
            text: <TextField {...FieldsProps.TextField} />,
            string: <TextField {...FieldsProps.TextField} />,
            number: <TextField {...FieldsProps.TextField} />,
            date: <BasicDatePicker {...FieldsProps.Date} />,
            time: <BasicTimePicker {...FieldsProps.Time} />,
            select: <SelectWrapper {...FieldsProps.Select} />,
            json: <TextField {...FieldsProps.Json} />,
            attachment: <Attachment />, 
        }[type])
    });

const excludedColumns: string[] = [
    // ...
];


// Define types for props
interface Column {
    name: string;
    dataType?: string;
    notNull?: boolean;
    enumValues?: any[];
}

interface Schema {
    table: string;
    columns: Column[];
}

interface Validators {
    onChange?: ({ value }: { value: { age: string } }) => string | undefined;
}

interface FormContainerProps {
    schema: Schema;
    excludedColumns?: string[];
    disableHeader?: boolean;
    handleSubmit?: (values: Record<string, any>) => void;
    handleCancelClick?: () => void;
    mapDefaultValue?: (column: Column, extras: Record<string, any>) => any;
    onChange?: (field: any, form: any) => void;
}
// PropTypes: {
//     schema: PropTypes.object.isRequired,
//     excludedColumns?: PropTypes.array
//     handleSubmit?: PropTypes.func
//     mapDefaultValues?: PropTypes.func
//     handleCancelClick?: PropTypes.func 
// }
const FormContainer = ({ schema, disableHeader = false, ...props }: FormContainerProps) => {
    const utilityStore = useUtilityStore(); // utility states

    const fieldsArray = schema.columns
        .filter((column: { name: string}) => props?.excludedColumns 
            ? props.excludedColumns 
            : !excludedColumns.includes(column.name)
        )
        .map((column: any) => ({
            name: column.name,
            label: column.name,
            // type: "text",
            type: column?.dataType,
            required: column?.notNull,
            value: "",
            ...column
        }));

    const onSubmit = async (values: any) => {
        // Using server-side insert/update
        const response = { error: "No onSubmit request made" };

        if (props?.handleSubmit) props.handleSubmit(values);
        
        // if (response.error) utilityStore.createAlert("error", `Something went wrong. Record not saved, ${(response.error as any).message}`);
        // else utilityStore.createAlert("success", `${schema.table} record saved.`);

    };

    const defaultValues = Object.assign(
        {},
        ...schema.columns
            .map((column: { name: string }) => ({
                [column.name]: props?.mapDefaultValue
                    ? props.mapDefaultValue(column, {/*callback extras*/})
                    : "", 
            }))
    );

    const validators = {
        onChange: ({ value }: { value: { age: string }}) => {
            // console.log("validators.onChange: ", value)
            if (parseInt(value.age) < 21) {
                return 'Must be 21 or older to sign'
            }
            return undefined;
        },
        // onBlur: ({ value }) => {...}
    };

    const form = useForm({ defaultValues, onSubmit, validators });
    // console.log({ form });

    const handleCancelClick = () => {
        form.reset();
        if (props?.handleCancelClick) props.handleCancelClick();
    };

    const handleSubmit = () => form.handleSubmit();

    return (
        <Grid container component={(form as any).Form} p={2} rowSpacing={2}>

            {!disableHeader && (
                <Grid size={12}>
                    <Typography variant="h5">
                        Log {schema.table}
                    </Typography>
                </Grid>
            )}
            <LocalizationProvider dateAdapter={AdapterMoment}>
            {buildFields(fieldsArray, form)
                .map((Field: any) => Field?.props?.name ? (
                    <Grid key={Field.props.name} size={12}>
                        <form.Field 
                            name={Field.props.name} 
                            validators={{
                                // onChange: (value) => (value > 10)
                            }}
                        >
                            {(field) => (
                                <>
                                    {/* <InputLabel>{Field.props.label.slice(0, 1).toUpperCase() + Field.props.label.slice(1)}</InputLabel> */}
                                    {React.cloneElement(Field, {
                                        ...field,
                                        defaultValue: field.state.value,
                                        onChange: (event) => {
                                            field.handleChange((event.target as any).value);
                                            
                                            if (props?.onChange) props.onChange(field, form);
                                            
                                            return;
                                        },
                                        onBlur: field.handleBlur,
                                        value: field.state.value
                                    })}
                                    {field.state.meta.errors ? (
                                        <em role="alert">{field.state.meta.errors.join(', ')}</em>
                                    ) : null}
                                </>
                            )}
                        </form.Field>
                    </Grid>
                ) : console.log("Field: ", Field))
            }
            </LocalizationProvider>
            <Grid size={12}>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                    <Button variant="outlined" color="error" onClick={handleCancelClick} fullWidth>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </Grid>

        </Grid>
    )
};

export default FormContainer
