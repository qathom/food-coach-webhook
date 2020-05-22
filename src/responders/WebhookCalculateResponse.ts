import { WebhookRequest, WebhookResponse, FoodUnit, I18n } from '../../types';
import { FoodMapper } from '../FoodMapper';
import { CacheConversation } from '../CacheConversation';
import { WebhookBaseResponder } from './WebhookBaseResponder';

export class WebhookCalculateResponse extends WebhookBaseResponder {
  protected readonly i18n: I18n = {
    en: {
      emptyList: 'Oups! You have an empty list, ask me to "search chocolate" for example.',
      detailsBelow: 'Details below:',
      exceededResult: 'Oh no! You exceeded :value KCAL.',
      dailyTarget: 'Your daily target is :value KCAL.',
      okResult: 'Well done! :value KCAL is below your daily target.',
    },
    fr: {
      emptyList: 'Oups ! Vous avez une liste vide, demandez-moi de "chercher du chocolat" par exemple.',
      detailsBelow: 'Détails ci-après :',
      exceededResult: 'Oh non ! Vous avez dépassé de :value KCAL.',
      dailyTarget: 'Votre objectif quotidien est :value KCAL.',
      okResult: 'Bravo ! :value KCAL est inférieure à votre objectif quotidien.',
    },
  };

  handle(webhookRequest: WebhookRequest, foodMapper: FoodMapper): WebhookResponse {
    super.handle(webhookRequest, foodMapper);

    const cacheConversation = new CacheConversation();

    const conversation = cacheConversation.find(webhookRequest.session);

    if (!conversation || conversation.items.length === 0) {
      this.add18nTextResponse(['emptyList']);
      return this.getResponse();
    }

    const ids = conversation.items;
    const list = ids.map(id => foodMapper.get(id));

    const totalEnergy = list.reduce((acc, item) => {
      const kiloCaloryItem = item.energy.find(e => e.unit === FoodUnit.KCAL);
      acc += kiloCaloryItem.value
      return acc;
    }, 0);
    const maxDailyEnergy = conversation.target; // KCAL

    const exceeded = totalEnergy > maxDailyEnergy;

    if (exceeded) {
      this.add18nTextResponse(['exceededResult'], [totalEnergy - maxDailyEnergy])
    } else {
      this.add18nTextResponse(['okResult'], [totalEnergy]);
    }

    this.add18nTextResponse(['dailyTarget'], [maxDailyEnergy]);

    this.add18nTextResponse(['detailsBelow']);

    const detailResponses: string[] = list.map((foodItem, i) => {
      const kiloCaloryItem = foodItem.energy.find(e => e.unit === FoodUnit.KCAL);
      return `#${i + 1}/${list.length} ${foodItem.name} | ${kiloCaloryItem.value} KCAL | ${foodItem.nutrients.map(nutrient => `${nutrient.type} = ${nutrient.value} ${nutrient.unit}}`)}`;
    });

    this.addTextResponse(detailResponses);

    return this.getResponse();
  }
}
