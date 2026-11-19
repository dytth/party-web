# KIẾN TRÚC DỰ ÁN & HƯỚNG DẪN DÀNH CHO AI AGENT — CIRCUS CYBER PARTY
*(Developer & AI Agent Architecture Guide — P2P Web Party Game Platform)*

Tài liệu này là **Single Source of Truth (SSOT)** về toàn bộ kiến trúc, công nghệ, luồng dữ liệu mạng P2P, luật của 6 game và quy trình vận hành/triển khai cho dự án **Circus Cyber Party (`party-web`)**.

---

## 1. TỔNG QUAN DỰ ÁN
* **Tên dự án:** Circus Cyber Party.
* **Mục đích:** Nền tảng Party Game Serverless P2P đa người chơi (4–20 người) chạy trực tiếp trên trình duyệt web, không cần cài đặt ứng dụng hay backend database phức tạp.
* **Mô hình hoạt động (Jackbox-Style):**
  * **Host Screen (Màn hình phòng / TV / Máy chiếu / PC):** Tạo phòng, hiển thị Room Code 4 chữ cái & QR Code tham gia, phát âm thanh SFX, quản lý vòng chơi và tổng kết kết quả.
  * **Player Screen (Điện thoại của người chơi):** Quét QR hoặc nhập mã phòng + tên để kết nối, hoạt động như tay cầm điều khiển (vẽ hình, bí mật bỏ phiếu, lật thẻ, nộp từ gợi ý, đánh bài).
* **Địa chỉ triển khai (Cloudflare Pages):**
  * **Production:** `https://party-circus-cyber.pages.dev`
  * **Custom Domain:** `https://party.circuscyber.com`

---

## 2. TECH STACK & KIẾN TRÚC MẠNG P2P

| Thành phần | Công nghệ / Thư viện | Vai trò |
| :--- | :--- | :--- |
| **Runtime & Core** | **React 19** (`19.3.1`) + **Vite 8** (`8.3.5`) | Giao diện hiện đại, tối ưu tốc độ render và đóng gói nhẹ |
| **Ngôn ngữ** | **TypeScript 5.9** (`tsc --noEmit`) | Đảm bảo type safety tuyệt đối cho mọi Game State & Network Message |
| **Giao diện & Style**| **Tailwind CSS v4** (`@tailwindcss/vite`) | Dark party theme, glow neon, hoàn toàn responsive Mobile/PC |
| **Mạng Peer-to-Peer**| **PeerJS** (`v1.5.5` - WebRTC DataChannels) | Kết nối trực tiếp giữa Host và các Player không cần backend server |
| **Âm thanh (SFX)** | **Web Audio API thuần** (`src/utils/sound.ts`) | Tổng hợp âm thanh 8-bit/synth bằng sóng âm (0 file mp3, 0 latency) |
| **Icons & QR** | `lucide-react` (1.61) + `qrcode.react` (4.2) | Biểu tượng trực quan và mã QR tham gia phòng tức thì |
| **Deploy & Hosting** | **Cloudflare Pages** | Phục vụ frontend tĩnh và Function cấp thông tin TURN ngắn hạn |

### Luồng truyền thông mạng (P2P Mesh vs Host-Client Topology):
* **Host là máy chủ cục bộ (Host-Centric Topology):** Host khởi tạo Peer ID theo định dạng `ccparty-<room-code-viết-thường>`.
* **Player kết nối Host:** Trình duyệt của Player kết nối qua WebRTC DataChannel. ICE thử đường trực tiếp và có thể dùng TURN relay khi cần. Cả Host và Player nhận cấu hình từ `POST /api/ice-servers`. Xem [README.md](README.md) để cấu hình relay và kiểm thử.
* **Host là nguồn dữ liệu duy nhất (Single Source of Truth):**
  * State đầy đủ của Game chỉ tồn tại trên máy Host.
  * Khi gửi dữ liệu cho Player, Host lọc qua hàm `clientState(gameState, playerId)` để **chỉ gửi thông tin được phép** (chống gian lận: không gửi vai trò Điệp viên, chủ đề bí mật hay màu thẻ Codenames cho người không có quyền xem).
  * Player gửi các hành động (`SUITE_ACTION` hoặc `NetworkMessage`) lên Host để `engine.ts` tính toán và phân phối lại.

