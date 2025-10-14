import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { obtenerHistorial } from "../../servicios/historialService";
import { useNavigation } from "@react-navigation/native";

export const HistorialMedicoScreen = () => {
  const [historial, setHistorial] = useState<any[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const cargarHistorial = async () => {
      const data = await obtenerHistorial();
      setHistorial(data);
    };
    cargarHistorial();
  }, []);

  const getColor = (gravedad: string) => {
    switch (gravedad) {
      case "leve": return "#28a745";
      case "moderado": return "#ffc107";
      case "grave": return "#dc3545";
      default: return "#6c757d";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Historial Médico</Text>

      {/* 🔹 Botón de volver debajo del título */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>⬅ Volver</Text>
      </TouchableOpacity>

      <FlatList
        data={historial}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderLeftColor: getColor(item.gravedad) }]}>
            <View style={styles.header}>
              <Text style={styles.tipo}>({item.tipo})</Text>
              <Text style={styles.fecha}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            <Text style={styles.mensaje}>{item.mensaje}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9f5f9",
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0d6efd",
    textAlign: "center",
    marginBottom: 15,
  },
  backButton: {
    alignSelf: "flex-start", // Colocado a la izquierda
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#0d6efd",
    borderRadius: 8,
    marginBottom: 20, // espacio antes de la lista
  },
  backText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tipo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
  },
  fecha: {
    fontSize: 12,
    color: "#6c757d",
  },
  mensaje: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212529",
  },
});
