import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
    user: "cityapp",
    host: "localhost",
    database: "cse412_midterm",
    password: "citypass",
    port: 5432,
});
