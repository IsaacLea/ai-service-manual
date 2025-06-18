import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DB_CONNECTION_STRING;
if (!connectionString) {
    throw new Error("DB_CONNECTION_STRING environment variable is not set.");
}
const sql = neon(connectionString);

enum LOG_SEVERITY {
    INFO = "INFO",
    ERROR = "ERROR",
}

export async function logInfo(message: string) {
    await log(LOG_SEVERITY.INFO, message);
}

export async function logError(error: Error | unknown) {

    console.error(error);
    let message;

    if (error instanceof Error) {
        message = error.message
    } else {
        message = JSON.stringify(error);
    }

    await log(LOG_SEVERITY.ERROR, message);
}

async function log(severity: LOG_SEVERITY, message: string) {
    await sql`INSERT INTO app_logs(create_time, severity, message) VALUES (NOW(), ${severity}, ${message})`;
}

export async function logMessage(index: string, queryText: string, responseText: string) {
    await sql`INSERT INTO messages(create_time, index, query_text, response_text) VALUES (NOW(), ${index}, ${queryText}, ${responseText})`;
}


