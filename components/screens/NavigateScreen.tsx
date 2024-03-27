import React from "react";
import { Text, View } from "react-native";
import POI from "../../interfaces/navigationInterfaces";

export default function NavigateScreen({ route }: { route: any }) {
  const { poi } = route.params as { poi: POI };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Navigation Station</Text>
      <Text>{poi.Name}</Text>
      <Text>{poi.Description}</Text>
    </View>
  );
}
