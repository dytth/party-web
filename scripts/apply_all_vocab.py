# -*- coding: utf-8 -*-
"""
Main script to compile, format, and apply vocabulary across:
1. party-web/src/games/the-lost-spy/words.ts
2. party-web/src/games/suite/data.ts
3. GAME_VOCABULARY.md
"""

import os
import shutil
import build_clean_vocab
import build_suite_vocab

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))

# 1. Gather all Game 1 pairs
all_g1_pairs = (
    build_clean_vocab.ITEMS +
    build_clean_vocab.PEOPLE +
    build_clean_vocab.FOOD +
    build_clean_vocab.PLACES +
    build_clean_vocab.ANIMALS +
    build_clean_vocab.ACTIONS +
    build_clean_vocab.CONCEPTS
)

# Remove exact duplicates if any while preserving order
seen_g1 = set()
unique_g1_pairs = []
for p in all_g1_pairs:
    k = (p[0].strip().lower(), p[2].strip().lower())
    if k not in seen_g1:
        seen_g1.add(k)
        unique_g1_pairs.append(p)

print(f"Total Unique Game 1 pairs: {len(unique_g1_pairs)}")

# 2. Gather Suite data
# Remove duplicates if any
def dedupe_pairs(lst):
    seen = set()
    res = []
    for vi, en in lst:
        k = vi.strip().lower()
        if k not in seen:
            seen.add(k)
            res.append((vi.strip(), en.strip()))
    return res

draw_topics = dedupe_pairs(build_suite_vocab.DRAW_TOPICS_LIST)
common_words = dedupe_pairs(build_suite_vocab.COMMON_WORDS_LIST)
most_likely = dedupe_pairs(build_suite_vocab.MOST_LIKELY_LIST)
just_one = dedupe_pairs(build_suite_vocab.JUST_ONE_LIST)

print(f"Total Draw Topics: {len(draw_topics)}")
print(f"Total Common Words: {len(common_words)}")
print(f"Total Most Likely: {len(most_likely)}")
print(f"Total Just One: {len(just_one)}")

# 3. Write party-web/src/games/the-lost-spy/words.ts
words_ts_path = os.path.join(BASE_DIR, "src", "games", "the-lost-spy", "words.ts")
with open(words_ts_path, "w", encoding="utf-8") as f:
    f.write('export interface WordPair {\n')
    f.write('  civilian: string;\n')
    f.write('  civilianEn: string;\n')
    f.write('  spy: string;\n')
    f.write('  spyEn: string;\n')
    f.write('  nature: string;\n')
    f.write('}\n\n')
    f.write('export const WORD_PAIRS: WordPair[] = [\n')
    for civ, civ_en, spy, spy_en, nature in unique_g1_pairs:
        # Escape quotes
        c = civ.replace("'", "\\'")
        ce = civ_en.replace("'", "\\'")
        s = spy.replace("'", "\\'")
        se = spy_en.replace("'", "\\'")
        n = nature.replace("'", "\\'")
        f.write(f"  {{ civilian: '{c}', civilianEn: '{ce}', spy: '{s}', spyEn: '{se}', nature: '{n}' }},\n")
    f.write('];\n\n')
    f.write('''export function getRandomWordPair(): WordPair {
  const index = Math.floor(Math.random() * WORD_PAIRS.length);
  return WORD_PAIRS[index];
}

// Helper: Normalize string (lowercase, remove extra spaces, remove punctuation)
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[.,\\/#!$%\\^&\\*;:{}=\\-_`~()]/g, '')
    .replace(/\\s+/g, ' ');
}

// Helper: Remove Vietnamese accents for lenient matching
export function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

// Check if user's guess matches civilian keyword (Vietnamese or English)
export function checkGuessMatch(guess: string, wordVi: string, wordEn: string): boolean {
  const cleanGuess = normalizeString(guess);
  const cleanGuessNoAccent = removeVietnameseAccents(cleanGuess);

  const cleanVi = normalizeString(wordVi);
  const cleanViNoAccent = removeVietnameseAccents(cleanVi);

  const cleanEn = normalizeString(wordEn);
  const cleanEnNoAccent = removeVietnameseAccents(cleanEn);

  // Exact or no-accent match on Vietnamese
  if (cleanGuess === cleanVi || cleanGuessNoAccent === cleanViNoAccent) {
    return true;
  }

  // Match on English
  if (cleanGuess === cleanEn || cleanGuessNoAccent === cleanEnNoAccent) {
    return true;
  }

  // Compact space check (e.g. "hoahong" vs "hoa hong" or "weddingring" vs "wedding ring")
  const compactGuess = cleanGuessNoAccent.replace(/\\s+/g, '');
  const compactVi = cleanViNoAccent.replace(/\\s+/g, '');
  const compactEn = cleanEnNoAccent.replace(/\\s+/g, '');

  if (compactGuess === compactVi || compactGuess === compactEn) {
    return true;
  }

  // Root word match (allow guessing core word e.g. "rose" in "Red rose" or "detective")
  if (cleanViNoAccent.includes(cleanGuessNoAccent) && cleanGuessNoAccent.length >= 3) {
    return true;
  }
  if (cleanEn.includes(cleanGuess) && cleanGuess.length >= 3) {
    return true;
  }

  return false;
}
''')

