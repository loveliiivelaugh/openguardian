import { useContext, useEffect } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useAppStore } from '@store/appStore';
import { queries } from '@api/index';

const queryOptions = {
    employees: {
        table: "employees",
        select: "*"
    },
    appointments: {
        table: "appointments",
        select: "*"
    },
    students: {
        table: "students",
        select: "*"
    },
    roles: {
        table: "roles",
        select: "*"
    },
    user_roles: {
        table: "user_roles",
        select: "*"
    },
};

const useStart = () => {
    const appStore = useAppStore();
    let appDataObject: any = {};
    const appQueries = useQueries({
        queries: Object
            .keys(queryOptions)
            .map((queryOptionKey) => ({
                ...queries.supabaseQuery(queryOptions[queryOptionKey as keyof typeof queryOptions]),
                ...{
                    select: (response: any) => {
                        appDataObject[queryOptionKey] = response.data;
                        const data = {[queryOptionKey]: response.data};
                        console.log("INSELECT: ", data);
                        return data;
                    }
                }
            }))
    });
    
    // // * Notes -> Had to write this inside of the Promise to not break from my normal
    // // ... useQuery architecture but also to hydrate the app queries at the start ...
    // // ... storing the data in a appStore zustand store. Otherwise app was breaking ...
    // // ... because of infinite looping /too many renders
    // const queryPromise = () => new Promise((resolve) => {
    //     const interval = setInterval(() => {
    //         console.log("APPQUERIES? in INTERVAL: ", appQueries)
    //         if (appQueries.length) {
    //             console.log("AFTER APPQUERIES.LENGTH CHECK: ", appQueries)
    //             clearInterval(interval);
    //             resolve(appQueries);
    //         };
    //     }, 1000);
    // });

    // useEffect(() => {
    //     (async () => {
    //         const data = await queryPromise();
    //         if (data) {
    //             // const queriesWithNames = Object.assign(
    //             //     {},
    //             //     ...Object
    //             //         .keys(queryOptions)
    //             //         .map((queryKey, index) => ({
    //             //             [queryKey]: data[index as keyof typeof data]
    //             //         }))
    //             // );
    //             appStore.setQueries(data);

    //             console.log({ data, appStore });
    //         }
    //     })();
    // }, []);
    useEffect(() => {
        console.log("HELLO: ", appDataObject)
        if (Object.keys(appDataObject).length > 4) appStore.setQueries(appDataObject)
    }, [])

    return appQueries;
};

// const appContext = useContext();

// const AppContextProvider = () => {
//     return (
//         <appContext.Provider>

//         </appContext.Provider>
//     )
// }

const StartupProvider = () => {
    useStart(); // hook to hydrate stores with initial requests
    // const appStore = useAppStore();
    // if(queries.length) appStore.setQueries(queries)
    return null;
};

export { StartupProvider, useStart };