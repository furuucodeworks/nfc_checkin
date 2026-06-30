import Link from "next/link";
import { LOCATIONS, type LocationId } from "@/lib/locations";

export default function Home() {
  const locations = Object.entries(LOCATIONS) as [LocationId, string][];

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-zinc-50 px-6 py-12">
      <main className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-zinc-900">
            NFC チェックインシステム
          </h1>
          <p className="mt-2 text-sm text-zinc-500">STEP 1: 環境構築と画面表示</p>
        </div>

        <ul className="space-y-2">
          {locations.map(([id, name]) => (
            <li key={id}>
              <Link
                href={`/checkin/${id}`}
                className="block rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 transition-colors hover:bg-zinc-50"
              >
                {name}
                <span className="ml-2 text-sm text-zinc-400">/checkin/{id}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
