
import QueryInput from "../../components/QueryInput";
import Image from "next/image";
import { getIndexByName } from "@/app/lib/databaseService";


export default async function ChatContent({
  params,
}: {
  params: Promise<{ indexName: string }>
}) {

  const { indexName } = await params
  const indexRecord = await getIndexByName(indexName)

  return (
    <div className="flex flex-1 h-full flex-col items-center justify-center w-full">

      <div className="flex-1 h-full w-full max-w-xl bg-white rounded-xl shadow-lg p-8 items-center flex flex-col space-y-4">
        <h1 className="text-xl font-extrabold text-black drop-shadow-lg">
          {indexRecord?.indexDisplayName}
        </h1>

        {indexName.toLowerCase().includes("tiger") &&
          <Image src="/triumph.png" alt="Logo" width={60} height={40} className="w-15 h-10" />
        }

        {indexRecord?.fileUrl && (
          <p className="mt-2 text-center">
            <a
              href={indexRecord.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
              download
            >
              Open manual
            </a>
          </p>
        )}
        <QueryInput indexName={indexName} />
      </div>
    </div >
  );
}
