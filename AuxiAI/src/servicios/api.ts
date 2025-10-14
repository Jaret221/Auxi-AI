import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.77.76:3000", // Cambia por la IP de tu máquina
});

export default api;