---

## 3. CẤU TRÚC THƯ MỤC CHI TIẾT
```
party-web/
├── AGENT.md                   # Tài liệu kiến trúc và hướng dẫn cho Agent (File này)
├── GAME_VOCABULARY.md         # Bộ dữ liệu từ vựng gốc chuẩn hóa song ngữ
├── deploy-party.bat           # Script 1-click kiểm tra code và deploy lên Cloudflare Pages
├── run-party.bat              # Script 1-click chạy local dev server (Port 3001)
├── package.json               # Cấu hình dự án và dependencies
├── tsconfig.json              # Cấu hình TypeScript
├── vite.config.ts             # Cấu hình Vite & Tailwind plugin
├── public/                    # Favicon và static assets
└── src/
    ├── main.tsx               # Entry point React
    ├── App.tsx                # Bộ điều phối trung tâm: PeerJS connection, state máy chủ Host & Player
    ├── types.ts               # Định nghĩa kiểu dữ liệu chung (Player, NetworkMessage, RoomState)
    ├── index.css              # Styling toàn cục, theme biến màu party-glow
    ├── components/            # Màn hình dùng chung
    │   ├── HomeView.tsx           # Màn hình bắt đầu (Tạo phòng Host hoặc Tham gia Player)
    │   ├── HostLobbyView.tsx      # Sảnh chờ của Host (QR code, mã phòng, danh sách người tham gia)
    │   ├── HostGameSelectView.tsx # Bảng chọn 6 game với thông tin chi tiết từng game
    │   ├── JoinView.tsx           # Form nhập mã phòng và tên người chơi
    │   ├── PlayerWaitingView.tsx  # Màn hình chờ của người chơi khi Host ở sảnh
    │   ├── LanguageToggle.tsx     # Nút đổi ngôn ngữ Tiếng Việt / English
    │   ├── HostAudioToggle.tsx    # Nút bật/tắt âm thanh trên màn hình Host
    │   └── Footer.tsx             # Chân trang bản quyền Circus Cyber
    ├── games/                 # Module 6 Game độc lập
    │   ├── the-lost-spy/          # [Game 1] Điệp Viên Lạc Lối (Who is the Spy)
    │   │   ├── config.ts          # Luật, thời gian, số người chơi tối thiểu/tối đa
    │   │   ├── engine.ts          # Logic game thuần (khởi tạo, vote, loại trừ, lật kèo)
    │   │   ├── types.ts           # Game state, voting state, client state
    │   │   ├── words.ts           # 1.181 cặp từ song ngữ (Đồ vật, Ẩm thực, Địa điểm...)
    │   │   ├── HostTheLostSpy.tsx # Màn hình Host cho Game 1
    │   │   └── PlayerTheLostSpy.tsx # Giao diện điện thoại cho Game 1
    │   └── suite/                 # [Game 2 - 6] Gói 5 Game Board Mini tích hợp
    │       ├── types.ts           # Kiểu dữ liệu 5 game (FakeArtist, Codenames, MostLikely, JustOne, TheMind)
    │       ├── data.ts            # Hơn 2.100 dòng từ vựng & câu hỏi song ngữ cho 5 game
    │       ├── engine.ts          # State machine thuần xử lý luật cho cả 5 game
    │       ├── HostSuiteGame.tsx  # Bộ điều khiển render màn hình Host cho 5 game
    │       └── PlayerSuiteGame.tsx # Giao diện điện thoại tương ứng cho từng game
    └── utils/                 # Tiện ích bổ trợ
        ├── i18n.ts                # Từ điển song ngữ (VI / EN)
        ├── roomCode.ts            # Tạo và chuẩn hóa mã phòng (loại bỏ ký tự dễ nhầm 0/O, 1/I)
        ├── session.ts             # Lưu/khôi phục session qua sessionStorage (hỗ trợ reconnect khi F5)
        └── sound.ts               # Web Audio API tổng hợp âm thanh hiệu ứng (pop, cheer, buzzer, start...)
```

