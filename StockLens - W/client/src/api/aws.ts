import axios from "axios";

const API_URL =
  "https://8neoa7izbf.execute-api.us-east-2.amazonaws.com/Prod/chat";

export async function sendMessageToAgent(
  message: string,
  sessionId: string = "web-session"
) {
  try {
    const response = await axios.post(
      API_URL,
      {
        user_query: message,
        session_id: sessionId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.response;
  } catch (err: any) {
    console.error("API Error:", err);
    return "Error contacting agent.";
  }
}