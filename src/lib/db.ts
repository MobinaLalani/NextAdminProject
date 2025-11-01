
import mysql from "mysql2/promise";

// ...existing code...
const pool = mysql.createPool({
  host: process.env.DB_HOST || "172.16.2.86",
  user: process.env.DB_USER || "develop",
  password: process.env.DB_PASS || "*dJ5%#XJm_VMVwc*",
  database: process.env.DB_NAME || "halaz-main-develop",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;