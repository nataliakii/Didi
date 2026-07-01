"use client";

import { AddCustomRingToCartButton } from "@/components/cart/AddCustomRingToCartButton";
import { getPrimaryImageUrl } from "@/lib/cart";
import type { AddCustomRingCartInput } from "@/types/cart";
import type { DiamondDetail, RingSettingDetail } from "@/types";
import type { Metal } from "@/constants/jewellery";

interface AddCustomRingToCartPanelProps {
  setting: RingSettingDetail;
  diamond: DiamondDetail;
  selectedMetal?: Metal;
  selectedRingSize?: string;
  price: number;
  canAdd: boolean;
}

export function AddCustomRingToCartPanel({
  setting,
  diamond,
  selectedMetal,
  selectedRingSize,
  price,
  canAdd,
}: AddCustomRingToCartPanelProps) {
  const cartInput: AddCustomRingCartInput | null =
    canAdd && selectedMetal && selectedRingSize
      ? {
          settingId: setting._id,
          diamondId: diamond._id,
          selectedMetal,
          ringSize: selectedRingSize,
        name: "Custom Diamond Ring",
        image:
          getPrimaryImageUrl(setting.images) ??
          getPrimaryImageUrl(diamond.images),
        price,
        settingSnapshot: {
          id: setting._id,
          name: setting.name,
          style: setting.style,
          basePrice: setting.basePrice,
          image: getPrimaryImageUrl(setting.images),
        },
        diamondSnapshot: {
          id: diamond._id,
          diamondType: diamond.diamondType,
          shape: diamond.shape,
          carat: diamond.carat,
          cut: diamond.cut,
          color: diamond.color,
          clarity: diamond.clarity,
          price: diamond.salePrice ?? diamond.price,
          certification: diamond.certification
            ? {
                lab: diamond.certification.lab,
                reportNumber: diamond.certification.reportNumber,
                reportUrl: diamond.certification.reportUrl,
                certificateFileUrl: diamond.certification.certificateFileUrl,
              }
            : undefined,
        },
      }
    : null;

  return (
    <AddCustomRingToCartButton
      input={cartInput}
      disabled={!canAdd}
      disabledMessage="Please choose metal and ring size first."
    />
  );
}
