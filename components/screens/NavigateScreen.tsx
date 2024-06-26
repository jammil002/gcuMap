import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import { POI, MapNode } from "../../interfaces/navigationInterfaces";
import { ViroARSceneNavigator } from "@viro-community/react-viro";
import { ARPathwayComponent } from "../ARPathwayComponent";
import { ARTestComponent } from "../ARTestComponent";

export default function NavigateScreen({ route }: { route: any }) {
  const { poi } = route.params as { poi: POI };
  const [closestNode, setClosestNode] = useState<POI | null>(null);
  const [navigationPath, setNavigationPath] = useState<MapNode[]>([]);

  useEffect(() => {
    const fetchLocationAndClosestNode = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Permission to access location was denied"
        );
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      try {
        const response = await fetch(
          "https://capstone-api-bay.vercel.app/closestNode",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userlatitude: currentLocation.coords.latitude,
              userlongitude: currentLocation.coords.longitude,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch closest node");
        }

        const closestNodeData = await response.json();
        setClosestNode(closestNodeData);
      } catch (error) {
        console.error("Error fetching closest node:", error);
        Alert.alert("Error", "Failed to fetch closest node");
      }
    };

    fetchLocationAndClosestNode();
  }, []);

  useEffect(() => {
    const navigateToPOI = async () => {
      if (!closestNode || !poi) {
        console.log("Missing node information for navigation.");
        return;
      }

      try {
        const response = await fetch(
          "https://capstone-api-bay.vercel.app/navigate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              startId: closestNode.NodeID,
              goalId: poi.NodeID,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const navigationData = await response.json();
        console.log(navigationData);
        setNavigationPath(navigationData.path);
      } catch (error) {
        console.error("Failed to fetch navigation path:", error);
        Alert.alert("Error", "Failed to fetch navigation path");
      }
    };

    if (closestNode && poi) {
      navigateToPOI();
    }
  }, [closestNode, poi]);

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    arView: {
      flex: 1, // Ensures that the AR view occupies the full space
    },
    loadingText: {
      fontSize: 18, // Or any appropriate size
      color: "#000", // Any color that suits your design
      textAlign: "center", // Centers text horizontally
    },
  });

  return (
    <View
      style={navigationPath.length > 0 ? styles.arView : styles.mainContainer}
    >
      {navigationPath.length > 0 ? (
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{ scene: ARTestComponent }}
          // initialScene={{
          //   scene: () => (
          //     <ARPathwayComponent navigationNodes={navigationPath} />
          //   ),
          // }}
        />
      ) : (
        <Text style={styles.loadingText}>Loading navigation path...</Text>
      )}
    </View>
  );
}
