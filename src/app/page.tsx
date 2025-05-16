
import ChatSelection from "./components/ChatSelection";
import Image from "next/image";

export default function Home() {

  return (
    <div className="grid justify-items-center min-h-screen">
      <header className="row-start-1 mb-4 flex items-center space-x-4">
        <Image src="/triumph.png" alt="Triumph Logo" width={60} height={40} className="w-15 h-10" />
        <h1 className="text-2xl font-bold">Tiger 900 Service Manual</h1>
      </header>

      <main className="w-full sm:w-100">
        <ChatSelection />
      </main>
    </div >
  );
}
