#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { renderToBuffer } = require('@react-pdf/renderer');
const React = require('react');
const readline = require('readline');

// Kana data - copied from the webapp
const KANA_DATA = {
  hiragana: {
    gojuon: {
      a_ko: [
        { char: "あ", romaji: "a" }, { char: "い", romaji: "i" }, { char: "う", romaji: "u" },
        { char: "え", romaji: "e" }, { char: "お", romaji: "o" }, { char: "か", romaji: "ka" },
        { char: "き", romaji: "ki" }, { char: "く", romaji: "ku" }, { char: "け", romaji: "ke" },
        { char: "こ", romaji: "ko" }
      ],
      sa_to: [
        { char: "さ", romaji: "sa" }, { char: "し", romaji: "shi" }, { char: "す", romaji: "su" },
        { char: "せ", romaji: "se" }, { char: "そ", romaji: "so" }, { char: "た", romaji: "ta" },
        { char: "ち", romaji: "chi" }, { char: "つ", romaji: "tsu" }, { char: "て", romaji: "te" },
        { char: "と", romaji: "to" }
      ],
      na_ho: [
        { char: "な", romaji: "na" }, { char: "に", romaji: "ni" }, { char: "ぬ", romaji: "nu" },
        { char: "ね", romaji: "ne" }, { char: "の", romaji: "no" }, { char: "は", romaji: "ha" },
        { char: "ひ", romaji: "hi" }, { char: "ふ", romaji: "fu" }, { char: "へ", romaji: "he" },
        { char: "ほ", romaji: "ho" }
      ],
      ma_yo: [
        { char: "ま", romaji: "ma" }, { char: "み", romaji: "mi" }, { char: "む", romaji: "mu" },
        { char: "め", romaji: "me" }, { char: "も", romaji: "mo" }, { char: "や", romaji: "ya" },
        { char: "ゆ", romaji: "yu" }, { char: "よ", romaji: "yo" }
      ],
      ra_n: [
        { char: "ら", romaji: "ra" }, { char: "り", romaji: "ri" }, { char: "る", romaji: "ru" },
        { char: "れ", romaji: "re" }, { char: "ろ", romaji: "ro" }, { char: "わ", romaji: "wa" },
        { char: "を", romaji: "wo" }, { char: "ん", romaji: "n" }
      ]
    },
    dakuten: {
      a_ko: [
        { char: "が", romaji: "ga" }, { char: "ぎ", romaji: "gi" }, { char: "ぐ", romaji: "gu" },
        { char: "げ", romaji: "ge" }, { char: "ご", romaji: "go" }
      ],
      sa_to: [
        { char: "ざ", romaji: "za" }, { char: "じ", romaji: "ji" }, { char: "ず", romaji: "zu" },
        { char: "ぜ", romaji: "ze" }, { char: "ぞ", romaji: "zo" }, { char: "だ", romaji: "da" },
        { char: "ぢ", romaji: "ji" }, { char: "づ", romaji: "zu" }, { char: "で", romaji: "de" },
        { char: "ど", romaji: "do" }
      ],
      na_ho: [
        { char: "ば", romaji: "ba" }, { char: "び", romaji: "bi" }, { char: "ぶ", romaji: "bu" },
        { char: "べ", romaji: "be" }, { char: "ぼ", romaji: "bo" }
      ],
      ma_yo: [],
      ra_n: []
    },
    handakuten: {
      a_ko: [],
      sa_to: [],
      na_ho: [
        { char: "ぱ", romaji: "pa" }, { char: "ぴ", romaji: "pi" }, { char: "ぷ", romaji: "pu" },
        { char: "ぺ", romaji: "pe" }, { char: "ぽ", romaji: "po" }
      ],
      ma_yo: [],
      ra_n: []
    },
    yoon: {
      a_ko: [
        { char: "きゃ", romaji: "kya" }, { char: "きゅ", romaji: "kyu" }, { char: "きょ", romaji: "kyo" }
      ],
      sa_to: [
        { char: "しゃ", romaji: "sha" }, { char: "しゅ", romaji: "shu" }, { char: "しょ", romaji: "sho" },
        { char: "ちゃ", romaji: "cha" }, { char: "ちゅ", romaji: "chu" }, { char: "ちょ", romaji: "cho" }
      ],
      na_ho: [
        { char: "にゃ", romaji: "nya" }, { char: "にゅ", romaji: "nyu" }, { char: "にょ", romaji: "nyo" },
        { char: "ひゃ", romaji: "hya" }, { char: "ひゅ", romaji: "hyu" }, { char: "ひょ", romaji: "hyo" }
      ],
      ma_yo: [
        { char: "みゃ", romaji: "mya" }, { char: "みゅ", romaji: "myu" }, { char: "みょ", romaji: "myo" }
      ],
      ra_n: [
        { char: "りゃ", romaji: "rya" }, { char: "りゅ", romaji: "ryu" }, { char: "りょ", romaji: "ryo" }
      ]
    }
  },
  katakana: {
    gojuon: {
      a_ko: [
        { char: "ア", romaji: "a" }, { char: "イ", romaji: "i" }, { char: "ウ", romaji: "u" },
        { char: "エ", romaji: "e" }, { char: "オ", romaji: "o" }, { char: "カ", romaji: "ka" },
        { char: "キ", romaji: "ki" }, { char: "ク", romaji: "ku" }, { char: "ケ", romaji: "ke" },
        { char: "コ", romaji: "ko" }
      ],
      sa_to: [
        { char: "サ", romaji: "sa" }, { char: "シ", romaji: "shi" }, { char: "ス", romaji: "su" },
        { char: "セ", romaji: "se" }, { char: "ソ", romaji: "so" }, { char: "タ", romaji: "ta" },
        { char: "チ", romaji: "chi" }, { char: "ツ", romaji: "tsu" }, { char: "テ", romaji: "te" },
        { char: "ト", romaji: "to" }
      ],
      na_ho: [
        { char: "ナ", romaji: "na" }, { char: "ニ", romaji: "ni" }, { char: "ヌ", romaji: "nu" },
        { char: "ネ", romaji: "ne" }, { char: "ノ", romaji: "no" }, { char: "ハ", romaji: "ha" },
        { char: "ヒ", romaji: "hi" }, { char: "フ", romaji: "fu" }, { char: "ヘ", romaji: "he" },
        { char: "ホ", romaji: "ho" }
      ],
      ma_yo: [
        { char: "マ", romaji: "ma" }, { char: "ミ", romaji: "mi" }, { char: "ム", romaji: "mu" },
        { char: "メ", romaji: "me" }, { char: "モ", romaji: "mo" }, { char: "ヤ", romaji: "ya" },
        { char: "ユ", romaji: "yu" }, { char: "ヨ", romaji: "yo" }
      ],
      ra_n: [
        { char: "ラ", romaji: "ra" }, { char: "リ", romaji: "ri" }, { char: "ル", romaji: "ru" },
        { char: "レ", romaji: "re" }, { char: "ロ", romaji: "ro" }, { char: "ワ", romaji: "wa" },
        { char: "ヲ", romaji: "wo" }, { char: "ン", romaji: "n" }
      ]
    },
    dakuten: {
      a_ko: [
        { char: "ガ", romaji: "ga" }, { char: "ギ", romaji: "gi" }, { char: "グ", romaji: "gu" },
        { char: "ゲ", romaji: "ge" }, { char: "ゴ", romaji: "go" }
      ],
      sa_to: [
        { char: "ザ", romaji: "za" }, { char: "ジ", romaji: "ji" }, { char: "ズ", romaji: "zu" },
        { char: "ゼ", romaji: "ze" }, { char: "ゾ", romaji: "zo" }, { char: "ダ", romaji: "da" },
        { char: "ヂ", romaji: "ji" }, { char: "ヅ", romaji: "zu" }, { char: "デ", romaji: "de" },
        { char: "ド", romaji: "do" }
      ],
      na_ho: [
        { char: "バ", romaji: "ba" }, { char: "ビ", romaji: "bi" }, { char: "ブ", romaji: "bu" },
        { char: "ベ", romaji: "be" }, { char: "ボ", romaji: "bo" }
      ],
      ma_yo: [],
      ra_n: []
    },
    handakuten: {
      a_ko: [],
      sa_to: [],
      na_ho: [
        { char: "パ", romaji: "pa" }, { char: "ピ", romaji: "pi" }, { char: "プ", romaji: "pu" },
        { char: "ペ", romaji: "pe" }, { char: "ポ", romaji: "po" }
      ],
      ma_yo: [],
      ra_n: []
    },
    yoon: {
      a_ko: [
        { char: "キャ", romaji: "kya" }, { char: "キュ", romaji: "kyu" }, { char: "キョ", romaji: "kyo" }
      ],
      sa_to: [
        { char: "シャ", romaji: "sha" }, { char: "シュ", romaji: "shu" }, { char: "ショ", romaji: "sho" },
        { char: "チャ", romaji: "cha" }, { char: "チュ", romaji: "chu" }, { char: "チョ", romaji: "cho" }
      ],
      na_ho: [
        { char: "ニャ", romaji: "nya" }, { char: "ニュ", romaji: "nyu" }, { char: "ニョ", romaji: "nyo" },
        { char: "ヒャ", romaji: "hya" }, { char: "ヒュ", romaji: "hyu" }, { char: "ヒョ", romaji: "hyo" }
      ],
      ma_yo: [
        { char: "ミャ", romaji: "mya" }, { char: "ミュ", romaji: "myu" }, { char: "ミョ", romaji: "myo" }
      ],
      ra_n: [
        { char: "リャ", romaji: "rya" }, { char: "リュ", romaji: "ryu" }, { char: "リョ", romaji: "ryo" }
      ]
    }
  }
};

