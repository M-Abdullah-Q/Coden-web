"use client";
import { Card } from "@/components/ui/card";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuestionContext } from "@/providers/QuestionProvider";
import { useEffect, useState, useRef, Suspense } from "react";
import axios from "axios";
import { useCodeContext } from "@/providers/CodeProvider";
import { MultiStepLoader as Loader } from "./ui/multi-step-loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "katex/dist/katex.min.css";
import katex from "katex";

const scrapeUrl = process.env.NEXT_PUBLIC_SCRAPE_URL;

// Separate component that uses useSearchParams
const ProblemStatementContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const descriptionRef = useRef(null);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  const loadingStates = [
    { text: "Retrieving problem statement..." },
    { text: "Loading test cases..." },
    { text: "Generating boilerplate code..." },
  ];

  const {
    title,
    setTitle,
    description,
    setDescription,
    setTimeLimit,
    setMemoryLimit,
    inputDescription,
    setInputDescription,
    outputDescription,
    setOutputDescription,
    setTests,
    setOngoing,
  } = useQuestionContext();

  const { setBoilerplates, setFullBoilerplates } = useCodeContext();

  // Ensure component is mounted before accessing searchParams
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to properly render LaTeX in HTML content
  const renderMathContent = (content: any) => {
    if (!content) return "";

    let sanitizedContent = content
      .replace(/\$(.*?)\$/g, (match: any, p1: any) => {
        try {
          const rendered = katex.renderToString(p1, {
            throwOnError: false,
            displayMode: false,
          });
          return rendered;
        } catch (error) {
          console.error("KaTeX error:", error);
          return match;
        }
      })
      .replace(/\$\$(.*?)\$\$/g, (match: any, p1: any) => {
        try {
          const rendered = katex.renderToString(p1, {
            throwOnError: false,
            displayMode: true,
          });
          return rendered;
        } catch (error) {
          console.error("KaTeX error:", error);
          return match;
        }
      });

    return sanitizedContent;
  };

  useEffect(() => {
    if (!mounted) return;

    const qId = searchParams.get("q");
    const ongoing = searchParams.get("ongoing");

    console.log("Component mounted, qId:", qId, "ongoing:", ongoing);
    console.log("Full search params:", searchParams.toString());

    if (!qId) {
      console.log("No qId found, showing modal");
      setLoading(false);
      setShowModal(true);
      return;
    }

    async function loadQuestion() {
      try {
        const apiUrl = `${scrapeUrl}?id=${qId}&ongoing=${ongoing}`;
        console.log(`Making API request to: ${apiUrl}`);

        const res = await axios.get(apiUrl);
        console.log("API response received:", res.status);

        const data = res.data;

        setTitle(data.title || "Problem Title");
        setDescription(data.description || "");
        setTimeLimit(data.timeLimit || "");
        setMemoryLimit(data.memoryLimit || "");
        setTests(data.tests || []);
        setInputDescription(data.inputDescription || "");
        setOutputDescription(data.outputDescription || "");
        setOngoing(ongoing === "true");

        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching question:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);

        setLoading(false);
        setShowModal(true);
      }
    }

    loadQuestion();
  }, [mounted, searchParams]);

  // Don't render anything until mounted
  if (!mounted) {
    return <ProblemStatementFallback />;
  }

  const processedDescription = renderMathContent(description);
  const processedInputDescription = renderMathContent(inputDescription);
  const processedOutputDescription = renderMathContent(outputDescription);

  return (
    <>
      <Card>
        <Loader
          loading={loading}
          loadingStates={loadingStates}
          loop={false}
        ></Loader>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>

          {/* Problem Description */}
          <div className="prose dark:prose-invert max-w-none mb-6">
            <div
              ref={descriptionRef}
              dangerouslySetInnerHTML={{ __html: processedDescription }}
            />
          </div>

          {/* Input Description */}
          {inputDescription && (
            <div className="mt-4">
              <div
                className="prose dark:prose-invert max-w-none"
                ref={inputRef}
                dangerouslySetInnerHTML={{ __html: processedInputDescription }}
              />
            </div>
          )}

          {/* Output Description */}
          {outputDescription && (
            <div className="mt-4">
              <div
                className="prose dark:prose-invert max-w-none"
                ref={outputRef}
                dangerouslySetInnerHTML={{ __html: processedOutputDescription }}
              />
              <div className="mt-6 text-sm text-muted-foreground italic">
                <p>
                  <strong>Note:</strong> We do not support variations like{" "}
                  <code>"YeS"</code>, <code>"yEs"</code>, etc. Please use exact
                  case-sensitive outputs as expected.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Modal for unsupported question */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Uh Oh</DialogTitle>
          </DialogHeader>
          <p>
            The requested question is not supported or unavailable. Please try
            again.
          </p>
          <div className="mt-4 text-sm text-gray-600">
            <p>Debug info:</p>
            <p>Question ID: {searchParams.get("q") || "Not found"}</p>
            <p>Ongoing: {searchParams.get("ongoing") || "false"}</p>
          </div>
          <Button onClick={() => router.push("/")}>Go to Home</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Loading fallback component
const ProblemStatementFallback = () => {
  return (
    <Card>
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Main component wrapped with Suspense
const ProblemStatement = () => {
  return (
    <Suspense fallback={<ProblemStatementFallback />}>
      <ProblemStatementContent />
    </Suspense>
  );
};

export default ProblemStatement;
