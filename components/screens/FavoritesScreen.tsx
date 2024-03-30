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
import POI from "../../interfaces/navigationInterfaces"; // Update the import path as necessary

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<POI[]>([]);

  useEffect(() => {
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
  }, []);

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
            <FontAwesome5 name="star" solid size={24} color="purple" />
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
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});
