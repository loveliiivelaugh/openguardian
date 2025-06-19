import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
// import { schema } from '@db/index';

const {
    SB_URL: supabaseUrl,
    SB_KEY: supabaseAnonKey,
} = Bun.env;

const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);
const supabaseLocal = createClient(
    Bun.env.LOCAL_SUPABASE_URL as string,
    Bun.env.LOCAL_SUPABASE_PUBLIC_KEY as string,
    {
        realtime: {
            params: {
                eventsPerSecond: 10
            }
        }
    }
);


const connectionString = process.env.SUPABASE_CONNECTION_STRING as string

function initDatabase() {
    try {
        console.info("Connecting to Supabase...")

        const client = postgres(connectionString)
        const db = drizzle(client, { schema: {} });

        if (db) console.info("Successfully Connected to Supabase!");

        // const dbLocal = drizzle(supabaseLocal, { schema });
        
        return db;

    } catch (error) {
        
        console.error(error, "Error connecting to Supabase");
        return error;
    }
};

function initLocalDatabase() {
    const localDatabase = drizzle(
        // @ts-ignore
        'postgres-js', 
        Bun.env.LOCAL_SUPABASE_URL as string,
    );
    return localDatabase;
};


export { 
    initDatabase, 
    initLocalDatabase, 
    supabase, 
    supabaseLocal 
};