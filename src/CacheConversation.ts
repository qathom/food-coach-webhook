import * as fs from 'fs';
import * as path from 'path';
import { Conversation } from '../types';

export class CacheConversation {
  private readonly uniqueKey: keyof Conversation = 'session';

  // Store the cache in /tmp folder with AWS lambda
  private readonly storePath = path.join(process.env.NODE_ENV === 'production' ? '/' : '', 'tmp', 'conversations.json');

  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(this.storePath)) {
      fs.writeFileSync(this.storePath, JSON.stringify([]));
    }
  }

  read(): Conversation[] {
    return JSON.parse(fs.readFileSync(this.storePath, 'utf-8')); 
  }

  find(session: string) {
    const list = this.read();
    return list.find(item => item[this.uniqueKey] === session);
  }

  save(conversation: Conversation) {
    const conversations = this.read();
    const index = conversations.findIndex(p => p[this.uniqueKey] === conversation[this.uniqueKey]);

    if (index === -1) {
      conversations.push({
        // Default
        ...{
          createdAt: new Date().toISOString(),
          target: null,
          items: [],
        },
        ...conversation,
      });
    } else {
      // Update items
      conversations[index].items = [
        ...conversations[index].items,
        ...conversation.items || [],
      ];

      // Update target
      if (conversation.target) {
        conversations[index].target = conversation.target;
      }
    }

    fs.writeFileSync(this.storePath, JSON.stringify(conversations));
  }

  remove(session: string) {
    const list = this.read();
    const index = list.findIndex(item => item[this.uniqueKey] === session);

    if (index > -1) {
      list.splice(index, 1);
    }

    fs.writeFileSync(this.storePath, JSON.stringify(list));
  }

  reset() {
    if (fs.existsSync(this.storePath)) {
      fs.unlinkSync(this.storePath);
    }

    this.init();
  }
}