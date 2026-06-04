type WorkersItem = {
  label: string;
  value?: string | number | null;
  percent?: string | number | null;
};

type WorkersProps = {
  heading: string;
  data?: WorkersItem[];
};

export default function Workers({ heading, data }: WorkersProps) {
  const formatPercent = (val?: string | number | null) => {
    if (val === null || val === undefined) return "-";
    const num = typeof val === "number" ? val : Number(val);
    return isNaN(num) ? "-" : num?.toFixed(2);
  };

  return (
    <div className="mt-8 flex w-full flex-col">
      <div className="mb-2.5 flex items-center justify-between gap-4">
        <h2 className="flex w-fit text-lg font-bold md:text-2xl md:whitespace-nowrap">
          Workers in {heading}
        </h2>
        <span className="hidden h-px w-full bg-[#e2e8f0] md:flex" />
      </div>

      <div className="flex w-full flex-wrap overflow-hidden rounded-lg border border-gray-200">
        <div className="w-full border-b border-gray-200 bg-[#f8fafc] p-3 text-sm tracking-[0.08em] text-[#64748b] uppercase">
          Total Workers & Work Participation Rate by Gender
        </div>

        <div className="flex w-full flex-wrap">
          {data?.map((item, index) => {
            const isLast = index === (data.length ?? 0) - 1;

            return (
              <div
                key={index}
                className={`flex w-1/3 flex-col gap-2 border-r border-gray-200 p-4 text-center ${
                  isLast ? "border-r-0" : ""
                }`}
              >
                <div className="w-full text-xs text-[#64748b] uppercase">
                  {item.label}
                </div>

                <div className="w-full text-sm font-bold">
                  {item.value ?? "-"}
                </div>

                <div className="w-full text-xs font-bold text-[#2563eb]">
                  {formatPercent(item.percent)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
