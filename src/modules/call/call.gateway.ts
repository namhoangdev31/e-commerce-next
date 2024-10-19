import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { CallService } from './call.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/call',
})
export class CallGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly callService: CallService) { }
  @SubscribeMessage('sayHello')
  handleResultConnect(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
    return { event: 'sayHello', data: { 'data': 'Hello World' } };
  }


  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
    return { event: 'joinedRoom', data: { room } };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.leave(room);
    return { event: 'leftRoom', data: { room } };
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: { room: string; message: string }, @ConnectedSocket() client: Socket) {
    this.server.to(data.room).emit('newMessage', {
      message: data.message,
      sender: client.id,
    });
    return { event: 'messageSent', data };
  }

  @SubscribeMessage('startCall')
  async handleStartCall(@MessageBody() data: { room: string }, @ConnectedSocket() client: Socket) {
    try {
      const call = await this.callService.create({ room: data.room });
      this.server.to(data.room).emit('callStarted', { callId: call.id });
      return { event: 'callStarted', data: call };
    } catch (error) {
      return { error: true, message: 'Failed to start call', details: error.message };
    }
  }

  @SubscribeMessage('endCall')
  async handleEndCall(@MessageBody() data: { callId: number }, @ConnectedSocket() client: Socket) {
    try {
      const call = await this.callService.remove(data.callId);
      this.server.to(call.room).emit('callEnded', { callId: data.callId });
      return { event: 'callEnded', data: call };
    } catch (error) {
      return { error: true, message: 'Failed to end call', details: error.message };
    }
  }
}


// The following code should be placed in a separate Next.js file, not in this Gateway file.
// For example, you might create a new file named 'callSocket.ts' in your Next.js project.

// callSocket.ts

// import { io, Socket } from 'socket.io-client';

// let socket: Socket;

// export const initializeSocket = () => {
//   socket = io('http://localhost:3030', {
//     transports: ['websocket'],
//   });

//   socket.on('connect', () => {
//     console.log('Connected to WebSocket server');
//   });

//   socket.on('disconnect', () => {
//     console.log('Disconnected from WebSocket server');
//   });

//   return socket;
// };

// export const joinRoom = (room: string) => {
//   if (socket) {
//     socket.emit('joinRoom', room);
//   }
// };

// export const leaveRoom = (room: string) => {
//   if (socket) {
//     socket.emit('leaveRoom', room);
//   }
// };

// export const sendMessage = (room: string, message: string) => {
//   if (socket) {
//     socket.emit('sendMessage', { room, message });
//   }
// };

// export const startCall = (room: string) => {
//   if (socket) {
//     socket.emit('startCall', { room });
//   }
// };

// export const endCall = (callId: number) => {
//   if (socket) {
//     socket.emit('endCall', { callId });
//   }
// };

// export const listenForNewMessages = (callback: (data: any) => void) => {
//   if (socket) {
//     socket.on('newMessage', callback);
//   }
// };

// export const listenForCallEvents = (
//   onCallStarted: (data: any) => void,
//   onCallEnded: (data: any) => void
// ) => {
//   if (socket) {
//     socket.on('callStarted', onCallStarted);
//     socket.on('callEnded', onCallEnded);
//   }
// };

// // Usage in a Next.js component:
// //
// // import { useEffect } from 'react';
// // import { initializeSocket, joinRoom, sendMessage, listenForNewMessages } from './callSocket';
// //
// // const ChatComponent = () => {
// //   useEffect(() => {
// //     const socket = initializeSocket();
// //     joinRoom('roomName');
// //     listenForNewMessages((data) => {
// //       console.log('New message:', data);
// //     });
// //
// //     return () => {
// //       socket.disconnect();
// //     };
// //   }, []);
// //
// //   const handleSendMessage = () => {
// //     sendMessage('roomName', 'Hello, World!');
// //   };
// //
// //   return (
// //     // Your component JSX
// //   );
// // };
