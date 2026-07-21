"use client";

interface PageTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageTitle({ eyebrow, title, description }: PageTitleProps) {
  return (
    <div className="mb-8">
      {eyebrow && <span className="section-title">{eyebrow}</span>}
      <h1 className="text-3xl font-bold text-charcoal mt-1 font-display">{title}</h1>
      {description && <p className="text-charcoal-light mt-2 max-w-2xl leading-relaxed">{description}</p>}
    </div>
  );
}
