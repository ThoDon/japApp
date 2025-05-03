import { SyllabaryType, SyllabarySubset, CharSubset } from "./types";

type KanaEntry = {
  char: string;
  romaji: string;
};

type KanaSubset = {
  [key in CharSubset]: KanaEntry[];
};

type KanaSyllabary = {
  [key in SyllabarySubset]: KanaSubset;
};

type KanaData = {
  [key in SyllabaryType]: KanaSyllabary;
};

export const KANA_DATA: KanaData = {
  hiragana: {
    gojuon: {
      a_ko: [
        { char: "あ", romaji: "a" },
        { char: "い", romaji: "i" },
        { char: "う", romaji: "u" },
        { char: "え", romaji: "e" },
        { char: "お", romaji: "o" },
        { char: "か", romaji: "ka" },
        { char: "き", romaji: "ki" },
        { char: "く", romaji: "ku" },
        { char: "け", romaji: "ke" },
        { char: "こ", romaji: "ko" },
      ],
      sa_to: [
        { char: "さ", romaji: "sa" },
        { char: "し", romaji: "shi" },
        { char: "す", romaji: "su" },
        { char: "せ", romaji: "se" },
        { char: "そ", romaji: "so" },
        { char: "た", romaji: "ta" },
        { char: "ち", romaji: "chi" },
        { char: "つ", romaji: "tsu" },
        { char: "て", romaji: "te" },
        { char: "と", romaji: "to" },
      ],
      na_ho: [
        { char: "な", romaji: "na" },
        { char: "に", romaji: "ni" },
        { char: "ぬ", romaji: "nu" },
        { char: "ね", romaji: "ne" },
        { char: "の", romaji: "no" },
        { char: "は", romaji: "ha" },
        { char: "ひ", romaji: "hi" },
        { char: "ふ", romaji: "fu" },
        { char: "へ", romaji: "he" },
        { char: "ほ", romaji: "ho" },
      ],
      ma_yo: [
        { char: "ま", romaji: "ma" },
        { char: "み", romaji: "mi" },
        { char: "む", romaji: "mu" },
        { char: "め", romaji: "me" },
        { char: "も", romaji: "mo" },
        { char: "や", romaji: "ya" },
        { char: "ゆ", romaji: "yu" },
        { char: "よ", romaji: "yo" },
      ],
      ra_n: [
        { char: "ら", romaji: "ra" },
        { char: "り", romaji: "ri" },
        { char: "る", romaji: "ru" },
        { char: "れ", romaji: "re" },
        { char: "ろ", romaji: "ro" },
        { char: "わ", romaji: "wa" },
        { char: "を", romaji: "wo" },
        { char: "ん", romaji: "n" },
      ],
    },
    dakuten: {
      a_ko: [
        { char: "が", romaji: "ga" },
        { char: "ぎ", romaji: "gi" },
        { char: "ぐ", romaji: "gu" },
        { char: "げ", romaji: "ge" },
        { char: "ご", romaji: "go" },
      ],
      sa_to: [
        { char: "ざ", romaji: "za" },
        { char: "じ", romaji: "ji" },
        { char: "ず", romaji: "zu" },
        { char: "ぜ", romaji: "ze" },
        { char: "ぞ", romaji: "zo" },
        { char: "だ", romaji: "da" },
        { char: "ぢ", romaji: "ji" },
        { char: "づ", romaji: "zu" },
        { char: "で", romaji: "de" },
        { char: "ど", romaji: "do" },
      ],
      na_ho: [
        { char: "ば", romaji: "ba" },
        { char: "び", romaji: "bi" },
        { char: "ぶ", romaji: "bu" },
        { char: "べ", romaji: "be" },
        { char: "ぼ", romaji: "bo" },
      ],
      ma_yo: [],
      ra_n: [],
    },
    handakuten: {
      a_ko: [],
      sa_to: [],
      na_ho: [
        { char: "ぱ", romaji: "pa" },
        { char: "ぴ", romaji: "pi" },
        { char: "ぷ", romaji: "pu" },
        { char: "ぺ", romaji: "pe" },
        { char: "ぽ", romaji: "po" },
      ],
      ma_yo: [],
      ra_n: [],
    },
    yoon: {
      a_ko: [
        { char: "きゃ", romaji: "kya" },
        { char: "きゅ", romaji: "kyu" },
        { char: "きょ", romaji: "kyo" },
      ],
      sa_to: [
        { char: "しゃ", romaji: "sha" },
        { char: "しゅ", romaji: "shu" },
        { char: "しょ", romaji: "sho" },
        { char: "ちゃ", romaji: "cha" },
        { char: "ちゅ", romaji: "chu" },
        { char: "ちょ", romaji: "cho" },
      ],
      na_ho: [
        { char: "にゃ", romaji: "nya" },
        { char: "にゅ", romaji: "nyu" },
        { char: "にょ", romaji: "nyo" },
        { char: "ひゃ", romaji: "hya" },
        { char: "ひゅ", romaji: "hyu" },
        { char: "ひょ", romaji: "hyo" },
      ],
      ma_yo: [
        { char: "みゃ", romaji: "mya" },
        { char: "みゅ", romaji: "myu" },
        { char: "みょ", romaji: "myo" },
      ],
      ra_n: [
        { char: "りゃ", romaji: "rya" },
        { char: "りゅ", romaji: "ryu" },
        { char: "りょ", romaji: "ryo" },
      ],
    },
  },
  katakana: {
    gojuon: {
      a_ko: [
        { char: "ア", romaji: "a" },
        { char: "イ", romaji: "i" },
        { char: "ウ", romaji: "u" },
        { char: "エ", romaji: "e" },
        { char: "オ", romaji: "o" },
        { char: "カ", romaji: "ka" },
        { char: "キ", romaji: "ki" },
        { char: "ク", romaji: "ku" },
        { char: "ケ", romaji: "ke" },
        { char: "コ", romaji: "ko" },
      ],
      sa_to: [
        { char: "サ", romaji: "sa" },
        { char: "シ", romaji: "shi" },
        { char: "ス", romaji: "su" },
        { char: "セ", romaji: "se" },
        { char: "ソ", romaji: "so" },
        { char: "タ", romaji: "ta" },
        { char: "チ", romaji: "chi" },
        { char: "ツ", romaji: "tsu" },
        { char: "テ", romaji: "te" },
        { char: "ト", romaji: "to" },
      ],
      na_ho: [
        { char: "ナ", romaji: "na" },
        { char: "ニ", romaji: "ni" },
        { char: "ヌ", romaji: "nu" },
        { char: "ネ", romaji: "ne" },
        { char: "ノ", romaji: "no" },
        { char: "ハ", romaji: "ha" },
        { char: "ヒ", romaji: "hi" },
        { char: "フ", romaji: "fu" },
        { char: "ヘ", romaji: "he" },
        { char: "ホ", romaji: "ho" },
      ],
      ma_yo: [
        { char: "マ", romaji: "ma" },
        { char: "ミ", romaji: "mi" },
        { char: "ム", romaji: "mu" },
        { char: "メ", romaji: "me" },
        { char: "モ", romaji: "mo" },
        { char: "ヤ", romaji: "ya" },
        { char: "ユ", romaji: "yu" },
        { char: "ヨ", romaji: "yo" },
      ],
      ra_n: [
        { char: "ラ", romaji: "ra" },
        { char: "リ", romaji: "ri" },
        { char: "ル", romaji: "ru" },
        { char: "レ", romaji: "re" },
        { char: "ロ", romaji: "ro" },
        { char: "ワ", romaji: "wa" },
        { char: "ヲ", romaji: "wo" },
        { char: "ン", romaji: "n" },
      ],
    },
    dakuten: {
      a_ko: [
        { char: "ガ", romaji: "ga" },
        { char: "ギ", romaji: "gi" },
        { char: "グ", romaji: "gu" },
        { char: "ゲ", romaji: "ge" },
        { char: "ゴ", romaji: "go" },
      ],
      sa_to: [
        { char: "ザ", romaji: "za" },
        { char: "ジ", romaji: "ji" },
        { char: "ズ", romaji: "zu" },
        { char: "ゼ", romaji: "ze" },
        { char: "ゾ", romaji: "zo" },
        { char: "ダ", romaji: "da" },
        { char: "ヂ", romaji: "ji" },
        { char: "ヅ", romaji: "zu" },
        { char: "デ", romaji: "de" },
        { char: "ド", romaji: "do" },
      ],
      na_ho: [
        { char: "バ", romaji: "ba" },
        { char: "ビ", romaji: "bi" },
        { char: "ブ", romaji: "bu" },
        { char: "ベ", romaji: "be" },
        { char: "ボ", romaji: "bo" },
      ],
      ma_yo: [],
      ra_n: [],
    },
    handakuten: {
      a_ko: [],
      sa_to: [],
      na_ho: [
        { char: "パ", romaji: "pa" },
        { char: "ピ", romaji: "pi" },
        { char: "プ", romaji: "pu" },
        { char: "ペ", romaji: "pe" },
        { char: "ポ", romaji: "po" },
      ],
      ma_yo: [],
      ra_n: [],
    },
    yoon: {
      a_ko: [
        { char: "キャ", romaji: "kya" },
        { char: "キュ", romaji: "kyu" },
        { char: "キョ", romaji: "kyo" },
      ],
      sa_to: [
        { char: "シャ", romaji: "sha" },
        { char: "シュ", romaji: "shu" },
        { char: "ショ", romaji: "sho" },
        { char: "チャ", romaji: "cha" },
        { char: "チュ", romaji: "chu" },
        { char: "チョ", romaji: "cho" },
      ],
      na_ho: [
        { char: "ニャ", romaji: "nya" },
        { char: "ニュ", romaji: "nyu" },
        { char: "ニョ", romaji: "nyo" },
        { char: "ヒャ", romaji: "hya" },
        { char: "ヒュ", romaji: "hyu" },
        { char: "ヒョ", romaji: "hyo" },
      ],
      ma_yo: [
        { char: "ミャ", romaji: "mya" },
        { char: "ミュ", romaji: "myu" },
        { char: "ミョ", romaji: "myo" },
      ],
      ra_n: [
        { char: "リャ", romaji: "rya" },
        { char: "リュ", romaji: "ryu" },
        { char: "リョ", romaji: "ryo" },
      ],
    },
  },
  kanji: {
    gojuon: { a_ko: [], sa_to: [], na_ho: [], ma_yo: [], ra_n: [] },
    dakuten: { a_ko: [], sa_to: [], na_ho: [], ma_yo: [], ra_n: [] },
    handakuten: { a_ko: [], sa_to: [], na_ho: [], ma_yo: [], ra_n: [] },
    yoon: { a_ko: [], sa_to: [], na_ho: [], ma_yo: [], ra_n: [] },
  },
};

