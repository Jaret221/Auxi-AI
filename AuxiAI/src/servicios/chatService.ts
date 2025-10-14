import axios from 'axios';

const API_URL = 'http://192.168.77.76:3000/chat'; // Cambia TU_IP por la IP de tu PC si pruebas en dispositivo físico

// Enviar mensaje al chatbot y recibir respuesta
export const sendMessage = async (message: string): Promise<string> => {
  try {
    const res = await axios.post(API_URL, { message });
    return res.data.response; // Se asume que tu API responde { response: "texto del bot" }
  } catch (err) {
    console.error('Error enviando mensaje:', err);
    return 'Error al contactar al chatbot';
  }
};

// (Opcional) Agregar nuevas frases de entrenamiento
export const addMessage = async (message: string, response: string) => {
  try {
    const res = await axios.post(`${API_URL}/add`, { message, response });
    return res.data;
  } catch (err) {
    console.error('Error agregando frase:', err);
    return { error: 'No se pudo agregar la frase' };
  }
};
