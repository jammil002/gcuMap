import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import * as Location from "expo-location";
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
} from "@viro-community/react-viro";

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

  const handleARSceneInitialized = (state: any, reason: any) => {
    // You might need to adjust the handling here based on your specific use case
    if (state === "TRACKING_NORMAL") {
      // handle normal tracking state
    } else if (state === "TRACKING_NONE") {
      // handle tracking loss
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
      <ViroARSceneNavigator
        initialScene={{
          scene: () => (
            <ViroARScene onTrackingUpdated={handleARSceneInitialized}>
              <ViroText
                text={`Node at Lat: ${latitude}, Long: ${longitude}`}
                position={[0, 0, -1]}
                style={styles.arText}
              />
            </ViroARScene>
          ),
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#f5f5f5",
    height: 200,
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
  arText: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});

export default TestScreen;
