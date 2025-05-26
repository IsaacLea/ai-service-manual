import { getIndexDisplayRecord } from "@/app/utils";
import QueryInput from "../../components/QueryInput";
import Image from "next/image";


export default async function ChatContent({
  params,
}: {
  params: Promise<{ indexName: string }>
}) {

  const { indexName } = await params

  const indexDisplayRecord = getIndexDisplayRecord(indexName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center justify-center">
      <header className="mb-8 flex flex-col items-center space-y-4">
        <h1 className="text-xl font-extrabold text-blue-800 drop-shadow-lg">

          {indexDisplayRecord &&
            indexDisplayRecord.indexDisplayName
          }

          {!indexDisplayRecord &&
            indexName
          }
        </h1>

        {indexDisplayRecord && indexDisplayRecord.imgSrc &&
          <Image src={indexDisplayRecord.imgSrc} alt="Logo" width={60} height={40} className="w-15 h-10" />
        }

      </header>

      <main className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
        <QueryInput indexName={indexName} />
      </main>
    </div >
  );
}
