import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getConnection();

    const query = `
      SELECT TOP (1000)
        [Id],
        [Title],
        [Latitude],
        [Longitude],
        [statusId]
      FROM [dbo].[MapNode]
      ORDER BY [Id] DESC
    `;

    const result = await pool.request().query(query);
    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error("API /api/MapNode error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
