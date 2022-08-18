import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {
  GameUpdateMessage,
  GameUpdateMessageMap,
  SubscribeGameMessage,
} from '../interfaces/socketMessages.interface';
import { GamesService } from '../services/games.service';
import { Server } from 'socket.io';
import { PlayerNotFoundError } from '../consts/errors.consts';
import { SocketMessages } from '../consts/sockets.consts';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GamesGateway implements OnGatewayDisconnect {
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

  async updatePlayers(updates: GameUpdateMessageMap, senderId: string) {
    let restMessage: GameUpdateMessage | undefined = undefined;
    Object.entries(updates).map(([playerId, message]) => {
      if (playerId === senderId) {
        restMessage = message;
      } else {
        const socket = this.server.sockets.sockets.get(message.socketId);
        socket?.emit(SocketMessages.fullUpdate, message);
      }
    });

    return restMessage;
  }

  handleDisconnect(client: Socket) {
    // Client should only have one room
    const gameNames = this.server.sockets.adapter.rooms.get(client.id);
    gameNames?.forEach((name) => {
      this.gamesService.setPlayerDisconnected(name, client.id);
    });
  }

  @SubscribeMessage(SocketMessages.ping)
  handlePing(client: Socket, data: string) {
    console.log(`Pinged: ${data}`);
    client.emit(SocketMessages.ping, data);
  }

  @SubscribeMessage(SocketMessages.subscribe)
  async subscribeToGame(client: Socket, data: SubscribeGameMessage) {
    const existingSocketId = await this.gamesService.getPlayerSocket(
      data.gameName,
      data.playerId,
    );

    if (existingSocketId) {
      const existingSocket = this.server.sockets.sockets.get(existingSocketId);
      existingSocket?.disconnect();
    }

    client.join(data.gameName);

    await this.gamesService.setPlayerSocket(
      data.gameName,
      data.playerId,
      client.id,
    );

    const update = await this.gamesService.getGameForPlayer(
      data.gameName,
      data.playerId,
    );
    client.emit(SocketMessages.subscribe, update);
  }
}
