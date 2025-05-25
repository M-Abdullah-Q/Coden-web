"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EditorProps } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useCodeContext } from "../providers/CodeProvider";
import { useQuestionContext } from "@/providers/QuestionProvider";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
}) as React.FC<EditorProps>;

const CodeEditor = () => {
  const { theme } = useTheme();
  const {
    language,
    functions,
    boilerplates,
    setBoilerplates,
    code,
    setCode,
    setFullBoilerplates,
  } = useCodeContext();
  // const { inputDescription, outputDescription, title } = useQuestionContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCode(functions?.[language] || '');

  }, [language, functions]);

  // useEffect(() => {
  //   async function getBoiler(title: string | null, inputDesc: string | null, outputDesc: string | null) {
  //     if (!title || !inputDesc || !outputDesc) return;

  //     try {
  //       setLoading(true);
  //       const res = await axios.post("/api/generator", {
  //         title,
  //         inputDescription: inputDesc,
  //         outputDescription: outputDesc,
  //       });

  //       const { boilers, fullBoilers, funcs } = res.data;
  //       setBoilerplates(boilers);
  //       setFunctions(funcs);
  //       setFullBoilerplates(fullBoilers);
  //     } catch (error) {
  //       console.error("Error getting from generator:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   if (!isDefault && !functions) {
  //     getBoiler(title, inputDescription, outputDescription);
  //     console.log("switched to ai");
  //   }

  //   // setCode(functions?.[language] || defaultCode?.[language]);
  //   if (isDefault) {
  //     try {
  //       const stored = localStorage.getItem("uploadedCode");
  //       const uploadedCode = stored ? JSON.parse(stored) as Record<string, string> : null;
  
  //       if (uploadedCode && uploadedCode[language]) {
  //         setCode(uploadedCode[language]);
  //       } else {
  //         setCode(defaultCode?.[language] || "");
  //       }
  //     } catch (err) {
  //       console.error("Failed to parse uploadedCode from localStorage", err);
  //       setCode(defaultCode?.[language] || "");
  //     }
  //   } else {
  //     setCode(functions?.[language] || "");
  //     // getBoiler(title, inputDescription, outputDescription);
  //     console.log("switched to ai");
  //   }
  // }, [isDefault,language]);

  return (
    <div className="relative">
      {loading ? (
        <Skeleton className="w-full h-[50vh] rounded-md" />
      ) : (
        <MonacoEditor
          height="50vh"
          defaultLanguage="javascript"
          language={language}
          value={code}
          onChange={(newCode: any) => setCode(newCode || "")}
          theme={theme === "dark" ? "vs-dark" : "birds-of-paradise"}
          options={{
            minimap: {
              enabled: false,
            },
          }}
        />
      )}
    </div>
  );
};

export default CodeEditor;
