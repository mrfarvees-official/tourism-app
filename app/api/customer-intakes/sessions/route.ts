import { NextRequest, NextResponse } from "next/server";
import { createIntakeSession, normalizeSessionForResponse } from "../store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const tenantKey = typeof payload.tenantKey === "string" ? payload.tenantKey.trim() : "";
  if (!tenantKey) {
    return NextResponse.json({ error: "tenantKey is required." }, { status: 400 });
  }

  const session = createIntakeSession({
    tenantKey,
    customerName: typeof payload.customerName === "string" ? payload.customerName : "",
    customerEmail: typeof payload.customerEmail === "string" ? payload.customerEmail : "",
    customerPhone: typeof payload.customerPhone === "string" ? payload.customerPhone : "",
    partialPaymentAmount: typeof payload.partialPaymentAmount === "string" ? payload.partialPaymentAmount : "",
    currency: "LKR",
    brandName: typeof payload.brandName === "string" ? payload.brandName : "",
    note: typeof payload.note === "string" ? payload.note : "",
    prefill:
      payload.prefill && typeof payload.prefill === "object" && !Array.isArray(payload.prefill)
        ? {
            name: typeof (payload.prefill as Record<string, unknown>).name === "string"
              ? String((payload.prefill as Record<string, unknown>).name)
              : "",
            email: typeof (payload.prefill as Record<string, unknown>).email === "string"
              ? String((payload.prefill as Record<string, unknown>).email)
              : "",
            phone: typeof (payload.prefill as Record<string, unknown>).phone === "string"
              ? String((payload.prefill as Record<string, unknown>).phone)
              : "",
            subject: typeof (payload.prefill as Record<string, unknown>).subject === "string"
              ? String((payload.prefill as Record<string, unknown>).subject)
              : "",
            message: typeof (payload.prefill as Record<string, unknown>).message === "string"
              ? String((payload.prefill as Record<string, unknown>).message)
              : "",
          }
        : undefined,
  });

  return NextResponse.json({
    data: normalizeSessionForResponse(session),
  });
}
