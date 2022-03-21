import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Talk } from './model/talk.model';
import { TalkService } from './talk.service';

@WebSocketGateway({
  cors: true,
  namespace: /\/nsp-.+/,
  // namespace: 'd12',
})
export class TalkGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('Talk');
  // 소켓 통신 라이프 사이클: constructor -> init -> connect -> event -> disconnect
  constructor(private readonly talkService: TalkService) {
    this.logger.log('constructor talk...');
  }
  afterInit(): void {
    this.logger.log('init talk...');
  }
  handleConnection(@ConnectedSocket() socket: Socket): void {
    this.logger.log(
      `connected socket[nsp, id] >> ["${socket.nsp.name}", "${socket.id}"]`,
    );
  }
  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    this.logger.log(
      `disconnected socket[nsp, id] >> ["${socket.nsp.name}", "${socket.id}"]`,
    );
  }

  @WebSocketServer() public server: Server;

  @SubscribeMessage('sendMessage')
  async handleSubmitTalk(
    @MessageBody() talk: any,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('talk >> ', talk);

    const roomId = await this.talkService.sendMessage(talk);
    console.log('roomId >> ', roomId);

    socket.emit(`${roomId}-spread`, {
      userId: 'fucking',
      message: talk.message,
      createdAt: new Date(Date.now()).toISOString(),
    });
  }
}
