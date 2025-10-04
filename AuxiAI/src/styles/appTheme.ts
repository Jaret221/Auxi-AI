// src/styles/appTheme.ts
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const appTheme = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  menuButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(239, 236, 236, 0.6)",
    padding: 12,
    borderRadius: 30,
    zIndex: 1,
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    width: width * 0.5, // ancho del menú 20%
    backgroundColor: "rgba(110, 199, 207, 0.32)",
    paddingTop: 80,
    paddingHorizontal: 10,
    alignItems: "center",
    zIndex: 1,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  menuItem: {
    fontSize: 16,
    marginVertical: 15,
    color: "#fff",
    textAlign: "center",
  },
  logoutButton: {
    position: "absolute",
    bottom: 30,
    left: 10,
    right: 10,
    padding: 12,
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
