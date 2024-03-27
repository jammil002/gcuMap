import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import POI from "../../interfaces/navigationInterfaces";

const SearchScreen: React.FC = () => {
  const [POIs, setPOIs] = useState<POI[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPOIs = async () => {
      try {
        const response = await fetch("https://capstone-api-bay.vercel.app/POI");
        const data: POI[] = await response.json();
        setPOIs(data);
      } catch (error) {
        console.error("An error occurred while fetching the POIs:", error);
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
              /* Handle selection or navigation */
            }}
          >
            <Text style={styles.title}>{item.Name}</Text>
            <Text style={styles.description}>
              {item.Description || "No description available."}
            </Text>
          </TouchableOpacity>
        )}
      />
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