// Helper functions to easily access the data
export function getKanaEntries(
  type: SyllabaryType,
  syllabarySubset: SyllabarySubset,
  charSubset: CharSubset
): KanaEntry[] {
  return KANA_DATA[type][syllabarySubset][charSubset];
}

export function getAllKanaEntries(
  type: SyllabaryType,
  syllabarySubsets: SyllabarySubset[],
  charSubsets: CharSubset[]
): KanaEntry[] {
  return syllabarySubsets.flatMap((syllabarySubset) =>
    charSubsets.flatMap(
      (charSubset) => KANA_DATA[type][syllabarySubset][charSubset]
    )
  );
}

export function getAvailableSyllabarySubsets(
  type: SyllabaryType
): SyllabarySubset[] {
  return Object.keys(KANA_DATA[type]) as SyllabarySubset[];
}

export function getAvailableCharSubsets(
  type: SyllabaryType,
  syllabarySubset: SyllabarySubset
): CharSubset[] {
  return Object.keys(KANA_DATA[type][syllabarySubset]) as CharSubset[];
}

export function getNonEmptyCharSubsets(
  type: SyllabaryType,
  syllabarySubset: SyllabarySubset
): CharSubset[] {
  return getAvailableCharSubsets(type, syllabarySubset).filter(
    (charSubset) => KANA_DATA[type][syllabarySubset][charSubset].length > 0
  );
}

