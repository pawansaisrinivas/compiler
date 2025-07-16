'use client';

import { useState, useTransition } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from 'lucide-react';
import { runCodeAnalysis, runCodeExecution } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import type { AnalyzeCodeForErrorsOutput } from '@/ai/flows/code-error-check';
import { OutputDisplay } from './output-display';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const languages = [
  { value: 'python', label: 'Python' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
];

const starterCode: Record<string, string> = {
  python: 'def hello_world():\n    print("Hello, World!")\n# Missing closing parenthesis to trigger AI error check\nhello_world(',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n")\n    return 0;\n}', // Missing semicolon
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl\n    return 0;\n}', // Missing semicolon
  java: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!")\n    }\n}', // Missing semicolon
};

export function CodeExecutorClient() {
  const [language, setLanguage] = useState(languages[0].value);
  const [code, setCode] = useState(starterCode[languages[0].value]);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeCodeForErrorsOutput | null>(null);
  const [output, setOutput] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    setCode(starterCode[value]);
    setAnalysisResult(null);
    setOutput('');
  };

  const handleRunCode = () => {
    startTransition(async () => {
      setOutput('');
      setAnalysisResult(null);
      const [analysis, execution] = await Promise.all([
          runCodeAnalysis({ code, language }),
          runCodeExecution({ code, language })
      ]);

      if ('error' in analysis) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: analysis.error,
        });
        setAnalysisResult(null);
      } else {
        setAnalysisResult(analysis);
      }
      
      if ('error' in execution) {
        toast({
            variant: 'destructive',
            title: 'Execution Error',
            description: execution.error,
        });
        setOutput('');
      } else {
          setOutput(execution.output);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-1 p-4 md:p-6 overflow-hidden">
      <Card className="flex flex-col overflow-hidden shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between p-3 border-b bg-card">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px] focus:ring-accent">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleRunCode} disabled={isPending} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Run
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder="Enter your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full resize-none font-mono text-base border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 p-4 bg-card"
              spellCheck="false"
            />
        </CardContent>
      </Card>
      <ScrollArea className="h-full">
         <div className="pr-2">
            <OutputDisplay isLoading={isPending} output={output} analysis={analysisResult} />
         </div>
      </ScrollArea>
    </div>
  );
}
