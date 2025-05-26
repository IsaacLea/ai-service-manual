import ChatSelection from "./components/ChatSelection";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">

      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 items-center flex flex-col space-y-4">

        <h1 className="text-2xl text-black drop-shadow-lg">
          AI Powered Content
        </h1>

        <ChatSelection />
      </div>
    </div>
  );
}
