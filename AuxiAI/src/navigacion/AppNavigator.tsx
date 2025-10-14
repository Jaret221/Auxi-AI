import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { ChatScreen } from '../screens/Usuario/ChatScreen';
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/Usuario/ProfileScreen";
import RegisterScreen from '../screens/RegisterScreen';
import HelpScreen from "../screens/Usuario/HelpScreen";
import ProtocolSearchScreen from "../screens/Funciones/ProtocolSearchScreen";
import VoiceSettings from "../screens/Funciones/TTSSettingsScreen";
import { HistorialMedicoScreen } from "../screens/Usuario/HistorialMedicoScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
       <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="ProtocolSearch" component={ProtocolSearchScreen} />
      <Stack.Screen name="VoiceSettings" component={VoiceSettings} />
            <Stack.Screen name="HistorialMedico" component={HistorialMedicoScreen} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}
