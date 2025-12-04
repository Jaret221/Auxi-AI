import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator 
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { obtenerHistorial } from "../../servicios/historialService"; // Asegúrate de que esta ruta sea correcta

// --- CONSTANTES DE ESTILO ---
const COLORS = {
  BG_MAIN: '#1E1E3F', // Fondo oscuro principal
  BG_CARD: 'rgba(255, 255, 255, 0.08)', // Tarjeta semi-transparente oscura
  NEON_BLUE: '#00BFFF', // Azul neón para acentos (Botón Volver)
  NEON_PURPLE: '#7B68EE', // Púrpura neón (Borde de acento)
  TEXT_LIGHT: '#E0E0E0', // Texto claro
  TEXT_ACCENT: '#FFFFFF', // Texto de título
  
  // Colores de Gravedad Futurista
  GRAVE: '#FF4500', // Naranja-Rojo (Grave)
  MODERADO: '#FFD700', // Dorado (Moderado)
  LEVE: '#3CB371', // Verde Esmeralda (Leve)
  DEFAULT: '#5A5A7A', // Gris oscuro
};

// --- TIPADO (Asumiendo la estructura del historial) ---
interface HistorialItem {
  _id: string;
  tipo: string;
  mensaje: string;
  gravedad: "leve" | "moderado" | "grave" | string;
  createdAt: string;
}

export const HistorialMedicoScreen = () => {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const data = await obtenerHistorial();
        setHistorial(data);
      } catch (error) {
        console.error("Error al cargar el historial:", error);
        // Opcional: Mostrar un mensaje de error al usuario
      } finally {
        setLoading(false);
      }
    };
    cargarHistorial();
  }, []);

  /**
   * Obtiene el color neón basado en la gravedad.
   * @param gravedad - La gravedad del evento ('leve', 'moderado', 'grave').
   */
  const getColor = (gravedad: string | undefined): string => {
    // 🚨 CORRECCIÓN CLAVE: Usamos 'gravedad?.toLowerCase() || "default"'
    // Esto asegura que si gravedad es null/undefined, se usa "default".
    const safeGravedad = gravedad?.toLowerCase() || "default"; 

    switch (safeGravedad) {
      case "leve": return COLORS.LEVE;
      case "moderado": return COLORS.MODERADO;
      case "grave": return COLORS.GRAVE;
      default: return COLORS.DEFAULT;
    }
  };

  /**
   * Renderiza cada elemento del historial.
   */
  const renderItem = ({ item }: { item: HistorialItem }) => {
    // 🚨 CORRECCIÓN CLAVE: Pasamos item.gravedad directamente a getColor
    const severityColor = getColor(item.gravedad);
    const displayGravedad = (item.gravedad || 'Desconocida').toUpperCase();
    
    return (
      <View style={[
        historialStyles.card, 
        { 
          borderColor: severityColor, // Borde lateral dinámico
          shadowColor: severityColor, // Sombra que simula el brillo neón
        }
      ]}>
        <View style={historialStyles.header}>
          {/* Usamos un valor por defecto seguro para item.tipo */}
          <Text style={historialStyles.tipo}>{(item.tipo || 'EVENTO').toUpperCase()}</Text>
          <View style={[historialStyles.gravedadBadge, { backgroundColor: severityColor }]}>
            <Text style={historialStyles.gravedadText}>{displayGravedad}</Text>
          </View>
        </View>
        
        <Text style={historialStyles.mensaje}>{item.mensaje}</Text>
        
        <Text style={historialStyles.fecha}>
          <Ionicons name="time-outline" size={12} color={COLORS.TEXT_LIGHT} />
          {" "} {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    );
  };
  
  if (loading) {
    return (
        <View style={historialStyles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.NEON_BLUE} />
            <Text style={{color: COLORS.TEXT_LIGHT, marginTop: 10}}>Cargando historial...</Text>
        </View>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.BG_MAIN, COLORS.BG_MAIN, '#303cbd']} // Gradiente oscuro/futurista
      style={historialStyles.gradientBackground}
    >
      <SafeAreaView style={historialStyles.safeArea}>
        
        {/* Botón volver */}
        <TouchableOpacity style={historialStyles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.NEON_BLUE} />
          <Text style={historialStyles.backText}>Volver</Text>
        </TouchableOpacity>
        
        <Text style={historialStyles.title}>⚕️ Historial Médico</Text>

        {historial.length === 0 ? (
          <View style={historialStyles.emptyState}>
            <Ionicons name="archive-outline" size={60} color={COLORS.DEFAULT} />
            <Text style={historialStyles.emptyText}>No hay registros médicos aún.</Text>
            <Text style={historialStyles.emptyTextSmall}>Tu historial se llenará con eventos de salud y emergencias.</Text>
          </View>
        ) : (
          <FlatList
            data={historial}
            keyExtractor={(item) => item._id}
            contentContainerStyle={historialStyles.listContent}
            renderItem={renderItem}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

// --- ESTILOS MEJORADOS ---
const historialStyles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: COLORS.BG_MAIN,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backText: {
    color: COLORS.NEON_BLUE,
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_ACCENT,
    textAlign: 'center',
    marginBottom: 25,
    textShadowColor: COLORS.NEON_PURPLE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  listContent: { 
    paddingBottom: 40 
  },
  card: {
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    borderLeftWidth: 5,
    // Efecto de brillo sutil en las tarjetas
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginBottom: 10,
  },
  tipo: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.TEXT_ACCENT,
  },
  gravedadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  gravedadText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.BG_MAIN, // Texto oscuro sobre badge neón
  },
  mensaje: {
    fontSize: 16,
    color: COLORS.TEXT_LIGHT,
    marginBottom: 10,
    lineHeight: 24,
  },
  fecha: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    opacity: 0.7,
    textAlign: 'right',
    marginTop: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.TEXT_LIGHT,
    marginTop: 15,
    fontWeight: 'bold',
  },
  emptyTextSmall: {
    fontSize: 14,
    color: COLORS.DEFAULT,
    marginTop: 5,
    textAlign: 'center',
  }
});