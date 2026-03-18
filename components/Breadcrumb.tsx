import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  redirectionUrl?: string | null;
};

type Props = {
  data: BreadcrumbItem[];
};

export default function Breadcrumb({ data }: Props) {
  return (
    <nav
      className="mb-4 flex w-full items-center gap-1 text-sm capitalize"
      aria-label="Breadcrumb"
    >
      {data?.map((item, index) => (
        <span key={item.label} className="flex items-center gap-1">
          {index > 0 && <span aria-hidden="true">›</span>}
          {item.redirectionUrl ? (
            <Link href={item.redirectionUrl} className="text-indigo-600">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
