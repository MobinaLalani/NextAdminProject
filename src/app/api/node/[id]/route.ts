import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";


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

    const result = await pool.request().input("Id", id).query(`
        SELECT 
          n.[Id], n.[Title], n.[Latitude], n.[Longitude], n.[statusId],
          ISNULL(STRING_AGG(nl.LabelId, ','), '') AS LabelIds
        FROM [dbo].[MapNode] n
        LEFT JOIN [dbo].[MapNodeLabel] nl ON n.Id = nl.NodeId
        WHERE n.Id = @Id
        GROUP BY n.[Id], n.[Title], n.[Latitude], n.[Longitude], n.[statusId]
      `);

    const row = result.recordset?.[0];
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const node = {
      Id: row.Id,
      Title: row.Title,
      Latitude: row.Latitude,
      Longitude: row.Longitude,
      statusId: row.statusId,
      nodeLabels: row.LabelIds ? row.LabelIds.split(",").map(Number) : [],
    };

    return NextResponse.json(node);
  } catch (err) {
    console.error("API /api/node/[id] GET error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

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
    const {
      Title = null,
      Latitude = null,
      Longitude = null,
      statusId = null,
      nodeLabels,
    } = body as {
      Title?: string | null;
      Latitude?: number | null;
      Longitude?: number | null;
      statusId?: number | null;
      nodeLabels?: number[]; // ← اضافه شد
    };

    const pool = await getConnection();

    // 1️⃣ Update Node
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

    // 2️⃣ Update Node Labels
    if (Array.isArray(nodeLabels)) {
      // حذف رکوردهای قبلی
      await pool.request().input("Id", id).query(`
        DELETE FROM [dbo].[MapNodeLabel] WHERE NodeId = @Id
      `);

      if (nodeLabels.length > 0) {
        const insertLabels = nodeLabels
          .map((labelId) => `(${id}, ${labelId})`)
          .join(", ");
        const queryLabels = `
          INSERT INTO [dbo].[MapNodeLabel] (NodeId, LabelId)
          VALUES ${insertLabels}
        `;
        await pool.request().query(queryLabels);
      }
    }

    // 3️⃣ واکشی Node و nodeLabels به‌روز
    const fetchQuery = `
      SELECT 
        n.[Id], n.[Title], n.[Latitude], n.[Longitude], n.[statusId],
        ISNULL(STRING_AGG(nl.LabelId, ','), '') AS LabelIds
      FROM [dbo].[MapNode] n
      LEFT JOIN [dbo].[MapNodeLabel] nl ON n.Id = nl.NodeId
      WHERE n.Id = @Id
      GROUP BY n.[Id], n.[Title], n.[Latitude], n.[Longitude], n.[statusId]
    `;

    const updatedRes = await pool.request().input("Id", id).query(fetchQuery);
    const row = updatedRes.recordset?.[0];
    if (!row)
      return NextResponse.json(
        { error: "Node not found after update" },
        { status: 404 }
      );

    const updatedNode = {
      Id: row.Id,
      Title: row.Title,
      Latitude: row.Latitude,
      Longitude: row.Longitude,
      statusId: row.statusId,
      nodeLabels: row.LabelIds ? row.LabelIds.split(",").map(Number) : [],
    };

    return NextResponse.json(updatedNode);
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