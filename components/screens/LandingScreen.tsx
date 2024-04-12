import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LandingScreenNavigationProp } from "../../types/navigationTypes";

const LandingScreen: React.FC = () => {
  const navigation = useNavigation<LandingScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>gcuMaps</Text>
      <Text style={styles.subheaderText}>an easy way to get around campus</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Search")}>
        <Text style={styles.text}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
        <Text style={styles.text}>Favorites</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <Text style={styles.text}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20,
    backgroundColor: "#FFF",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "purple",
    marginBottom: 4,
  },
  subheaderText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    paddingVertical: 10,
  },
});
