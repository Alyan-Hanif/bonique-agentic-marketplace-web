export default function PageHeader({
  kicker,
  title,
  description,
  actions,
}: {
  kicker?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">{kicker}</p>
        ) : null}
        <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-neutral-500">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
