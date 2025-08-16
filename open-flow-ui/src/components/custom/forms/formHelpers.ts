// import moment from "moment";

// import { TextField } from "@mui/material";

// import { BasicDatePicker, BasicTimePicker } from "./BasicDatePicker";
// import { SelectWrapper } from "./SelectWrapper";
// import { Attachment } from "./Attachment";
// // import type { FitnessStore, SupabaseStore } from "../../../types";


// type Column = {
//     name: string
//     type: string
// }

// const mapDefaultValue = (column: Column, store: any) => {
//     const profile = store.fitnessTables?.profile[0];
//     // console.log("mapDefaultValue: ", column, profile);

//     switch (column.name) {
//         // Profile Default Values
//         case "age":
//             return profile?.age;
//         case "height":
//             return profile?.height;
//         case "weight":
//             return parseInt(profile?.weight) || 0;
//         case "goal":
//             return (profile?.goal === 0 ? "maintain" : "lose");
//         case "exercise":
//             return (profile?.exercise === 1.55 ? "very active" : "sedentary");
//         case "tdee":
//             return profile?.tdee || 0;
//         case "bmr":
//             return profile?.bmr || 0;

//         // Exercise Search Default Values
//         case "reps":
//             return 10;
//         case "sets":
//             return 3;
//         case "muscle":
//             return (store.selectedSearchItem?.muscle || "");
//         case "difficulty":
//             return (store.selectedSearchItem?.difficulty || "");
//         case "equipment":
//             return (store.selectedSearchItem?.equipment || "");
//         case "instructions":
//             return (store.selectedSearchItem?.instructions || "");
//         case "type":
//             return (store.selectedSearchItem?.type || "");
//         case "calories_burned":
//             return 0; // TODO:  Coming Soon!! --> Functionality to automate figuring out calories burned

//         // Food Search Default Values
//         case "name":
//             return (store.selectedSearchItem?.food_name || store.selectedSearchItem?.name || "");
//         case "date":
//             return moment().format("ddd, MMMM DD, YYYY");
//         case "time":
//             return moment().format("h:mm a");
//         case "calories":
//             return (
//                 store.selectedSearchItem?.nf_calories 
//                 || store.selectedSearchItem?.calories
//                 || 0
//             );
//         case "serving_size":
//             return 1;
//         case "num_servings":
//             return 1;
//         case "user_id":
//             return 1;
//         case "meal":
//             let meal = "snack";
//             // Check time of day and assign meal accordingly
//             const currentHour = new Date().getHours();
//             if (currentHour >= 6 && currentHour < 12) {
//                 meal = "breakfast";
//             }
//             if (currentHour >= 12 && currentHour < 18) {
//                 meal = "lunch";
//             }
//             if (currentHour >= 18 && currentHour < 22) {
//                 meal = "dinner";
//             }
//             return meal;
//         case "nutrients":
//             return store.selectedSearchItem || {};

//         // Sleep + Steps
//         case "startDate":
//             return moment().format("ddd, MMMM DD, YYYY");
//         case "endDate":
//             return moment().format("ddd, MMMM DD, YYYY");

//         // Default
//         default:
//             return "";
//     };
// };


// const buildFields = (fieldsArray: any, formState: any) => fieldsArray
//     .map((field: any) => {

//         // Define common properties for all fields
//         const commonProperties = {
//             key: field.name,
//             id: field.name,
//             ...field,
//             fullWidth: true
//         };

//         console.log("buildFields: ", field, formState);
//         // Define properties specific to the field type
//         const FieldsProps = {
//             TextField: { ...commonProperties },
//             Select: {
//                 ...commonProperties,
//                 options: (field?.enumValues || []),
//                 SelectProps: {
//                     native: true,
//                 },
//                 // value: formState.state.values[field.name],
//                 defaultValue: formState.state.values[field.name],
//             },
//             Date: {
//                 ...commonProperties,
//                 // value: moment(new Date()).format("YYYY-MM-DD"),
//                 // placeholder: new Date().toLocaleDateString(),
//             },
//             Time: {
//                 ...commonProperties,
//                 // value: new Date(field.value).toLocaleTimeString(),
//                 // placeholder: new Date().toLocaleTimeString(),
//             },
//             Json: {
//                 ...commonProperties,
//                 value: JSON.stringify(field.value),
//                 type: "text",
//                 multiline: true,
//                 minRows: 4,
//             },
//         };

