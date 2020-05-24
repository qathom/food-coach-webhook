import { WebhookRequest, WebhookResponse, WebhookResponder, I18n } from '../../types';
import { CacheConversation } from '../CacheConversation';
import { WebhookBaseResponder } from './WebhookBaseResponder';
import { FoodMapper } from '../FoodMapper';

export class WebhookSetTargetResponse extends WebhookBaseResponder {
  protected readonly i18n: I18n = {
    en: {
      targetUpdated: 'Your target is now :value KCAL.',
      targetError: 'Sorry. The target should be between :value KCAL.',
    },
    fr: {
      targetUpdated: 'Votre objectif nutritionnel est maintenant :value KCAL.',
      targetError: 'Désolé. L\'objectif nutritionnel doit être compris entre :value KCAL.',

    },
  };

  handle(webhookRequest: WebhookRequest, foodMapper: FoodMapper): WebhookResponse {
    super.handle(webhookRequest, foodMapper);

    const target: string = webhookRequest.queryResult.parameters?.target as string;
    const cacheConversation = new CacheConversation();

    const kCalTarget = parseInt(target, 10);
    const minTarget = 1400;
    const maxTarget = 4000;

    if (isNaN(kCalTarget) || kCalTarget < minTarget || kCalTarget > maxTarget) {
      this.add18nTextResponse(['targetError'], [`${minTarget}-${maxTarget}`]);
      return this.getResponse();
    }

    cacheConversation.save({
      session: webhookRequest.session,
      target: kCalTarget,
    });

    this.add18nTextResponse(['targetUpdated'], [kCalTarget]);

    return this.getResponse();
  }
}
