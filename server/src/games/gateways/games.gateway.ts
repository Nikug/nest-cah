import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SubscribeGameMessage } from '../interfaces/socketMessages.interface';
import { GamesService } from '../services/games.service';
import { Server } from 'socket.io';

@WebSocketGateway({
  path: '/socket',
  cors: {
    origin: '*',
  },
})
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private gamesService: GamesService) {}

  updateAllButSender(
    gameName: string,
    socketId: string,
    event: string,
    data: any,
  ) {
    const socket = this.server.sockets.sockets.get(socketId);
    socket?.to(gameName).emit(event, data);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Todo: Set player disconnected
    // Check if game should be deleted
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket, data: string) {
    console.log(`Pinged: ${data}`);
    client.emit('ping', data);
  }

  @SubscribeMessage('subscribeGame')
  async subscribeToGame(client: Socket, data: SubscribeGameMessage) {
    client.join(data.gameName);
    await this.gamesService.setPlayerSocket(
      data.gameName,
      data.playerId,
      client.id,
    );
  }
}
