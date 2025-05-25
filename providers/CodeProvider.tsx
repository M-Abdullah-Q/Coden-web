"use client";

import { createContext, ReactNode, useState, useContext, useEffect } from "react";

interface Language {
  value: string;
  label: string;
  id: string;
}

interface CodeContextType {
  languages: Language[];
  language: string;
  setLanguage: (lang: string) => void;
  languageId: string;
  setLanguageId: (langCode: string) => void;
  code: string ;
  setCode: (code: string ) => void;
  boilerplates: Record<string, string> | null;
  setBoilerplates: (boilerplates: Record<string,string> | null) => void;
  fullBoilerplates:  Record<string,string> | null;
  setFullBoilerplates: (fullBoilerplates: Record<string, string> | null) => void;
  functions: Record<string, string> | null;
  setFunctions: (boilerplates: Record<string,string> | null) => void;
  saveFunctions: () => void;
  resetFunctions: () => void;
  // functions: Record<string, string> | null;
  // setFunctions: (functions: Record<string,string> | null) => void;
  // isDefault: boolean;
  // setIsDefault: (isDefault: boolean) => void;
  // defaultCode: Record<string, string>;
  // setDefaultCode: (defaultCode : Record<string, string>) => void;
}

const languages: Language[] = [
  { value: "cpp", label: "C++", id: "54"},
  { value: "java", label: "Java", id: "91"},
  { value: "javascript", label: "JavaScript", id:"102"},
  { value: "python", label: "Python", id: "100"},
];

const defaultFunctions: Record<string, string> = {
  'cpp': `class Solution {
public:
    int solve() {
        
    }
};`,
  'java': `class solution {
  public static void solve(BufferedReader br) throws IOException {
    //use br.readLine to take inputs
  }
}`,
  'javascript': `class Solution {
  solve() {
    // Write your code here
  }
}
`,
  'python': `class Solution(object):
  def solve(self, answers):
`,
};

const defaultBoilerplates: Record<string, string> = {
  'cpp': `
#include <iostream>
#include <vector>
using namespace std;

###USER_CODE_HERE###;

int main() {
    Solution sol;
    sol.solve();

    return 0;
}`,
  'java': `
import static java.lang.Math.max;
import static java.lang.Math.min;
import static java.lang.Math.abs;
import java.io.*;
import java.util.*;

###USER_CODE_HERE###

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        solution.solve(br);  

        br.close();
    }
}`,
  'javascript': `
###USER_CODE_HERE###

function main() {
  const sol = new Solution();
  sol.solve();
}

main();`,
  'python': `
###USER_CODE_HERE###

def main():
    T = int(input())
    sol = Solution();
    for _ in range(T):
        sol.solve()

if __name__ == "__main__":
    main()`,
};

const defaultFullBoilerplates: Record<string, string> = {
  'cpp': `
#include <iostream>
#include <vector>
using namespace std;

###USER_CODE_HERE###;

int main() {
    int T;
    cin >> T;
    Solution sol;

    while (T--) {
        sol.solve();
    }

    return 0;
}`,
  'java': `
import static java.lang.Math.max;
import static java.lang.Math.min;
import static java.lang.Math.abs;
import java.io.*;
import java.util.*;

###USER_CODE_HERE###

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int T = Integer.parseInt(br.readLine());

        while (T-- > 0) {
            solution.solve(br);  
        }

        br.close();
    }
}`,
  'javascript': `
###USER_CODE_HERE###

function main() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let inputLines = [];
  rl.on('line', (line) => {
    inputLines.push(line);
  });

  rl.on('close', () => {
    let lineIndex = 0;
    const T = parseInt(inputLines[lineIndex++]);
    const sol = new Solution();

    for (let i = 0; i < T; i++) {
      // Assuming each test case might involve reading a line or more
      // You might need to adjust this depending on how inputs are structured
      sol.solve(inputLines[lineIndex++]); 
    }
  });
}

main();`,
  'python': `
###USER_CODE_HERE###

def main():
    T = int(input())
    sol = Solution();
    for _ in range(T):
        line = input()
        sol.solve(line)

if __name__ == "__main__":
    main()`,
};

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export function CodeProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("cpp");
  const [functions, setFunctions] = useState<Record<string,string> | null>(null);
  const [fullBoilerplates, setFullBoilerplates] = useState<Record<string,string> | null>(null);
  const [boilerplates, setBoilerplates] = useState<Record<string,string> | null>(null);
  const [languageId,setLanguageId] = useState("102");
  const [code,setCode] = useState<string>(defaultBoilerplates['cpp']);

  useEffect(() => {
    const storedFunctions = localStorage.getItem("functions");
    const storedBoilerplates = localStorage.getItem("boilerplates");
    const storedFullBoilerplates = localStorage.getItem("fullBoilerplates");
  
    const parsedFunctions = storedFunctions ? JSON.parse(storedFunctions) : defaultFunctions;
    setFunctions(parsedFunctions);
    if (!storedFunctions) {
      localStorage.setItem("functions", JSON.stringify(defaultFunctions));
    }
  
    const parsedBoilerplates = storedBoilerplates ? JSON.parse(storedBoilerplates) : defaultBoilerplates;
    setBoilerplates(parsedBoilerplates);
    if (!storedBoilerplates) {
      localStorage.setItem("boilerplates", JSON.stringify(defaultBoilerplates));
    }
  
    const parsedFullBoilerplates = storedFullBoilerplates ? JSON.parse(storedFullBoilerplates) : defaultFullBoilerplates;
    setFullBoilerplates(parsedFullBoilerplates);
    if (!storedFullBoilerplates) {
      localStorage.setItem("fullBoilerplates", JSON.stringify(defaultFullBoilerplates));
    }
  }, []);

  const saveFunctions = () => {
    if (!code) return;
    setFunctions((prev) => {
      const updated = { ...(prev || {}), [language]: code };
      localStorage.setItem("functions", JSON.stringify(updated));
      setCode(updated[language]);
      return updated;
    });
  };

  const resetFunctions = () => {
    setFunctions((prev) => {
      const updated = { ...(prev || {}), [language]: defaultFunctions[language]};
      localStorage.setItem("functions",JSON.stringify(updated));
      setCode(updated[language]);
      return updated;
    });
  }

  return (
    <CodeContext.Provider
      value={{ languages, language, setLanguage, languageId, setLanguageId, boilerplates, code, setCode, setBoilerplates, fullBoilerplates, setFullBoilerplates, saveFunctions, functions, setFunctions, resetFunctions}}
    >
      {children}
    </CodeContext.Provider>
  );
}

export function useCodeContext() {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error("useCodeContext must be used within a CodeProvider");
  }
  return context;
}