//         // let type = field?.enumValues ? "select" : field?.type;
//         let type: "select" | "date" | "time" | "string" | "number" | "json" = field?.enumValues 
//             ? "select" 
//             : field?.type;

//         if (field?.columnType.includes("PgDateString")) type = "date";
//         if (field?.columnType.includes("PgTime")) type = "time";

//         return ({
//             text: <TextField {...FieldsProps.TextField} />,
//             string: <TextField {...FieldsProps.TextField} />,
//             number: <TextField {...FieldsProps.TextField} />,
//             date: <BasicDatePicker {...FieldsProps.Date} />,
//             time: <BasicTimePicker {...FieldsProps.Time} />,
//             select: <SelectWrapper {...FieldsProps.Select} />,
//             json: <TextField {...FieldsProps.Json} />,
//             attachment: <Attachment />, 
//         }[type]);
//     });

// const excludedColumns = [
//     "id",
//     "created_at",
//     "updated_at",
//     "user_id",
//     "nutrients"
// ];

// // const validationDefinitions = [
// //     // Profile Form Inputs Validations
// //     {
// //         "name": "age",
// //         "type": "number",
// //         "validation": (value) => ((typeof(value) === definition.type) && (0 > value < 100)),
// //         "required": false // required should come from database schema
// //     },
// //     {
// //         "name": "height",
// //         "type": "number",
// //         "validation": (value) => ((typeof(value) === definition.type) && (0 > value < 90))
// //     },
// //     {
// //         "name": "weight",
// //         "type": "number",
// //         "validation": (value) => ((typeof(value) === definition.type) && (0 > value < 300))
// //     },
// //     {
// //         "name": "goal",
// //         "type": "string",
// //         "validation": (value) => ["lose", "maintain", "gain"].includes(value.toLowerCase().trim())
// //     },
// //     {
// //         "name": "exercise",
// //         "type": "string",
// //         "validation": (value) => ["sedentary", "somewhat active", "active", "very active"].includes(value.toLowerCase().trim())
// //     },
// //     {
// //         "name": "tdee",
// //         "type": "number",
// //         "validation": (value) => ((typeof(value) === definition.type) && (0 >= value < 10000))
// //     },
// //     {
// //         "name": "bmr",
// //         "type": "number",
// //         "validation": (value) => ((typeof(value) === definition.type) && (0 >= value < 5000))
// //     },

// //     // Exercise Form Inputs Validations
// //     {
// //         "name": "reps",
// //         "type": "number",
// //         "validation": (value) => ((typeof(value) === definition.type) && (0 >= value < 100))
// //     },
// //     {
// //         "name": "sets",
// //         "type": "number",
// //         "validation": (value) => ((typeof(value) === definition.type) && (0 >= value < 100))
// //     },
// //     {
// //         "name": "muscle",
// //         "type": "string",
// //         // TODO: Find all muscle types available in API and validate to them
// //         "validation": (value) => (typeof(value) === definition.type)
// //     },
// //     {
// //         "name": "difficulty",
// //         "type": "string",
// //         // TODO: Find difficulty types available in API and validate to them
// //         "validation": (value) => (typeof(value) === definition.type)
// //     },
// //     {
// //         "name": "equipment",
// //         "type": "string",
// //         // TODO: Find equipment available in API and validate to them
// //         "validation": (value) => (typeof(value) === definition.type)
// //     },
// //     {
// //         "name": "instructions",
// //         "type": "string",
// //         "validation": (value) => (typeof(value) === definition.type)
// //     },
// //     {
// //         "name": "type",
// //         "type": "string",
// //         // TODO: Find equipment available in API and validate to them
// //         "validation": (value) => (typeof(value) === definition.type)
// //     },
// //     {
// //         "name": "calories_burned",
// //         "type": "number",
// //         "validation": (value) => (typeof(value) === definition.type)
// //     },
// // ]


// export {
//     mapDefaultValue,
//     buildFields,
//     excludedColumns,
//     // validationDefinitions
// };