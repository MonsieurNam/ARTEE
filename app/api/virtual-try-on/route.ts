// app/api/virtual-try-on/route.ts

import { NextResponse } from "next/server"

// Helper function to wait for some time
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function POST(request: Request) {
  try {
    const { userImage, mockupImage } = await request.json()

    if (!userImage || !mockupImage) {
      return NextResponse.json(
        { error: "Thiếu ảnh người dùng hoặc ảnh thiết kế" },
        { status: 400 },
      )
    }

    const startResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "e9f29a052d91476f5b49435887ea3d8a55403a4667a38750a300263fad70e736",
        input: {
          human_img: userImage,
          garment_img: mockupImage,
          prompt: "a photo of a model",
        },
      }),
    })

    const prediction = await startResponse.json()

    if (startResponse.status !== 201) {
      return NextResponse.json({ error: prediction.detail }, { status: 500 })
    }

    let generatedImageUrl = null
    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await sleep(1000)
      const pollResponse = await fetch(prediction.urls.get, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      })
      const pollResult = await pollResponse.json()
      if (pollResult.status === "succeeded") {
        generatedImageUrl = pollResult.output[0]
        break
      } else if (pollResult.status === "failed") {
        return NextResponse.json({ error: "Quá trình tạo ảnh thất bại" }, { status: 500 })
      }
    }

    return NextResponse.json({ imageUrl: generatedImageUrl })
  } catch (error) {
    console.error("[VIRTUAL_TRY_ON_API_ERROR]", error)
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 })
  }
}