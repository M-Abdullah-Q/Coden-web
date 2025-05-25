"use client"
import { createContext, ReactNode, useState, useContext } from "react";

interface ResultContextType  {
    result: boolean;
    setResult: (result : boolean) => void;
    exec: boolean;
    setExec: (loading: boolean) => void;
    results: ResultsType | null;
    setResults: (results: ResultsType | null) => void
    tokens: string | null;
    setTokens: (tokens: string | null) => void;
};

interface ResultsType {
    stdout: string[] | null,
    statuses: number[] | null,
    stderr : string[] | null
}

const ResultContext = createContext<ResultContextType | undefined>(undefined);

// result false loading false - nothing to show
// result false loading true - skeleton
// result true - result

//adjust the type of results to accomodate the required stdout

export function ResultProvider({children}: {children : ReactNode}){
    const [result,setResult] = useState<boolean>(false);
    const [exec,setExec] = useState<boolean>(false);
    const [results,setResults] = useState<ResultsType | null>(null);
    const [tokens, setTokens] = useState<string | null>(null);

    return (
        <ResultContext.Provider
            value={{result,setResult, exec, setExec, results, setResults, tokens, setTokens}}
        >
            {children}
        </ResultContext.Provider>
    )
}

export function useResultContext(){
    const context = useContext(ResultContext);
    if (!context) {
        throw new Error("useResultContext must be used within a ResultProvider");
    }
    return context;
}
