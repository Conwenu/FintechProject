import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/home-screen";
import EventDetailScreen from "../screens/event-detail-screen";
import { navOptions } from "./options";
import { useNavigation } from "@react-navigation/native";
import ProfileDetailScreen from "../screens/profiles/profiles-detail-screen";
import ProfileScreen from "../screens/profiles/profiles-screen";

import LoginScreen from "../screens/SignIn/LoginScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";
import SignInScreen from "../screens/SignIn/SignIn";
import SignUpScreen from "../screens/Register/SignUp";
import InitialSettingCurrency from "../screens/InitialSetting/InitialSettingCurrency";
import InitialSettingBudget from "../screens/InitialSetting/InitialSettingBudget";
import { View, Text } from "react-native";
import Splash from "../screens/Splash/Splash";
import { TabLayout } from "./tabs";
import { NewLogin } from "../screens/SignIn/new-login";
const Stack = createStackNavigator();

// export const HomeStack = () => {
//   const navgation = useNavigation()
//   return (
//     <Stack.Navigator screenOptions={() => navOptions(navgation)}>
//       <Stack.Screen name="HomeTabs" component={TabLayout} />
//       <Stack.Screen name="Event" component={EventDetailScreen} />
//     </Stack.Navigator>
//   );
// };


export const AuthenticationStack = () => {
  const navgation = useNavigation()
  return (
    <Stack.Navigator screenOptions={() => navOptions(navgation)}>
      {/* <Stack.Screen name="SignIn" component={SignInScreen} /> */}
      <Stack.Screen name="SignIn" component={NewLogin} />
      <Stack.Screen name="SignUp" component={SignUpScreen} /> 
    </Stack.Navigator>
  );
};


// export const ProfileStack = () => {
//   const navgation = useNavigation()
//   return (
//     <Stack.Navigator screenOptions={() => navOptions(navgation)}>
//       <Stack.Screen name="Profiles" component={ProfileScreen} />
//       <Stack.Screen name="Profile" component={ProfileDetailScreen} />
//     </Stack.Navigator>
//   );
// };

export const SplashStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator screenOptions={() => navOptions(navigation)}>
      <Stack.Screen name = "Splash" component={<Splash/>}/>
    </Stack.Navigator>
  )
}

export const AppStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator screenOptions={() => navOptions(navigation)}>
      <Stack.Screen name="InitialSettingCurrency" component={InitialSettingCurrency} />
      <Stack.Screen name="InitialSettingBudget" component={InitialSettingBudget} />
      <Stack.Screen name="HomeTabs" component={TabLayout} />
    </Stack.Navigator>
  )
}