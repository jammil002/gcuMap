import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { POI } from "../../interfaces/navigationInterfaces";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<POI[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

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
          <View style={styles.item}>
            <Text style={styles.title}>{item.Name}</Text>
            <Text style={styles.description}>
              {item.Description || "No description available."}
            </Text>
            <TouchableOpacity onPress={() => toggleFavorite(item)}>
              <FontAwesome5
                name="star"
                solid={item.isFavorite}
                size={24}
                color={item.isFavorite ? "purple" : "grey"}
              />
            </TouchableOpacity>
          </View>
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
  searchInput: {
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
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
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
});
