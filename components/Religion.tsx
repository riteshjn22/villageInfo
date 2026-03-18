type ReligionItem = {
  label: string;
  value?: string | number | null;
  percent?: string | number | null;
};

type ReligionProps = {
  heading: string;
  religionData?: ReligionItem[];
};

export default function Religion({ heading, religionData }: ReligionProps) {
  const religionColor: Record<string, string> = {
    hindu: "bg-gradient-to-r from-[#f97316] to-[#fb923c]",
    muslim: "bg-gradient-to-r from-[#10b981] to-[#34d399]",
    sikh: "bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]",
    christian: "bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]",
    jain: "bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa]",
    buddhist: "bg-gradient-to-r from-[#ec4899] to-[#f472b6]",
  };

  const formatPercent = (val?: string | number | null) => {
    if (val === null || val === undefined) return "-";
    const num = typeof val === "number" ? val : Number(val);
    return isNaN(num) ? "-" : num.toFixed(2);
  };

  return (
    <div className="mt-8 flex w-full flex-col">
      <div className="mb-2.5 flex items-center justify-between gap-4">
        <h2 className="flex w-fit text-lg font-bold md:text-2xl md:whitespace-nowrap">
          Religion Population in {heading}
        </h2>
        <span className="hidden h-px w-full bg-[#e2e8f0] md:flex" />
      </div>

      <div className="flex w-full overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f8fafc] text-left uppercase">
              <th className="p-3 text-xs text-[#64748b]">Religion</th>
              <th className="w-1/2 p-3 text-xs text-[#64748b]">
                Population Share
              </th>
              <th className="p-3 text-xs text-[#64748b]">Population</th>
              <th className="p-3 text-xs text-[#64748b]">%</th>
            </tr>
          </thead>

          <tbody>
            {religionData?.map((item, index) => {
              const key = item?.label?.toLowerCase();
              const gradient =
                key && religionColor[key] ? religionColor[key] : "";

              return (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-3 py-5 text-xs font-bold text-[#64748b]">
                    {item.label}
                  </td>

                  <td className="px-3 py-5 text-xs text-[#64748b]">
                    <div className={`h-1.5 w-full rounded-lg ${gradient}`} />
                  </td>

                  <td className="px-3 py-5 text-xs text-[#64748b]">
                    <span className="font-bold">{item.value ?? "-"}</span>
                  </td>
                  <td className="px-3 py-5 text-xs text-[#64748b]">
                    {formatPercent(item.percent)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
