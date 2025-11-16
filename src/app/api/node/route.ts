import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// 🟢 READ - گرفتن لیست نودها
export async function GET() {
  try {
    const pool = await getConnection();
    const query = `
      SELECT TOP (1000)
       [MapNode].[Id], [Title], [Latitude], [Longitude], [statusId] ,MapNodeLabel.LabelId as LabelId
      FROM [dbo].[MapNode] left join MapNodeLabel
	    on [MapNode].Id = MapNodeLabel.NodeId
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
    const { Title, Latitude, Longitude, statusId, nodeLabels } =
      await req.json();

    if (!Title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!Array.isArray(nodeLabels)) {
      return NextResponse.json(
        { error: "nodeLabels must be an array" },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    // 1️⃣ Insert Node
    const queryNode = `
      INSERT INTO [dbo].[MapNode] ([Title], [Latitude], [Longitude], [statusId])
      OUTPUT INSERTED.[Id], INSERTED.[Title], INSERTED.[Latitude], INSERTED.[Longitude], INSERTED.[statusId]
      VALUES (@Title, @Latitude, @Longitude, @statusId)
    `;

    const resultNode = await pool
      .request()
      .input("Title", Title)
      .input("Latitude", Latitude)
      .input("Longitude", Longitude)
      .input("statusId", statusId)
      .query(queryNode);

    const createdNode = resultNode.recordset?.[0];

    if (!createdNode) {
      return NextResponse.json(
        { error: "Node creation failed" },
        { status: 500 }
      );
    }

    const nodeId = createdNode.Id;

    // 2️⃣ Insert Node Labels
    if (nodeLabels.length > 0) {
      const insertLabels = nodeLabels
        .map((labelId: number) => `(${nodeId}, ${labelId})`)
        .join(", ");

      const queryLabels = `
        INSERT INTO [dbo].[MapNodeLabel] (NodeId, LabelId)
        VALUES ${insertLabels}
      `;

      await pool.request().query(queryLabels);
    }

    return NextResponse.json({ ...createdNode, nodeLabels }, { status: 201 });
  } catch (err) {
    console.error("API /api/node POST error:", err);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }
}
