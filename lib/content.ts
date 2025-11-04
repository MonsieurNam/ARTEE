// lib/content.ts
export const HERO_CONTENT = {
  slogan: "SEE. WEAR. LOVE.",
  subtitle: "Thiết kế áo in theo yêu cầu với công nghệ AR tiên tiến - Nghệ Thuật Sống Động trên Mỗi Chiếc Áo",
  description:
    "ARTEE là nơi nghệ thuật gặp gỡ công nghệ AR, biến mỗi chiếc áo thành một tác phẩm sống động. Chúng tôi mang đến trải nghiệm thời trang tương tác – sáng tạo, bền vững và đầy cảm hứng cho khách hàng tại Việt Nam.",
};

export const BRAND_STORY = {
  title: "ABOUT ARTEE",
  description: "ARTEE là nền tảng thiết kế áo in theo yêu cầu kết hợp công nghệ AR, tính bền vững và sáng tạo cá nhân.",
  pillars: [
    {
      title: "Nghệ Thuật Độc Đáo",
      description: "Mỗi thiết kế đều được thiết kế theo cách bạn muốn, mang đậm dấu ấn cá nhân.",
    },
    {
      title: "Bền Vững",
      description: "Vải sợi cà phê, quy trình sản xuất có trách nhiệm — thời trang không làm hại hành tinh.",
    },
    {
      title: "Công Nghệ AR",
      description: "Trải nghiệm tương tác chưa từng có — nghệ thuật sống động ngay trên chiếc áo bạn mặc.",
    },
  ],
};

export interface ProductOption {
  id: string
  name: string
  price: number
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  // --- THAY ĐỔI Ở ĐÂY ---
  galleryImages: {
    id: number
    url: string
    alt: string
    pose: 'front' | 'back' // Thêm thuộc tính pose
  }[]
  // --- KẾT THÚC THAY ĐỔI ---
  isARReady: boolean
  story: string
  fabrics: ProductOption[]
  sizes: ProductOption[]
}

