import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// 🟢 READ - گرفتن لیست نودها
export async function GET() {
  try {
    const pool = await getConnection();
    const query = `
      SELECT TOP (1000)
        [Id], [Title], [Latitude], [Longitude], [statusId]
      FROM [dbo].[MapNode]
      ORDER BY [Id] DESC
    `;
    const result = await pool.request().query(query);
    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error("API /api/node GET error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// 🟡 CREATE - افزودن نود جدید و برگرداندن رکورد ساخته‌شده
export async function POST(req: Request) {
  try {
    const { Title, Latitude, Longitude, statusId } = await req.json();
    if (!Title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const pool = await getConnection();
    const query = `
      INSERT INTO [dbo].[MapNode] ([Title], [Latitude], [Longitude], [statusId])
      OUTPUT INSERTED.[Id], INSERTED.[Title], INSERTED.[Latitude], INSERTED.[Longitude], INSERTED.[statusId]
      VALUES (@Title, @Latitude, @Longitude, @statusId)
    `;

    const result = await pool
      .request()
      .input("Title", Title)
      .input("Latitude", Latitude)
      .input("Longitude", Longitude)
      .input("statusId", statusId)
      .query(query);

    const created = result.recordset?.[0];
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("API /api/node POST error:", err);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }
}
