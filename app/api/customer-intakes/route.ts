import { NextRequest, NextResponse } from "next/server";
import { listCustomerSubmissions, storeCustomerSubmission } from "./store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const tenantKey = request.nextUrl.searchParams.get("tenantKey")?.trim();

  if (!tenantKey) {
    return NextResponse.json({ error: "tenantKey is required." }, { status: 400 });
  }

  return NextResponse.json({
    data: listCustomerSubmissions(tenantKey),
  });
}

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!payload) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const token = typeof payload.token === "string" ? payload.token.trim() : "";
  if (!token) {
    return NextResponse.json({ error: "token is required." }, { status: 400 });
  }

  const primaryContact =
    payload.primaryContact && typeof payload.primaryContact === "object" && !Array.isArray(payload.primaryContact)
      ? (payload.primaryContact as Record<string, unknown>)
      : {};
  const travelers = Array.isArray(payload.travelers) ? payload.travelers : [];

  const submission = storeCustomerSubmission({
    token,
    primaryContact: {
      name: typeof primaryContact.name === "string" ? primaryContact.name : "",
      email: typeof primaryContact.email === "string" ? primaryContact.email : "",
      phone: typeof primaryContact.phone === "string" ? primaryContact.phone : "",
      nationality: typeof primaryContact.nationality === "string" ? primaryContact.nationality : "",
      passport_number:
        typeof primaryContact.passport_number === "string" ? primaryContact.passport_number : "",
      visa_type: typeof primaryContact.visa_type === "string" ? primaryContact.visa_type : "",
      notes: typeof primaryContact.notes === "string" ? primaryContact.notes : "",
    },
    travelers: travelers.map((traveler) => {
      const entry =
        traveler && typeof traveler === "object" && !Array.isArray(traveler)
          ? (traveler as Record<string, unknown>)
          : {};

      return {
        full_name: typeof entry.full_name === "string" ? entry.full_name : "",
        date_of_birth: typeof entry.date_of_birth === "string" ? entry.date_of_birth : "",
        nationality: typeof entry.nationality === "string" ? entry.nationality : "",
        passport_number: typeof entry.passport_number === "string" ? entry.passport_number : "",
        passport_expiry: typeof entry.passport_expiry === "string" ? entry.passport_expiry : "",
        visa_type: typeof entry.visa_type === "string" ? entry.visa_type : "",
        gender: typeof entry.gender === "string" ? entry.gender : "",
      };
    }),
    paymentUrl: typeof payload.paymentUrl === "string" ? payload.paymentUrl : undefined,
    paymentStatus:
      payload.paymentStatus === "paid" ||
      payload.paymentStatus === "expired" ||
      payload.paymentStatus === "not_required"
        ? payload.paymentStatus
        : "pending",
  });

  if (!submission) {
    return NextResponse.json({ error: "The session is invalid or expired." }, { status: 410 });
  }

  return NextResponse.json({ data: submission });
}
