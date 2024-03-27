import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  RootStackParamList,
  LandingScreenNavigationProp,
} from "../../types/navigationTypes";
import { useNavigation } from "@react-navigation/native";

const LandingScreen: React.FC = () => {
  const navigation = useNavigation<LandingScreenNavigationProp>();

  return (
    <View style={styles.container}>
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
    backgroundColor: "#FFF", // Or choose a stark, plain background color typical of Neo-Brutalism
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000", // High contrast text color
    paddingVertical: 10, // Space out the options
  },
});
