import Link from "next/link";

type ListItem = {
  name: string;
  redirectionUrl?: string | null;
};

type Props = {
  heading: string;
  listData: ListItem[];
};

export default function PopularList({ heading, listData }: Props) {
  return (
    <div className="flex w-full flex-col rounded-xl border border-gray-200 p-4 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
      <h3 className="font-bold text-[#0f172a]">{heading}</h3>
      <ul className="mt-4 flex flex-col">
        {listData?.map((item, index) => (
          <li
            key={item.redirectionUrl ?? `${item.name}-${index}`}
            className="flex w-full border-b border-b-gray-200 last:border-0"
          >
            {item.redirectionUrl ? (
              <Link
                prefetch={false}
                href={item.redirectionUrl}
                className="flex w-full py-2 leading-normal text-[#2563eb]"
              >
                {item.name}
              </Link>
            ) : (
              <span className="flex w-full py-2 leading-normal text-[#0f172a]">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
