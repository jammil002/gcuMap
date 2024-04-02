// ARPathway.tsx
import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  ViroARScene,
  ViroNode,
  ViroMaterials,
  ViroSphere,
} from "@viro-community/react-viro";
import * as Location from "expo-location";
import { MapNode } from "../interfaces/navigationInterfaces"; // Adjust the import path as necessary

interface ARPathwayProps {
  navigationNodes: MapNode[];
}

const ARPathway: React.FC<ARPathwayProps> = ({ navigationNodes }) => {
  const [userPosition, setUserPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const currentNode = navigationNodes[currentNodeIndex];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission",
          "Permission to access location was denied"
        );
        return;
      }

      const subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (location) => {
          setUserPosition({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );

      return () => subscription.remove();
    })();
  }, []);

  const convertGeoToARCoords = (node: MapNode): [number, number, number] => {
    // Your conversion logic here
    return [0, 0, -1]; // Example conversion
  };

  ViroMaterials.createMaterials({
    nodeMaterial: {
      diffuseColor: "#FF0000", // Customize as needed
    },
  });

  return (
    <ViroARScene>
      {currentNode && (
        <ViroNode
          position={convertGeoToARCoords(currentNode)}
          key={currentNode.NodeID}
        >
          <ViroSphere
            radius={0.1}
            position={[0, 0, -1]} // Adjust based on your conversion logic
            materials={["nodeMaterial"]}
          />
          {/* Any additional AR content specific to the node */}
        </ViroNode>
      )}
    </ViroARScene>
  );
};

export default ARPathway;
