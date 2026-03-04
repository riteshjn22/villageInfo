import Link from "next/link";

type ListType = "state" | "district" | "tehsil";

type ListItem = {
  name: string;
  population: number | null;
  total: number | null;
  sex_ratio: number | null;
  literacy_rate: number | null;
  state_slug?: string; // optional — only needed when rows are links
  district_slug?: string;
  tehsil_slug?: string;
  village_slug?: string;
};

type Props = {
  type: ListType;
  heading: string;
  data: ListItem[];
};

const TYPE_CONFIG: Record<ListType, { listType: string; total: string }> = {
  state: { listType: "Districts", total: "Total Tehsils" },
  district: { listType: "Tehsils", total: "Total Villages" },
  tehsil: { listType: "Villages", total: "Households" },
};

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="p-3 text-[#64748b] text-xs">{children}</th>
);

const TD = ({ children }: { children: React.ReactNode }) => (
  <td className="p-3 text-[#64748b] text-xs">{children ?? "—"}</td>
);

export default function List({ type, heading, data }: Props) {
  const { listType, total } = TYPE_CONFIG[type];

  return (
    <div className="flex w-full mt-8 flex-col">
      <div className="flex gap-4 mb-2.5 items-center justify-between">
        <h2 className="text-lg md:text-2xl font-bold flex w-fit md:whitespace-nowrap">
          {listType} List in {heading}
        </h2>
        <span className="md:flex hidden h-px bg-[#e2e8f0] w-full" />
      </div>

      <div className="w-full flex border border-gray-200 overflow-hidden rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f8fafc] uppercase text-left">
              <TH>#</TH>
              <TH>{listType} Name</TH>
              <TH>Population</TH>
              <TH>{total}</TH>
              <TH>Sex Ratio</TH>
              <TH>Literacy Rate</TH>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr className="text-left" key={item.name}>
                <TD>{index + 1}</TD>
                <TD>
                  <Link
                    href={`/${[item?.state_slug, item?.district_slug, item?.tehsil_slug, item?.village_slug].filter(Boolean).join("/")}`}
                  >
                    {item.name}
                  </Link>
                </TD>
                <TD>{item.population}</TD>
                <TD>{item.total}</TD>
                <TD>{item.sex_ratio}</TD>
                <TD>{item.literacy_rate}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
