import {
  CERTIFICATION_LABS,
  type CertificationLab,
} from "@/constants/certification";
import { safeConnectDB } from "@/lib/db";
import { Diamond } from "@/models/Diamond";
import type {
  AdminDiamondSummary,
  DiamondCertification,
  DiamondDetail,
  UpdateDiamondCertificationInput,
} from "@/types";
import mongoose from "mongoose";

function isCertificationLab(value: string | undefined): value is CertificationLab {
  return Boolean(value && CERTIFICATION_LABS.includes(value as CertificationLab));
}

function toCertification(
  certification?: {
    lab?: string;
    reportNumber?: string;
    reportUrl?: string;
    certificateFileUrl?: string;
  } | null,
): DiamondCertification | undefined {
  if (!certification) return undefined;

  const hasData = Boolean(
    certification.lab ||
      certification.reportNumber ||
      certification.reportUrl ||
      certification.certificateFileUrl,
  );

  if (!hasData) return undefined;

  return {
    lab: isCertificationLab(certification.lab) ? certification.lab : undefined,
    reportNumber: certification.reportNumber,
    reportUrl: certification.reportUrl,
    certificateFileUrl: certification.certificateFileUrl,
  };
}

function toAdminDiamondSummary(diamond: {
  _id: { toString(): string };
  diamondType: string;
  shape: string;
  carat: number;
  cut: string;
  color: string;
  clarity: string;
  price: number;
  salePrice?: number;
  certification?: Parameters<typeof toCertification>[0];
  availabilityStatus: string;
  images?: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): AdminDiamondSummary {
  return {
    _id: diamond._id.toString(),
    diamondType: diamond.diamondType as AdminDiamondSummary["diamondType"],
    shape: diamond.shape as AdminDiamondSummary["shape"],
    carat: diamond.carat,
    cut: diamond.cut as AdminDiamondSummary["cut"],
    color: diamond.color as AdminDiamondSummary["color"],
    clarity: diamond.clarity as AdminDiamondSummary["clarity"],
    price: diamond.price,
    salePrice: diamond.salePrice,
    certification: toCertification(diamond.certification),
    availabilityStatus:
      diamond.availabilityStatus as AdminDiamondSummary["availabilityStatus"],
    images: diamond.images ?? [],
    isActive: diamond.isActive,
    createdAt: diamond.createdAt.toISOString(),
    updatedAt: diamond.updatedAt.toISOString(),
  };
}

export async function getAdminDiamonds(): Promise<AdminDiamondSummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const diamonds = await Diamond.find()
      .sort({ updatedAt: -1 })
      .lean();

    return diamonds.map((diamond) =>
      toAdminDiamondSummary(
        diamond as unknown as Parameters<typeof toAdminDiamondSummary>[0],
      ),
    );
  } catch (error) {
    console.error("getAdminDiamonds error:", error);
    return [];
  }
}

export async function getAdminDiamondById(
  id: string,
): Promise<(DiamondDetail & { isActive: boolean; updatedAt: string }) | null> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(id)) return null;

  try {
    const diamond = await Diamond.findById(id).lean();
    if (!diamond) return null;

    const doc = diamond as unknown as Parameters<typeof toAdminDiamondSummary>[0] & {
      polish?: string;
      symmetry?: string;
      fluorescence?: string;
    };

    const summary = toAdminDiamondSummary(doc);

    return {
      ...summary,
      polish: doc.polish,
      symmetry: doc.symmetry,
      fluorescence: doc.fluorescence,
    };
  } catch (error) {
    console.error("getAdminDiamondById error:", error);
    return null;
  }
}

export async function updateDiamondCertification(
  id: string,
  input: UpdateDiamondCertificationInput,
): Promise<DiamondCertification | null> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(id)) return null;

  try {
    const diamond = await Diamond.findById(id);
    if (!diamond) return null;

    const current = diamond.certification ?? {};

    if (input.lab !== undefined) current.lab = input.lab;
    if (input.reportNumber !== undefined) {
      current.reportNumber = input.reportNumber.trim();
    }
    if (input.reportUrl !== undefined) {
      current.reportUrl = input.reportUrl.trim() || undefined;
    }
    if (input.certificateFileUrl !== undefined) {
      current.certificateFileUrl = input.certificateFileUrl.trim() || undefined;
    }

    diamond.certification = current;
    diamond.markModified("certification");
    await diamond.save();

    return toCertification(diamond.certification) ?? {};
  } catch (error) {
    console.error("updateDiamondCertification error:", error);
    return null;
  }
}
