// lib/db.ts
import sql from "mssql";

// تنظیمات اتصال
const config = {
  user: process.env.DB_USER || "develop",
  password: process.env.DB_PASSWORD || "*dJ5%#XJm_VMVwc*",
  server: process.env.DB_SERVER as string || "172.16.2.86",
  database: process.env.DB_DATABASE || "halaz-main-develop",
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true", // برای Azure یا SSL
    trustServerCertificate: true, // اگر SSL ندارید، این رو true بذارید
  },
};

// برای جلوگیری از باز شدن کانکشن‌های زیاد در حالت dev
let pool: sql.ConnectionPool;

export const getConnection = async () => {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
};