---

## 4. CHI TIẾT 6 GAME TRONG DỰ ÁN

| STT | Game ID | Tên Game & Thể loại | Dữ liệu từ vựng | Cơ chế cốt lõi |
| :-: | :--- | :--- | :--- | :--- |
| **1** | `the-lost-spy` | **Điệp Viên Lạc Lối**<br>*(Ẩn vai • Suy luận • Vote)* | **1.181 cặp từ** song ngữ (`words.ts`) | Dân nhận từ gốc, Điệp viên nhận từ gần nghĩa. Mỗi người miêu tả 1 câu, sau đó vote tìm Điệp viên. Điệp viên có cơ hội đoán từ của Dân để lật kèo. |
| **2** | `fake-artist` | **Họa Sĩ Giả Mạo**<br>*(Vẽ 1 nét P2P • Ẩn vai)* | **523 chủ đề vẽ** (`data.ts`) | Mọi người biết chủ đề trừ Kẻ Giả Mạo. Lần lượt mỗi người vẽ đúng 1 nét lên cùng Canvas (đồng bộ vector realtime). Sau 2 vòng vote tìm Kẻ Giả Mạo. Kẻ Giả Mạo đoán chủ đề để lội ngược dòng. |
| **3** | `codenames` | **Mật Danh**<br>*(Thẻ bài 5×5 • Đội Đỏ / Xanh)* | **1.004 từ thẻ bài** (`data.ts`) | 2 Spymaster thấy bản đồ ngầm của ma trận 25 thẻ. Spymaster gợi ý "1 Từ + 1 Số", các Operatives bàn bạc và chạm thẻ trên điện thoại. Chạm trúng Sát thủ (`ASSASSIN`) thua ngay lập tức. |
| **4** | `most-likely` | **Ai Có Khả Năng Nhất?**<br>*(Bình chọn kín • Party)* | **105 câu hỏi tình huống** (`data.ts`) | Bốc câu hỏi ngẫu nhiên. Mọi người bí mật vote 1 người chơi trên màn hình điện thoại. Host công bố biểu đồ vote và vinh danh người bị cả phòng gọi tên. |
| **5** | `just-one` | **Chỉ Một Từ**<br>*(Đoán từ hợp tác • Triệt tiêu từ)* | **512 từ khóa bí mật** (`data.ts`) | 1 Người Đoán nhắm mắt. Những người còn lại nhập 1 từ gợi ý trên điện thoại. Hệ thống tự so sánh chuỗi (normalize string) và triệt tiêu toàn bộ từ trùng lặp. Người Đoán dựa vào các từ độc nhất còn lại để đoán. |
| **6** | `the-mind` | **Đồng Điệu**<br>*(Cảm nhận thời gian • Im lặng)* | **100 lá bài (1–100)** (`engine.ts`) | Chia bài ngẫu nhiên theo Level. Người chơi tuyệt đối không nói hoặc ra hiệu, cùng cảm nhận nhịp thời gian để đánh các lá bài theo thứ tự tăng dần. Đánh sai bị trừ Mạng (Lives). |

---

## 5. QUY CHUẨN THIẾT KẾ MÃ NGUỒN CHO AGENT (CRITICAL RULES)

1. **Nguyên tắc phân tách Pure Logic (`engine.ts`):**
   * Toàn bộ luật chơi, chuyển stage, tính điểm, xác định thắng thua bắt buộc phải nằm trong hàm thuần túy (pure functions) của `engine.ts`.
   * **CẤM** viết logic nghiệp vụ phức tạp trực tiếp bên trong `useEffect` hay component React. React chỉ nhận state và render giao diện.
2. **Nguyên tắc bảo vệ dữ liệu bí mật (State Sanitization / Anti-Cheat):**
   * Host là nơi nắm toàn bộ state thật (`GameState`).
   * Khi broadcast xuống các Player qua DataChannel, **bắt buộc** gọi hàm lọc `clientState(gameState, playerId)`. Không bao giờ gửi lộ đáp án, role điệp viên, mật danh spymaster cho player không phận sự.
