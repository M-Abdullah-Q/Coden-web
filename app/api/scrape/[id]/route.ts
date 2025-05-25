import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import TurndownService from "turndown";

interface TestType {
  input: string;
  output: string;
}

interface DetailsType {
  error?: string;
  title: string;
  timeLimit: string;
  memoryLimit: string;
  description: string;
  inputDescription: string;
  outputDescription: string;
  tests: TestType[];
}

export async function GET( req: NextRequest, { params }: { params: Promise<{ id: string }> })  {
  try {
    const searchParams = req.nextUrl.searchParams;
    const { id } = await params;
    const ongoing = searchParams.get("ongoing") === "true";

    const probSeturl = `https://codeforces.com/problemset/problem/${id.slice(0, -1)}/${id.slice(-1).toUpperCase()}`;
    const contestUrl = `https://codeforces.com/contest/${id.slice(0, -1)}/problem/${id.slice(-1).toUpperCase()}`;
    const url = ongoing ? contestUrl : probSeturl;
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for many hosting platforms
    });
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    });

    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Convert TurndownService to a string to be used inside evaluate()
    // const TurndownServiceStr = TurndownService.toString();

    const details = await page.evaluate(() => {

        function wrapMathWithKatexDelimiters(html: string): string {
          const div = document.createElement("div");
          div.innerHTML = html;
      
          div.querySelectorAll(".tex-math").forEach((el) => {
            const latex = el.textContent?.trim() || "";
            // Use block math for centered formulas, inline otherwise
            const wrapper = document.createElement("span");
            wrapper.innerHTML = `\\(${latex}\\)`; // or use $$...$$ if it's block-level
            el.replaceWith(wrapper);
          });
      
          return div.innerHTML;
        }
      
        // const TurndownService = eval(`(${TurndownServiceStr})`);
        // const turndownService = new TurndownService();

        const problemStatement = document.querySelector(".problem-statement");
        if (!problemStatement) {
          return { error: "Problem statement not found" };
        }

        const titleElement = problemStatement.querySelector(".title");
        const timeLimitElement = problemStatement.querySelector(".header .time-limit");
        const memoryLimitElement = problemStatement.querySelector(".header .memory-limit");

        const rawDescription = problemStatement.children[1]?.innerHTML || "Description not found";
        const descriptionHTML = rawDescription;
        
        const inputDescriptionHTML = problemStatement.querySelector(".input-specification")?.innerHTML || "Input description not found";
        const outputDescriptionHTML = problemStatement.querySelector(".output-specification")?.innerHTML || "Output description not found";

        // Extract sample tests
        const sampleTestsNode = document.querySelector(".sample-tests");
        let tests: TestType[] = [];

        const testNode = sampleTestsNode?.querySelector(".sample-test");
        if(testNode?.children && testNode?.children.length > 2){
            return {
                error : 'Depricated/Not Found'
            }
        }

        // let singleFlag = true;
        // if(!inputDescriptionHTML.includes('Each test contains multiple test cases')) singleFlag = false;

        if (sampleTestsNode) {
            const inputNodes = sampleTestsNode.querySelectorAll('.input pre');
            const outputNodes = sampleTestsNode.querySelectorAll('.output pre');

            let inputMap = new Map();
            let outputArray: string[] = [];

            

            // Extract and group input lines
            inputNodes.forEach((inputNode) => {
                const inputDivs = inputNode.querySelectorAll('div');

                inputDivs.forEach((div) => {
                    let className = div.className;
                    let match = className.match(/test-example-line-(\d+)/);
                    if (!match) return;

                    let testCaseIndex = parseInt(match[1], 10);
                    if (testCaseIndex === 0) return; //Ignoring the 0th one cz its count

                    let text = div.textContent?.trim();
                    if (!inputMap.has(testCaseIndex)) {
                        inputMap.set(testCaseIndex, []);
                    }
                    inputMap.get(testCaseIndex).push(text);
                });
            });

            // Extract output lines
            outputNodes.forEach((outputNode) => {
                let outputLines : string[] = []
                outputLines = outputNode.textContent?.trim().split("\n") || [];
                outputArray.push(...outputLines);
            });

            // Construct test cases by aligning inputs and outputs
            let outputIndex = 0;
            inputMap.forEach((inputLines, testCaseIndex) => {
                let expectedOutput = outputArray[outputIndex] || "Output not found";
                tests.push({
                    input: inputLines.join("\n"),
                    output: expectedOutput
                });
                outputIndex++;
            });
        }

        return {
          title: titleElement?.textContent?.trim(),
          timeLimit: timeLimitElement?.textContent?.slice(19).trim() || "Time limit not found",
          memoryLimit: memoryLimitElement?.textContent?.slice(21).trim() || "Memory limit not found",
          description: descriptionHTML,
          inputDescription: inputDescriptionHTML,
          outputDescription: outputDescriptionHTML,
          tests,
        };
      },
    );

    await browser.close();

    if(details.error){
        return NextResponse.json({error : details.error},{status:404});
    }

    // Convert extracted HTML content to Markdown
    const turndownService = new TurndownService();
    // turndownService.addRule("mathjax", {
    //   filter: (node) => node.tagName === "SCRIPT" && (node as HTMLScriptElement).type === "math/tex",
    //   replacement: (content, node) => `$$${node.textContent}$$`, // LaTeX format
    // });

    const modDetails = {
      title: details.title,
      timeLimit: details.timeLimit,
      memoryLimit: details.memoryLimit,
      description: details.description,
      inputDescription: details.inputDescription,
      outputDescription: details.outputDescription,
      tests: details.tests,
    };

    return NextResponse.json(modDetails, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
