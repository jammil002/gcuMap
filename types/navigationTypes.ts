import { StackNavigationProp } from "@react-navigation/stack";
import POI from "../interfaces/navigationInterfaces";

export type RootStackParamList = {
  Landing: undefined;
  Search: undefined;
  Favorites: undefined;
  Settings: undefined;
  Navigate: { poi: POI };
};

export type LandingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Landing"
>;

export type SearchScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Search"
>;
