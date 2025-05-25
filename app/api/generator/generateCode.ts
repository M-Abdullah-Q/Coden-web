import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { FullBoilerplateGenerator } from "./fullBoilerplateGenerator";
import { BoilerplateGenerator } from "./boilerplateGenerator";
import { FunctionGenerator } from "./functionGenerator";

const API_KEY = process.env.GOOGLE_API_KEY;

export async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" },{status:405});
  }

  const body = await req.json();

  const { title, inputDescription, outputDescription } = body;

  if (!inputDescription || !outputDescription) {
    return NextResponse.json({ error: "Input and output descriptions are required." },{status:400});
  }

//   console.log('recieved description')

  const genAI = new GoogleGenerativeAI(API_KEY || '');
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
  Title: ${title}
  Input Description: ${inputDescription}
  Output Description: ${outputDescription}

  Task: 
      - Analyze the input and output descriptions carefully to determine the necessary input and output fields.
      - Identify the correct data types (e.g., integer, string, list of numbers, boolean, etc.) using the following type mapping.

Type Mapping Rules:
- Integer: "int"
- Long Integer:"long long"
- Floating Point: "double"
- String: "string"
- Boolean: "bool"
- Array of Integers: "vector<int>"
- Array of Long Integers: "vector<long long>"
- Array of Floats: "vector<double>"
- Array of Strings: "vector<string>"
- Array of Booleans: "vector<bool>"


      - Ignore the test cases input if present.
      - Avoid using "T" or "t" in input feild names.
      - Convert the title into a camelCase function name by removing numbers, special characters, and extra spaces.
      - The output must be in **JSON format** following the exact response structure below.

Response Format:
{
  "title": "<camelCase function name>",
  "inputs": [
    { "type": "<input type>", "name": "<input name>" },
    { "type": "<input type>", "name": "<input name>" }
  ],
  "outputs": [
    { "type": "<output type>", "name": "<output name>" }
  ]
}

Example:
For:
Title: "A. Sum of Two Numbers"
Input Description: "Two integers a and b."
Output Description: "An integer representing their sum."

Expected Response:
{
  "title": "sumOfTwoNumbers",
  "inputs": [
    { "type": "int", "name": "a" },
    { "type": "int", "name": "b" }
  ],
  "outputs": [
    { "type": "int", "name": "sum" }
  ]
}
`;

  try {
    // console.log('inside try');
    const result = await model.generateContent(prompt);
    // console.log('check 1');
    const response = await result.response;
    // console.log('check 2 ');
    
    let text = await response.text();
    text = text.replace(/^```json\s*/, "").replace(/```$/, "");

    try {
      const jsonResponse = JSON.parse(text);
      const {title, inputs, outputs} = jsonResponse;

      //further processing using the input and ouput description

      const fullBoilerGen = new FullBoilerplateGenerator(title, inputs, outputs);
      const boilerGen = new BoilerplateGenerator(title, inputs, outputs);
      const funcGen = new FunctionGenerator(title, inputs, outputs);

      const res = {
        fullBoilers : {
          "cpp" : fullBoilerGen.generateCpp(),
          "java" : fullBoilerGen.generateJava(),
          "javascript" : fullBoilerGen.generateJs(),
          "python" : fullBoilerGen.generatePython()
        },
        boilers : {
          "cpp" : boilerGen.generateCpp(),
          "java" : boilerGen.generateJava(),
          "javascript" : boilerGen.generateJs(),
          "python" : boilerGen.generatePython()
        },
        funcs : {
          "cpp" : funcGen.generateCpp(),
          "java" : funcGen.generateJava(),
          "javascript" : funcGen.generateJs(),
          "python" : funcGen.generatePython()
        }
      }



      return NextResponse.json(res,{status:200});
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      console.log("Raw response text:", text);
      return NextResponse.json({ error: "Failed to parse JSON response from Gemini API." },{status:500});
    }

  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate response from Gemini API." }, {status:500});
  }
}