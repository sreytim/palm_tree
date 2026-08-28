export default function WeaveDivider({ className = "" }: { className?: string }) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`weave-divider ${className}`}
    />
  );
}
