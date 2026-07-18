"use client";

import {
  CLARITY_GRADE_GUIDE,
  COLOR_GRADE_GUIDE,
  CUT_GRADE_GUIDE,
  GRADE_TOPIC_COPY,
  POPULAR_LW_RATIOS,
} from "@/constants/diamond-guides";
import {
  CLARITY_SLIDER_GRADES,
  COLOR_SLIDER_GRADES,
  CUT_SLIDER_GRADES,
} from "@/constants/jewellery";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export type GradeInfoTopic = "cut" | "color" | "clarity" | "lwRatio";

interface GradeInfoModalProps {
  topic: GradeInfoTopic | null;
  activeGrade?: string | null;
  onClose: () => void;
}

function GuideList({
  grades,
  guide,
  activeGrade,
}: {
  grades: readonly string[];
  guide: Record<string, { title: string; description: string }>;
  activeGrade?: string | null;
}) {
  const focus = activeGrade && guide[activeGrade] ? activeGrade : grades[grades.length - 1];
  const entry = focus ? guide[focus] : undefined;

  return (
    <div className="mt-5 space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {grades.map((grade) => (
          <span
            key={grade}
            className={cn(
              "rounded-sm border px-2 py-1 text-xs",
              grade === focus
                ? "border-brand-navy bg-brand-navy text-brand-ivory"
                : "border-brand-gold/25 text-brand-navy/70",
            )}
          >
            {grade}
          </span>
        ))}
      </div>
      {entry && (
        <div className="rounded-sm bg-brand-navy px-4 py-3 text-brand-ivory">
          <p className="text-sm font-medium">{entry.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-brand-ivory/75">
            {entry.description}
          </p>
        </div>
      )}
    </div>
  );
}

export function GradeInfoModal({
  topic,
  activeGrade,
  onClose,
}: GradeInfoModalProps) {
  useEffect(() => {
    if (!topic) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [topic, onClose]);

  if (!topic) return null;

  const copy = GRADE_TOPIC_COPY[topic];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-brand-navy/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="grade-info-title"
        className="relative z-10 max-h-[85vh] w-full max-w-md overflow-y-auto rounded-sm border border-brand-gold/25 bg-white p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-sm text-brand-charcoal/45 hover:text-brand-navy"
        >
          ✕
        </button>
        <h2
          id="grade-info-title"
          className="pr-8 font-serif text-2xl text-brand-navy"
        >
          {copy.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/70">
          {copy.body}
        </p>

        {topic === "cut" && (
          <GuideList
            grades={CUT_SLIDER_GRADES}
            guide={CUT_GRADE_GUIDE}
            activeGrade={activeGrade}
          />
        )}
        {topic === "color" && (
          <GuideList
            grades={COLOR_SLIDER_GRADES}
            guide={COLOR_GRADE_GUIDE}
            activeGrade={activeGrade}
          />
        )}
        {topic === "clarity" && (
          <GuideList
            grades={CLARITY_SLIDER_GRADES}
            guide={CLARITY_GRADE_GUIDE}
            activeGrade={activeGrade}
          />
        )}
        {topic === "lwRatio" && (
          <div className="mt-5">
            <p className="text-xs font-medium tracking-[0.16em] text-brand-navy/60 uppercase">
              Popular ratios by shape
            </p>
            <dl className="mt-3 space-y-2 text-sm">
              {Object.entries(POPULAR_LW_RATIOS).map(([shape, ratio]) => (
                <div key={shape} className="flex justify-between gap-4">
                  <dt className="text-brand-charcoal/65">{shape}</dt>
                  <dd className="font-medium text-brand-navy">{ratio}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
