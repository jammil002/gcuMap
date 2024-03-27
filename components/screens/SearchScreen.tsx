import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import POI from "../../interfaces/navigationInterfaces";
import LoadingComponent from "../LoadingComponent";
import ErrorComponent from "../ErrorComponent";
import { SearchScreenNavigationProp } from "../../types/navigationTypes";

const SearchScreen: React.FC = () => {
  const [POIs, setPOIs] = useState<POI[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<SearchScreenNavigationProp>(); // Use the useNavigation hook

  useEffect(() => {
    const fetchPOIs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("https://capstone-api-bay.vercel.app/POI");
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data: POI[] = await response.json();
        setPOIs(data);
      } catch (error) {
        setError("An error occurred while fetching the POIs.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPOIs();
  }, []);

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
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={filteredPOIs}
            keyExtractor={(item) => item.NodeID.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  navigation.navigate("Navigate", { poi: item });
                }}
              >
                <Text style={styles.title}>{item.Name}</Text>
                <Text style={styles.description}>
                  {item.Description || "No description available."}
                </Text>
              </TouchableOpacity>
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

export default SearchScreen;
