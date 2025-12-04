import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function VoiceSettingsScreen({ navigation }: any) {
  const [selectedSpeed, setSelectedSpeed] = useState(1.0);
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loadingVoices, setLoadingVoices] = useState(true);

  useEffect(() => {
    const loadVoices = async () => {
      try {
        const availableVoices = await Speech.getAvailableVoicesAsync();
        const filtered = availableVoices.filter((v) =>
          v.language.startsWith("es")
        );
        setVoices(filtered);

        const savedSpeed = await AsyncStorage.getItem("voiceSpeed");
        const savedVoice = await AsyncStorage.getItem("voiceId");
        if (savedSpeed) setSelectedSpeed(parseFloat(savedSpeed));
        if (savedVoice) setSelectedVoice(savedVoice);
      } catch (err) {
        console.log("Error cargando voces:", err);
      } finally {
        setLoadingVoices(false);
      }
    };
    loadVoices();
  }, []);

  const handleVoiceTest = () => {
    if (!selectedVoice) {
      Alert.alert("Selecciona una voz primero");
      return;
    }

    setIsSpeaking(true);

    const message = "Hola, soy tu asistente de AuxiIA. Esta es una prueba de voz.";

    Speech.speak(message, {
      rate: selectedSpeed,
      voice: selectedVoice,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  };

  const stopVoice = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem("voiceSpeed", selectedSpeed.toString());
      if (selectedVoice) await AsyncStorage.setItem("voiceId", selectedVoice);

      Alert.alert(
        "✅ Configuración guardada",
        "Los cambios se aplicarán al chat."
      );
    } catch (err) {
      Alert.alert("Error", "No se pudo guardar la configuración.");
    }
  };

  return (
    <LinearGradient
      colors={["#0a0f24", "#071930", "#02101f"]}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          <Ionicons name="volume-high-outline" size={24} color="#00E0FF" />{" "}
          Configuración de Voz
        </Text>

        {/* VELOCIDAD */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="speedometer-outline" size={18} color="#00E0FF" />{" "}
            Velocidad:{" "}
            <Text style={{ color: "#00E0FF" }}>
              {selectedSpeed.toFixed(1)}x
            </Text>
          </Text>

          <View style={styles.speedOptions}>
            {[0.8, 1.0, 1.2, 1.4].map((speed) => (
              <TouchableOpacity
                key={speed}
                style={[
                  styles.speedButton,
                  selectedSpeed === speed && styles.speedButtonActive,
                ]}
                onPress={() => setSelectedSpeed(speed)}
              >
                <Text
                  style={[
                    styles.speedText,
                    selectedSpeed === speed && styles.speedTextActive,
                  ]}
                >
                  {speed}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* VOCES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="mic-outline" size={18} color="#00E0FF" /> Seleccionar
            Voz
          </Text>

          {loadingVoices ? (
            <ActivityIndicator color="#00E0FF" />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ paddingVertical: 5 }}
            >
              {voices.map((voice, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.voiceCard,
                    selectedVoice === voice.identifier &&
                      styles.voiceCardActive,
                  ]}
                  onPress={() => setSelectedVoice(voice.identifier)}
                >
                  <Text
                    style={[
                      styles.voiceName,
                      selectedVoice === voice.identifier &&
                        styles.voiceNameActive,
                    ]}
                    numberOfLines={1}
                  >
                    {voice.name || "Voz desconocida"}
                  </Text>

                  <Text
                    style={[
                      styles.voiceCode,
                      selectedVoice === voice.identifier &&
                        styles.voiceCodeActive,
                    ]}
                  >
                    {voice.language}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* BOTÓN DE PRUEBA */}
        <TouchableOpacity
          style={styles.testButton}
          onPress={isSpeaking ? stopVoice : handleVoiceTest}
        >
          <Ionicons
            name={
              isSpeaking
                ? "pause-circle-outline"
                : "play-circle-outline"
            }
            size={24}
            color="#00E0FF"
          />
          <Text style={styles.testButtonText}>
            {isSpeaking ? "Pausar voz" : "Probar voz"}
          </Text>
        </TouchableOpacity>

        {/* GUARDAR */}
        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Ionicons name="lock-closed-outline" size={18} color="#fff" />
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>

        {/* VOLVER */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={18} color="#00E0FF" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    backgroundColor: "rgba(10, 20, 40, 0.95)",
    borderRadius: 20,
    padding: 25,
    width: "85%",
    shadowColor: "#00E0FF",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },

  title: {
    color: "#00E0FF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  section: {
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 15,
  },

  sectionTitle: {
    color: "#00E0FF",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  speedOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  speedButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },

  speedButtonActive: {
    backgroundColor: "#00E0FF",
  },

  speedText: {
    color: "#fff",
  },

  speedTextActive: {
    color: "#000",
    fontWeight: "700",
  },

  voiceCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    alignItems: "center",
    width: 140,
    borderWidth: 1,
    borderColor: "transparent",
  },

  voiceCardActive: {
    backgroundColor: "#00E0FF",
    borderColor: "#00E0FF",
  },

  voiceName: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },

  voiceNameActive: {
    color: "#000",
  },

  voiceCode: {
    color: "#00E0FF",
    fontSize: 12,
  },

  voiceCodeActive: {
    color: "#000",
  },

  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#00E0FF",
    borderRadius: 30,
    paddingVertical: 12,
    marginBottom: 10,
  },

  testButtonText: {
    color: "#00E0FF",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
    textAlign: "center",
  },

  saveButton: {
    flexDirection: "row",
    backgroundColor: "#00C853",
    borderRadius: 30,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },

  backButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  backText: {
    color: "#00E0FF",
    marginLeft: 8,
    fontWeight: "bold",
  },
});
