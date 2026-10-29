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

`pnpm check` lần lượt kiểm tra TypeScript và bản build production.

## Thêm game mới

1. Tạo `src/games/<game-id>` với `types.ts`, `engine.ts` và giao diện Host/Player.
2. Thêm thẻ chọn game trong `HostGameSelectView.tsx`.
3. Đăng ký điều hướng và message mạng trong `App.tsx`.
4. Kiểm tra tối thiểu: bắt đầu, mất kết nối, hành động không hợp lệ, hòa/kết thúc và chơi lại.
