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
    <div className="grid gap-2 rounded-2xl bg-stone-100/90 p-1.5 ring-1 ring-stone-200/80 dark:bg-stone-800/90 dark:ring-stone-700/50">
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
