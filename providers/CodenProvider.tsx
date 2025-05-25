import { ReactNode } from "react";
import { CodeProvider } from "./CodeProvider";
import { QuestionProvider } from "./QuestionProvider";
import { ResultProvider } from "./ResultProvider";

export default function CodenProvider({ children }: { children: ReactNode }) {
    return (
        <CodeProvider>
            <QuestionProvider>
                <ResultProvider>
                    {children}
                </ResultProvider>
            </QuestionProvider>
        </CodeProvider>
    );
}
