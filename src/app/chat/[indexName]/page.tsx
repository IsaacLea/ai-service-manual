

import QueryInput from "../../components/QueryInput";
import Image from "next/image";

const INDEX_TIGER_900 = "tiger-900";

export default async function ChatContent({
  params,
}: {
  params: Promise<{ indexName: string }>
}) {

  const { indexName } = await params

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center justify-center">
      <header className="mb-8 flex flex-col items-center space-y-4">
        {indexName === INDEX_TIGER_900 && (
          <>
            <h1 className="text-4xl font-extrabold text-blue-800 drop-shadow-lg">
              Tiger 900 Service Manual
            </h1>
            <Image src="/triumph.png" alt="Triumph Logo" width={60} height={40} className="w-15 h-10" />
          </>
        )}

        {indexName !== INDEX_TIGER_900 && (
          <h1 className="text-4xl font-extrabold text-blue-800 drop-shadow-lg">{indexName}</h1>
        )}

      </header>

      <main className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
        <QueryInput indexName={indexName} />
      </main>
    </div >
  );
}
