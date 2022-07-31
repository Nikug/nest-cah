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
import { PlayerNotFoundError } from '../consts/errors.consts';
import { SocketMessages } from '../consts/sockets.consts';

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

  async updateOtherPlayers(
    gameName: string,
    playerId: string,
    event: string,
    data: any,
  ) {
    const socketId = await this.gamesService.getPlayerSocket(
      gameName,
      playerId,
    );
    if (!socketId) {
      throw new PlayerNotFoundError(
        playerId,
        `SocketId was not found for player ${playerId}`,
      );
    }
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

  @SubscribeMessage(SocketMessages.ping)
  handlePing(client: Socket, data: string) {
    console.log(`Pinged: ${data}`);
    client.emit(SocketMessages.ping, data);
  }

  @SubscribeMessage(SocketMessages.subscribe)
  async subscribeToGame(client: Socket, data: SubscribeGameMessage) {
    console.log('yeet');
    client.join(data.gameName);
    await this.gamesService.setPlayerSocket(
      data.gameName,
      data.playerId,
      client.id,
    );
  }
}
