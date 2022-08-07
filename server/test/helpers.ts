import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';

export const getClientSocket = (app: INestApplication) => {
  const server = app.getHttpServer();
  if (!server.address()) {
    server.listen();
  }

  const address = server.address();
  const socketAddress = `http://[${address.address}]:${address.port}`;
  const socket = io(socketAddress, { multiplex: false });

  return socket;
};

export const waitSockets = async (
  sockets: Socket[] | Socket,
  event: string,
  callback?: (data: any) => void,
) => {
  const socketsArray = Array.isArray(sockets) ? sockets : [sockets];
  let socketEventCount = 0;
  let escape = 0;

  socketsArray.map((socket) =>
    socket.on(event, async (data: any) => {
      socketEventCount++;
      await callback?.(data);
    }),
  );

  while (socketEventCount < socketsArray.length) {
    await new Promise((resolve) => setTimeout(resolve, 10));
    escape++;
    if (escape > 100)
      throw new Error(
        `Timeout, waited for ${socketsArray.length} "${event}" events, received ${socketEventCount}`,
      );
  }
  return;
};
