import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import sql from "mssql";


export async function GET() {
  try {
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
      ORDER BY ZN.Id;
    `;
    const result = await pool.request().query(query);
    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error("API /api/zoneNode GET error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const { ZoneTitle, ZoneStatus, NodeIds } = await req.json();

    if (!ZoneTitle) {
      return NextResponse.json(
        { error: "ZoneTitle is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(NodeIds) || NodeIds.length === 0) {
      return NextResponse.json(
        { error: "Nodes array is required" },
        { status: 400 }
      );
    }

    const pool = await getConnection();

 
    const insertZoneQuery = `
      INSERT INTO [dbo].[MapZone] ([Title], [StatusId])
      OUTPUT INSERTED.[Id], INSERTED.[Title], INSERTED.[StatusId]
      VALUES (@Title, @StatusId)
    `;

    const zoneResult = await pool
      .request()
      .input("Title", sql.NVarChar, ZoneTitle)
      .input("StatusId", sql.Int, ZoneStatus)
      .query(insertZoneQuery);

    const createdZone = zoneResult.recordset?.[0];
    const zoneId = createdZone?.Id;

    if (!zoneId) {
      return NextResponse.json({ error: "Failed to create zone" }, { status: 500 });
    }

    let insertedCount = 0;
    for (const nodeId of NodeIds) {
      const insertNodeRes = await pool
        .request()
        .input("NodeId", sql.Int, nodeId)
        .input("ZoneId", sql.Int, zoneId)
        .query(
          `INSERT INTO [dbo].[MapZoneNode] (NodeId, ZoneId) VALUES (@NodeId, @ZoneId)`
        );
      if (insertNodeRes.rowsAffected?.[0] > 0) insertedCount += insertNodeRes.rowsAffected[0];
    }

    if (insertedCount === 0) {
      return NextResponse.json({ error: "Failed to link nodes to zone" }, { status: 500 });
    }

    return NextResponse.json(
      { zone: createdZone, nodesAdded: insertedCount },
      { status: 201 }
    );

  } catch (err) {
    console.error("API /api/zone POST error:", err);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }
}
