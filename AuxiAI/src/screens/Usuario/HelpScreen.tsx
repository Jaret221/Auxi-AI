// src/screens/HelpScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { appTheme } from "../../styles/appTheme";

export default function HelpScreen({ navigation }: any) {
  return (
    <View style={appTheme.container}>
      <Text style={styles.title}>Ayuda / Información</Text>
      <Text style={styles.text}>
        Aquí puedes colocar información de ayuda, tutoriales o instrucciones para el usuario.
      </Text>

      {/* Recuadro Conócenos */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Conócenos</Text>
        <Text style={styles.cardText}>
          Somos AuxiAI, una aplicación diseñada para brindar asistencia inmediata en emergencias médicas, con información clara y fácil de usar.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginHorizontal: 20,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  cardText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#3498db",
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