print("Wrote words.ts successfully!")

# 4. Write party-web/src/games/suite/data.ts
data_ts_path = os.path.join(BASE_DIR, "src", "games", "suite", "data.ts")
with open(data_ts_path, "w", encoding="utf-8") as f:
    f.write("const pairs = (source: string) => source.trim().split('\\n').map(line => line.split('|') as [string, string]);\n\n")
    
    # DRAW_TOPICS
    f.write("export const DRAW_TOPICS = pairs(`\n")
    for vi, en in draw_topics:
        f.write(f"{vi}|{en}\n")
    f.write("`);\n\n")

    # COMMON_WORDS (Pairs of [VI, EN])
    f.write("export const COMMON_WORDS: [string, string][] = pairs(`\n")
    for vi, en in common_words:
        f.write(f"{vi}|{en}\n")
    f.write("`);\n\n")

    # MOST_LIKELY
    f.write("export const MOST_LIKELY = pairs(`\n")
    for vi, en in most_likely:
        f.write(f"{vi}|{en}\n")
    f.write("`);\n\n")

    # JUST_ONE_WORDS
    f.write("export const JUST_ONE_WORDS = pairs(`\n")
    for vi, en in just_one:
        f.write(f"{vi}|{en}\n")
    f.write("`);\n")

print("Wrote data.ts successfully!")

