import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.67:3000", // Cambia por la IP de tu máquina
});

export default api;
