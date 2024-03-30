import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { POI, MapNode } from "../../interfaces/navigationInterfaces"; // Adjust this import as necessary
import LoadingComponent from "../LoadingComponent";
import ErrorComponent from "../ErrorComponent";

const SearchScreen: React.FC = () => {
  const [POIs, setPOIs] = useState<POI[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPOIs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("https://capstone-api-bay.vercel.app/POI");
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const nodes: MapNode[] = await response.json();
        const pois: POI[] = nodes.map((node) => ({
          ...node,
          isFavorite: false,
        }));
        setPOIs(pois);
      } catch (error) {
        setError("An error occurred while fetching the POIs.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPOIs();
  }, []);

  const toggleFavorite = async (selectedPoi: POI) => {
    const updatedPOIs = POIs.map((poi) => {
      if (poi.NodeID === selectedPoi.NodeID) {
        return { ...poi, isFavorite: !poi.isFavorite };
      }
      return poi;
    });
    setPOIs(updatedPOIs);
    await AsyncStorage.setItem(
      "favorites",
      JSON.stringify(updatedPOIs.filter((poi) => poi.isFavorite))
    );
  };

  const filteredPOIs = useMemo(() => {
    return POIs.filter((poi) =>
      poi.Name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [POIs, searchQuery]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingComponent />
      ) : error ? (
        <ErrorComponent message={error || "Unknown error"} />
      ) : (
        <>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a POI..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <FlatList
            data={filteredPOIs}
            keyExtractor={(item) => item.NodeID.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.title}>{item.Name}</Text>
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
        </>
      )}
    </View>
  );
};

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
});

export default SearchScreen;
