# Circus Cyber Party

Ứng dụng Party Game chạy độc lập với website chính trong `.site`.

## Cấu trúc

- `src/components`: màn hình dùng chung cho Host và người chơi.
- `src/games/<game-id>`: toàn bộ luật, dữ liệu và giao diện của từng game.
- `engine.ts`: luật game thuần, không phụ thuộc React hay PeerJS để dễ bảo trì và kiểm tra độc lập.
- `config.ts`: số người và thời lượng dùng chung, tránh rải số cố định trong giao diện.
- `src/utils`: session, mã phòng và đa ngôn ngữ.

## Kiểm tra trước khi phát hành

```powershell
pnpm install --frozen-lockfile
pnpm check
```

`pnpm check` chạy TypeScript, kiểm thử cấu hình ICE/TURN và build production. Các test dùng Node.js 22.18 trở lên hoặc Node.js 24.

## Kết nối giữa hai mạng

Host và Player thử kết nối trực tiếp qua WebRTC. Khi NAT hoặc firewall chặn đường trực tiếp, ICE có thể chuyển sang relay Cloudflare Realtime TURN.

1. Tạo TURN key trong Cloudflare Realtime. Thêm `TURN_KEY_ID` và `TURN_KEY_API_TOKEN` vào **Settings → Variables and Secrets** của Cloudflare Pages. Chọn secret được mã hóa cho token và cấu hình riêng từng môi trường cần dùng. [Tạo TURN credentials](https://developers.cloudflare.com/realtime/turn/generate-credentials/) · [Pages secrets](https://developers.cloudflare.com/pages/functions/bindings/#secrets)
2. Đặt rate limiting cho `POST /api/ice-servers` trước khi bật TURN công khai. Đây là endpoint cấp thông tin relay cho người chơi chưa đăng nhập. Theo dõi lưu lượng TURN và điều chỉnh giới hạn theo số người vào phòng đồng thời.
3. Chạy `pnpm check`, rồi chạy `wrangler pages deploy dist --project-name=party-circus-cyber` từ thư mục gốc để Wrangler kèm thư mục `functions/`. Với môi trường local có TURN, đặt hai biến trong `.dev.vars` và chạy `wrangler pages dev dist` sau khi build.
4. Kiểm thử trên URL HTTPS dùng chung với Host trên Wi-Fi và Player trên dữ liệu di động. Xác minh vào phòng, tải lại trang Player trong ván, và thử từ mạng chặn UDP. Dùng `chrome://webrtc-internals` hoặc `edge://webrtc-internals` để kiểm tra candidate pair đã chọn có loại `relay` khi thử đường relay.

Function cấp thông tin TURN có hạn 24 giờ. Khi endpoint thiếu cấu hình hoặc gặp lỗi, ứng dụng vẫn thử STUN để kết nối trực tiếp. `pnpm dev` dùng chế độ này vì Vite không chạy Pages Functions.

## Thêm game mới

1. Tạo `src/games/<game-id>` với `types.ts`, `engine.ts` và giao diện Host/Player.
2. Thêm thẻ chọn game trong `HostGameSelectView.tsx`.
3. Đăng ký điều hướng và message mạng trong `App.tsx`.
4. Kiểm tra tối thiểu: bắt đầu, mất kết nối, hành động không hợp lệ, hòa/kết thúc và chơi lại.
