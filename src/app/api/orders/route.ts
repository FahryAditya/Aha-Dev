import { NextResponse } from "next/server";
import { fullOrderSchema } from "@/lib/validation";
import { createOrder } from "@/lib/ordersService";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parseResult = fullOrderSchema.safeParse(json);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: issue ? `${issue.path.join(".")}: ${issue.message}` : "Invalid order payload" },
        { status: 400 }
      );
    }

    const order = await createOrder(parseResult.data);

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      message: "Order request received and queued for Discord notification.",
    });
  } catch (error) {
    console.error("[API orders] Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error processing order" },
      { status: 500 }
    );
  }
}
