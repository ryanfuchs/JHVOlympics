import { chipActiveClassName, chipClassName, chipInactiveClassName } from "@/lib/styles";

type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentControlProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export default function SegmentControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentControlProps<T>) {
  return (
    <div className="grid gap-2 rounded-2xl bg-zinc-100/80 p-1.5 ring-1 ring-zinc-200/60 dark:bg-zinc-800/80 dark:ring-zinc-700/60">
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`${chipClassName} min-h-11 justify-center rounded-xl ${
              value === option.value ? chipActiveClassName : chipInactiveClassName
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
