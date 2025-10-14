import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { sendMessage } from '../../servicios/chatService';
import { guardarHistorial } from '../../servicios/historialService';

type Message = {
  id: string;
  text: string;
  from: 'user' | 'bot';
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
  leve: "#28a745",
  moderado: "#ffc107",
  grave: "#dc3545",
};

export const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async (text?: string, gravedad?: string) => {
    const userInput = text || input;
    if (!userInput) return;

    await guardarHistorial(userInput, 'user', gravedad);

    const userMsg: Message = { id: Date.now().toString(), text: userInput, from: 'user' };
    setMessages((prev) => [...prev, userMsg]);

    const response = await sendMessage(userInput);
    const botMsg: Message = { id: (Date.now() + 1).toString(), text: response, from: 'bot' };
    setMessages((prev) => [...prev, botMsg]);

    await guardarHistorial(response, 'bot');

    setInput('');
  };

  const rows: typeof emergencyOptions[][] = [];
  for (let i = 0; i < emergencyOptions.length; i += 3) {
    rows.push(emergencyOptions.slice(i, i + 3));
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* 🔹 Grid de botones de emergencia */}
        <View style={styles.gridContainer}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.emergencyButton, { backgroundColor: severityColors[option.severity] }]}
                  onPress={() => handleSend(option.value, option.severity)}
                >
                  <Text style={styles.emergencyText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* 🔹 Lista de mensajes */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={item.from === 'user' ? styles.userMsg : styles.botMsg}>
              <Text style={styles.msgText}>{item.text}</Text>
            </View>
          )}
          style={styles.chatList}
        />

        {/* 🔹 Input y botón */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Escribe tu mensaje..."
            />
            <TouchableOpacity style={styles.sendButton} onPress={() => handleSend()}>
              <Text style={styles.sendButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>

          {/* 🔹 Borde/espacio debajo del input */}
          <View style={styles.bottomBorder} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  gridContainer: { marginTop: 50, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  emergencyButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyText: { color: '#fff', fontWeight: 'bold', fontSize: 13, textAlign: 'center' },

  chatList: { flex: 1, marginBottom: 10 },

  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1e7dd',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  botMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#f8d7da',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  msgText: { fontSize: 16 },

  inputWrapper: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#90caf9', // tono más claro
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomBorder: {
    borderTopWidth: 50,
    borderTopColor: '#e9f5f9',
    width: '100%',
  },
});
