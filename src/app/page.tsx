import ChatSelection from "./components/ChatSelection";

export default function Home() {
  return (
    <div className="flex flex-1 h-full flex-col items-center justify-center">
      <div className=" flex flex-col flex-1 w-full max-w-xl bg-white rounded-xl shadow-lg p-8 items-center space-y-4">
        <h1 className="text-2xl text-black drop-shadow-lg">
          AI Powered Content
        </h1>

        <ChatSelection />
      </div>
    </div>
  );
}
