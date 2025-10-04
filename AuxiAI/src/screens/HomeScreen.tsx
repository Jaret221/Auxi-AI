// src/screens/HomeScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ImageBackground,
  Pressable,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { appTheme } from "../styles/appTheme";

const backgrounds = [
  require("../../assets/Fondos/1.png"),
  require("../../assets/Fondos/4.png"),
  require("../../assets/Fondos/8.png"),
];

export default function HomeScreen({ navigation }: any) {
  const [background, setBackground] = useState(backgrounds[0]);
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(200)).current;

  // Fondo aleatorio al cargar
  useEffect(() => {
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackground(randomBg);
  }, []);

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={appTheme.container}>
      <ImageBackground source={background} style={appTheme.backgroundImage}>
        {/* Botón menú superior derecho */}
        <TouchableOpacity style={appTheme.menuButton} onPress={toggleMenu}>
          <Icon name="menu" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Botón central AuxiChat */}
        <View style={styles.centerButtonContainer}>
          <TouchableOpacity
            style={styles.auxiChatButton}
            onPress={() => navigation.navigate("Chat")}
          >
            <Text style={styles.auxiChatText}>AuxiChat</Text>
          </TouchableOpacity>
        </View>

        {/* Menú lateral derecho */}
        {menuVisible && (
          <>
            {/* Overlay semitransparente */}
            <Pressable
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1, // <- debajo del menú
              }}
              onPress={toggleMenu}
            />

            <Animated.View
              style={[
                appTheme.menuContainer,
                { transform: [{ translateX: slideAnim }], zIndex: 2 },
              ]}
            >
              <Text style={appTheme.menuTitle}>Menú</Text>

              <TouchableOpacity
                style={appTheme.menuItem}
                onPress={() => navigation.navigate("Profile", { id: 1 })}
              >
                <Text>👤 Datos de Usuario</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={appTheme.menuItem}
                onPress={() => alert("Historial médico")}
              >
                <Text>📋 Historial Médico</Text>
              </TouchableOpacity>

              {/* Botón cerrar sesión */}
              <TouchableOpacity
                style={appTheme.logoutButton}
                onPress={() => {
                  alert("Sesión cerrada correctamente");
                  toggleMenu();
                  navigation.navigate("Login");
                }}
              >
                <Text style={appTheme.logoutText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  centerButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  auxiChatButton: {
    borderWidth: 2,
    borderColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  auxiChatText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
