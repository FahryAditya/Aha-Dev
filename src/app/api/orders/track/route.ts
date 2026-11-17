import { NextResponse, connection } from "next/server";
import { findOrderByQuery } from "@/lib/ordersService";

export async function GET(request: Request) {
  await connection();
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || searchParams.get("orderNumber") || searchParams.get("email");

    if (!query) {
      return NextResponse.json(
        { error: "Parameter 'query', 'orderNumber', atau 'email' diperlukan." },
        { status: 400 }
      );
    }

    const order = await findOrderByQuery(query);

    if (!order) {
      return NextResponse.json(
        { error: "Order tidak ditemukan. Pastikan nomor order atau email sudah sesuai." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("[API track] Error querying order:", error);
    return NextResponse.json(
      { error: "Internal server error querying order" },
      { status: 500 }
    );
  }
}
