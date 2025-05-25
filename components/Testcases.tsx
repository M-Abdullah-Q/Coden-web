"use client";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Skeleton } from "./ui/skeleton";

interface Test{
  input: string,
  output: string 
}

const Testcases = ({tests}:{tests: Test[]}) => {

    return(
      <Tabs defaultValue="test-0" className="h-[250px] overflow-hidden">
        <div className="relative">
          <div className="overflow-x-auto whitespace-nowrap scrollbar-none rounded-lg" style={{ 
            WebkitOverflowScrolling: 'touch', 
            msOverflowStyle: 'none', 
            scrollbarWidth: 'none' 
          }}>
            <TabsList className="flex space-x-2 min-w-max">
              {tests.map((_, index) => (
                <TabsTrigger key={index} value={`test-${index}`} className="text-sm px-4">
                  Test {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
        <div className="mt-4 max-h-[180px] overflow-y-auto whitespace-nowrap scrollbar-none rounded-lg" style={{ 
            WebkitOverflowScrolling: 'touch', 
            msOverflowStyle: 'none', 
            scrollbarWidth: 'none' 
          }}>
          {tests.map((test, index) => (
            <TabsContent key={index} value={`test-${index}`}>
              <div className="p-4 rounded-md bg-muted border border-border">
                <p className="font-semibold text-sm">Input:</p>
                <textarea
                  value={test.input}
                  readOnly
                  className="w-full h-[80px] bg-background text-foreground p-2 rounded-md font-mono border border-border resize-none"
                />
                <p className="font-semibold text-sm mt-2">Expected Output:</p>
                <textarea 
                  className="w-full h-[40px] bg-background text-foreground p-2 rounded-md font-mono border border-border flex items-center resize-none"
                  readOnly
                  value={test.output}
                >
                </textarea>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    )
}

export default Testcases;