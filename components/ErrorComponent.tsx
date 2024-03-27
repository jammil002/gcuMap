import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ErrorComponentProps } from "../interfaces/componentInterfaces";

const ErrorComponent: React.FC<ErrorComponentProps> = ({ message }) => (
  <View style={styles.container}>
    <Text style={styles.message}>{message}</Text>
  </View>
);

export default ErrorComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
});
