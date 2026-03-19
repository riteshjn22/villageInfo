import { formatDate } from "@/utils/common";
import Image from "next/image";
import Link from "next/link";

interface BlogItem {
  url: string;
  imageUrl?: string;
  title: string;
  author?: string;
  date?: string;
  short_description?: string;
}

// A lightweight 1×1 gray pixel as the blur placeholder
// <svg ...><rect fill="#333333"/></svg> → base64 encoded
const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMzMzMzMzMiLz48L3N2Zz4=";

export default function BlogBody({
  item,
  priority = false,
}: {
  item: BlogItem;
  priority?: boolean;
}) {
  return (
    <Link
      href={item?.url}
      className="flex items-center overflow-hidden rounded-lg border border-gray-300 transition hover:bg-gray-100"
    >
      {item?.imageUrl && (
        <div className="relative h-full w-1/3">
          <Image
            src={item?.imageUrl}
            alt={item?.title}
            fill
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </div>
      )}
      <div
        className={`flex ${item?.imageUrl ? "w-2/3" : "w-full"} flex-col gap-1 p-2 md:gap-4 md:p-4`}
      >
        <div>
          <p className="w-full truncate text-sm font-medium">{item?.title}</p>
          <p className="flex w-full flex-wrap gap-1 truncate text-xs font-medium text-gray-500 md:flex-nowrap md:gap-4">
            {item?.author && (
              <span className="capitalize">{`Author : ${item?.author}`}</span>
            )}
            {item?.date && (
              <span>{`Published : ${formatDate(item?.date)}`}</span>
            )}
          </p>
        </div>

        <p className="line-clamp-2 text-sm">
          {item?.short_description?.replace(/<[^>]*>/g, "")}
        </p>
      </div>
    </Link>
  );
}
