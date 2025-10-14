import axios from 'axios';

const API_URL = "http://192.168.77.76:3000/historial";

// Guardar mensaje en el historial (MongoDB) a través de NestJS
export const guardarHistorial = async (mensaje: string, tipo: string, gravedad?: string) => {
  try {
    await axios.post(API_URL, { mensaje, tipo, gravedad });
  } catch (error) {
    console.error("Error guardando historial:", error);
  }
};

// Obtener historial completo desde MongoDB
export const obtenerHistorial = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    console.error("Error obteniendo historial:", error);
    return [];
  }
};
