export type Language = 'vi' | 'en';

const LANG_STORAGE_KEY = 'ccparty_lang';

export function getSavedLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'en' || saved === 'vi') return saved;
  } catch {}
  return 'vi';
}

export function saveLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {}
}

export const TRANSLATIONS = {
  vi: {
    // Common
    appName: 'Party Game',
    appSubtitle: 'Trò chơi kết nối bạn bè trên mọi thiết bị',
    back: 'Quay lại',
    confirm: 'Xác nhận',
    cancel: 'Hủy',
    close: 'Đóng',
    roomCode: 'Mã phòng',
    yourName: 'Tên của bạn',
    online: 'Đã kết nối',
    reconnecting: 'Đang kết nối lại',
    connectionLost: 'Mất tín hiệu tạm thời',
    roomClosedMsg: 'Chủ phòng đã đóng phòng chơi.',

    // Home
    createRoom: 'Tạo phòng',
    joinRoom: 'Vào phòng',

    // Host Lobby
    hostRole: 'Phòng chơi (Host)',
    lobbyTitle: 'Sảnh chờ',
    closeRoom: 'Đóng phòng',
    joinCodeHeader: 'Mã tham gia',
    scanQrHint: 'Mở trình duyệt trên điện thoại hoặc quét mã bên dưới',
    scanQrSub: 'Quét mã để vào phòng tự động',
    joinedPlayers: 'Người chơi đã vào',
    waitingForPlayers: 'Đang chờ người chơi nhập mã vào phòng...',
    startGame: 'Bắt đầu',
    startGameHint: 'Bấm bắt đầu để mở danh sách chọn game',
    p2pFooter: 'Circus Cyber Party • Kết nối ngang hàng P2P',

    // Game Select
    hostScreen: 'Màn hình Host',
    selectGameTitle: 'Chọn trò chơi',
    backToLobby: 'Quay lại sảnh',
    currentPlayersCount: 'Phòng hiện có {n} người chơi. Chọn game để bắt đầu:',
    minPlayersRequired: 'Tối thiểu 4 người',
    needMorePlayers: 'Phòng hiện có {current} người. Cần thêm {needed} người nữa.',
    needMin4PlayersBtn: 'Cần tối thiểu 4 người để chơi',
    chooseThisGame: 'Chọn game này',
    game1Desc: 'Mỗi người nhận một từ khóa giống nhau, duy nhất 1 gián điệp nhận từ khóa khác. Miêu tả khéo léo và bỏ phiếu tìm ra gián điệp!',
    game2Title: 'Trò chơi tiếp theo',
    game2Desc: 'Thể loại giải đố hoặc phản xạ nhanh đang được phát triển.',
    comingSoon: 'Sắp ra mắt',
    notOpenYet: 'Chưa mở',

    // Join Form
    joinTitle: 'Vào phòng',
    joinSubtitle: 'Nhập mã phòng và tên của bạn để tham gia',
    roomCodePlaceholder: 'VD: CYBR',
    namePlaceholder: 'VD: Nam, Linh, ...',
    connecting: 'Đang kết nối...',
    errorNoRoomCode: 'Vui lòng nhập mã phòng',
    errorInvalidCode: 'Mã phòng phải có đúng 4 ký tự',
    errorNoName: 'Vui lòng nhập tên của bạn',

    // Player Waiting
    joinedSuccessTitle: 'Đã vào phòng',
    readyToPlaySub: 'Bạn đã sẵn sàng tham gia',
    reconnectingSub: 'Đang tìm lại máy Host, bạn không cần thoát...',
    lookAtHostScreen: 'Hãy nhìn lên màn hình chính và chờ Host bắt đầu trò chơi...',
    hostReloadNotice: 'Nếu Host vô tình tải lại trang, kết nối sẽ tự động phục hồi trong giây lát.',
    leaveRoom: 'Rời khỏi phòng',
    changeName: 'Đổi tên',
    changeNameTitle: 'Đổi tên người chơi',
    changeNamePlaceholder: 'Nhập tên mới (tối đa 15 ký tự)...',
    saveName: 'Lưu thay đổi',

    // Game 1: The Lost Spy
    game1Title: 'Điệp Viên Lạc Lối',
    round: 'Vòng',
    memorizeStage: 'Giai đoạn ghi nhớ',
    describeStage: 'Vòng miêu tả',
    voteStage: 'Vòng bỏ phiếu',
    resultStage: 'Kết quả phán quyết',
    gameOverStage: 'Kết thúc ván đấu',
    stopGame: 'Dừng game',

    // Memorize
    readSecretWordTime: 'Thời gian đọc từ khóa bí mật',
    memorizeNoticeHost: 'Mỗi người chơi hãy nhìn vào điện thoại của mình để đọc và ghi nhớ từ khóa bí mật!',
    skipCountdown: 'Bỏ qua đếm ngược & Bắt đầu',
    yourSecretWord: 'Từ khóa bí mật của bạn',
    keepSecretPhone: 'Hãy ghi nhớ kỹ từ khóa này trong đầu. Giữ kín màn hình, không để người ngồi cạnh nhìn thấy!',

    // Describe
    speakingTurn: 'Lượt nói',
    speakerTurnOf: 'Đến lượt phát biểu của:',
    describeGuideHost: 'Người chơi hãy nói 1 câu miêu tả về từ khóa của mình (không nói thẳng từ khóa).',
    nextPlayer: 'Người tiếp theo',
    finishRoundAndVote: 'Hoàn tất vòng & Bỏ phiếu',
    attention: 'Chú ý',
    yourTurnToDescribe: 'ĐẾN LƯỢT BẠN MIÊU TẢ!',
    yourTurnDescribeSub: 'Hãy nói to 1 câu hoặc cụm từ miêu tả từ khóa của bạn để mọi người cùng nghe.',
    nowHappening: 'Đang diễn ra',
    turnOfPlayer: 'Đến lượt của:',
    listenCarefullyNotice: 'Hãy lắng nghe thật kỹ để tìm ra manh mối ai đang nói lệch sóng.',
    forgotWord: 'Quên từ khóa?',
    holdToReveal: 'Nhấn và giữ để xem lại từ khóa',

    // Vote
    eliminationVote: 'Bình chọn loại trừ',
    whoIsSpy: 'Ai là Gián điệp?',
    voteGuideHost: 'Mọi người hãy mở điện thoại và chọn người bạn nghi ngờ nhất.',
    votedBadge: 'Đã vote',
    waitingBadge: 'Chờ...',
    votesReceived: 'Đã nhận: {current}/{total} phiếu bầu',
    revealVoteResult: 'Công bố kết quả bỏ phiếu',
    votedSpectatorNotice: 'Bạn đã bị loại ở vòng trước nên không thể bỏ phiếu. Hãy theo dõi các người chơi còn lại!',
    voteSubmittedSuccess: '✓ Đã gửi phiếu bầu!',
    lookAtHostWaitForResult: 'Hãy nhìn lên màn hình chính và chờ công bố kết quả.',
    chooseSuspectPrompt: 'Bấm chọn người bạn nghi ngờ nhiều nhất:',
    castVoteBtn: 'Bỏ phiếu →',

    // Result & Elimination
    eliminatedAnnouncement: 'Người nhận nhiều phiếu nhất và bị loại:',
    correctSpyTitle: 'CHÍNH XÁC!',
    correctSpyHostSub: 'chính là Gián điệp! Dân thường đã chiến thắng!',
    innocentTitle: 'OAN UỔNG!',
    innocentHostSub: 'chỉ là Dân thường vô tội! Trận đấu tiếp tục với những người còn lại.',
    innocentSpyWinsHostSub: 'là Dân thường! Chỉ còn lại 1 Dân thường và 1 Gián điệp, Gián điệp đã sống sót và chiến thắng!',
    continueBtn: 'Tiếp tục',
    viewGameOverBtn: 'Xem kết thúc trận đấu',
    nextRoundBtn: 'Vòng tiếp theo',
    wasSpyClient: 'Chính là Gián điệp!',
    wasInnocentClient: 'Là Dân thường vô tội!',
    wasInnocentSpyWinsClient: 'Là Dân thường! Chỉ còn 1 Dân thường và 1 Gián điệp -> Gián điệp thắng!',

    // Game Over
    civiliansWin: 'DÂN THƯỜNG CHIẾN THẮNG!',
    spyWins: 'GIÁN ĐIỆP CHIẾN THẮNG!',
    civiliansWinDesc: 'Dân thường đã suy luận xuất sắc và tìm ra gián điệp ẩn nấp!',
    spyWinsDesc: 'Gián điệp đã đánh lừa tất cả mọi người và sống sót ngoạn mục!',
    civilianWordReveal: 'Từ khóa Dân thường:',
    spyWordReveal: 'Từ khóa Gián điệp ({name}):',
    playAgain: 'Chơi ván mới',
    backToSelectGame: 'Về chọn game',

    // Guess Keyword Mechanic
    guessWordBtn: '🎯 Đoán từ khóa gốc (Dành cho Gián Điệp)',
    guessWordModalTitle: 'Đoán từ khóa gốc',
    guessWordWarning: '⚠️ CẢNH BÁO QUAN TRỌNG:',
    guessWordWarning1: 'Nếu bạn là Gián điệp và đoán đúng: Bạn thắng luôn!',
    guessWordWarning2: 'Nếu bạn là Dân thường điền đáp án: Bạn sẽ bị LOẠI NGAY LẬP TỨC!',
    guessInputLabel: 'Nhập từ khóa bạn đoán (Tiếng Việt hoặc Tiếng Anh):',
    guessInputPlaceholder: 'VD: Trà sữa / Milk tea',
    submitGuess: 'Gửi đáp án',
    spectatorBadge: 'Khán giả (Đã bị loại)',

    // Kick Member
    kickPlayer: 'Đuổi khỏi phòng',
    kickConfirm: 'Bạn có chắc chắn muốn đuổi "{name}" khỏi phòng?',
    kickedNotice: 'Bạn đã bị Host mời ra khỏi phòng.',
    playerListModalTitle: 'Danh sách người chơi',
    statusAlive: 'Đang sống',
    statusEliminated: 'Đã bị loại',
  },

  en: {
    // Common
    appName: 'Party Game',
    appSubtitle: 'Connect & play with friends across all devices',
    back: 'Back',
    confirm: 'Confirm',
    cancel: 'Cancel',
    close: 'Close',
    roomCode: 'Room Code',
    yourName: 'Your Name',
    online: 'Connected',
    reconnecting: 'Reconnecting',
    connectionLost: 'Signal Temporarily Lost',
    roomClosedMsg: 'The host has closed the room.',

    // Home
    createRoom: 'Create Room',
    joinRoom: 'Join Room',

    // Host Lobby
    hostRole: 'Room Host',
    lobbyTitle: 'Waiting Lobby',
    closeRoom: 'Close Room',
    joinCodeHeader: 'Join Code',
    scanQrHint: 'Open browser on your phone or scan the code below',
    scanQrSub: 'Scan code to auto-join room',
    joinedPlayers: 'Joined Players',
    waitingForPlayers: 'Waiting for players to enter code...',
    startGame: 'Start Game',
    startGameHint: 'Click start to open game selection menu',
    p2pFooter: 'Circus Cyber Party • Peer-to-Peer P2P Network',

    // Game Select
    hostScreen: 'Host Screen',
    selectGameTitle: 'Select Game',
    backToLobby: 'Back to Lobby',
    currentPlayersCount: 'Room has {n} players. Select a game to start:',
    minPlayersRequired: 'Min 4 players',
    needMorePlayers: 'Room has {current} players. Need {needed} more.',
    needMin4PlayersBtn: 'Requires at least 4 players',
    chooseThisGame: 'Select Game',
    game1Desc: 'Everyone gets the same keyword, except 1 spy receives a different one. Describe cleverly and vote to eject the spy!',
    game2Title: 'Next Game',
    game2Desc: 'Trivia and reflex party game coming soon.',
    comingSoon: 'Coming Soon',
    notOpenYet: 'Locked',

    // Join Form
    joinTitle: 'Join Room',
    joinSubtitle: 'Enter room code and your name to join',
    roomCodePlaceholder: 'e.g. CYBR',
    namePlaceholder: 'e.g. Alex, Sam, ...',
    connecting: 'Connecting...',
    errorNoRoomCode: 'Please enter room code',
    errorInvalidCode: 'Room code must have exactly 4 characters',
    errorNoName: 'Please enter your name',

    // Player Waiting
    joinedSuccessTitle: 'Joined Room',
    readyToPlaySub: 'You are ready to play',
    reconnectingSub: 'Reconnecting to Host, please do not close...',
    lookAtHostScreen: 'Look up at the main screen and wait for the Host to start...',
    hostReloadNotice: 'If the Host refreshes the page, connection will restore automatically.',
    leaveRoom: 'Leave Room',
    changeName: 'Change Name',
    changeNameTitle: 'Change Player Name',
    changeNamePlaceholder: 'Enter new name (max 15 chars)...',
    saveName: 'Save Changes',

    // Game 1: The Lost Spy
    game1Title: 'The Lost Spy',
    round: 'Round',
    memorizeStage: 'Memorization Stage',
    describeStage: 'Clue Round',
    voteStage: 'Voting Round',
    resultStage: 'Judgment Result',
    gameOverStage: 'Match Ended',
    stopGame: 'Quit Game',

    // Memorize
    readSecretWordTime: 'Secret Keyword Memorization Time',
    memorizeNoticeHost: 'Everyone look at your phones to read and memorize your secret keyword!',
    skipCountdown: 'Skip Countdown & Start',
    yourSecretWord: 'Your Secret Keyword',
    keepSecretPhone: 'Memorize this word in your head. Keep your screen hidden from people nearby!',

    // Describe
    speakingTurn: 'Speaking Turn',
    speakerTurnOf: 'Turn of:',
    describeGuideHost: 'Players give 1 clue describing their keyword (without saying the keyword itself).',
    nextPlayer: 'Next Player',
    finishRoundAndVote: 'Finish Round & Vote',
    attention: 'Attention',
    yourTurnToDescribe: 'IT IS YOUR TURN TO DESCRIBE!',
    yourTurnDescribeSub: 'Speak aloud 1 sentence or clue describing your secret keyword.',
    nowHappening: 'Now Speaking',
    turnOfPlayer: 'Turn of:',
    listenCarefullyNotice: 'Listen carefully to spot anyone whose clue sounds off-pitch.',
    forgotWord: 'Forgot keyword?',
    holdToReveal: 'Hold to reveal secret keyword',

    // Vote
    eliminationVote: 'Elimination Vote',
    whoIsSpy: 'Who is the Spy?',
    voteGuideHost: 'Everyone open your phones and vote for the suspect.',
    votedBadge: 'Voted',
    waitingBadge: 'Waiting...',
    votesReceived: 'Received: {current}/{total} votes',
    revealVoteResult: 'Reveal Voting Results',
    votedSpectatorNotice: 'You were eliminated in a previous round and cannot vote. Watch the game!',
    voteSubmittedSuccess: '✓ Vote Submitted!',
    lookAtHostWaitForResult: 'Look at the main screen and wait for results.',
    chooseSuspectPrompt: 'Tap to vote for who you suspect the most:',
    castVoteBtn: 'Vote →',

    // Result & Elimination
    eliminatedAnnouncement: 'Player with the most votes eliminated:',
    correctSpyTitle: 'CORRECT!',
    correctSpyHostSub: 'is the Spy! Civilians have won the game!',
    innocentTitle: 'INNOCENT!',
    innocentHostSub: 'was just an innocent Civilian! Game continues with remaining players.',
    innocentSpyWinsHostSub: 'was a Civilian! Only 1 Civilian and 1 Spy remain, the Spy has won!',
    continueBtn: 'Continue',
    viewGameOverBtn: 'View Match Summary',
    nextRoundBtn: 'Next Round',
    wasSpyClient: 'Was indeed the Spy!',
    wasInnocentClient: 'Was an innocent Civilian!',
    wasInnocentSpyWinsClient: 'Was a Civilian! 1 Civilian & 1 Spy left -> Spy wins!',

    // Game Over
    civiliansWin: 'CIVILIANS WIN!',
    spyWins: 'SPY WINS!',
    civiliansWinDesc: 'Civilians deduced brilliantly and unmasked the undercover spy!',
    spyWinsDesc: 'The spy deceived everyone and survived until the end!',
    civilianWordReveal: 'Civilian Keyword:',
    spyWordReveal: 'Spy Keyword ({name}):',
    playAgain: 'Play Again',
    backToSelectGame: 'Select Game',

    // Guess Keyword Mechanic
    guessWordBtn: '🎯 Guess Original Keyword (Spy Only)',
    guessWordModalTitle: 'Guess Original Keyword',
    guessWordWarning: '⚠️ IMPORTANT WARNING:',
    guessWordWarning1: 'If you are the SPY and guess correctly: YOU WIN IMMEDIATELY!',
    guessWordWarning2: 'If you are a CIVILIAN and guess: YOU ARE ELIMINATED IMMEDIATELY!',
    guessInputLabel: 'Enter the keyword you guess (Vietnamese or English):',
    guessInputPlaceholder: 'e.g. Milk tea / Trà sữa',
    submitGuess: 'Submit Guess',
    spectatorBadge: 'Spectator (Eliminated)',

    // Kick Member
    kickPlayer: 'Kick from room',
    kickConfirm: 'Are you sure you want to kick "{name}" from the room?',
    kickedNotice: 'You have been removed from the room by the Host.',
    playerListModalTitle: 'Players List',
    statusAlive: 'Alive',
    statusEliminated: 'Eliminated',
  },
};
