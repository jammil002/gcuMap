import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import * as Location from "expo-location";
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroSphere,
  ViroMaterials,
} from "@viro-community/react-viro";

ViroMaterials.createMaterials({
  sphereMaterial: {
    diffuseColor: "#1F00FF",
  },
});

const TestScreen = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [showARScene, setShowARScene] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup function to handle component unmount and other cleanup operations
      setShowARScene(false);
      setLoading(false);
    };
  }, []);

  const handleSetCurrentLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access location was denied"
      );
      setLoading(false);
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      setLatitude(String(location.coords.latitude));
      setLongitude(String(location.coords.longitude));
    } catch (error) {
      Alert.alert("Error", "Failed to fetch location");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startARScene = () => {
    if (!latitude || !longitude) {
      Alert.alert(
        "Invalid Input",
        "Please enter valid latitude and longitude."
      );
      return;
    }
    setShowARScene(true);
  };

  const renderARScene = () => (
    <ViroARScene>
      <ViroSphere
        position={[0, 0, -2]} // Position the sphere 2 meters in front of the user
        radius={0.1} // Sphere radius
        materials={["sphereMaterial"]}
      />
    </ViroARScene>
  );

  return (
    <View style={{ flex: 1 }}>
      {!showARScene && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={latitude}
            onChangeText={setLatitude}
            placeholder="Latitude"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={longitude}
            onChangeText={setLongitude}
            placeholder="Longitude"
            keyboardType="numeric"
          />
          <Button
            title="Use Current Location"
            onPress={handleSetCurrentLocation}
            disabled={loading}
          />
          <Button title="Start AR Scene" onPress={startARScene} />
        </View>
      )}
      {showARScene && (
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{ scene: renderARScene }}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
    borderRadius: 4,
  },
});

export default TestScreen;