export const COLLECTION = {
  title: "The First Drop",
  subtitle: "First Collection",
  description: "Khám phá những thiết kế độc đáo được tạo bởi các nghệ sĩ hàng đầu",
  products: [
    {
      id: 1,
      name: "Ấn Sen",
      description: " Biểu tượng của sự thuần khiết và kiên cường",
      price: 299000,
      image: "/remove_background/hoodie_back (2).png",
      galleryImages: [
        // --- CẬP NHẬT DỮ LIỆU ---
        { id: 1, url: "/remove_background/hoodie_front (2).png", alt: "Ấn Sen front view", pose: "front" },
        // { id: 2, url: "/remove_background/hoodie_side.png", alt: "Ấn Sen side view", pose: "side" },
        { id: 3, url: "/remove_background/hoodie_back (2).png", alt: "Ấn Sen back view", pose: "back" },
        // --- KẾT THÚC CẬP NHẬT ---
      ],
      isARReady: false,
      story:
        "Ấn Sen – một con dấu cổ, nén trọn vẹn vòng đời của đóa sen vào trong một khoảnh khắc: từ mầm non trong bùn đất, vươn lên thành lá, thành hoa, rồi kết đài. Không chỉ là một chiếc áo, đây là một con dấu khẳng định khí chất. Giống như đóa sen vươn lên từ bùn lầy mà vẫn thuần khiết, nó dành cho những ai luôn giữ được bản sắc riêng của mình giữa dòng đời.",
      fabrics: [
        { id: "cotton-100", name: "100% Cotton", price: 0 },
        { id: "cotton-blend", name: "Cotton Blend", price: 50000 },
        { id: "organic", name: "Organic Cotton", price: 100000 },
      ],
      sizes: [
        { id: "xs", name: "XS", price: 0 },
        { id: "s", name: "S", price: 0 },
        { id: "m", name: "M", price: 0 },
        { id: "l", name: "L", price: 0 },
        { id: "xl", name: "XL", price: 0 },
        { id: "xxl", name: "XXL", price: 50000 },
      ],
    },
    {
      id: 2,
      name: "Nạp Cảm Hứng",
      description: "Không chỉ là một ly cà phê, đây là nút 'khởi động' cho mọi ý tưởng",
      price: 299000,
      image: "/cafe_sau.png",
      galleryImages: [
        // --- CẬP NHẬT DỮ LIỆU ---
        { id: 1, url: "/remove_background/coffe_front.png", alt: "Nạp Cảm Hứng front view", pose: "front" },
        // { id: 2, url: "/remove_background/coffe_side.png", alt: "Nạp Cảm Hứng side view", pose: "side" },
        { id: 3, url: "/remove_background/coffe_back.png", alt: "Nạp Cảm Hứng back view", pose: "back" },
        // --- KẾT THÚC CẬP NHẬT ---
      ],
      isARReady: true,
      story:
        "Không chỉ là một ly cà phê, đây là nút 'khởi động' cho mọi ý tưởng. Dành cho những ai cần một cú hích năng lượng để bắt đầu một ngày mới đầy sáng tạo.",
      fabrics: [
        { id: "cotton-100", name: "100% Cotton", price: 0 },
        { id: "cotton-blend", name: "Cotton Blend", price: 50000 },
        { id: "organic", name: "Organic Cotton", price: 100000 },
      ],
      sizes: [
        { id: "xs", name: "XS", price: 0 },
        { id: "s", name: "S", price: 0 },
        { id: "m", name: "M", price: 0 },
        { id: "l", name: "L", price: 0 },
        { id: "xl", name: "XL", price: 0 },
        { id: "xxl", name: "XXL", price: 50000 },
      ],
    },
    {
      id: 3,
      name: "Chung nhịp vươn xa",
      description: "Thiết kế dành cho doanh nghiệp và đội nhóm",
      price: 299000,
      image: "/remove_background/brand_front.png",
      galleryImages: [
        // --- CẬP NHẬT DỮ LIỆU ---
        { id: 1, url: "/remove_background/brand_front.png", alt: "CHUNG NHỊP VƯƠN XA front view", pose: "front" },
        // { id: 2, url: "/remove_background/brand_side.png", alt: "CHUNG NHỊP VƯƠN XA side view", pose: "side" },
        { id: 3, url: "/remove_background/brand_back.png", alt: "CHUNG NHỊP VƯƠN XA back view", pose: "back" },
        // --- KẾT THÚC CẬP NHẬT ---
      ],
      isARReady: true,
      story:
        "Chung Nhịp: Chúng ta là một đội, đoàn kết và làm việc ăn ý với nhau. Giống như hai dòng chảy xanh (vững chắc) và vàng (sáng tạo) hòa làm một, tất cả cùng nhìn về một hướng để tạo ra sức mạnh chung. Vươn Xa: Họa tiết hướng lên thể hiện tinh thần luôn tiến về phía trước, không ngừng phát triển và chinh phục những mục tiêu lớn hơn.",
      fabrics: [
        { id: "cotton-100", name: "100% Cotton", price: 0 },
        { id: "cotton-blend", name: "Cotton Blend", price: 50000 },
        { id: "organic", name: "Organic Cotton", price: 100000 },
      ],
      sizes: [
        { id: "xs", name: "XS", price: 0 },
        { id: "s", name: "S", price: 0 },
        { id: "m", name: "M", price: 0 },
        { id: "l", name: "L", price: 0 },
        { id: "xl", name: "XL", price: 0 },
        { id: "xxl", name: "XXL", price: 50000 },
      ],
    },
    {
      id: 4,
      name: "Hồi ức đáng nhớ",
      description: "Nơi lưu giữ và chia sẻ kỉ niệm",
      price: 299000,
      image: "/remove_background/custom_back.png",
      galleryImages: [
        // --- CẬP NHẬT DỮ LIỆU ---
        { id: 1, url: "/remove_background/custom_front.png", alt: "Hồi ức đáng nhớ front view", pose: "front" },
        // { id: 2, url: "/remove_background/custom_side.png", alt: "Hồi ức đáng nhớ side view", pose: "side" },
        { id: 3, url: "/remove_background/custom_back.png", alt: "Hồi ức đáng nhớ back view", pose: "back" },
        // --- KẾT THÚC CẬP NHẬT ---
      ],
      isARReady: true,
      story:
        "Không chỉ là một chiếc áo, đây là kho lưu giữ những kỉ niệm quý giá. Mỗi thiết kế mang trong mình câu chuyện riêng, giúp bạn chia sẻ và kết nối với những người thân yêu qua từng khoảnh khắc đáng nhớ.",
      fabrics: [
        { id: "cotton-100", name: "100% Cotton", price: 0 },
        { id: "cotton-blend", name: "Cotton Blend", price: 50000 },
        { id: "organic", name: "Organic Cotton", price: 100000 },
      ],
      sizes: [
        { id: "xs", name: "XS", price: 0 },
        { id: "s", name: "S", price: 0 },
        { id: "m", name: "M", price: 0 },
        { id: "l", name: "L", price: 0 },
        { id: "xl", name: "XL", price: 0 },
        { id: "xxl", name: "XXL", price: 50000 },
      ],
    }
  ] as Product[],
};

export const HOW_IT_WORKS = {
  title: "Cách thức hoạt động",
  description: "Ba bước đơn giản để có được thiết kế áo của bạn",
  steps: [
    {
      number: 1,
      title: "CHỌN",
      description: "Chọn loại áo, màu sắc và thiết kế yêu thích của bạn",
    },
    {
      number: 2,
      title: "QUÉT",
      description: "Quét hình ảnh marker bằng ứng dụng Artivive",
    },
    {
      number: 3,
      title: "TRẢI NGHIỆM",
      description: "Xem thiết kế 3D của bạn xuất hiện trong thế giới thực",
    },
  ],
};

export const FINAL_CTA = {
  title: "Bắt đầu hành trình sáng tạo của bạn",
  description: "Tham gia cộng đồng ARTEE và chia sẻ thiết kế độc đáo của bạn",
  socialLinks: [
    { name: "Instagram", url: "https://instagram.com", icon: "📷" },
    { name: "Facebook", url: "https://facebook.com", icon: "f" },
    { name: "TikTok", url: "https://tiktok.com", icon: "🎵" },
    { name: "Twitter", url: "https://twitter.com", icon: "𝕏" },
  ],
  newsletter: {
    title: "Đăng ký nhận tin tức",
    description: "Nhận thông báo về bộ sưu tập mới và ưu đãi độc quyền",
    placeholder: "Nhập email của bạn",
  },
};

export const SHIRT_ASSETS: Record<string, { front: string; back: string }> = {
  tee: {
    front: '/remove_background/tshirt_front.png',
    back: '/remove_background/tshirt_back.png',
  },
  hoodie: {
    front: '/remove_background/hoodie_front.png',
    back: '/remove_background/hoodie_back.png',
  },
  polo: {
    front: '/remove_background/polo_front.png',
    back: '/remove_background/polo_back.png',
  },
};