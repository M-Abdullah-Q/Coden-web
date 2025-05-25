import { NextRequest } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {

    // const tokenString = req.nextUrl.searchParams.get('tokenString');

    const { searchParams } = new URL(req.url);
    const tokenString = searchParams.get("tokens");

    if (!tokenString) {
        return new Response(`data: ${JSON.stringify({ error: "Missing tokenString parameter" })}\n\n`, {
            headers: { "Content-Type": "text/event-stream" },
        });
    }

    const stream = new ReadableStream({
        async start(controller) {
            try {
                const options = {
                    method: 'GET',
                    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
                    params: {
                        tokens: tokenString,
                        base64_encoded: 'true',
                        fields: '*',
                    },
                    headers: {
                        'x-rapidapi-key': process.env.X_RAPID_API_KEY || '',
                        'x-rapidapi-host': process.env.X_RAPID_API_HOST || '',
                    },
                };

                if (!options.headers["x-rapidapi-key"] || !options.headers["x-rapidapi-host"]) {
                    console.error("Missing API credentials");
                    controller.enqueue(`data: ${JSON.stringify({ error: "Missing API credentials" })}\n\n`);
                    controller.close();
                    return;
                }

                let statusFlag = false;
                let res;

                while (!statusFlag) {
                    const response = await axios.request(options);

                    if (!response.data || !response.data.submissions) {
                        console.error("Invalid response from API", response.data);
                        controller.enqueue(`data: ${JSON.stringify({ error: "Invalid API response" })}\n\n`);
                        controller.close();
                        return;
                    }

                    const submissionStatuses = response.data.submissions.map((sub: any) => parseInt(sub.status_id, 10));
                    const pendingSubmissions = submissionStatuses.filter((sub: any) => {return sub<=2});

                    if (pendingSubmissions.length === 0) {
                        res = {
                            statuses: submissionStatuses,
                            compile_output: response.data.submissions.map((sub: any) => atob(sub.compile_output)),
                            stdout: response.data.submissions.map((sub: any) => atob(sub.stdout)),
                            stderr: response.data.submissions.map((sub: any) => atob(sub.stderr))
                        };
                        statusFlag = true;
                        // console.log(response.data);
                    } else {
                        await new Promise((resolve) => setTimeout(resolve, 2000));
                    }
                }

                controller.enqueue(`data: ${JSON.stringify(res)}\n\n`);
                controller.close();
            } catch (error: any) {
                console.error("SSE Error:", error.message);
                controller.enqueue(`data: ${JSON.stringify({ error: error.message })}\n\n`);
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            Connection: "keep-alive",
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
        },
    });
}
