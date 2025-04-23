import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Font,
} from "@react-pdf/renderer";
import { Exercise } from "@/lib/types";

import path from "path";

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
Font.register({
  family: "Inter",
  src: path.resolve(process.cwd(), "./public/fonts/Inter-SemiBold.woff2"),
  fontWeight: 500,
});

type Props = {
  exercises: Exercise[];
  showCorrection: boolean;
  dictionary: Record<string, string>;
};

export const PDFDocument = ({
  exercises,
  showCorrection,
  dictionary,
}: Props) => {
  return (
    <Document>
      {exercises.map((exercise, index) => {
        const directionLabel =
          exercise.direction === "syllabaryToRomaji"
            ? `${dictionary[exercise.type]} → ${dictionary.romaji}`
            : `${dictionary.romaji} → ${dictionary[exercise.type]}`;

        const pageLabel = exercises.length > 1 ? ` ${index + 1}` : "";
        const title = `${dictionary.exercise}${pageLabel} - ${directionLabel}`;

        return (
          <Page size="A4" style={styles.page} key={index}>
            <Text style={styles.header}>
              <Text style={styles.logo}>Jap</Text>&apos;App - {title}
            </Text>

            <View style={styles.grid}>
              {exercise.grid.map((item, idx) => {
                const char =
                  exercise.direction === "syllabaryToRomaji"
                    ? item.char
                    : item.romaji;
                return (
                  <View key={idx} style={styles.cell}>
                    <Text style={styles.character}>{char}</Text>
                    <View style={styles.writingBox}></View>
                  </View>
                );
              })}
            </View>

            {showCorrection && (
              <View style={styles.correctionSection}>
                <Text style={styles.header}>
                  {dictionary.correction}
                  {pageLabel} - {directionLabel}
                </Text>
                <View style={styles.grid}>
                  {exercise.grid.map((item, idx) => {
                    const correction =
                      exercise.direction === "syllabaryToRomaji"
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

const styles = StyleSheet.create({
  page: {
    color: "#000",
    fontFamily: "Noto Sans JP",
    fontWeight: "bold",
    fontSize: 12,
    padding: 16,
    lineHeight: 1.6,
  },
  header: {
    fontSize: 12,
    borderBottom: "1px solid #ccc",
    marginBottom: 10,
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

  character: {
    fontFamily: "Noto Sans JP",
    fontWeight: 400,
    fontSize: 18,
    marginBottom: 10,
  },
  characterLatin: {
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: 18,
    marginBottom: 10,
  },
  correctionCharacter: {
    fontFamily: "Noto Sans JP",
    fontWeight: 400,
    fontSize: 12,
  },
  correctionLatin: {
    fontFamily: "Inter",
    fontWeight: 400,
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
  correctionSection: {},
});
