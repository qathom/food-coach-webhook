import { WebhookRequest, WebhookResponse, I18n } from '../../types';
import { CacheConversation } from '../CacheConversation';
import { WebhookBaseResponder } from './WebhookBaseResponder';
import { FoodMapper } from '../FoodMapper';

export class WebhookResetResponse extends WebhookBaseResponder {
  protected readonly i18n: I18n = {
    en: {
      deleted: 'Deleted!',
    },
    fr: {
      deleted: 'Supprimé !',
    },
  };

  handle(webhookRequest: WebhookRequest, foodMapper: FoodMapper): WebhookResponse {
    super.handle(webhookRequest, foodMapper);

    const cacheConversation = new CacheConversation();
    cacheConversation.remove(webhookRequest.session);
    
    this.add18nTextResponse(['deleted']);

    return this.getResponse();
  }
}
