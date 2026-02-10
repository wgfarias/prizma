import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type EvolutionWebhookBody = {
  event?: string;
  instance?: string;
  data?: unknown;
  [key: string]: unknown;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EvolutionWebhookBody;
    const eventType = body.event ?? body.type ?? "unknown";
    const instanceName = (body.instance ?? body.instanceName ?? body.key) as string | undefined;
    if (!instanceName) {
      return NextResponse.json({ ok: false, error: "instance missing" }, { status: 400 });
    }
    const admin = createAdminClient();
    const { data: row } = await admin
      .from("evolution_instances")
      .select("tenant_id")
      .eq("instance_name", instanceName)
      .single();
    if (!row) {
      return NextResponse.json({ ok: true }); // ignore unknown instance
    }
    await admin.from("whatsapp_events").insert({
      tenant_id: row.tenant_id,
      instance_name: instanceName,
      event_type: String(eventType),
      payload: body,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[webhook evolution]", e);
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }
}