// Utility functions
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getAllKanaEntries(type, syllabarySubsets, charSubsets) {
  return syllabarySubsets.flatMap((syllabarySubset) =>
    charSubsets.flatMap(
      (charSubset) => KANA_DATA[type][syllabarySubset][charSubset] || []
    )
  );
}

function generateExercise(type, syllabarySubsets, charSubsets, count) {
  const characterSet = getAllKanaEntries(type, syllabarySubsets, charSubsets);
  
  if (characterSet.length === 0) {
    throw new Error(`No characters available for type: ${type}, subsets: ${syllabarySubsets.join(',')}, chars: ${charSubsets.join(',')}`);
  }

  const repeats = Math.ceil(count / characterSet.length);
  let allChars = [];

  for (let i = 0; i < repeats; i++) {
    allChars = [...allChars, ...shuffleArray(characterSet)];
  }

  return allChars.slice(0, count);
}

function generateExercises(type, syllabarySubsets, charSubsets, count, pageCount) {
  const exercises = [];
  const charactersPerPage = Math.ceil(count / pageCount);

  for (let i = 0; i < pageCount; i++) {
    const exercise = generateExercise(
      type,
      syllabarySubsets,
      charSubsets,
      charactersPerPage
    );
    exercises.push(exercise);
  }

  return exercises;
}

