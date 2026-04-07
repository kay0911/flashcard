<div align="center">
  <img src="public/favicon.svg" alt="VocabAI Logo" width="120" />
  <h1>VocabAI - Smart Flashcards</h1>
  
  <p>Một siêu ứng dụng học từ vựng ứng dụng sức mạnh của AI. Trích xuất từ khóa tự động, lật thẻ Flashcards, làm trắc nghiệm và quản lý thẻ nhớ an toàn qua Đám mây.</p>

  <div>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
  </div>
</div>

<br />

## 🌟 Tính năng Nổi bật

*   **🪄 Trích xuất bằng AI:** Tích hợp bộ não `Gemini 3.1 Flash Lite Preview`. Bạn chỉ cần ném vào một đoạn báo tiếng Anh hoặc tiếng Việt, AI sẽ tự lọc các từ vựng tinh túy nhất và tự tạo thẻ học cho bạn.
*   **✍️ Nhập liệu Thủ công:** Chuyển đổi linh hoạt với giao diện điền tay truyền thống nếu bạn muốn tự quản lý các mặt thẻ của mình dưới dạng một danh sách động.
*   **🎧 Phát âm tự động (TTS):** Hỗ trợ Web Speech API bản xứ (en-US). Chỉ cần click nhẹ vào chiếc loa là đọc từ chuẩn US/UK không cần app ngoài.
*   **🎯 Chế độ Thi Trắc nghiệm (Quiz Mode):** Biến bộ thẻ thành hệ thống bài thi xáo trộn khép kín (Anh-Việt, Việt-Anh), chấm điểm và hiển thị kết quả.
*   **☁️ Lưu trữ Đám mây Thư Viện:** Đăng ký bằng Google OAuth hoặc Email OTP. Toàn bộ thẻ ghi nhớ của bạn được bảo mật (Row Level Security) trên hạ tầng **Supabase**. Bất cứ thiết bị nào đăng nhập cũng có thể tra cứu và học bài.

## 🛠 Tech Stack

Dự án được viết theo cấu trúc `Fullstack Serverless` mạnh mẽ:

*   **Frontend Framework:** React 18, Vite.
*   **State Management:** Zustand (Chia nhỏ thành Auth, Flashcard và Quiz Store riêng biệt).
*   **Styling:** Tailwind CSS v4, Lucide React (Icons).
*   **Routing:** React Router v6 (Protected Routing / Public Routing).
*   **Backend as a Service:** Supabase (Auth, Role, Postgres Database).
*   **AI Engine:** Google Generative AI (`@google/generative-ai`).

## 🚀 Hướng dẫn Cài đặt Local

Thực hiện các bước sau để copy máy trạm phát triển của bạn.

### 1. Cài đặt các thư viện
```bash
npm install
```

### 2. Thiết lập Môi trường
Tạo file `.env` ở thư mục gốc của dự án và điền thông tin sau:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Cấu trúc Database Table (Supabase)
Tạo bảng chứa thẻ bảo mật trong trình Database SQL của Supabase Dashboard:

```sql
-- Create Decks
CREATE TABLE decks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Cards
CREATE TABLE cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS Cho phép người dùng kết nối bảo mật độc lập
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own decks" 
ON decks FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage cards in their decks" 
ON cards FOR ALL USING (
  deck_id IN (SELECT id FROM decks WHERE user_id = auth.uid())
);
```

### 4. Chạy Server
Khởi động máy chủ VITE (HMR - Hot Module Replacement):
```bash
npm run dev
```

Truy cập `http://localhost:5173` để sử dụng trực tiếp VocabAI trên môi trường máy của bạn!

---

<div align="center">
  <i>Được Code hoàn toàn bởi Gemini 💛</i>
</div>
