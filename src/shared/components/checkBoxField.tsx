export function CheckboxField({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="w-full flex items-center gap-2 mt-6">
      <input
        type="checkbox"
        className="h-4 w-4 accent-[var(--accent)] disabled:opacity-60"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label className="text-fg text-sm">{label}</label>
    </div>
  );
}