import { useThemeColors } from "@/hooks/useThemeColors";
import { useState } from "react";
import {Modal, Pressable, StyleSheet, Text, View, ScrollView} from "react-native";
import { types, TypeName } from "@/constants/pokemonTypes";
import { ThemedText } from "../ThemedText";
import { Card } from "../Card";
import { Shadows } from "@/constants/Shadows";
import { Colors } from '../../constants/Colors';

type Props = {
  value: TypeName[];
  onChange: (selected: TypeName[]) => void;
};

export function FilterButton({ value, onChange }: Props) {
  const colors = useThemeColors();
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleType = (type: TypeName) => {
    if (value.includes(type)) {
      onChange(value.filter((t) => t !== type));
    } else {
      onChange([...value, type]);
    }
  };

  return (
    <>
      <Pressable onPress={() => setModalVisible(true)}>
        <View
          style={[styles.button, { backgroundColor: colors.grayWhite }]}
        >
          <Text style={{ fontWeight: "bold", color: colors.tint }}>Filter</Text>
        </View>
      </Pressable>

      <Modal
        animationType="fade"
        transparent
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)} />
        <View style={[styles.popup, { backgroundColor: colors.tint }]}>
          <ThemedText
            style={styles.title}
            variant="subtitle2"
            color={colors.grayWhite}
          >
            Filter by Type
          </ThemedText>

          <Card style={styles.card}>
            <ScrollView contentContainerStyle={styles.typeList}>
              {Object.keys(types).map((type) => {
                const t = type as TypeName;
                const isSelected = value.includes(t);
                return (
                  <Pressable
                    key={t}
                    onPress={() => toggleType(t)}
                    style={[
                      styles.typeButton,
                      {
                        backgroundColor: isSelected ? types[t] : "white",
                        borderColor: types[t],
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: isSelected ? "white" : types[t],
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {t}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Card>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 32,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  popup: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -200 }],
    width: 300,
    maxHeight: 400,
    padding: 12,
    gap: 16,
    borderRadius: 16,
    ...Shadows.dp2,
  },
  title: {
    textAlign: "center",
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  typeList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  typeButton: {
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
