interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
}

export default function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  tone = "dark",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const titleColor = tone === "light" ? "text-cream" : "text-ink";
  const ledeColor = tone === "light" ? "text-cream/80" : "text-ink-soft";

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <p
          className={`font-mono text-xs tracking-[0.2em] uppercase mb-3 ${
            tone === "light" ? "text-beige" : "text-clay-deep"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2 className={`font-display text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.1] font-medium ${titleColor}`}>
        {title}
      </h2>
      {lede && <p className={`mt-4 text-base sm:text-lg leading-relaxed ${ledeColor}`}>{lede}</p>}
    </div>
  );
}
