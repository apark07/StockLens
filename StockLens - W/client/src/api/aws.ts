

import axios from "axios";

const API_URL = "https://8neoa7izbf.execute-api.us-east-2.amazonaws.com/Prod/chat";

export async function sendMessageToAgent(
  message: string,
  sessionId: string = "web-session"
) {
  try {
    // Wrap the payload in "body" as a JSON string
    const payload = {
      body: JSON.stringify({
        user_query: message,
        session_id: sessionId,
      }),
    };

    console.log("📤 Sending request to API Gateway...", payload);

    const response = await axios.post(API_URL, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: false,
    });

    console.log("📥 Raw Axios response.data:", response.data);

    let body = response.data;
    if (body.body && typeof body.body === "string") {
      console.log("🔍 'body' is a string. Attempting JSON.parse...");
      body = JSON.parse(body.body);
      console.log("✅ Parsed body:", body);
    }

    return body.response ?? "Agent returned no response.";
  } catch (err: any) {
    console.error("API Error:", err);
    return "Error contacting agent.";
  }
}