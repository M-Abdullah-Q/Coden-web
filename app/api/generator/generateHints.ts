import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { FullBoilerplateGenerator } from "./fullBoilerplateGenerator";
import { BoilerplateGenerator } from "./boilerplateGenerator";
import { FunctionGenerator } from "./functionGenerator";

const API_KEY = process.env.GOOGLE_API_KEY;

export async function handler (req: NextRequest) {
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Method Not Allowed" },{status:405});
    }
  
    const body = await req.json();
  
    const { title, inputDescription, outputDescription, description } = body;
  
    if (!inputDescription || !outputDescription) {
      return NextResponse.json({ error: "Input and output descriptions are required." },{status:400});
    }
  
  //   console.log('recieved description')
  
    const genAI = new GoogleGenerativeAI(API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
    const prompt = `
Task:
You are a helpful and patient teacher, explaining a coding problem to a student. Your goal is to guide them to the solution, not just give it to them. Provide three hints to help the student solve the problem. The hints should be progressively more explanatory, starting with a very general suggestion and becoming more specific with each subsequent hint.

Here is the problem description:

Title: ${title},
Description: ${description}
Input Description: ${inputDescription}
Output Description: ${outputDescription}

Respond in the following JSON format:

{
  "hints": [
    {
      "level": 1,
      "hint": "[Hint 1: A very general suggestion to get started]"
    },
    {
      "level": 2,
      "hint": "[Hint 2: A more specific clue, building on Hint 1]"
    },
    {
      "level": 3,
      "hint": "[Hint 3: The most detailed guidance, but still encouraging the student to solve it]"
    }
  ]
}`;
  
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
        const res = jsonResponse;
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