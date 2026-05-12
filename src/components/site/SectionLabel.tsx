export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="eyebrow">{children}</span>
      <span className="h-px w-12 bg-border" />
    </div>
  );
}
