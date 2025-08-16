// import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

// interface SelectWrapperProps {
//     label: string;
//     enumValues: any;
//     value: any;
//     onChange: any;
// }

// type Option = { label?: string, value?: string } | string;

// export const SelectWrapper = (props: SelectWrapperProps) => {
//     let options = (props?.enumValues || []);
//     return (
//         <FormControl fullWidth>
//             <InputLabel id={props?.label}>
//                 {props?.label}
//             </InputLabel>
//             <Select {...props}>
//                 {options.map((option: Option, index: number) => (
//                     <MenuItem key={index} value={(option?.value || option)}>
//                         {(option?.label || (option.slice(0, 1).toUpperCase() + option.slice(1)))}
//                     </MenuItem>
//                 ))}
//             </Select>
//         </FormControl>
//     );
// };
