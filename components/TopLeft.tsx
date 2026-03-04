type DataItem = {
  label: string;
  value?: string | number | null;
};

type TopLeftProps = {
  title: string;
  subHeading?: string | null;
  data?: DataItem[];
};

export default function TopLeft({ title, subHeading, data }: TopLeftProps) {
  return (
    <div className="flex w-full md:w-1/3 flex-col gap-1 border border-[#c7d7fb] rounded-[14px] bg-[#eff6ff] p-4 min-w-52.5 shrink-0">
      <p className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#3b82f6] mb-1.5">
        {title}
      </p>
      <p className={`text-[19px] text-[#1e3a8a] mb-2.5 leading-[1.2]`}>
        {subHeading}
      </p>
      {data?.map((item, index) => (
        <p
          className="flex justify-between gap-2 text-[13px] py-1.25 border-b border-[#dbeafe]"
          key={index}
        >
          <span className="w-1/3 text-[#4b6fa5]">{item.label}</span>
          <strong className="truncate text-[#1e3a8a] text-right">
            {item?.value ?? "-"}
          </strong>
        </p>
      ))}
    </div>
  );
}
