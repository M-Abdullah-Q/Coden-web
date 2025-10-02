import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const id = searchParams.get("id") ?? "2170a";
  const ongoing = searchParams.get("ongoing") === "true";

  try {
    const data = await scrapeCodeforcesProblem(id, ongoing);

    if ("status" in data && data.status === 200) {
      return NextResponse.json(data, { status: 200 });
    } else if ("error" in data) {
      return NextResponse.json(
        { error: data.error },
        { status: data.status || 500 }
      );
    } else {
      return NextResponse.json(
        { error: "Unknown error occurred" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

interface TestType {
  input: string;
  output: string;
}

interface DetailsType {
  title: string | undefined;
  timeLimit: string | undefined;
  memoryLimit: string | undefined;
  description: string | undefined;
  inputDescription: string | undefined;
  outputDescription: string | undefined;
  tests: TestType[] | undefined;
  status: number | undefined;
}

interface ErrorType {
  error: string;
  status: number;
}

// Add a type for the page.evaluate return value that can include error
interface PageEvaluateResult extends Partial<DetailsType> {
  error?: string;
}

async function scrapeCodeforcesProblem(
  id: string,
  ongoing: boolean
): Promise<DetailsType | ErrorType> {
  try {
    const statQue: DetailsType = {
      title: "A. All Lengths Subtraction",
      timeLimit: "1 second",
      memoryLimit: "256 megabytes",
      description: `You are given a permutation∗
 p
 of length n
.

You must perform exactly one operation for each integer k
 from 1 up to n
 in that order:

Choose a subarray†
 of p
 of length exactly k
, and subtract 1 from every element in that subarray.
After completing all n
 operations, your goal is to have all elements of the array equal to zero.

Determine whether it is possible to achieve this.

∗
A permutation of length n
 is an array consisting of n
 distinct integers from 1
 to n
 in arbitrary order. For example, [2,3,1,5,4]
 is a permutation, but [1,2,2]
 is not a permutation (2
 appears twice in the array), and [1,3,4]
 is also not a permutation (n=3
 but there is 4
 in the array).

†
An array a
 is a subarray of an array b
 if a
 can be obtained from b
 by the deletion of several (possibly, zero or all) elements from the beginning and several (possibly, zero or all) elements from the end.
`,
      inputDescription: `
INPUT

Each test contains multiple test cases. The first line contains the number of test cases t
 (1≤t≤100
). The description of the test cases follows.

The first line contains the value n
 (1≤n≤100
) — the length of the permutation.

The second line contains p1,p2,…pn
 (1≤pi≤n
) — the permutation itself.`,
      outputDescription: `
OUTPUT
For each test case, output YES if it is possible to make all elements of the array p
 equal to 0
 after performing all the operations; otherwise, output NO.

You can output the answer in any case (upper or lower). For example, the strings "yEs", "yes", "Yes", and "YES" will be recognized as positive responses.
`,
      tests: [
        { input: "4\n1 3 4 2", output: "YES" },
        { input: "5\n1 5 2 4 3", output: "NO" },
        { input: "5\n2 4 5 3 1", output: "YES" },
        { input: "3\n3 1 2", output: "NO" },
      ],
      status: 200,
    };

    return statQue;

    const probSeturl = `https://codeforces.com/problemset/problem/${id.slice(
      0,
      -1
    )}/${id.slice(-1).toUpperCase()}`;

    const contestUrl = `https://codeforces.com/contest/${id.slice(
      0,
      -1
    )}/problem/${id.slice(-1).toUpperCase()}`;

    const url = ongoing ? contestUrl : probSeturl;

    let puppeteer: any;
    let args: any = ["--no-sandbox", "--disable-setuid-sandbox"];
    let launchOptions: any = {
      headless: true,
    };

    const isVercel = !!process.env.VERCEL_ENV;

    if (isVercel) {
      const chromium = (await import("@sparticuz/chromium")).default;
      puppeteer = await import("puppeteer-core");
      launchOptions = {
        ...launchOptions,
        args: chromium.args,
        executablePath: await chromium.executablePath(),
      };
    } else {
      puppeteer = await import("puppeteer");
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for many hosting platforms
    });
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    });

    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Remove async from page.evaluate() - it's not supported
    const details: PageEvaluateResult = await page.evaluate(() => {
      console.log("inside evaluate");
      function wrapMathWithKatexDelimiters(html: string): string {
        console.log("inside wrap katex");
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

      const problemStatement = document.querySelector(".problem-statement");
      if (!problemStatement) {
        return { error: "Problem statement not found" };
      }

      const titleElement = problemStatement.querySelector(".title");
      const timeLimitElement = problemStatement.querySelector(
        ".header .time-limit"
      );
      const memoryLimitElement = problemStatement.querySelector(
        ".header .memory-limit"
      );

      const rawDescription =
        problemStatement.children[1]?.innerHTML || "Description not found";
      const descriptionHTML = rawDescription;

      const inputDescriptionHTML =
        problemStatement.querySelector(".input-specification")?.innerHTML ||
        "Input description not found";
      const outputDescriptionHTML =
        problemStatement.querySelector(".output-specification")?.innerHTML ||
        "Output description not found";

      // Extract sample tests
      const sampleTestsNode = document.querySelector(".sample-tests");
      let tests: Array<{ input: string; output: string }> = [];

      const testNode = sampleTestsNode?.querySelector(".sample-test");
      if (testNode?.children && testNode?.children.length > 2) {
        return {
          error: "Depricated/Not Found",
        };
      }

      if (sampleTestsNode) {
        const inputNodes = sampleTestsNode.querySelectorAll(".input pre");
        const outputNodes = sampleTestsNode.querySelectorAll(".output pre");

        let inputMap = new Map<number, string[]>();
        let outputArray: string[] = [];

        // Extract and group input lines
        inputNodes.forEach((inputNode) => {
          const inputDivs = inputNode.querySelectorAll("div");

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
            inputMap.get(testCaseIndex)?.push(text || "");
          });
        });

        // Extract output lines
        outputNodes.forEach((outputNode) => {
          let outputLines: string[] = [];
          outputLines = outputNode.textContent?.trim().split("\n") || [];
          outputArray.push(...outputLines);
        });

        // Construct test cases by aligning inputs and outputs
        let outputIndex = 0;
        inputMap.forEach((inputLines, testCaseIndex) => {
          let expectedOutput = outputArray[outputIndex] || "Output not found";
          tests.push({
            input: inputLines.join("\n"),
            output: expectedOutput,
          });
          outputIndex++;
        });
      }

      return {
        title: titleElement?.textContent?.trim(),
        timeLimit:
          timeLimitElement?.textContent?.slice(19).trim() ||
          "Time limit not found",
        memoryLimit:
          memoryLimitElement?.textContent?.slice(21).trim() ||
          "Memory limit not found",
        description: descriptionHTML,
        inputDescription: inputDescriptionHTML,
        outputDescription: outputDescriptionHTML,
        tests,
      };
    });

    await browser.close();

    if (details.error) {
      return { error: details.error ?? "Unknown error", status: 404 };
    }

    const modDetails: DetailsType = {
      title: details.title,
      timeLimit: details.timeLimit,
      memoryLimit: details.memoryLimit,
      description: details.description,
      inputDescription: details.inputDescription,
      outputDescription: details.outputDescription,
      tests: details.tests,
      status: 200,
    };

    return modDetails;
  } catch (error) {
    console.error("Error:", error);
    return { error: JSON.stringify(error), status: 500 };
  }
}
