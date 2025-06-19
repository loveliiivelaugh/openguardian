import axios from "axios";
import apiConfig from "./api.config.json";
import { supabase } from "./supabase";

// creds
const isDev = (import.meta.env.MODE === "development");
apiConfig.host.baseURL = isDev ? "http://localhost:5250" : import.meta.env.VITE_HOSTNAME;
apiConfig.host.headers.Authorization = "Bearer " + import.meta.env.VITE_MASTER_API_KEY;

const client = axios.create(apiConfig.host);
const graphqlClient = axios.create(apiConfig.host);

type PayloadTypes = {
    QueryPayload: {
        [propertyKey: string]: any
    }
    MutatePayload: {
        options?: {
            debounce?: number
        }
        [propertyKey: string]: any
    }
};

type SupabaseQueryOptions = {
    table: string;
    select?: string;
    operate?: string;
    filter?: {
        column: string;
        value: number;
    }
};

type DebounceType = (...args: any) => any;
const debounce: DebounceType = (fn, ms) => setTimeout(() => fn(), ms);

const queryPathCallback: (queryPath: any) => string = (queryPath: any) => {
    if (typeof queryPath === "function") return queryPath(apiConfig.paths);
    return queryPath;
};
// general app queries
const queries = ({
    /**
     * General Query to use any query with a passed queryPath
     * @param {string} queryPath Path to the rest API
     * @param {any} [payload] Payload to send with the query
     * @param {string} [method] HTTP method to use, defaults to "get"
     * @returns {import("react-query").UseQueryOptions} An object suitable for use with the `useQuery` hook
     */
    query: (queryPath: any, payload?: PayloadTypes["QueryPayload"], method?: string) => ({
        queryKey: [queryPath],
        queryFn: async () => payload 
            ? (await (client as any)[method || "post"](queryPathCallback(queryPath), payload)).data
            : (await (client as any)[method || "get"](queryPathCallback(queryPath))).data,
        options: {
            retries: 2
        }
    }),
    mutate: (queryPath: any) => ({
        mutationKey: [queryPath],
        mutationFn: async (payload?: PayloadTypes["MutatePayload"]) => payload?.options?.debounce
            ? (await debounce(client.post(queryPathCallback(queryPath), payload), payload.options.debounce)).data
            : (await client.post(queryPathCallback(queryPath), payload)).data,
        options: {
            retries: 2
        }
    }),

    supabaseQuery: (options: SupabaseQueryOptions) => ({
        queryKey: [`supabase-${options.table}-${options.select}`],
        queryFn: async () => await supabase
            .from(options.table)
            .select(options?.select ? options.select : "*")
            ?.eq(options?.filter?.column || "", options?.filter?.value || "")
    }),
    supabaseMutation: (options: SupabaseQueryOptions) => ({
        mutationKey: [`supabase-mutate-${options.table}`],
        mutationFn: async (payload: any) => {
            const table = payload?.table;
            const operation = payload?.operation;

            if (payload?.table) delete payload.table;
            if (payload?.operation) delete payload.operation;

            // payload = payload.map((item: any) => {
            //     delete item.table;
            //     delete item.operation;
            //     return item;
            // });

            // @ts-ignore
            return await supabase
                .from(table || options.table)[operation || "insert"](payload)
                .select();
        }
    }),
    /**
     * Queries the GraphQL API
     * @param {string} queryPath Path to the GraphQL API
     * @returns {import("react-query").UseQueryOptions} An object suitable for use with the `useQuery` hook
     */
    graphQuery: (query: string) => ({
        queryKey: ["graphql", query],
        queryFn: async () => graphqlClient.post(query),
    }),
});

const paths = apiConfig.paths;
export { client, paths, queries };