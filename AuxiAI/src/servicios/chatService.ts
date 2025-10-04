import axios from 'axios';

const API_URL = 'http://192.168.1.67:3000/chat'; // Cambia localhost por la IP de tu PC si pruebas en dispositivo físico

export const sendMessage = async (message: string): Promise<string> => {
  try {
    const res = await axios.post(API_URL, { message });
    return res.data.response;
  } catch (err) {
    console.error('Error enviando mensaje:', err);
    return 'Error al contactar al chatbot';
  }
};

export const addMessage = async (message: string, response: string): Promise<any> => {
  try {
    const res = await axios.post(`${API_URL}/add`, { message, response });
    return res.data;
  } catch (err) {
    console.error('Error agregando frase:', err);
    return { error: 'No se pudo agregar la frase' };
  }
};
