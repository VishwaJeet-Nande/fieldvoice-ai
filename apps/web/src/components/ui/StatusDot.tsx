type Status = "success" | "warning" | "danger" | "info" | "neutral";

interface StatusDotProps {
  status?: Status;
  label?: string;
}

export function StatusDot({
  status = "neutral",
  label,
}: StatusDotProps) {
  return (
    <span className="fv-status">
      <span className={`fv-status-dot fv-status-${status}`} />
      {label && <span>{label}</span>}
    </span>
  );
}
