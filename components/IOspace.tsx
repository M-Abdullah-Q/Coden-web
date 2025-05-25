"use client";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useQuestionContext } from "@/providers/QuestionProvider";
import Testcases from "./Testcases";
import TestResult from "./TestResults";
import { useResultContext } from "@/providers/ResultProvider";
import { useEffect, useState } from "react";

const IOspace = () => {
  const { tests } = useQuestionContext();
  const { exec } = useResultContext();
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if(exec){
      setReloadKey(reloadKey+1);
    }
  }, [exec])

  return (
    <Card key={reloadKey} className="p-6 bg-background text-foreground shadow-md rounded-lg">
      <Tabs defaultValue={exec? "testResults" : "testCases"} className="w-full">
        {/* Tab buttons */}
        <TabsList className="flex space-x-2">
          <TabsTrigger value="testCases">Test Cases</TabsTrigger>
          <TabsTrigger value="testResults">Test Results</TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="testCases">
          <Testcases tests={tests} />
        </TabsContent>

        <TabsContent value="testResults">
          <TestResult tests={tests} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default IOspace;
