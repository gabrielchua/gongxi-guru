import { NextResponse } from "next/server"
import { retry } from "@/app/utils/retry"

// Track token request metrics
let tokenRequestCount = 0
let tokenErrorCount = 0

async function getOpenAIToken() {
  tokenRequestCount++
  
  try {
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "verse",
      }),
    })

    if (!response.ok) {
      tokenErrorCount++
      const errorText = await response.text()
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    if (!data.client_secret?.value) {
      tokenErrorCount++
      throw new Error("Invalid token structure received from OpenAI")
    }

    return data
  } catch (error) {
    tokenErrorCount++
    throw error
  }
}

export async function GET() {
  try {
    // Use retry utility for token fetching
    const data = await retry(getOpenAIToken, {
      maxAttempts: 3,
      delayMs: 1000,
      backoff: true
    })

    // Add monitoring headers
    const headers = new Headers({
      'X-Token-Request-Count': tokenRequestCount.toString(),
      'X-Token-Error-Count': tokenErrorCount.toString(),
    })

    return NextResponse.json(data, { headers })
  } catch (error) {
    console.error("All retry attempts failed:", error)
    return NextResponse.json({ 
      error: "Service temporarily unavailable. Please try again later.",
      details: error.message 
    }, { 
      status: 500,
      headers: {
        'X-Token-Request-Count': tokenRequestCount.toString(),
        'X-Token-Error-Count': tokenErrorCount.toString(),
      }
    })
  }
}

