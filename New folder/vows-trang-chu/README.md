# Vows · Trang chủ thiệp cưới online

Website tĩnh (HTML + CSS + JS thuần), không cần cài đặt hay build.

## Cấu trúc

```
index.html                 trang chủ
assets/css/style.css       giao diện (màu, kính, bố cục, bản điện thoại)
assets/css/fonts.css       khai báo phông chữ
assets/js/main.js          video mở đầu, hiện chữ, nút Bỏ qua / Xem lại, menu điện thoại
assets/fonts/              Cormorant Garamond + Be Vietnam Pro (có tiếng Việt, giấy phép OFL)
assets/media/
  hero-rose-1080p.mp4      video cho máy tính
  hero-rose-720p.mp4       video cho điện thoại (màn ≤ 760px)
  hero-rose-start.jpg      khung đầu video (ảnh chờ khi video đang tải)
  hero-rose-end.jpg        khung cuối video = ảnh gốc (nền hero và các ảnh vòm)
assets/favicon.svg
```

## Chạy thử

Mở `index.html` bằng Chrome, Edge hoặc Safari là chạy. Nếu muốn giống website thật hơn, chạy một server nhỏ trong thư mục này:

```
python3 -m http.server 8000
```

rồi vào http://localhost:8000

## Đưa lên website

Chép nguyên thư mục lên hosting (Netlify, Vercel, cPanel, GitHub Pages...). Nếu chỉ lấy phần hero ghép vào trang có sẵn: chép khối `<section class="hero">` trong `index.html`, các phần `HERO` + `reveal` trong `style.css`, file `fonts.css`, `main.js` và thư mục `assets/media`.

## Chỉnh nhanh

| Muốn đổi | Sửa ở đâu |
| --- | --- |
| Thời điểm chữ hiện ra | `data-reveal-at="8"` trên `<section class="hero">` (giây). Video dài 8s, để 7 nếu muốn chữ hiện ngay khi camera vừa dừng |
| Video | Thay file trong `assets/media`, giữ nguyên tên. Nhớ thay cả `hero-rose-start.jpg` (khung đầu) và `hero-rose-end.jpg` (khung cuối) cho khớp |
| Màu chủ đạo, màu chữ | Các biến trong `:root` đầu file `style.css` (`--wine` là màu nút) |
| Độ trong của kính | Lớp `.glass` trong `style.css` |
| Liên kết menu | Các `href="#..."` trong `index.html` (Mẫu thiệp, Bảng giá, Đăng nhập... đang để chỗ trống) |
| Bỏ đoạn mở đầu khi đang sửa | Thêm `?intro=off` sau địa chỉ, ví dụ `index.html?intro=off` |

## Hành vi

- Video tự phát không tiếng (điều kiện để trình duyệt cho tự chạy), không lặp. Khi xong, trang giữ khung cuối và chữ, menu, thiệp mẫu hiện dần.
- Trình duyệt chặn tự phát hoặc người dùng bật "giảm chuyển động": trang hiện ngay ảnh tĩnh kèm chữ.
- Hiệu ứng khi cuộn (ảnh trôi chậm, chữ nổi lên) chạy trên Chrome, Edge, Safari 26 trở lên; trình duyệt khác hiện trang tĩnh bình thường.
- Tắt JavaScript: trang vẫn hiện đủ nội dung trên ảnh tĩnh.
