import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Font,
} from "@react-pdf/renderer";
import { Exercise, SyllabarySubset } from "@/lib/types";

import path from "path";
import { syllabarySubsetsRecord } from "../lib/utils";

Font.register({
  family: "Noto Sans JP",
  fonts: [
    {
      src: path.resolve(process.cwd(), "./public/fonts/noto-sans-jp-light.ttf"),
      fontWeight: 300,
    },
    {
      src: path.resolve(
        process.cwd(),
        "./public/fonts/noto-sans-jp-regular.ttf"
      ),
      fontWeight: 400,
    },
    {
      src: path.resolve(process.cwd(), "./public/fonts/noto-sans-jp-bold.ttf"),
      fontWeight: 700,
    },
  ],
});

type Props = {
  exercises: Exercise[];
  showCorrection: boolean;
  dictionary: Record<string, string>;
  categories: SyllabarySubset[];
};

export const PDFDocument = ({
  exercises,
  showCorrection,
  dictionary,
  categories,
}: Props) => {
  return (
    <Document>
      {exercises.map(({ direction, type, grid, pageFormat }, index) => {
        const isSyllabaryToRomaji = direction === "syllabaryToRomaji";

        const directionLabel = isSyllabaryToRomaji
          ? `${dictionary[type]} → ${dictionary.romaji}`
          : `${dictionary.romaji} → ${dictionary[type]}`;

        const pageLabel = exercises.length > 1 ? ` ${index + 1}` : "";

        return (
          <Page size="A4" style={styles.page} key={index}>
            {getSectionHeader(
              dictionary,
              pageLabel,
              directionLabel,
              categories
            )}

            <View style={styles.grid}>
              {grid.map((item, idx) => {
                const char = isSyllabaryToRomaji ? item.char : item.romaji;
                return (
                  <View key={idx} style={styles.cell}>
                    <Text
                      style={
                        isSyllabaryToRomaji
                          ? styles.characterJP
                          : styles.characterLatin
                      }
                    >
                      {char}
                    </Text>
                    <View style={styles.writingBox}></View>
                  </View>
                );
              })}
            </View>

            {showCorrection && (
              <View break={pageFormat === "fullPage" ? true : false}>
                {getSectionHeader(
                  dictionary,
                  pageLabel,
                  directionLabel,
                  categories,
                  true
                )}
                <View style={styles.grid}>
                  {grid.map((item, idx) => {
                    const correction = isSyllabaryToRomaji
                      ? item.romaji
                      : item.char;
                    return (
                      <View key={idx} style={styles.cell}>
                        <View style={styles.correctionBox}>
                          <Text style={styles.correctionCharacter}>
                            {correction}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </Page>
        );
      })}
    </Document>
  );
};

function getSectionHeader(
  dictionary: Record<string, string>,
  pageLabel: string,
  directionLabel: string,
  categories: SyllabarySubset[],
  isCorrection?: boolean
) {
  return (
    <View style={styles.header}>
      <View style={{ display: "flex", flexDirection: "row" }}>
        {!isCorrection && (
          <>
            <Text style={styles.logo}>Kana</Text>
            <Text>&apos;Sheet - </Text>
          </>
        )}
        <Text style={{ fontWeight: 400 }}>
          {!isCorrection ? dictionary.exercise : dictionary.correction}
          {pageLabel}
        </Text>
      </View>
      <View>
        <Text style={{ fontWeight: 400, color: "#cacaca", fontSize: "8px" }}>
          {directionLabel} (
          {categories.sort(sortByCategory).map((x, index) => {
            const isLast = categories.length - 1 === index;
            return `${syllabarySubsetsRecord[x]}${!isLast ? " - " : ""}`;
          })}
          )
        </Text>
      </View>
    </View>
  );
}

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
  correctionSection: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
});

const order = ["gojuon", "dakuten", "handakuten", "yoon"];

const sortByCategory = (() => {
  const orderMap = Object.fromEntries(order.map((key, index) => [key, index]));
  return (a: string, b: string) =>
    (orderMap[a] ?? Infinity) - (orderMap[b] ?? Infinity);
})();
