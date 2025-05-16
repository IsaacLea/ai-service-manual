import ChatSelection from "./components/ChatSelection";
//
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center justify-center">
      <header className="mb-8 flex flex-col items-center space-y-4">

        <h1 className="text-4xl font-extrabold text-blue-800 drop-shadow-lg">
          AI Powered Content
        </h1>
        <p className="text-lg text-blue-700 font-medium">
          Your smart motorcycle service assistant
        </p>
      </header>
      <main className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
        <ChatSelection />
      </main>
    </div>
  );
}
