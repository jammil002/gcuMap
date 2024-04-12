import React from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  RootStackParamList,
  SettingsScreenNavigationProp,
} from "../../types/navigationTypes";

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const handleDeleteData = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete all stored data?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear(); // This deletes all data from AsyncStorage
              Alert.alert(
                "Data Deleted",
                "All stored data has been successfully deleted."
              );
            } catch (error) {
              console.error("Failed to delete the data", error);
              Alert.alert("Error", "Failed to delete the stored data.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen</Text>
      <Button title="Delete All Data" color="red" onPress={handleDeleteData} />
      <Button
        title="Go to Test Screen"
        onPress={() => navigation.navigate("TestScreen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20, // Adjusted for better spacing
  },
});
