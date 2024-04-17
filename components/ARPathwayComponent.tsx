import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  ViroARScene,
  ViroNode,
  ViroMaterials,
  ViroSphere,
  ViroARSceneNavigator,
} from "@viro-community/react-viro";
import * as Location from "expo-location";
import {
  MapNode,
  UserPosition,
  DistanceAndBearing,
} from "../interfaces/navigationInterfaces";

const ARPathwayComponent: React.FC<{ navigationNodes: MapNode[] }> = ({
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
    if (
      !userPosition ||
      userPosition.latitude === undefined ||
      userPosition.longitude === undefined
    ) {
      console.log("User position is not properly defined.");
      return [0, 0, 0];
    }

    console.log(
      "User Position:",
      userPosition.latitude,
      userPosition.longitude
    );
    console.log("Node Position:", node.longitude, node.latitude);

    // Calculate distance and bearing
    const { distance, bearing } = getDistanceAndBearing(
      userPosition.latitude,
      userPosition.longitude,
      node.latitude,
      node.longitude
    );

    console.log(`Distance: ${distance}, Bearing: ${bearing}`);

    // Convert distance and bearing to AR coordinates
    if (userPosition.heading !== undefined && userPosition.heading !== null) {
      const angleFromUserHeading = (bearing - userPosition.heading + 360) % 360;
      const radians = (angleFromUserHeading * Math.PI) / 180;

      const x = Math.cos(radians) * distance;
      const z = Math.sin(radians) * distance;

      console.log(`X: ${x}, Z: ${z}`);
      return [x, 0, -z];
    }

    return [0, 0, 0];
  };

  ViroMaterials.createMaterials({
    nodeMaterial: {
      diffuseColor: "#532b88",
    },
  });

  // Generating breadcrumbs
  const breadcrumbs = navigationNodes
    .slice(0, currentNodeIndex)
    .map((node, index) => {
      const position = convertGeoToARCoords(node, userPosition!);
      console.log("Calculated AR Coords"); // Assuming userPosition is always available here
      return (
        <ViroSphere
          key={`breadcrumb-${index}`}
          position={position}
          radius={0.05} // Smaller radius for breadcrumbs
          materials={["nodeMaterial"]}
        />
      );
    });

  return (
    <ViroARScene>
      {breadcrumbs}
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
          {/* Additional content as needed */}
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
  // Convert degrees to radians
  function degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  console.log(startLatitude, startLongitude, endLatitude, endLongitude);

  // Ensure the input values are within the valid range
  if (
    !isFinite(startLatitude) ||
    !isFinite(startLongitude) ||
    !isFinite(endLatitude) ||
    !isFinite(endLongitude)
  ) {
    console.error("Invalid input values for latitude or longitude");
    return { distance: NaN, bearing: NaN };
  }

  const earthRadiusMeters = 6371000; // Radius of the Earth in meters
  const lat1 = degreesToRadians(startLatitude);
  const lon1 = degreesToRadians(startLongitude);
  const lat2 = degreesToRadians(endLatitude);
  const lon2 = degreesToRadians(endLongitude);

  const deltaLat = lat2 - lat1;
  const deltaLon = lon2 - lon1;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadiusMeters * c;

  const y = Math.sin(deltaLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
  const bearingDegrees = (Math.atan2(y, x) * 180) / Math.PI;
  const bearing = (bearingDegrees + 360) % 360; // Normalize bearing

  console.log(`Calculated Distance: ${distance}, Bearing: ${bearing}`);
  return { distance, bearing };
}

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export default ARPathwayComponent;
