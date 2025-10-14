import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(@Body('message') message: string) {
    const response = await this.chatService.sendMessage(message);
    return { response };
  }

  @Post('add')
  async addMessage(@Body() body: { message: string, response: string }) {
    return await this.chatService.addMessage(body.message, body.response);
  }
}
