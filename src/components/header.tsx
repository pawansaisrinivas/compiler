import { Logo } from "@/components/icons";

export function Header() {
  return (
    <header className="p-4 border-b shrink-0">
      <div className="container mx-auto flex items-center gap-3">
        <Logo className="h-7 w-7 text-primary" />
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Code Executor
        </h1>
      </div>
    </header>
  );
}
