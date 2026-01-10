// app/api/virtual-try-on/route.ts
import { generateText } from 'ai';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Helper để xử lý chuỗi Base64 Data URI từ client.
 */
function parseDataUri(dataUri: string) {
  const content = dataUri.substring(5);
  const parts = content.split(',');
  if (parts.length < 2) {
    throw new Error('Định dạng Data URI không hợp lệ.');
  }
  const header = parts[0];
  const data = parts[1];
  const mediaType = header.split(';')[0] || 'image/png';
  const buffer = Buffer.from(data, 'base64');
  return { buffer, mediaType };
}

export async function POST(request: NextRequest) {
  try {
    const {
      userImage,
      mockupImage,
      productPose,
    } = await request.json();

    if (!userImage || !mockupImage || !productPose) {
      return NextResponse.json(
        { error: 'Thiếu userImage, mockupImage hoặc productPose' },
        { status: 400 },
      );
    }

    // 1. Xử lý ảnh đầu vào
    const parsedUserImage = parseDataUri(userImage);
    const parsedMockupImage = parseDataUri(mockupImage);

    // 2. Xây dựng "Prompt Thông minh" (Đã cập nhật để chống cắt ảnh)
    // Thay đổi chính nằm ở phần "GENERATION RULES"
    const smartPrompt = `
        You are an expert AI fashion visualization specialist in Fashion Inpainting.
        
        **INPUTS:**
        1. [Image 1]: User's photo (The person who will wear the clothes).
        2. [Image 2]: Garment photo (The standalone clothing item).
        3. Pose context: "${productPose}" (front/back).

        **TASK 1: SAFETY & VALIDATION**
        - Analyze [Image 1]. If it contains explicit nudity or is not a person, output text: "Lỗi: Ảnh không hợp lệ."
        - Check pose consistency. If User is '${productPose}' but garment is opposite, output text: "Lỗi: Hướng ảnh không khớp (Trước/Sau)."

        **TASK 2: VIRTUAL TRY-ON GENERATION**
        If validation passes, generate a photorealistic image where the user in [Image 1] is wearing the garment from [Image 2].

        **CRITICAL CONSTRAINTS (MUST FOLLOW):**
        1.  **NO CROPPING (ZERO TOLERANCE):** 
            -   The output image **MUST** have the **EXACT SAME ASPECT RATIO and COMPOSITION** as [Image 1].
            -   **DO NOT** zoom in on the torso. 
            -   **DO NOT** cut off the head, legs, or feet if they are visible in [Image 1].
            -   If [Image 1] is a full-body shot, the output MUST be a full-body shot.
            -    **KEEP ORIGINAL DIMENSIONS:** The output image MUST act as a layer on top of [Image 1]. It must have the **EXACT SAME aspect ratio** (width/height) as [Image 1].
            -  **NO OUTPAINTING:** Do NOT add, invent, or extend the background horizontally or vertically. If [Image 1] is a tall portrait (e.g., 9:16), the output MUST be a tall portrait (9:16). Do NOT make it square.
            -  **NO ZOOM/CROP:** The user's head and feet must remain in the exact same pixel coordinates as in [Image 1].

        2.  **PRESERVATION:**
            -   Keep the user's face, hair, skin tone, body shape, and pose **100% identical**.
            -   Keep the background **100% identical**.
            -   Keep the lower body clothing (pants, skirt, shoes) **exactly as they are**.

        3.  **REALISTIC BLENDING:**
            -   Warp and drape the garment from [Image 2] naturally onto the user's upper body.
            -   Match the lighting and shadows of [Image 1].
            -   Ensure the new garment completely covers the original shirt the user was wearing.

        **OUTPUT:**
        -   Return ONLY the generated image. Do not add any text or explanation if successful.
    `;

    // 3. Gọi API qua Vercel AI Gateway
    const result = await generateText({
      model: 'google/gemini-2.5-flash-image-preview', // Model tối ưu cho xử lý ảnh
      providerOptions: {
        google: { responseModalities: ['TEXT', 'IMAGE'] }, // Yêu cầu trả về ảnh
      },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: smartPrompt },
            {
              type: 'file',
              mediaType: parsedUserImage.mediaType,
              data: parsedUserImage.buffer,
            },
            {
              type: 'file',
              mediaType: parsedMockupImage.mediaType,
              data: parsedMockupImage.buffer,
            },
          ],
        },
      ],
    });

    // 4. Xử lý kết quả trả về
    const generatedImages = result.files?.filter((f) =>
      f.mediaType?.startsWith('image/'),
    );

    if (generatedImages && generatedImages.length > 0) {
      const imageFile = generatedImages[0];
      const imageBase64 = Buffer.from(imageFile.uint8Array).toString('base64');
      const dataUri = `data:${imageFile.mediaType};base64,${imageBase64}`;
      return NextResponse.json({
        success: true,
        imageUrl: dataUri,
      });
    } else {
      // Nếu AI trả về text (thường là thông báo lỗi từ Prompt)
      return NextResponse.json(
        {
          success: false,
          error: result.text || 'AI không thể tạo ảnh. Vui lòng thử ảnh khác.',
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('[VIRTUAL_TRY_ON_API_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Lỗi xử lý: ${errorMessage}` },
      { status: 500 },
    );
  }
}