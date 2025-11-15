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

    const query = `
      SELECT 
        ZN.Id AS ZoneNodeId,
        Z.Id AS ZoneId,
        Z.Title AS ZoneTitle,
        Z.StatusId AS ZoneStatus,
        N.Id AS NodeId,
        N.Title AS NodeTitle,
        N.Latitude,
        N.Longitude,
        N.StatusId AS NodeStatus
      FROM [dbo].[MapZoneNode] ZN
      JOIN [dbo].[MapZone] Z ON Z.Id = ZN.ZoneId
      JOIN [dbo].[MapNode] N ON N.Id = ZN.NodeId
      WHERE ZN.ZoneId = @Id
      ORDER BY ZN.Id;
    `;

    const result = await pool.request().input("Id", id).query(query);

    if (result.recordset.length === 0) {
      return NextResponse.json({ error: "Zone not found" }, { status: 404 });
    }

    // گرفتن اطلاعات اصلی زون
    const { ZoneTitle, ZoneStatus } = result.recordset[0];

    // ساخت selectedNodes
    const selectedNodes = result.recordset
      .filter((r) => r.Latitude && r.Longitude)
      .map((r) => ({
        nodeId: r.NodeId,
        lng: r.Longitude,
        lat: r.Latitude,
      }));

    return NextResponse.json({
      zoneTitle: ZoneTitle,
      zoneStatus: ZoneStatus,
      selectedNodes,
    });
  } catch (err) {
    console.error("API /api/zone/[id] GET error:", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
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
    const { ZoneTitle = null, ZoneStatus = null } = body as {
      ZoneTitle?: string | null;
      ZoneStatus?: number | null;
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
      .input("Title", ZoneTitle)
      .input("StatusId", ZoneStatus)
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
    await pool
      .request()
      .input("ZoneId", id)
      .query(`DELETE FROM [dbo].[MapZoneNode] WHERE [ZoneId] = @ZoneId`);
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
