import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Landing: undefined;
  Search: undefined;
  Favorites: undefined;
  Settings: undefined;
};

export type LandingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Landing"
>;
