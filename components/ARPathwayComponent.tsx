import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  ViroARScene,
  ViroNode,
  ViroMaterials,
  ViroSphere,
} from "@viro-community/react-viro";
import * as Location from "expo-location";
import { MapNode, UserPosition } from "../interfaces/navigationInterfaces";

export const ARPathwayComponent: React.FC<{ navigationNodes: MapNode[] }> = ({
  navigationNodes,
}) => {
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);

  useEffect(() => {
    const requestPermissionsAndWatchPosition = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Location permission not granted");
          Alert.alert(
            "Location Permission",
            "Permission to access location was denied"
          );
          return;
        }

        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 1, // Update on every meter moved
          },
          (update) => {
            console.log("New user position received:", update.coords);
            setUserPosition({
              latitude: update.coords.latitude,
              longitude: update.coords.longitude,
              heading: update.coords.heading,
            });
          }
        );

        return () => {
          console.log("Removing location subscription");
          subscription.remove();
        };
      } catch (error) {
        console.error("Failed to set up location watch:", error);
        Alert.alert("Location Error", "Failed to start location monitoring");
      }
    };

    requestPermissionsAndWatchPosition();
  }, []);

  const convertGeoToARCoords = (node: MapNode): [number, number, number] => {
    if (!userPosition) {
      console.log("User position is not available yet.");
      return [0, 0, -1]; // Early return if user position is not defined
    }

    console.log(
      "User Position:",
      userPosition.latitude,
      userPosition.longitude,
      "Node Position:",
      node.latitude,
      node.longitude
    );

    const { distance, bearing } = getDistanceAndBearing(
      userPosition.latitude,
      userPosition.longitude,
      node.latitude,
      node.longitude
    );

    console.log(`Distance: ${distance}, Bearing: ${bearing}`);

    const angleFromUserHeading =
      (bearing - (userPosition.heading || 0) + 360) % 360;
    const radians = (angleFromUserHeading * Math.PI) / 180;
    const x = Math.cos(radians) * distance;
    const z = -Math.sin(radians) * distance;

    console.log(`X: ${x}, Z: ${z}`);
    return [x, 0, z];
  };

  ViroMaterials.createMaterials({
    nodeMaterial: {
      diffuseColor: "#532b88",
    },
  });

  return (
    <ViroARScene>
      {navigationNodes.map((node, index) => {
        const position = convertGeoToARCoords(node);
        console.log(`Sphere position for node ${node.NodeID}:`, position);
        return (
          <ViroSphere
            key={`breadcrumb-${index}`}
            position={position}
            radius={0.02} // Smaller radius for breadcrumbs
            materials={["nodeMaterial"]}
          />
        );
      })}
    </ViroARScene>
  );
};

function getDistanceAndBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  console.log(
    "Calculating distance and bearing from",
    lat1,
    lon1,
    "to",
    lat2,
    lon2
  );
  const earthRadiusMeters = 6371000; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180; // φ1, φ2 in radians
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadiusMeters * c; // Calculate the distance in meters
  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  const bearingDegrees = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360; // Normalize bearing to 0-360 degrees

  console.log(
    `Computed Distance: ${distance} meters, Bearing: ${bearingDegrees} degrees`
  );
  return { distance, bearing: bearingDegrees };
}