// PDF Document Component
const { Document, Page, StyleSheet, Text, View, Font } = require('@react-pdf/renderer');

// Register fonts
Font.register({
  family: "Noto Sans JP",
  fonts: [
    {
      src: path.resolve(process.cwd(), "./public/fonts/noto-sans-jp-light.ttf"),
      fontWeight: 300,
    },
    {
      src: path.resolve(process.cwd(), "./public/fonts/noto-sans-jp-regular.ttf"),
      fontWeight: 400,
    },
    {
      src: path.resolve(process.cwd(), "./public/fonts/noto-sans-jp-bold.ttf"),
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    color: "#000",
    fontFamily: "Noto Sans JP",
    fontWeight: 400,
    fontSize: 12,
    padding: 16,
    lineHeight: 1.6,
  },
  header: {
    fontSize: 12,
    borderBottom: "1px solid #ccc",
    marginBottom: 10,
    fontWeight: 700,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  logo: {
    color: "#e7000b",
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  cell: {
    flex: "1 0 8%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 5,
  },
  correctionBox: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  characterJP: {
    fontSize: 18,
    marginBottom: 10,
  },
  characterLatin: {
    fontSize: 14,
    marginBottom: 10,
  },
  correctionCharacter: {
    fontSize: 12,
  },
  writingBox: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 5,
  },
});

const syllabarySubsetsRecord = {
  gojuon: "Gojūon",
  dakuten: "Dakuten",
  handakuten: "Handakuten",
  yoon: "Yōon",
};

const charSubsetsRecord = {
  a_ko: "a - ko",
  sa_to: "sa - to",
  na_ho: "na - ho",
  ma_yo: "ma - yo",
  ra_n: "ra - n",
};

function getSectionHeader(dictionary, pageLabel, directionLabel, categories, charSubsets, isCorrection = false) {
  const order = ["gojuon", "dakuten", "handakuten", "yoon"];
  const orderMap = Object.fromEntries(order.map((key, index) => [key, index]));
  const sortByCategory = (a, b) => (orderMap[a] ?? Infinity) - (orderMap[b] ?? Infinity);

  return React.createElement(View, { style: styles.header },
    React.createElement(View, { style: { display: "flex", flexDirection: "row" } },
      !isCorrection && React.createElement(React.Fragment, null,
        React.createElement(Text, { style: styles.logo }, "Kana"),
        React.createElement(Text, null, "'Sheet - ")
      ),
      React.createElement(Text, { style: { fontWeight: 400 } },
        !isCorrection ? dictionary.exercise : dictionary.correction,
        pageLabel
      )
    ),
    React.createElement(View, null,
      React.createElement(Text, {
        style: {
          fontWeight: 400,
          color: "#cacaca",
          fontSize: "7px",
        }
      },
        directionLabel,
        " / ",
        charSubsets.sort(sortByCategory).map((x, index) => {
          const isLast = charSubsets.length - 1 === index;
          return `${charSubsetsRecord[x]}${!isLast ? ", " : ""}`;
        }).join(''),
        " / ",
        categories.sort(sortByCategory).map((x, index) => {
          const isLast = categories.length - 1 === index;
          return `${syllabarySubsetsRecord[x]}${!isLast ? " - " : ""}`;
        }).join('')
      )
    )
  );
}

function PDFDocument({ exercises, showCorrection, dictionary, categories, charSubsets }) {
  return React.createElement(Document, null,
    exercises.map(({ direction, type, grid, pageFormat }, index) => {
      const isSyllabaryToRomaji = direction === "syllabaryToRomaji";
      const directionLabel = isSyllabaryToRomaji
        ? `${dictionary[type]} → ${dictionary.romaji}`
        : `${dictionary.romaji} → ${dictionary[type]}`;
      const pageLabel = exercises.length > 1 ? ` ${index + 1}` : "";

      return React.createElement(Page, { size: "A4", style: styles.page, key: index },
        getSectionHeader(dictionary, pageLabel, directionLabel, categories, charSubsets),
        React.createElement(View, { style: styles.grid },
          grid.map((item, idx) => {
            const char = isSyllabaryToRomaji ? item.char : item.romaji;
            return React.createElement(View, { key: idx, style: styles.cell },
              React.createElement(Text, {
                style: isSyllabaryToRomaji ? styles.characterJP : styles.characterLatin
              }, char),
              React.createElement(View, { style: styles.writingBox })
            );
          })
        ),
        showCorrection && React.createElement(View, { break: pageFormat === "fullPage" ? true : false },
          getSectionHeader(dictionary, pageLabel, directionLabel, categories, charSubsets, true),
          React.createElement(View, { style: styles.grid },
            grid.map((item, idx) => {
              const correction = isSyllabaryToRomaji ? item.romaji : item.char;
              const char = isSyllabaryToRomaji ? item.char : item.romaji;
              return React.createElement(View, { key: idx, style: styles.cell },
                pageFormat === "fullPage" && React.createElement(Text, {
                  style: isSyllabaryToRomaji ? styles.characterJP : styles.characterLatin
                }, char),
                React.createElement(View, { style: styles.correctionBox },
                  React.createElement(Text, { style: styles.correctionCharacter }, correction)
                )
              );
            })
          )
        )
      );
    })
  );
}

// Configuration
const config = {
  syllabaryType: 'hiragana',
  direction: 'syllabaryToRomaji',
  pageFormat: 'halfPage',
  pageCount: 1,
  showCorrection: true,
  syllabarySubsets: ['gojuon', 'dakuten', 'handakuten', 'yoon'], // All subsets by default
  charSubsets: ['a_ko', 'sa_to', 'na_ho', 'ma_yo', 'ra_n'], // All character ranges by default
  outputPath: './output/kana-exercises.pdf',
  dictionary: {
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    kanji: 'Kanji',
    romaji: 'Romaji',
    exercise: 'Exercise',
    correction: 'Correction'
  }
};

// Calculate characters per page based on format (matching webapp)
function getCharactersPerPage(pageFormat) {
  if (pageFormat === 'fullPage') {
    return 11 * 12; // 11 rows × 12 columns = 132 characters
  } else {
    return 7 * 12; // 7 rows × 12 columns = 84 characters
  }
}

async function generatePDF() {
  try {
    console.log('🚀 Starting PDF generation...');
    
    // Calculate characters per page based on format
    const charactersPerPage = getCharactersPerPage(config.pageFormat);
    
    const configWithChars = {
      ...config,
      charactersPerPage
    };
    
    console.log('📋 Configuration:', JSON.stringify(configWithChars, null, 2));

    const exercises = generateExercises(
      config.syllabaryType,
      config.syllabarySubsets,
      config.charSubsets,
      charactersPerPage * config.pageCount,
      config.pageCount
    );

    const exerciseObjects = exercises.map((grid, index) => ({
      id: `exercise-${index + 1}`,
      type: config.syllabaryType,
      direction: config.direction,
      pageFormat: config.pageFormat,
      grid: grid,
      timestamp: Date.now()
    }));

    console.log(`📝 Generated ${exerciseObjects.length} exercises`);

    const pdfBuffer = await renderToBuffer(
      React.createElement(PDFDocument, {
        exercises: exerciseObjects,
        showCorrection: config.showCorrection,
        dictionary: config.dictionary,
        categories: config.syllabarySubsets,
        charSubsets: config.charSubsets
      })
    );

    const outputDir = path.dirname(config.outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(config.outputPath, pdfBuffer);
    
    console.log(`✅ PDF generated successfully!`);
    console.log(`📁 Output: ${path.resolve(config.outputPath)}`);
    console.log(`📊 File size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  }
}

// Interactive prompt system with bullet point selection
async function promptForParameters() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  console.log('📝 Interactive PDF Generator Setup\n');

  try {
    // Syllabary type selection
    console.log('Choose syllabary type:');
    console.log('  1. Hiragana (ひらがな)');
    console.log('  2. Katakana (カタカナ)');
    const syllabaryChoice = await question('Enter choice (1-2) [1]: ') || '1';
    const syllabaryType = syllabaryChoice === '2' ? 'katakana' : 'hiragana';
    console.log(`✅ Selected: ${syllabaryType}\n`);
    
    // Direction selection
    console.log('Choose exercise direction:');
    console.log('  1. Syllabary → Romaji (write romaji for kana)');
    console.log('  2. Romaji → Syllabary (write kana for romaji)');
    const directionChoice = await question('Enter choice (1-2) [1]: ') || '1';
    const direction = directionChoice === '2' ? 'romajiToSyllabary' : 'syllabaryToRomaji';
    console.log(`✅ Selected: ${direction}\n`);
    
    // Number of pages
    const pageCount = parseInt(await question('Number of pages [1]: ') || '1');
    console.log(`✅ Selected: ${pageCount} page(s)\n`);
    
    // Page format selection
    console.log('Choose page format:');
    console.log('  1. Half page (exercise and correction on same page)');
    console.log('  2. Full page (exercise and correction on separate pages)');
    const formatChoice = await question('Enter choice (1-2) [1]: ') || '1';
    const pageFormat = formatChoice === '2' ? 'fullPage' : 'halfPage';
    console.log(`✅ Selected: ${pageFormat === 'fullPage' ? 'Full page' : 'Half page'}\n`);
    
    // Show correction
    console.log('Include correction section?');
    console.log('  1. Yes (show answers)');
    console.log('  2. No (practice only)');
    const correctionChoice = await question('Enter choice (1-2) [1]: ') || '1';
    const showCorrection = correctionChoice === '1';
    console.log(`✅ Selected: ${showCorrection ? 'Yes' : 'No'}\n`);
    
    // Syllabary subsets selection
    console.log('Choose syllabary subsets:');
    console.log('  1. Gojūon (basic 46 characters)');
    console.log('  2. Dakuten (voiced consonants: が, ざ, だ, ば)');
    console.log('  3. Handakuten (semi-voiced: ぱ, ぴ, ぷ, ぺ, ぽ)');
    console.log('  4. Yōon (contracted sounds: きゃ, しゃ, ちゃ)');
    console.log('  5. All subsets');
    console.log('  6. Custom selection');
    
    const subsetsChoice = await question('Enter choice (1-6) [5]: ') || '5';
    let syllabarySubsets;
    
    if (subsetsChoice === '5') {
      syllabarySubsets = ['gojuon', 'dakuten', 'handakuten', 'yoon'];
      console.log('✅ Selected: All subsets');
    } else if (subsetsChoice === '6') {
      console.log('\nEnter custom subsets (comma-separated):');
      console.log('Available: gojuon, dakuten, handakuten, yoon');
      const customSubsets = await question('Subsets [gojuon]: ') || 'gojuon';
      syllabarySubsets = customSubsets.split(',').map(s => s.trim());
      console.log(`✅ Selected: ${syllabarySubsets.join(', ')}`);
    } else {
      const subsetMap = {
        '1': ['gojuon'],
        '2': ['dakuten'],
        '3': ['handakuten'],
        '4': ['yoon']
      };
      syllabarySubsets = subsetMap[subsetsChoice] || ['gojuon'];
      console.log(`✅ Selected: ${syllabarySubsets.join(', ')}`);
    }
    console.log();
    
    // Character subsets selection
    console.log('Choose character ranges:');
    console.log('  1. a-ko (あ, い, う, え, お, か, き, く, け, こ)');
    console.log('  2. sa-to (さ, し, す, せ, そ, た, ち, つ, て, と)');
    console.log('  3. na-ho (な, に, ぬ, ね, の, は, ひ, ふ, へ, ほ)');
    console.log('  4. ma-yo (ま, み, む, め, も, や, ゆ, よ)');
    console.log('  5. ra-n (ら, り, る, れ, ろ, わ, を, ん)');
    console.log('  6. All ranges');
    console.log('  7. Custom selection');
    
    const charsChoice = await question('Enter choice (1-7) [6]: ') || '6';
    let charSubsets;
    
    if (charsChoice === '6') {
      charSubsets = ['a_ko', 'sa_to', 'na_ho', 'ma_yo', 'ra_n'];
      console.log('✅ Selected: All character ranges');
    } else if (charsChoice === '7') {
      console.log('\nEnter custom character ranges (comma-separated):');
      console.log('Available: a_ko, sa_to, na_ho, ma_yo, ra_n');
      const customChars = await question('Ranges [a_ko,sa_to]: ') || 'a_ko,sa_to';
      charSubsets = customChars.split(',').map(s => s.trim());
      console.log(`✅ Selected: ${charSubsets.join(', ')}`);
    } else {
      const charMap = {
        '1': ['a_ko'],
        '2': ['sa_to'],
        '3': ['na_ho'],
        '4': ['ma_yo'],
        '5': ['ra_n']
      };
      charSubsets = charMap[charsChoice] || ['a_ko', 'sa_to'];
      console.log(`✅ Selected: ${charSubsets.join(', ')}`);
    }
    console.log();
    
    // Output path
    const outputPath = await question('Output file path [./output/kana-exercises.pdf]: ') || './output/kana-exercises.pdf';
    console.log(`✅ Selected: ${outputPath}`);

    console.log('\n🎯 Configuration Summary:');
    console.log(`   • Type: ${syllabaryType}`);
    console.log(`   • Direction: ${direction}`);
    console.log(`   • Format: ${pageFormat === 'fullPage' ? 'Full page' : 'Half page'}`);
    console.log(`   • Pages: ${pageCount}`);
    console.log(`   • Correction: ${showCorrection ? 'Yes' : 'No'}`);
    console.log(`   • Subsets: ${syllabarySubsets.join(', ')}`);
    console.log(`   • Characters: ${charSubsets.join(', ')}`);
    console.log(`   • Output: ${outputPath}`);
    console.log('\n✅ Configuration complete!');

    return {
      syllabaryType,
      direction,
      pageFormat,
      pageCount,
      showCorrection,
      syllabarySubsets,
      charSubsets,
      outputPath
    };
  } finally {
    rl.close();
  }
}

// Command line argument parsing
function parseArgs() {
  const args = process.argv.slice(2);
  
  // If no arguments provided, return null to trigger interactive mode
  if (args.length === 0) {
    return null;
  }
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--type':
      case '-t':
        config.syllabaryType = args[++i];
        break;
      case '--direction':
      case '-d':
        config.direction = args[++i];
        break;
      case '--pages':
      case '-p':
        config.pageCount = parseInt(args[++i]);
        break;
      case '--format':
      case '-f':
        config.pageFormat = args[++i];
        break;
      case '--correction':
      case '-c':
        config.showCorrection = args[++i] === 'true';
        break;
      case '--subsets':
      case '-s':
        config.syllabarySubsets = args[++i].split(',');
        break;
      case '--chars':
        config.charSubsets = args[++i].split(',');
        break;
      case '--output':
      case '-o':
        config.outputPath = args[++i];
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
    }
  }
  
  return true; // Indicates command-line mode
}

function showHelp() {
  console.log(`
📚 Kana Sheet PDF Generator (Standalone)

Usage: node scripts/generate-pdf-standalone.js [options]

Options:
  -t, --type <type>           Syllabary type (hiragana, katakana)
  -d, --direction <dir>       Direction (syllabaryToRomaji, romajiToSyllabary)
  -f, --format <format>       Page format (halfPage, fullPage)
  -p, --pages <number>        Number of pages to generate
  -c, --correction <bool>     Show correction section (true/false)
  -s, --subsets <list>        Syllabary subsets (gojuon,dakuten,handakuten,yoon)
  --chars <list>              Character subsets (a_ko,sa_to,na_ho,ma_yo,ra_n)
  -o, --output <path>         Output file path
  -h, --help                  Show this help message

Examples:
  node scripts/generate-pdf-standalone.js --type hiragana --pages 2 --correction true
  node scripts/generate-pdf-standalone.js -t katakana -p 1 -s gojuon,dakuten -o ./my-exercises.pdf
  node scripts/generate-pdf-standalone.js --type hiragana --subsets gojuon,yoon --chars a_ko,sa_to

Default configuration:
  Type: hiragana
  Direction: syllabaryToRomaji
  Format: halfPage
  Pages: 1
  Correction: true
  Subsets: gojuon,dakuten,handakuten,yoon (all subsets)
  Characters: a_ko,sa_to,na_ho,ma_yo,ra_n (all ranges)
  Output: ./output/kana-exercises.pdf
`);
}

async function main() {
  const argsResult = parseArgs();
  
  if (argsResult === null) {
    // Interactive mode
    console.log('🎯 Interactive PDF Generator Mode\n');
    const params = await promptForParameters();
    
    // Update config with user input
    config.syllabaryType = params.syllabaryType;
    config.direction = params.direction;
    config.pageFormat = params.pageFormat;
    config.pageCount = params.pageCount;
    config.showCorrection = params.showCorrection;
    config.syllabarySubsets = params.syllabarySubsets;
    config.charSubsets = params.charSubsets;
    config.outputPath = params.outputPath;
    
    console.log('\n🚀 Starting PDF generation with your settings...\n');
  }
  
  await generatePDF();
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

module.exports = { generatePDF, config };