export function getRandomKanaEntry(
  type: SyllabaryType,
  syllabarySubsets: SyllabarySubset[],
  charSubsets: CharSubset[]
): KanaEntry {
  const allEntries = getAllKanaEntries(type, syllabarySubsets, charSubsets);
  if (allEntries.length === 0) {
    throw new Error("No kana entries available for the given parameters");
  }
  const randomIndex = Math.floor(Math.random() * allEntries.length);
  return allEntries[randomIndex];
}

export function getRandomKanaEntries(
  type: SyllabaryType,
  syllabarySubsets: SyllabarySubset[],
  charSubsets: CharSubset[],
  count: number
): KanaEntry[] {
  const allEntries = getAllKanaEntries(type, syllabarySubsets, charSubsets);
  if (allEntries.length === 0) {
    throw new Error("No kana entries available for the given parameters");
  }

  // If we need more entries than available, return all entries
  if (count >= allEntries.length) {
    return allEntries;
  }

  // Fisher-Yates shuffle algorithm
  const shuffled = [...allEntries];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

export function getKanaByRomaji(
  type: SyllabaryType,
  romaji: string
): KanaEntry | undefined {
  for (const syllabarySubset of getAvailableSyllabarySubsets(type)) {
    for (const charSubset of getAvailableCharSubsets(type, syllabarySubset)) {
      const entry = KANA_DATA[type][syllabarySubset][charSubset].find(
        (entry) => entry.romaji === romaji
      );
      if (entry) return entry;
    }
  }
  return undefined;
}

export function getRomajiByKana(
  type: SyllabaryType,
  kana: string
): KanaEntry | undefined {
  for (const syllabarySubset of getAvailableSyllabarySubsets(type)) {
    for (const charSubset of getAvailableCharSubsets(type, syllabarySubset)) {
      const entry = KANA_DATA[type][syllabarySubset][charSubset].find(
        (entry) => entry.char === kana
      );
      if (entry) return entry;
    }
  }
  return undefined;
}
