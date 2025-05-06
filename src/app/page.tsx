

import QueryInput from "./components/QueryInput";

export default function Home() {
  return (
    <div className="grid justify-items-center min-h-screen sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="row-start-1 mb-4">
        <h1 className="text-2xl font-bold">Tiger 900 Service Manual</h1>
      </header>

      <main>
        <QueryInput />
      </main>
    </div>
  );
}
