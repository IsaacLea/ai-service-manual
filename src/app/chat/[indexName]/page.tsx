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
    <div className="min-h-screen flex flex-col items-center justify-center">

      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 justify-center flex flex-col items-center space-y-4">
        <h1 className="text-xl font-extrabold text-black drop-shadow-lg">

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
        <QueryInput indexName={indexName} />
      </div>
    </div >
  );
}
