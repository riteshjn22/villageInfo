type BasicItem = {
  label: string;
  value?: string | number | null;
};

type NestedItem = {
  label: string;
  value?: BasicItem[]; // for SC/ST nested structure
};

type PopulationProps = {
  heading: string;
  year: string | number;
  overAllPopulation?: BasicItem[];
  childrenPopulation?: BasicItem[];
  scStPopulation?: NestedItem[];
};

export default function Population({
  heading,
  year,
  overAllPopulation,
  childrenPopulation,
  scStPopulation,
}: PopulationProps) {
  return (
    <div className="flex w-full mt-8 flex-col">
      <div className="flex gap-4 mb-2.5 items-center justify-between">
        <h2 className="text-lg md:text-2xl font-bold flex w-fit md:whitespace-nowrap">
          Population of {heading} - (Census {year})
        </h2>
        <span className="md:flex hidden h-px bg-[#e2e8f0] w-full" />
      </div>

      <div className="flex w-full gap-4 flex-wrap">
        {/* Overall Population */}
        <div className="flex w-full flex-wrap rounded-lg overflow-hidden border border-gray-200">
          <div className="w-full uppercase text-[#64748b] text-sm tracking-[0.08em] p-3 bg-[#f8fafc] border-b border-b-gray-200">
            Total Population by Gender
          </div>

          <div className="flex w-full flex-wrap">
            {(() => {
              const normalItems = overAllPopulation?.filter(
                (item) => item.label !== "Sex Ratio",
              );

              return overAllPopulation?.map((item, index) => {
                if (item.label !== "Sex Ratio") {
                  const normalIndex = normalItems?.findIndex(
                    (i) => i.label === item.label,
                  );
                  const isLastNormal =
                    normalIndex === (normalItems?.length ?? 0) - 1;

                  return (
                    <div
                      key={index}
                      className={`w-1/3 flex p-4 flex-col gap-2 text-center border-r border-gray-200 ${
                        isLastNormal ? "border-r-0" : ""
                      }`}
                    >
                      <div className="w-full text-xs text-[#64748b] uppercase">
                        {item.label}
                      </div>
                      <div className="w-full text-sm font-bold">
                        {item.value ?? "-"}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={index}
                    className="w-full flex border-t border-gray-200"
                  >
                    <div className="w-1/2 text-sm text-[#64748b] capitalize p-3 bg-[#f8fafc]">
                      {item.label}
                    </div>
                    <div className="w-1/2 text-sm text-[#0f172a] capitalize p-3 font-bold flex gap-2 flex-wrap">
                      {item.value ?? "-"}
                      <span className="text-xs font-light text-[#64748b]">
                        females per 1,000 males
                      </span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Children + SC/ST */}
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          {/* Children Population */}
          <div className="flex w-full md:w-1/2 flex-wrap rounded-lg overflow-hidden border border-gray-200">
            <div className="w-full uppercase text-[#64748b] text-sm tracking-[0.08em] p-3 bg-[#f8fafc] border-b border-b-gray-200">
              Children Population (Age 0-6 Years)
            </div>

            <table className="w-full">
              <tbody>
                {childrenPopulation?.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-b-gray-200 text-sm last:border-b-0"
                  >
                    <td className="p-4 bg-[#f8fafc] w-1/2 text-[#475569] font-medium">
                      {item.label}
                    </td>
                    <td className="p-4 text-[#0f172a] font-bold">
                      {item.value ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SC/ST Population */}
          <div className="flex w-full md:w-1/2 flex-wrap rounded-lg overflow-hidden border border-gray-200">
            <div className="w-full uppercase text-[#64748b] text-sm tracking-[0.08em] p-3 bg-[#f8fafc] border-b border-b-gray-200">
              Scheduled Caste & Scheduled Tribe
            </div>

            <table className="w-full">
              <tbody>
                <tr>
                  {scStPopulation?.map((section, index) => (
                    <td className="w-1/2 p-3" key={index}>
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td
                              colSpan={2}
                              className="text-xs text-[#2563eb] font-bold pb-2"
                            >
                              {section.label}
                            </td>
                          </tr>

                          {section.value?.map((item, subIndex) => (
                            <tr
                              key={subIndex}
                              className="border-b border-b-gray-200 last:border-b-0"
                            >
                              <td className="py-2 text-xs text-[#64748b]">
                                {item.label}
                              </td>
                              <td className="py-2 text-xs font-bold text-[#0f172a]">
                                {item.value != null
                                  ? Number.isInteger(Number(item.value))
                                    ? String(item.value)
                                    : parseFloat(String(item.value)).toFixed(2)
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
