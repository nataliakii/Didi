import {
  CERTIFICATION_LABS,
  type CertificationLab,
} from "@/constants/certification";
import { CATALOG_ROLES } from "@/constants/admin-roles";
import { requireAdminApi } from "@/lib/admin-auth";
import {
  updateDiamondCertification,
} from "@/services/diamond-admin.service";
import type { UpdateDiamondCertificationInput } from "@/types";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function parseCertificationInput(
  body: unknown,
): UpdateDiamondCertificationInput | null {
  if (!body || typeof body !== "object") return null;

  const input = body as Record<string, unknown>;
  const result: UpdateDiamondCertificationInput = {};

  if (typeof input.lab === "string") {
    if (!CERTIFICATION_LABS.includes(input.lab as CertificationLab)) {
      return null;
    }
    result.lab = input.lab as CertificationLab;
  }

  if (typeof input.reportNumber === "string") {
    result.reportNumber = input.reportNumber;
  }

  if (typeof input.reportUrl === "string") {
    result.reportUrl = input.reportUrl;
  }

  if (typeof input.certificateFileUrl === "string") {
    result.certificateFileUrl = input.certificateFileUrl;
  }

  return result;
}

export async function PATCH(request: Request, context: RouteContext) {
  const gate = await requireAdminApi(CATALOG_ROLES);
  if (!gate.ok) return gate.response;

  const { id } = await context.params;

  try {
    const body: unknown = await request.json();
    const input = parseCertificationInput(body);

    if (!input) {
      return NextResponse.json(
        { error: "Invalid grading report data." },
        { status: 400 },
      );
    }

    const certification = await updateDiamondCertification(id, input);

    if (!certification) {
      return NextResponse.json({ error: "Diamond not found." }, { status: 404 });
    }

    return NextResponse.json({
      certification,
      message: "Grading report details saved.",
    });
  } catch (error) {
    console.error("PATCH certification error:", error);
    return NextResponse.json(
      { error: "Could not save grading report details." },
      { status: 500 },
    );
  }
}
