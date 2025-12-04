import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendMessage } from "../../servicios/chatService";
import { guardarHistorial } from "../../servicios/historialService";

type Message = {
  id: string;
  text: string;
  from: "user" | "bot";
};

const emergencyOptions = [
  { label: "🩸 Heridas y Sangrado", value: "herida sangrado", severity: "grave" },
  { label: "☀️ Insolación / Golpe de Calor", value: "insolación", severity: "moderado" },
  { label: "🦴 Fractura Ósea", value: "fractura", severity: "grave" },
  { label: "😮‍💨 Asfixia", value: "asfixia", severity: "grave" },
  { label: "⚡ Convulsiones", value: "convulsiones", severity: "grave" },
  { label: "😵 Desmayo", value: "desmayo", severity: "moderado" },
];

const severityColors: Record<string, string> = {
  leve: "#4CAF50",
  moderado: "#FFC107",
  grave: "#E91E63",
};

export const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showEmergencias, setShowEmergencias] = useState(true);

  const flatListRef = useRef<FlatList>(null);

  // AUTO SCROLL
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const speakMessage = async (text: string) => {
    try {
      const savedSpeed = await AsyncStorage.getItem("voiceSpeed");
      const savedVoice = await AsyncStorage.getItem("voiceId");

      const rate = savedSpeed ? parseFloat(savedSpeed) : 1.0;
      const voice = savedVoice || undefined;

      Speech.stop();
      Speech.speak(text, {
        rate,
        voice,
        language: "es-MX",
      });
    } catch (error) {
      console.log("Error cargando configuración de voz:", error);
      Speech.speak(text, { rate: 1.0, language: "es-MX" });
    }
  };  

  const handleSend = async (text?: string, gravedad?: string) => {
    const userInput = text || input;
    if (!userInput) return;

    await guardarHistorial(userInput, "user", gravedad);

    const userMsg: Message = {
      id: Date.now().toString(),
      text: userInput,
      from: "user",
    };
    setMessages((prev) => [...prev, userMsg]);

    const response = await sendMessage(userInput);
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      from: "bot",
    };
    setMessages((prev) => [...prev, botMsg]);

    await guardarHistorial(response, "bot");
    speakMessage(response);

    setInput("");
  };

  const rows: typeof emergencyOptions[][] = [];
  for (let i = 0; i < emergencyOptions.length; i += 3) {
    rows.push(emergencyOptions.slice(i, i + 3));
  }

  return (
    <LinearGradient colors={["#00b4d8", "#0077b6"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        // 🚨 Ajuste Clave: Usar 'height' en Android o no especificar, y 'padding' en iOS.
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.keyboardView}
        // Ajuste fino prara la altura del teclado en iOS si es necesario.
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} 
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          style={styles.flatList} // Asegura que el FlatList use flex: 1
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <View style={item.from === "user" ? styles.userMsg : styles.botMsg}>
              <Text style={styles.msgText}>{item.text}</Text>
            </View>
          )}
          ListHeaderComponent={
            <>
              <View style={styles.topBorder} />
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setShowEmergencias(!showEmergencias)}
              >
                <Text style={styles.toggleButtonText}>
                  {showEmergencias ? "Ocultar emergencias ▲" : "Mostrar emergencias ▼"}
                </Text>
              </TouchableOpacity>

              {showEmergencias && (
                <View style={styles.gridContainer}>
                  {rows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                      {row.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.emergencyButton,
                            { backgroundColor: severityColors[option.severity] },
                          ]}
                          onPress={() => handleSend(option.value, option.severity)}
                        >
                          <Text style={styles.emergencyText}>{option.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </>
          }
        />

        {/* BARRA DE MENSAJE: Es el último elemento en el KAV */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Escribe tu mensaje..."
            placeholderTextColor="#00000088"
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => handleSend()}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    // Asegurarse de que el KAV también use flex: 1
  },
  flatList: {
    flex: 1,
    // Asegura que el FlatList crezca y empuje el input hacia abajo.
  },
  topBorder: {
    borderTopWidth: 30,
    borderTopColor: "#03045e27",
    marginBottom: 20,
    width: "100%",
  },

  toggleButton: {
    alignSelf: "center",
    backgroundColor: "#ffffff44",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 10,
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  gridContainer: {
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  emergencyButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  emergencyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },

  userMsg: {
    alignSelf: "flex-end",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 15,
    maxWidth: "80%",
    elevation: 2,
  },
  botMsg: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff55",
    padding: 12,
    marginVertical: 6,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    maxWidth: "80%",
    borderWidth: 1,
    borderColor: "#ffffff66",
    elevation: 2,
  },
  msgText: {
    fontSize: 16,
    color: "#03045e",
  },

  // ⭐ BARRA DE INPUT
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#ccc",
    elevation: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#00b4d8",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 48,
    color: "#03045e",
    fontSize: 16,
    elevation: 2,
  },
  sendButton: {
    backgroundColor: "#00b4d8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    height: 48,
    justifyContent: "center",
    marginLeft: 8,
    elevation: 5,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ChatScreen;