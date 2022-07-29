import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  path: '/socket',
  cors: {
    origin: '*',
  },
})
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(client: Socket, message: any) {
    console.log(`Client connected: ${client.id} ${message}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket, data: string) {
    console.log(`Pinged: ${data}`);
    client.emit('ping', data);
  }
}
