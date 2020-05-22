import { JsonController, Post } from 'routing-controllers';
import { CacheConversation } from '../CacheConversation';

@JsonController()
export class CacheController {
  @Post('/reset')
  hook() {
    const cacheConversation = new CacheConversation();
    cacheConversation.reset();

    return { status: 'OK' };
  }
}
