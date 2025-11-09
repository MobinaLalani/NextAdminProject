import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// GET یک نود بر اساس Id
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("Id", id)
      .query(`SELECT [Id], [Title], [Latitude], [Longitude], [statusId] FROM [dbo].[MapNode] WHERE [Id] = @Id`);

    const row = result.recordset?.[0];
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    console.error("API /api/node/[id] GET error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// PUT ویرایش نود (به‌صورت partial)
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
    console.log("[PUT /api/node/:id] incoming", { id, body });
    const { Title = null, Latitude = null, Longitude = null, statusId = null } = body as {
      Title?: string | null;
      Latitude?: number | null;
      Longitude?: number | null;
      statusId?: number | null;
    };
 
    const pool = await getConnection();
    const updateQuery = `
      UPDATE [dbo].[MapNode]
      SET
        [Title] = ISNULL(@Title, [Title]),
        [Latitude] = ISNULL(@Latitude, [Latitude]),
        [Longitude] = ISNULL(@Longitude, [Longitude]),
        [statusId] = ISNULL(@statusId, [statusId])
      WHERE [Id] = @Id
    `;

    const result = await pool
      .request()
      .input("Id", id)
      .input("Title", Title)
      .input("Latitude", Latitude)
      .input("Longitude", Longitude)
      .input("statusId", statusId)
      .query(updateQuery);

    if (result.rowsAffected[0] === 0)
      return NextResponse.json({ error: "Node not found" }, { status: 404 });

    const fetchQuery = `SELECT [Id], [Title], [Latitude], [Longitude], [statusId] FROM [dbo].[MapNode] WHERE [Id] = @Id`;
    const updatedRes = await pool.request().input("Id", id).query(fetchQuery);
    const updated = updatedRes.recordset?.[0];
    console.log("[PUT /api/node/:id] updated", updated);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("API /api/node/[id] PUT error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE حذف نود
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
    const del = await pool
      .request()
      .input("Id", id)
      .query(`DELETE FROM [dbo].[MapNode] WHERE [Id] = @Id`);

    if (del.rowsAffected[0] === 0)
      return NextResponse.json({ error: "Node not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API /api/node/[id] DELETE error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}