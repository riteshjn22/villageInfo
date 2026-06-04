type TopChipProps = {
  heading: string;
  value?: string | number | null;
  isShowPercent?: boolean;
};

export default function TopChip({
  heading,
  value,
  isShowPercent,
}: TopChipProps) {
  const displayValue =
    typeof value === "number" && !Number.isInteger(value)
      ? `${parseFloat(value?.toFixed(2))}${isShowPercent ? "%" : ""}`
      : value;

  return (
    <div className="flex w-full flex-col gap-1 rounded-xl border border-gray-200 bg-linear-to-b from-slate-50 to-white p-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)] md:w-1/3">
      <p className="mb-1.25 text-[11px] font-semibold tracking-[0.05em] text-[#64748b] uppercase">
        {heading}
      </p>
      <p className="text-[17px] leading-[1.2] font-bold text-[#0f172a]">
        {displayValue ?? "-"}
      </p>
    </div>
  );
}
