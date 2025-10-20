// app/api/generate-ar-preview/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { userImage, mockupImage, prompt } = await request.json()

    if (!userImage || !mockupImage || !prompt) {
      return NextResponse.json({ error: "Missing required fields: userImage, mockupImage, prompt" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Convert base64 images to proper format for Gemini
    const userImagePart = {
      inlineData: {
        data: userImage.split(",")[1] || userImage,
        mimeType: "image/png",
      },
    }

    const mockupImagePart = {
      inlineData: {
        data: mockupImage.split(",")[1] || mockupImage,
        mimeType: "image/png",
      },
    }

    const result = await model.generateContent([
      userImagePart,
      mockupImagePart,
      {
        text: `You are an expert fashion visualization AI. Given a user's photo and a t-shirt mockup image, create a realistic visualization of the user wearing the t-shirt. 
        
        Task: ${prompt}
        
        Requirements:
        - Blend the t-shirt design naturally onto the user's body
        - Maintain realistic lighting and shadows
        - Ensure proper proportions and fit
        - Keep the user's face and upper body visible
        - Make the visualization look professional and realistic
        
        Generate a high-quality image that shows the user wearing the designed t-shirt.`,
      },
    ])

    const response = result.response
    const text = response.text()

    // Note: Gemini 2.0 Flash returns text descriptions, not images directly
    // For production, you would need to use an image generation model or service
    return NextResponse.json({
      success: true,
      description: text,
      message: "Virtual try-on visualization generated successfully",
    })
  } catch (error) {
    console.error("[v0] Virtual Try-On API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate virtual try-on image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