# 5. Generate GAME_VOCABULARY.md
vocab_md_path = os.path.join(ROOT_DIR, "GAME_VOCABULARY.md")
with open(vocab_md_path, "w", encoding="utf-8") as f:
    f.write("# TỔNG HỢP BỘ TỪ VỰNG CÁC GAME (CIRCUS CYBER PARTY)\n")
    f.write("*(Tài liệu chuẩn hóa — Song ngữ Tiếng Việt & English — Ngắn gọn, chuẩn nghĩa, dễ đoán)*\n\n")
    f.write("---\n\n")
    f.write("## MỤC LỤC\n")
    f.write(f"1. [Game 1: Điệp Viên Lạc Lối (The Lost Spy) — {len(unique_g1_pairs)} cặp từ](#1-game-1-điệp-viên-lạc-lối-the-lost-spy)\n")
    f.write(f"2. [Game 2: Họa Sĩ Giả Mạo (A Fake Artist) — {len(draw_topics)} chủ đề vẽ](#2-game-2-họa-sĩ-giả-mạo-a-fake-artist)\n")
    f.write(f"3. [Game 3: Mật Danh (Codenames) — {len(common_words)} từ vựng thẻ bài song ngữ](#3-game-3-mật-danh-codenames)\n")
    f.write(f"4. [Game 4: Ai Có Khả Năng Nhất? (Most Likely To) — {len(most_likely)} câu hỏi (bốc ngẫu nhiên 20 câu/ván)](#4-game-4-ai-có-khả-năng-nhất-most-likely-to)\n")
    f.write(f"5. [Game 5: Chỉ Một Từ (Just One) — {len(just_one)} từ khóa bí mật](#5-game-5-chỉ-một-từ-just-one)\n")
    f.write("6. [Game 6: Đồng Điệu (The Mind) — 100 lá bài](#6-game-6-đồng-điệu-the-mind)\n\n")
    f.write("---\n\n")

    # Section 1: Game 1
    f.write(f"## 1. GAME 1: ĐIỆP VIÊN LẠC LỐI (THE LOST SPY) — {len(unique_g1_pairs)} CẶP TỪ\n\n")
    f.write("> **Tiêu chuẩn thiết kế:** Các từ vựng được tối giản ngắn gọn (2 - 3 từ), chuẩn xác ngữ nghĩa, cực kỳ dễ đoán và tự nhiên cho người chơi nói/đoán cả bằng Tiếng Việt và Tiếng Anh.\n\n")
    
    # Group by nature
    by_nature = {}
    for p in unique_g1_pairs:
        by_nature.setdefault(p[4], []).append(p)
    
    stt = 1
    for nat, pairs_list in by_nature.items():
        f.write(f"### Nhóm: {nat} ({len(pairs_list)} cặp)\n\n")
        f.write("| STT | Từ Dân Thường | English | Từ Gián Điệp | English | Bản Chất |\n")
        f.write("| :-: | :--- | :--- | :--- | :--- | :--- |\n")
        for civ, civ_en, spy, spy_en, nature in pairs_list:
            f.write(f"| {stt} | {civ} | {civ_en} | {spy} | {spy_en} | {nature} |\n")
            stt += 1
        f.write("\n")

    # Section 2: Game 2
    f.write(f"## 2. GAME 2: HỌA SĨ GIẢ MẠO (A FAKE ARTIST) — {len(draw_topics)} CHỦ ĐỀ VẼ\n\n")
    f.write("| STT | Chủ Đề Tiếng Việt | English Topic |\n")
    f.write("| :-: | :--- | :--- |\n")
    for i, (vi, en) in enumerate(draw_topics, 1):
        f.write(f"| {i} | {vi} | {en} |\n")
    f.write("\n---\n\n")

    # Section 3: Game 3
    f.write(f"## 3. GAME 3: MẬT DANH (CODENAMES) — {len(common_words)} TỪ VỰNG THẺ BÀI SONG NGỮ\n\n")
    f.write("| STT | Tiếng Việt (VI) | English (EN) |\n")
    f.write("| :-: | :--- | :--- |\n")
    for i, (vi, en) in enumerate(common_words, 1):
        f.write(f"| {i} | {vi} | {en} |\n")
    f.write("\n---\n\n")

    # Section 4: Game 4
    f.write(f"## 4. GAME 4: AI CÓ KHẢ NĂNG NHẤT? (MOST LIKELY TO) — {len(most_likely)} CÂU HỎI\n\n")
    f.write("> **Cơ chế:** Kho 105 câu hỏi phong phú. Mỗi ván chơi hệ thống sẽ tự động bốc ngẫu nhiên **20 câu hỏi** để tạo trải nghiệm mới mẻ không trùng lặp.\n\n")
    f.write("| STT | Câu Hỏi Tiếng Việt | English Question |\n")
    f.write("| :-: | :--- | :--- |\n")
    for i, (vi, en) in enumerate(most_likely, 1):
        f.write(f"| {i} | {vi} | {en} |\n")
    f.write("\n---\n\n")

    # Section 5: Game 5
    f.write(f"## 5. GAME 5: CHỈ MỘT TỪ (JUST ONE) — {len(just_one)} TỪ KHÓA BÍ MẬT\n\n")
    f.write("| STT | Từ Khóa Tiếng Việt | English Word |\n")
    f.write("| :-: | :--- | :--- |\n")
    for i, (vi, en) in enumerate(just_one, 1):
        f.write(f"| {i} | {vi} | {en} |\n")
    f.write("\n---\n\n")

    # Section 6: Game 6
    f.write("## 6. GAME 6: ĐỒNG ĐIỆU (THE MIND) — 100 LÁ BÀI\n\n")
    f.write("* **Quy cách bài:** Đánh số nguyên từ `1` đến `100`.\n")
    f.write("* **Cơ chế:** Hoàn toàn không dùng ngôn ngữ, người chơi giao tiếp bằng cảm nhận thời gian và linh cảm.\n")

# Copy to party-web/GAME_VOCABULARY.md
shutil.copyfile(vocab_md_path, os.path.join(BASE_DIR, "GAME_VOCABULARY.md"))
print("Generated GAME_VOCABULARY.md in root and party-web successfully!")
