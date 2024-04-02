import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  ViroARScene,
  ViroNode,
  ViroMaterials,
  ViroSphere,
} from "@viro-community/react-viro";
import * as Location from "expo-location";
import {
  MapNode,
  UserPosition,
  DistanceAndBearing,
} from "../interfaces/navigationInterfaces";
import { ARPathwayProps } from "../types/navigationTypes";

const ARPathway: React.FC<{ navigationNodes: MapNode[] }> = ({
  navigationNodes,
}) => {
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);
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
            heading: location.coords.heading,
          });
        }
      );

      return () => subscription.remove();
    })();
  }, []);

  const convertGeoToARCoords = (
    node: MapNode,
    userPosition: UserPosition
  ): [number, number, number] => {
    // Calculate distance and bearing
    const { distance, bearing } = getDistanceAndBearing(
      userPosition.latitude,
      userPosition.longitude,
      node.Latitude,
      node.Longitude
    );

    // Convert distance and bearing to AR coordinates
    if (userPosition.heading) {
      const angleFromUserHeading = (bearing - userPosition.heading + 360) % 360;
      const radians = (angleFromUserHeading * Math.PI) / 180;

      const x = Math.cos(radians) * distance;
      const z = Math.sin(radians) * distance;

      return [x, 0, -z];
    }

    return [0, 0, 0];
  };

  ViroMaterials.createMaterials({
    nodeMaterial: {
      diffuseColor: "#FF0000",
    },
  });

  return (
    <ViroARScene>
      {currentNode && userPosition && (
        <ViroNode
          position={convertGeoToARCoords(currentNode, userPosition)}
          key={currentNode.NodeID}
        >
          <ViroSphere
            radius={0.1}
            position={[0, 0, -1]}
            materials={["nodeMaterial"]}
          />
        </ViroNode>
      )}
    </ViroARScene>
  );
};

function getDistanceAndBearing(
  startLatitude: number,
  startLongitude: number,
  endLatitude: number,
  endLongitude: number
): DistanceAndBearing {
  const earthRadiusMeters = 6371000; // Radius of the Earth in meters
  const deltaLatitudeRadians = degreesToRadians(endLatitude - startLatitude);
  const deltaLongitudeRadians = degreesToRadians(endLongitude - startLongitude);

  const a =
    Math.sin(deltaLatitudeRadians / 2) * Math.sin(deltaLatitudeRadians / 2) +
    Math.cos(degreesToRadians(startLatitude)) *
      Math.cos(degreesToRadians(endLatitude)) *
      Math.sin(deltaLongitudeRadians / 2) *
      Math.sin(deltaLongitudeRadians / 2);

  const centralAngleRadians = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusMeters * centralAngleRadians; // Distance in meters

  // Calculate bearing
  const y =
    Math.sin(deltaLongitudeRadians) * Math.cos(degreesToRadians(endLatitude));
  const x =
    Math.cos(degreesToRadians(startLatitude)) *
      Math.sin(degreesToRadians(endLatitude)) -
    Math.sin(degreesToRadians(startLatitude)) *
      Math.cos(degreesToRadians(endLatitude)) *
      Math.cos(deltaLongitudeRadians);
  let bearingRadians = Math.atan2(y, x);
  let bearingDegrees = radiansToDegrees(bearingRadians);
  bearingDegrees = (bearingDegrees + 360) % 360; // Normalize to 0-360

  return { distance, bearing: bearingDegrees };
}

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export default ARPathway;
