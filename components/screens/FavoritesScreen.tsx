import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { POI } from "../../interfaces/navigationInterfaces";
import { FavoritesScreenNavigationProp } from "../../types/navigationTypes";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<POI[]>([]);
  const navigation = useNavigation<FavoritesScreenNavigationProp>(); // Use navigation hook

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const favoritesJson = await AsyncStorage.getItem("favorites");
          if (favoritesJson) {
            setFavorites(JSON.parse(favoritesJson));
          }
        } catch (error) {
          console.error("Error loading favorites:", error);
        }
      };

      loadFavorites();
    }, [])
  );

  const toggleFavorite = async (selectedPoi: POI) => {
    let updatedFavorites = favorites.filter(
      (fav) => fav.NodeID !== selectedPoi.NodeID
    );

    if (updatedFavorites.length === favorites.length) {
      updatedFavorites.push({ ...selectedPoi, isFavorite: true });
    }

    setFavorites(updatedFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.NodeID.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("Navigate", { poi: item })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.Name}</Text>
              <Text style={styles.description}>
                {item.Description || "No description available."}
              </Text>
            </View>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation(); // Prevent navigation when toggling the favorite
                toggleFavorite(item);
              }}
              style={{ padding: 10 }}
            >
              <FontAwesome5
                name="star"
                solid={item.isFavorite}
                size={24}
                color={item.isFavorite ? "purple" : "grey"}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    flex: 1, // This pushes the star icon to the right
  },
  description: {
    fontSize: 14,
    color: "#666",
    flex: 1, // Ensures description fills the space and is aligned properly
  },
  favoriteIcon: {
    padding: 10, // Provides padding for easier tapping
  },
});
