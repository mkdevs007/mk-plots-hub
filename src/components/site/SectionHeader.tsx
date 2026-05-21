export function SectionHeader({
  eyebrow,
  title,
  description,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <div className={`flex items-center gap-3 text-gold text-xs font-semibold tracking-[0.2em] uppercase ${center ? "justify-center" : ""}`}>
          <span className="gold-divider" />
          {eyebrow}
          <span className="gold-divider" />
        </div>
      )}
      <h2 className="mt-4 font-display text-4xl md:text-5xl text-foreground text-balance leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">{description}</p>
      )}
    </div>
  );
}
