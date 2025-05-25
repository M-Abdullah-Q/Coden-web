import { GoogleGenerativeAI } from "@google/generative-ai";
import { handler as generateHandler } from "./generateCode";
import { handler as generateHintsHandler } from "./generateHints";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_API_KEY;

// export async function POST(req: NextRequest) {
//   return generateHandler(req);
// }

export async function POST(req: NextRequest) {
  return generateHintsHandler(req);
}

// import { OpenAI } from "openai";
// import { NextRequest, NextResponse } from "next/server";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function POST(req: NextRequest) {
//   if (req.method !== "POST") {
//     return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
//   }

//   const body = await req.json();
//   const { inputDescription, outputDescription } = body;

//   if (!inputDescription || !outputDescription) {
//     return NextResponse.json(
//       { error: "Input and output descriptions are required." },
//       { status: 400 }
//     );
//   }

//   const prompt = `
//   Input Description: ${inputDescription}
//   Output Description: ${outputDescription}
//   Guidelines:
//     1. Case Sensitivity:
//       - All outputs in the boilerplate should be converted to lowercase.

//     2. Function Naming:
//       - Extract the function name from the Title, excluding numbering (e.g., "A.", "B.", etc.).
//       - Use camelCase naming style.

//     3. Function Signatures:
//       - Exclude "Each test case contains multiple test cases" from function signatures.
//       - Use T for test cases.

//     4. Response Handling:
//       - If the output is "yes" or "no", use boolean values (true/false). Convert them back to "yes" or "no" in the boilerplate.
//       - In case of an array response, have the user return a List or array (equivalent in each language) and then print out the array in the boilerplates.

//     5. Main Method Naming:
//       - C++: The main method should be int main().
//       - Java: The main method should be public class Main.

//   JSON Structure:
//   The response should contain three primary objects:
//     1. "boilers" – Full boilerplate implementations in each language, using "###USER CODE HERE###" as a placeholder for the function implementation. Only one test case is executed at a time.
//     2. "fullBoilers" – Complete programs including multiple test cases. Function signatures should be included.
//     3. "funcs" – Function skeletons with a "// code here" comment.
  
//   Response format:
//   {
//     "boilers": { "cpp": "...", "java": "...", "javascript": "...", "python": "..." },
//     "fullBoilers": { "cpp": "...", "java": "...", "javascript": "...", "python": "..." },
//     "funcs": { "cpp": "...", "java": "...", "javascript": "...", "python": "..." }
//   }
//   `;

//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [{ role: "system", content: "You are a helpful assistant that generates structured JSON responses." },
//                  { role: "user", content: prompt }],
//       response_format: {type : "json_object"}
//     });

//     const text = completion.choices[0].message.content ?? "";

//     try {
//       const jsonResponse = JSON.parse(text);
//       return NextResponse.json(jsonResponse, { status: 200 });
//     } catch (parseError) {
//       console.error("Error parsing JSON response:", parseError);
//       console.log("Raw response text:", text);
//       return NextResponse.json({ error: "Failed to parse JSON response from Generator." }, { status: 500 });
//     }
//   } catch (error) {
//     console.error("Error generating content:", error);
//     return NextResponse.json({ error: "Failed to generate response from Generator." }, { status: 500 });
//   }
// }
