

import QueryInput from "../../components/QueryInput";
import Image from "next/image";

const INDEX_TIGER_900 = "tiger-900-sm";

export default async function ChatContent({
  params,
}: {
  params: Promise<{ indexName: string }>
}) {

  const { indexName } = await params

  return (
    <div className="grid justify-items-center min-h-screen">
      <header className="row-start-1 mb-4 flex items-center space-x-4">
        {indexName === INDEX_TIGER_900 && (
          <>
            <Image src="/triumph.png" alt="Triumph Logo" width={60} height={40} className="w-15 h-10" />
            <h1 className="text-2xl font-bold">Tiger 900 Service Manual</h1>
          </>
        )}

        {indexName !== INDEX_TIGER_900 && (
          <h1 className="text-2xl font-bold">{indexName}</h1>
        )}

      </header>

      <main className="w-full sm:w-100">
        <QueryInput indexName={indexName} />
      </main>
    </div >
  );
}
