// app/api/virtual-try-on/route.ts
import { generateText } from 'ai';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Helper để xử lý chuỗi Base64 Data URI từ client.
 * Nó sẽ tách mediaType và dữ liệu Base64 thuần.
 */
function parseDataUri(dataUri: string) {
  // Cắt bỏ "data:"
  const content = dataUri.substring(5); // vd: "image/png;base64,iVBORw0..."
  
  const parts = content.split(',');
  if (parts.length < 2) {
    throw new Error('Định dạng Data URI không hợp lệ. Thiếu dấu phẩy.');
  }

  const header = parts[0]; // vd: "image/png;base64"
  const data = parts[1]; // vd: "iVBORw0..."
  
  if (!header || !data) {
    throw new Error('Định dạng Data URI không hợp lệ.');
  }
  
  const mediaType = header.split(';')[0] || 'image/png';
  const buffer = Buffer.from(data, 'base64');
  return { buffer, mediaType };
}
// --- KẾT THÚC HÀM HELPER ---

export async function POST(request: NextRequest) {
  try {
    const {
      userImage,
      mockupImage,
      productPose,
    } = await request.json();

    if (!userImage || !mockupImage || !productPose) {
      return NextResponse.json(
        { error: 'Thiếu userImage, mockupImage hoặc productPose (front/back)' },
        { status: 400 },
      );
    }

    // 1. Xử lý ảnh đầu vào (Dùng hàm mới)
    const parsedUserImage = parseDataUri(userImage);
    const parsedMockupImage = parseDataUri(mockupImage);

    // 2. Xây dựng "Prompt Thông minh" (Không đổi)
    const smartPrompt = `
      You are an expert AI "Virtual Try-On" specialist for the ARTEE fashion brand.
        I will provide 3 inputs:
        1.  [Image 1: User's Photo]
        2.  [Image 2: Garment Photo]
        3.  A text variable 'productPose'. The current productPose is: "${productPose}".

        **TASK 1: VALIDATION (Most Important)**
        -   Analyze [Image 1: User's Photo] to see if it is a 'front' view or 'back' view.
        -   Compare this detected pose to the 'productPose' variable ("${productPose}").

        **TASK 2: ACTION**

        * **IF POSES DO NOT MATCH** (e.g., user is 'front' but 'productPose' is 'back'):
            1.  DO NOT generate an image.
            2.  Your ONLY output must be a single, brief text sentence in VIETNAMESE explaining the mismatch.
            3.  Example: "Lỗi: Ảnh của bạn là mặt trước, nhưng áo đang ở mặt sau. Vui lòng tải ảnh phù hợp."

        * **IF POSES MATCH:**
            1.  Generate a new image where the person from [Image 1] is wearing the [Image 2: Garment].
            2.  **Generation Rules:** You MUST preserve 100% of the person's face, hair, skin tone, pose, and the background from [Image 1]. Realistically warp and drape the garment.
            3.  Your ONLY output must be the final generated image. Do not add any text.
    `;

    // 3. Gọi API qua Vercel AI Gateway (Không đổi)
    const result = await generateText({
      model: 'google/gemini-2.5-flash-image-preview',
      providerOptions: {
        google: { responseModalities: ['TEXT', 'IMAGE'] },
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

    // 4. Xử lý kết quả (Không đổi)
    const generatedImages = result.files.filter((f) =>
      f.mediaType?.startsWith('image/'),
    );

    if (generatedImages.length > 0) {
      const imageFile = generatedImages[0];
      const imageBase64 = Buffer.from(imageFile.uint8Array).toString('base64');
      const dataUri = `data:${imageFile.mediaType};base64,${imageBase64}`;
      return NextResponse.json({
        success: true,
        imageUrl: dataUri,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.text || 'Lỗi: Hướng ảnh không khớp hoặc AI không thể xử lý.',
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('[VIRTUAL_TRY_ON_GATEWAY_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Lỗi máy chủ nội bộ: ${errorMessage}` },
      { status: 500 },
    );
  }
}