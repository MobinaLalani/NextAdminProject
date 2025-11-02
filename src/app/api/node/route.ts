import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getConnection();
    // تبدیل ستون های geometry/geography به متن قابل نمایش (WKT)
    const query = `SELECT TOP (1000)
      [Id],
      [Title],
      CASE WHEN COLUMNPROPERTY(object_id('dbo.Nodes'), 'Location', 'ColumnId') IS NOT NULL
           THEN [Location].STAsText()
           ELSE NULL END AS [LocationWKT],
      [Address],
      [IsActive],
      [IsConnector],
      [IsDeleted],
      [Created],
      [CreatedBy],
      [LastModified],
      [LastModifiedBy],
      [DeletedAt],
      [DeletedBy]
    FROM [dbo].[Nodes]`;
    const result = await pool.request().query(query);
    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error("API /api/node error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
