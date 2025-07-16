import { Header } from "@/components/header";
import { CodeExecutorClient } from "@/components/code-executor-client";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        <CodeExecutorClient />
      </main>
    </div>
  );
}
