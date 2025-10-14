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
  Alert,
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
  const slideAnim = useRef(new Animated.Value(300)).current;

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
        {/* Icono de ayuda superior izquierdo como burbuja */}
        <TouchableOpacity
          style={styles.helpBubble}
          onPress={() => navigation.navigate("Help")}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>?</Text>
        </TouchableOpacity>

        {/* Botón menú superior derecho */}
        <TouchableOpacity style={appTheme.menuButton} onPress={toggleMenu}>
          <Icon name="menu" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Frase central */}
        <View style={styles.centerTextContainer}>
          <Text style={styles.centerPhrase}>AuxiIA, la IA que te cuida</Text>
        </View>

        {/* Botón central AuxiChat más largo */}
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
            <Pressable style={styles.overlay} onPress={toggleMenu} />
            <Animated.View
              style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}
            >
              <Text style={styles.menuTitle}>Menú Principal</Text>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("Profile", { id: 1 })}
              >
                <Icon name="person-outline" size={20} color="#333" />
                <Text style={styles.menuItemText}>Datos de Usuario</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("HistorialMedico")}
              >
                <Icon name="document-text-outline" size={20} color="#333" />
                <Text style={styles.menuItemText}>Historial Médico</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("ProtocolSearch")}
              >
                <Icon name="list-outline" size={20} color="#333" />
                <Text style={styles.menuItemText}>Protocolos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("VoiceSettings")}
              >
                <Icon name="mic-outline" size={20} color="#333" />
                <Text style={styles.menuItemText}>Voice Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => {
                  alert("Sesión cerrada correctamente");
                  toggleMenu();
                  navigation.navigate("Login");
                }}
              >
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  helpBubble: {
    position: "absolute",
    left: 20,
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  centerTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  centerPhrase: {
    fontStyle: "italic",
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
  centerButtonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 100,
  },
  auxiChatButton: {
    borderWidth: 2,
    borderColor: "#fff",
    paddingVertical: 22,
    paddingHorizontal: 70, // más largo
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  auxiChatText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 260,
    height: "100%",
    backgroundColor: "#fff",
    padding: 20,
    zIndex: 2,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: -3, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#e74c3c",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
