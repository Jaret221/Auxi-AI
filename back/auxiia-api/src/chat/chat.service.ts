import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ChatService {
  // URL donde corre tu Flask API
  private aiUrl = 'http://127.0.0.1:5000';

  // Enviar mensaje al chatbot
  async sendMessage(message: string): Promise<string> {
    try {
      const res = await axios.post(`${this.aiUrl}/chat`, { message });
      return res.data.response;
    } catch (err) {
      console.error('Error comunicándose con el chatbot:', err.message);
      return "Error: no se pudo contactar al chatbot";
    }
  }

  // Agregar nueva frase al entrenamiento del chatbot
  async addMessage(message: string, response: string): Promise<any> {
    try {
      const res = await axios.post(`${this.aiUrl}/add`, { message, response });
      return res.data;
    } catch (err) {
      console.error('Error agregando nueva frase:', err.message);
      return { error: "No se pudo agregar la frase" };
    }
  }
}
