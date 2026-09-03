import Link from "next/link";

function LeftSideBar() {
  return (
    <div className="w-full bg-gray-100 p-4 md:w-1/4">
      <h2 className="text-lg font-semibold">Navigation</h2>
      <ul className="mt-2">
        <li className="mb-1">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Content
          </Link>
        </li>
        <li className="mb-1">
          <Link
            href="/dashboard/upload"
            className="text-blue-600 hover:underline"
          >
            Upload Data
          </Link>
        </li>
      </ul>

      {/* deepak start - new section: Hindu Population feature nav, kept
          separate from the sections above so the existing Content /
          Upload Data workflow is untouched */}
      <h2 className="mt-4 text-lg font-semibold">Hindu Population</h2>
      <ul className="mt-2">
        <li className="mb-1">
          <Link
            href="/dashboard/hindu-population"
            className="text-blue-600 hover:underline"
          >
            Upload / Download
          </Link>
        </li>
      </ul>
      {/* deepak end - new section */}
      {/* deepak start - new section: Muslim Population feature nav */}
      <h2 className="mt-4 text-lg font-semibold">Muslim Population</h2>
      <ul className="mt-2">
        <li className="mb-1">
          <Link
            href="/dashboard/muslim-population"
            className="text-blue-600 hover:underline"
          >
            Upload / Download
          </Link>
        </li>
      </ul>
      {/* deepak end - new section */}
      {/* deepak start - new section: Christian Population feature nav */}
      <h2 className="mt-4 text-lg font-semibold">Christian Population</h2>
      <ul className="mt-2">
        <li className="mb-1">
          <Link
            href="/dashboard/christian-population"
            className="text-blue-600 hover:underline"
          >
            Upload / Download
          </Link>
        </li>
      </ul>
      {/* deepak end - new section */}
      {/* deepak start - new section: Sikh Population feature nav */}
      <h2 className="mt-4 text-lg font-semibold">Sikh Population</h2>
      <ul className="mt-2">
        <li className="mb-1">
          <Link
            href="/dashboard/sikh-population"
            className="text-blue-600 hover:underline"
          >
            Upload / Download
          </Link>
        </li>
      </ul>
      {/* deepak end - new section */}
      {/* deepak start - new section: Buddhist Population feature nav */}
      <h2 className="mt-4 text-lg font-semibold">Buddhist Population</h2>
      <ul className="mt-2">
        <li className="mb-1">
          <Link
            href="/dashboard/buddhist-population"
            className="text-blue-600 hover:underline"
          >
            Upload / Download
          </Link>
        </li>
      </ul>
      {/* deepak end - new section */}
      {/* deepak start - new section: Jain Population feature nav */}
      <h2 className="mt-4 text-lg font-semibold">Jain Population</h2>
      <ul className="mt-2">
        <li className="mb-1">
          <Link
            href="/dashboard/jain-population"
            className="text-blue-600 hover:underline"
          >
            Upload / Download
          </Link>
        </li>
      </ul>
      {/* deepak end - new section */}
    </div>
  );
}
export default LeftSideBar;
