import { Injectable } from '@nestjs/common'
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase'
import { Message, MulticastMessage } from 'firebase-admin/messaging'

@Injectable()
export class NotificationService {
  constructor(@InjectFirebaseAdmin() private readonly fcmService: FirebaseAdmin) {}

  async sendToDevice(
    token: string,
    title: string,
    body: string,
    data: any = {},
    imageUrl?: string,
  ) {
    const message: Message = {
      token,
      notification: {
        title,
        body,
        imageUrl,
      },
      data,
      android: {
        notification: {
          clickAction: 'FLUTTER_NOTIFICATION_CLICK',
          sound: 'default',
          priority: 'max',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    }
    return this.fcmService.messaging.send(message)
  }

  async sendToDevices(
    tokens: string[],
    title: string,
    body: string,
    data: any = {},
    imageUrl?: string,
  ) {
    const message: MulticastMessage = {
      tokens,
      notification: {
        title,
        body,
        imageUrl,
      },
      data,
      android: {
        notification: {
          clickAction: 'FLUTTER_NOTIFICATION_CLICK',
          sound: 'default',
          priority: 'max',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    }
    return this.fcmService.messaging.sendMulticast(message)
  }

  async sendToTopic(topic: string, title: string, body: string, data: any = {}, imageUrl?: string) {
    const message: Message = {
      topic,
      notification: {
        title,
        body,
        imageUrl,
      },
      data,
      android: {
        notification: {
          clickAction: 'FLUTTER_NOTIFICATION_CLICK',
          sound: 'default',
          priority: 'max',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    }
    return this.fcmService.messaging.send(message)
  }

  async subscribeToTopic(tokens: string[], topic: string) {
    return this.fcmService.messaging.subscribeToTopic(tokens, topic)
  }

  async unsubscribeFromTopic(tokens: string[], topic: string) {
    return this.fcmService.messaging.unsubscribeFromTopic(tokens, topic)
  }

  async sendToCondition(
    condition: string,
    title: string,
    body: string,
    data: any = {},
    imageUrl?: string,
  ) {
    const message: Message = {
      condition,
      notification: {
        title,
        body,
        imageUrl,
      },
      data,
      android: {
        notification: {
          clickAction: 'FLUTTER_NOTIFICATION_CLICK',
          sound: 'default',
          priority: 'max',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    }
    return this.fcmService.messaging.send(message)
  }

  async sendToTopicWithCondition(
    topics: string[],
    title: string,
    body: string,
    data: any = {},
    imageUrl?: string,
  ) {
    const condition = topics.map(topic => `'${topic}' in topics`).join(' || ')
    return this.sendToCondition(condition, title, body, data, imageUrl)
  }

  async sendSilentNotification(token: string, data: any = {}) {
    const message: Message = {
      token,
      data,
      android: {
        priority: 'high',
      },
      apns: {
        headers: {
          'apns-priority': '5',
          'apns-push-type': 'background',
        },
        payload: {
          aps: {
            contentAvailable: true,
          },
        },
      },
    }
    return this.fcmService.messaging.send(message)
  }

  async sendWithCustomSound(
    token: string,
    title: string,
    body: string,
    sound: string,
    data: any = {},
  ) {
    const message: Message = {
      token,
      notification: {
        title,
        body,
      },
      data,
      android: {
        notification: {
          sound: sound,
          priority: 'max',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: sound,
          },
        },
      },
    }
    return this.fcmService.messaging.send(message)
  }
}