3. **Mã phòng và Kết nối (Peer & Room):**
   * Mã phòng luôn chuẩn hóa bằng `sanitizeRoomCode` (chữ in hoa, 4 ký tự, không chứa 0, O, 1, I).
   * Cơ chế tự động khôi phục Session qua `src/utils/session.ts`: khi người chơi refresh trình duyệt, hệ thống sẽ tự động dùng `playerId` cũ để tái kết nối mà không làm mất slot chơi.
4. **Hệ thống âm thanh SFX:**
   * Sử dụng `playHostSound(soundName)` từ `src/utils/sound.ts`. Không import file âm thanh `.mp3` / `.wav` dung lượng lớn.
5. **Đa ngôn ngữ (i18n):**
   * Mọi nhãn nút bấm, thông báo, hướng dẫn đều hỗ trợ cả `vi` và `en` qua `TRANSLATIONS[lang]`.

---

## 6. QUY TRÌNH PHÁT TRIỂN & DEPLOYMENT

### Môi trường máy chủ cục bộ:
* **Node.js:** v22 (`C:\laragon\bin\nodejs\node-v22`)
* **Package Manager:** `pnpm` (Corepack / v12.21)
* **Cloudflare CLI:** `wrangler` (`v4.165`)

### Chạy Local Development:
```powershell
# Chạy bằng script:
.\run-party.bat

# Hoặc bằng lệnh:
$env:PATH = "C:\laragon\bin\nodejs\node-v22;C:\laragon\bin\git\cmd;$env:PATH"
pnpm dev --port 3001
```
Mở trình duyệt: `http://localhost:3001`

### Kiểm tra Code (Bắt buộc trước khi commit/deploy):
```powershell
$env:PATH = "C:\laragon\bin\nodejs\node-v22;C:\laragon\bin\git\cmd;$env:PATH"
pnpm check
```
Lệnh này chạy `tsc --noEmit`, kiểm thử ICE/TURN và `vite build`.

### Deploy tự động lên Cloudflare Pages:
* **Cách 1-Click (Khuyên dùng):** Chạy tệp `deploy-party.bat`.
* **Lệnh qua Terminal:**
```powershell
$env:PATH = "C:\laragon\bin\nodejs\node-v22;C:\laragon\bin\git\cmd;$env:PATH"
pnpm check
wrangler pages deploy dist --project-name=party-circus-cyber
```
* **Cấu hình xác thực Cloudflare:**
  * Dùng phiên đăng nhập Wrangler hoặc đặt `CLOUDFLARE_API_TOKEN` và `CLOUDFLARE_ACCOUNT_ID` trong môi trường deploy. Tệp `deploy-party.bat` dùng cục bộ và được bỏ qua trong Git.

---

## 7. QUY TRÌNH THÊM HOẶC CHỈNH SỬA GAME MỚI
Khi Agent được yêu cầu sửa đổi hoặc thêm game:
1. **Kiểm tra/Bổ sung Type:** Cập nhật `src/games/suite/types.ts` (hoặc tạo folder riêng trong `src/games/<game-id>/`).
2. **Xây dựng Engine:** Viết hàm tạo game (`create*Game`), chuyển round (`next*Round`), áp dụng action (`apply*Action`) và lọc client state (`client*State`).
3. **Xây dựng Giao diện:**
   * Màn hình Host: Tập trung vào hiển thị trực quan, kích thước chữ lớn cho TV, thanh tiến trình, hiệu ứng neon party.
   * Màn hình Player: Tối ưu cho màn hình cảm ứng di động, nút bấm to, phản hồi tức thì.
4. **Đăng ký vào Bộ chọn:** Cập nhật `HostGameSelectView.tsx` với icon, mô tả và gắn trạng thái `ready: true`.
5. **Kiểm thử Typecheck & Build:** Chạy `pnpm check` đảm bảo không có cảnh báo hay lỗi kiểu dữ liệu trước khi hoàn tất.
