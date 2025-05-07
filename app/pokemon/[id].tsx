import { Card } from "@/components/Card";
import { PokemonSpec } from "@/components/pokemon/PokemonSpec";
import { PokemonStat } from "@/components/pokemon/PokemonStat";
import { PokemonType } from "@/components/pokemon/PokemonType";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { formatSize, formatWeight, getPokemonArtwork, getPokemonArtworkShiny } from "@/functions/pokemon";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

export default function Pokemon() {
    const colors = useThemeColors();
    const params = useLocalSearchParams() as { id: string };
    const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: params.id });
    const { data: species } = useFetchQuery("/pokemon-species/[id]/", { id: params.id })
    const mainType = pokemon?.types?.[0].type.name;
    const colorType = mainType ? Colors.type[mainType] : colors.tint;
    const types = pokemon?.types ?? [];
    const [showShiny, setShowShiny] = useState(false);
    const bio = species?.flavor_text_entries
        ?.find(({ language }) => language.name == "en")
        ?.flavor_text.replaceAll("\n", " ");
    return (
        <RootView style={{ backgroundColor: colorType }}>
            <View>
                <Image
                    style={styles.pokeball}
                    source={require("@/assets/images/pokeball_big.png")}
                    width={208}
                    height={208}
                />
                <Row style={styles.header}>
                    <Row gap={8}>
                        <Pressable onPress={router.back}>
                            <Image
                                source={require("@/assets/images/back.png")}
                                width={32}
                                height={32}
                            />
                        </Pressable>
                        
                        {/* Titre */}
                        <ThemedText
                            color={colors.grayWhite}
                            variant="headline"
                            style={{ textTransform: "capitalize" }}
                        >
                            { pokemon?.name }
                        </ThemedText>
                    </Row>
                    {/* Numéro */}
                    <ThemedText color={colors.grayWhite} variant="subtitle2">
                        #{ params.id.padStart(3, "0") }
                    </ThemedText>
                </Row>
                <View style={styles.body}>
                    <Image
                        style={styles.artwork}
                        source={{
                            uri: showShiny
                                ? getPokemonArtworkShiny(params.id)
                                : getPokemonArtwork(params.id),
                        }}
                        width={200}
                        height={200}
                    />
                    <Card style={styles.card}>
                        <Row gap={16}>
                            {types.map((type) => (
                                <PokemonType name={type.type.name} key={type.type.name} />
                            ))}
                        </Row>
                        {/* About */}
                        <ThemedText variant="subtitle1" color={ colorType }>
                            About
                        </ThemedText>
                        <Row>
                            <PokemonSpec
                                style={{
                                    borderStyle: "solid",
                                    borderRightWidth: 1,
                                    borderColor: colors.grayLight,
                                }}
                                title={formatWeight(pokemon?.weight)}
                                description="Weight"
                                image={require("@/assets/images/weight.png")}
                            />
                            <PokemonSpec
                                style={{
                                    borderStyle: "solid",
                                    borderRightWidth: 1,
                                    borderColor: colors.grayLight,
                                }}
                                title={formatSize(pokemon?.height)}
                                description="Height"
                                image={require("@/assets/images/size.png")}
                            />
                            <PokemonSpec
                                title={pokemon?.moves
                                    .slice(0, 2)
                                    .map((m) => m.move.name)
                                    .join("\n")}
                                description="Moves"
                            />
                        </Row>
                        <ThemedText>{bio}</ThemedText>
                        
                        {/* Base stats */}
                        <ThemedText variant="subtitle1" color={ colorType }>
                            Base stats
                        </ThemedText>

                        <View style={{ alignSelf: "stretch" }}>
                            {pokemon?.stats.map((stat) => (
                                <PokemonStat
                                    key={stat.stat.name}
                                    name={stat.stat.name}
                                    value={stat.base_stat}
                                    color={colorType}
                                />
                            ))}
                        </View>
                        <Pressable
                            onPress={() => setShowShiny(!showShiny)}
                            style={{
                                backgroundColor: colorType,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 8,
                                alignItems: "center",
                                marginTop: 16,
                                alignSelf: "stretch"
                            }}
                        >
                            <Text style={{ color: "#fff", textAlign: "center" }}>
                                {showShiny ? "Show Normal" : "Show Shiny"}
                            </Text>
                        </Pressable>
                        <Row gap={16} style={{ marginTop: 16 }}>
                            <Pressable
                                onPress={() => {
                                const prevId = Math.max(1, Number(params.id) - 1);
                                router.replace(`/pokemon/${prevId}`);
                                }}
                                style={{
                                backgroundColor: colors.grayLight,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 8,
                                flex: 1,
                                alignItems: "center"
                                }}
                            >
                                <Text style={{ color: "#fff" }}>Précédent</Text>
                            </Pressable>

                            <Pressable
                                onPress={() => {
                                const nextId = Number(params.id) + 1;
                                router.replace(`/pokemon/${nextId}`);
                                }}
                                style={{
                                backgroundColor: colors.grayLight,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 8,
                                flex: 1,
                                alignItems: "center"
                                }}
                            >
                                <Text style={{ color: "#fff" }}>Next</Text>
                            </Pressable>
                        </Row>
                    </Card>
                </View>
            </View>
        </RootView>
    );
}

const styles = StyleSheet.create({
    header: {
        margin: 20,
        justifyContent: "space-between",
    },
    pokeball: {
        opacity: 0.1,
        position: "absolute",
        right: 8,
        top: 8,
        zIndex: -1,
    },
    artwork: {
        position: "absolute",
        top: -140,
        alignSelf: "center",
        zIndex: 2,
    },
    body: {
        marginTop: 144,
    },
    card: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        height: 600,
        gap: 16,
        alignItems: "center",
    }
});