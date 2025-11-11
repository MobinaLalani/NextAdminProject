import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import sql from "mssql";

// 🟢 READ - گرفتن لیست نودها
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
      WHERE ZoneId = 8
      ORDER BY ZN.Id;
    `;
    const result = await pool.request().query(query);
    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error("API /api/zoneNode GET error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// 🟡 CREATE - افزودن زون و نودهای مرتبط
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

    // -----------------------------
    // مرحله 1: درج رکورد در MapZone و گرفتن Id
    // -----------------------------
    const insertZoneQuery = `
      INSERT INTO [dbo].[MapZone] ([Title], [StatusId])
      OUTPUT INSERTED.[Id], INSERTED.[Title], INSERTED.[StatusId]
      VALUES (@Title, @StatusId)
    `;
    const zoneResult = await pool
      .request()
      .input("ZoneTitle", sql.NVarChar, ZoneTitle)
      .input("ZoneStatus", sql.Int, ZoneStatus)
      .query(insertZoneQuery);

    const createdZone = zoneResult.recordset?.[0];
    const zoneId = createdZone?.Id;

    if (!zoneId) {
      return NextResponse.json({ error: "Failed to create zone" }, { status: 500 });
    }

    // -----------------------------
    // مرحله 2: درج رکوردهای MapZoneNode
    // -----------------------------
    // ساخت Table-Valued Parameter
    const table = new sql.Table(); // استفاده از sql.Table() درست است
    table.columns.add("NodeId", sql.Int);
    table.columns.add("ZoneId", sql.Int);

    NodeIds.forEach((nodeId: number) => {
      table.rows.add(nodeId, zoneId);
    });

    // TVP نیاز به تعریف Type در SQL Server دارد
    // ابتدا باید در SQL Server Type ایجاد شده باشد، مثلاً:
    // CREATE TYPE NodeZoneTableType AS TABLE (NodeId INT, ZoneId INT);
    await pool
      .request()
      .input("NodesTable", sql.TVP, table)
      .query(`
        INSERT INTO [dbo].[MapZoneNode] (NodeId, ZoneId)
        SELECT NodeId, ZoneId FROM @NodesTable
      `);

    return NextResponse.json(
      { zone: createdZone, nodesAdded: NodeIds.length },
      { status: 201 }
    );

  } catch (err) {
    console.error("API /api/mapzone POST error:", err);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }
}
