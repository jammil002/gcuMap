import React from "react";
import {
  ViroARScene,
  ViroSphere,
  ViroMaterials,
} from "@viro-community/react-viro";

ViroMaterials.createMaterials({
  testMaterial: {
    diffuseColor: "purple",
  },
});

export const ARTestComponent = () => {
  return (
    <ViroARScene>
      <ViroSphere
        position={[0, 0, -2]}
        radius={0.2}
        materials={["testMaterial"]}
      />
      <ViroSphere
        position={[0, 0, -6]}
        radius={0.2}
        materials={["testMaterial"]}
      />
      <ViroSphere
        position={[0, 0, -10]}
        radius={0.2}
        materials={["testMaterial"]}
      />
      <ViroSphere
        position={[0, 0, -14]}
        radius={0.2}
        materials={["testMaterial"]}
      />
      <ViroSphere
        position={[0, 0, -16]}
        radius={0.2}
        materials={["testMaterial"]}
      />
      <ViroSphere
        position={[0, 0, -20]}
        radius={0.2}
        materials={["testMaterial"]}
      />
    </ViroARScene>
  );
};
