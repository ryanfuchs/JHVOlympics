type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <header className="mb-6">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
        {title}
      </h1>
      {description && (
        <p className="mt-1.5 text-[15px] text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      )}
    </header>
  );
}
