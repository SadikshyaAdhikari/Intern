import pgPromise from "pg-promise";

const pgp = pgPromise();

// Admin database connection
export const db = pgp({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "infocare",
  database: "hello",
  sync: true,
});

export default pgp;
