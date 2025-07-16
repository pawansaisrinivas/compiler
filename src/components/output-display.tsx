'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { AnalyzeCodeForErrorsOutput } from "@/ai/flows/code-error-check";
import { AlertTriangle, Code, Terminal } from "lucide-react";

type OutputDisplayProps = {
  isLoading: boolean;
  output: string;
  analysis: AnalyzeCodeForErrorsOutput | null;
};

export function OutputDisplay({ isLoading, output, analysis }: OutputDisplayProps) {

  const hasErrors = analysis && analysis.errors.length > 0;

  if (isLoading) {
    return <OutputSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 duration-500">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Terminal className="h-5 w-5" />
            Console Output
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md text-sm text-foreground overflow-x-auto">
            <code>{output || "No output yet. Click 'Run' to execute your code."}</code>
          </pre>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <AlertTriangle className={`h-5 w-5 ${hasErrors ? 'text-destructive' : 'text-green-500'}`} />
            AI Error Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysis && hasErrors ? (
            <Accordion type="single" collapsible className="w-full">
              {analysis.errors.map((error, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-left hover:no-underline data-[state=open]:text-primary">
                    <div className="flex items-start text-left gap-3">
                      <Code className="h-4 w-4 mt-1 text-destructive shrink-0" />
                      <span className="font-semibold">{error.message}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2 pl-7">
                    <div>
                      <p className="font-semibold mb-1 text-muted-foreground">Location:</p>
                      <p className="text-sm">{error.location}</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1 text-muted-foreground">Suggested Fix:</p>
                      <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                        <code className="text-foreground">{error.suggestion}</code>
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-sm text-muted-foreground">
              {analysis ? "No potential errors found. Looks good!" : "Run code to start analysis."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OutputSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
