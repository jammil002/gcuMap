import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import * as Location from "expo-location";

const TestScreen = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleSetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access location was denied"
      );
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLatitude(String(location.coords.latitude));
    setLongitude(String(location.coords.longitude));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Set Location Manually or Use Current Location
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={setLatitude}
        value={latitude}
        placeholder="Enter latitude"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        onChangeText={setLongitude}
        value={longitude}
        placeholder="Enter longitude"
        keyboardType="numeric"
      />
      <Button
        title="Set to Current Location"
        onPress={handleSetCurrentLocation}
      />
      <Button
        title="Save"
        onPress={() =>
          Alert.alert(
            "Location Set",
            `Latitude: ${latitude}, Longitude: ${longitude}`
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
});

export default TestScreen;
