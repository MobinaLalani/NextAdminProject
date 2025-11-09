import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// PUT: ویرایش زون (Title/StatusId)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const { Title = null, StatusId = null } = body as {
      Title?: string | null;
      StatusId?: number | null;
    };

    const pool = await getConnection();
    const updateQuery = `
      UPDATE [dbo].[MapZone]
      SET
        [Title] = ISNULL(@Title, [Title]),
        [StatusId] = ISNULL(@StatusId, [StatusId])
      WHERE [Id] = @Id
    `;

    const result = await pool
      .request()
      .input("Id", id)
      .input("Title", Title)
      .input("StatusId", StatusId)
      .query(updateQuery);

    if (result.rowsAffected[0] === 0)
      return NextResponse.json({ error: "Zone not found" }, { status: 404 });

    const fetchQuery = `SELECT [Id], [Title], [StatusId] FROM [dbo].[MapZone] WHERE [Id] = @Id`;
    const updatedRes = await pool.request().input("Id", id).query(fetchQuery);
    const updated = updatedRes.recordset?.[0];
    return NextResponse.json(updated);
  } catch (err) {
    console.error("API /api/zone/[id] PUT error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE: حذف زون و وابستگی‌هایش در MapZoneNode
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const pool = await getConnection();
    // پاک کردن وابستگی‌ها ابتدا
    await pool.request().input("ZoneId", id).query(`DELETE FROM [dbo].[MapZoneNode] WHERE [ZoneId] = @ZoneId`);
    // سپس خود زون
    const del = await pool
      .request()
      .input("Id", id)
      .query(`DELETE FROM [dbo].[MapZone] WHERE [Id] = @Id`);

    if (del.rowsAffected[0] === 0)
      return NextResponse.json({ error: "Zone not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API /api/zone/[id] DELETE error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}