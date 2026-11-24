# CLAUDE.md

## Dự án

Web (frontend) cho dịch vụ thiệp cưới online, domain `ketduyen.me`. Cặp đôi chọn mẫu, nhập nội dung, sự kiện, ảnh, nhạc rồi đăng thiệp. Khách mở trang thiệp theo slug, có link riêng cho nhà trai và nhà gái.

- Repo này chỉ có web. Backend (FastAPI) ở repo `hieutran-12/Startup`; trên máy người dùng là `~/Documents/myProject/Startup`.
- **Hợp đồng API là `README.md` của repo backend.** Tóm tắt những gì web cần biết: `docs/backend.md`.
- Trạng thái ngày 24/11/2026:
  - Đã có giao diện trang chủ, danh mục mẫu, xem mẫu, modal đăng nhập và đăng ký, trang tạo thiệp.
  - **Chưa gọi API**: đăng nhập còn giả lập trong `my-fe-app/src/features/auth/AuthContext.tsx`.
  - Code gọi API (`http.ts`) một bạn trong nhóm đang viết, chưa push.

## Stack và lệnh

- Code nằm trong `my-fe-app/`: Vite 5, React 18, TypeScript, Mantine 7, react-router-dom 6 (BrowserRouter), dayjs. Quản lý gói bằng yarn v1 (`yarn.lock`).
- `New folder/vows-trang-chu/` là bản trang chủ tĩnh (HTML, CSS, JS thuần) làm từ trước. Không nằm trong bản build.

```sh
cd my-fe-app
yarn install
yarn dev          # http://localhost:5173
yarn build        # tsc --noEmit && vite build -> dist/
yarn typecheck
```

## Cấu trúc `my-fe-app/src`

- `config/site.ts`: tên thương hiệu (đang để "Vows" tạm) và `ROUTES`.
- `features/`: `home`, `auth`, `create`.
- `pages/`: `templates`, `template-preview`, `template-demo`.
- `templates/`:
  - `registry.ts`: danh sách mẫu.
  - `catalog/<slug>/`: component của từng mẫu.
  - `types.ts`, `sampleData.ts`.
- `components/`, `styles/`, `theme/`.

## Deploy

- AWS Amplify Hosting, app `ketduyen-web`, region `ap-southeast-2`, nối repo này từ 24/11/2026.
  - Push nhánh `main` thì Amplify tự build thư mục `my-fe-app` (`yarn run build`, thư mục `dist`) rồi đưa lên `https://ketduyen.me`.
  - `www.ketduyen.me` tự chuyển về `https://ketduyen.me`.
  - Xem tiến trình build: Amplify console › `ketduyen-web` › nhánh `main`.
- Biến môi trường lúc build (`VITE_API_URL`) đặt trong Amplify console. Đổi biến xong phải build lại mới có hiệu lực.
- Amplify trả `index.html` cho mọi đường dẫn không phải file tĩnh, nên thêm route mới không cần cấu hình gì.

## Quy tắc khi làm việc

- Trả lời người dùng bằng tiếng Việt, câu đơn giản. Việc làm trên console thì viết từng bước đánh số.
- Không tự đặt tên trường, endpoint hay mã lỗi API: đọc `docs/backend.md` và README của backend. Thiếu thì hỏi người dùng, vì backend phải sửa spec trước.
- Đăng nhập dùng backend của dự án (JWT kèm cookie refresh), **không dùng Supabase hay Firebase**. Comment cũ trong `AuthContext.tsx` ghi khác.
- Backend v1 chưa có đăng nhập Google hay Facebook.
- Repo chưa có quy ước code riêng: viết theo cách của các file xung quanh.
- Chỉ commit hay push khi người dùng đồng ý.
