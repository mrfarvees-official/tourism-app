import { NextResponse } from "next/server";
import { getIntakeSession, normalizeSessionForResponse } from "../../store";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const session = token ? getIntakeSession(token) : null;

  if (!session) {
    return NextResponse.json({ error: "Session not found or expired." }, { status: 410 });
  }

  return NextResponse.json({
    data: normalizeSessionForResponse(session),
  });
}
