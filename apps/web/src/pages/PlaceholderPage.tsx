interface PlaceholderPageProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PlaceholderPage({
  eyebrow,
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="fv-page">
      <div className="fv-page-header">
        <div>
          <p className="fv-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>

      <div className="fv-placeholder">
        <div className="fv-placeholder-icon">◌</div>
        <h2>Workspace ready</h2>
        <p>
          This experience will be connected to FieldVoice intelligence
          in the next build phase.
        </p>
      </div>
    </div>
  );
}
