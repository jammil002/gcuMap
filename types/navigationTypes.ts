import { StackNavigationProp } from "@react-navigation/stack";
import { MapNode, POI } from "../interfaces/navigationInterfaces";

export type RootStackParamList = {
  Landing: undefined;
  Search: undefined;
  Favorites: undefined;
  Settings: undefined;
  Navigate: { poi: POI };
  TestScreen: undefined;
};

export type LandingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Landing"
>;

export type SearchScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Search"
>;

export interface ARPathwayProps {
  navigationNodes: MapNode[];
}

export type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Settings"
>;

export type FavoritesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Favorites"
>;
