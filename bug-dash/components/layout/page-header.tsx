import Link from "next/link";

export default function PageHeader({
  title,
  description,
  action,
  backHref,
  backLabel = "Back",
}: {
  title: string;
  description?: string;
  /** right-aligned action, e.g. a <Button> or <Link> */
  action?: React.ReactNode;
  /** optional "← back" link shown above the title */
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {backHref && (
        <Link
          href={backHref}
          className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)]"
        >
          ← {backLabel}
        </Link>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--fg)]">{title}</h1>
          {description && (
            <p className="text-sm text-[var(--fg-muted)]">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
