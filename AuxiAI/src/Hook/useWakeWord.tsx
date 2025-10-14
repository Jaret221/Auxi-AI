// hooks/useWakeWord.tsx
import { useEffect, useState } from "react";
import Voice from "@react-native-voice/voice";
import { useNavigation } from "@react-navigation/native";

export default function useWakeWord(wakeWord: string = "auxi") {
  const navigation = useNavigation();
  const [listening, setListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      if (event.value && event.value.length > 0) {
        const transcript = event.value[0].toLowerCase();
        console.log("Detectado:", transcript);

        if (transcript.includes(wakeWord.toLowerCase())) {
          // 👉 Navegar al Chat
          navigation.navigate("Chat" as never);
        }
      }
    };

    startListening();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      await Voice.start("es-MX"); // Idioma español México
      setListening(true);
    } catch (e) {
      console.error("Error al iniciar reconocimiento:", e);
    }
  };

  return { listening };
}
