import { WebhookRequest, WebhookResponse, WebhookResponder, FoodUnit } from '../types';
import { FoodMapper } from './FoodMapper';
import { CacheConversation } from './CacheConversation';

export class WebhookSelectionResponse implements WebhookResponder {
  private sendResponse(textResponses: string[]): WebhookResponse {
    const webhookResponse: WebhookResponse = {
      fulfillmentMessages: [
        {
          text: {
            text: textResponses,
          },
        },
      ],
    };

    return webhookResponse;
  }

  handle(webhookRequest: WebhookRequest, foodMapper: FoodMapper): WebhookResponse {
    const cacheConversation = new CacheConversation();

    const textResponses: string[] = [];

    const conversation = cacheConversation.find(webhookRequest.session);

    if (!conversation || conversation.items.length === 0) {
      return this.sendResponse(['Oups! You have an empty list, ask me to "search for chocolate" for example.']);
    }

    const ids = conversation.items;
    const list = ids.map(id => foodMapper.get(id));

    const totalEnergy = list.reduce((acc, item) => {
      const kiloCaloryItem = item.energy.find(e => e.unit === FoodUnit.KCAL);
      acc += kiloCaloryItem.value
      return acc;
    }, 0);
    const maxDailyEnergy = parseInt(webhookRequest.queryResult.parameters?.energy as string, 10) || 2200; // KCAL

    const exceeded = totalEnergy > maxDailyEnergy;

    if (exceeded) {
      textResponses.push(`Oh no! You exceeded ${totalEnergy - maxDailyEnergy} KCAL, knowing that your daily recommended energy is ${maxDailyEnergy} KCAL`);
    } else {
      textResponses.push(`Well done! ${totalEnergy} KCAL is below your daily energy ${maxDailyEnergy} KCAL`);
    }

    textResponses.push('Details below:');

    list.forEach((foodItem, i) => {
      const kiloCaloryItem = foodItem.energy.find(e => e.unit === FoodUnit.KCAL);
      textResponses.push(`#${i + 1}/${list.length} ${foodItem.name}: ${kiloCaloryItem.value} KCAL | ${foodItem.nutrients.map(nutrient => `${nutrient.type} = ${nutrient.value} ${nutrient.unit}}`)}`)
    });

    return this.sendResponse(textResponses);
  }
}
