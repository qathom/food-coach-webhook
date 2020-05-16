import { WebhookRequest, WebhookResponse, WebhookResponder, FoodUnit } from '../types';
import { FoodMapper } from './FoodMapper';

export class WebhookItemCaloryResponse implements WebhookResponder {
  handle(webhookRequest: WebhookRequest, foodMapper: FoodMapper): WebhookResponse {
    const meals: string[] = webhookRequest.queryResult.parameters?.meal as string[];
    const matches: string[] = meals.toString().match(/\d+/g) || [];
    const foodList = matches
      .map(match => foodMapper.get(parseInt(match, 10)))
      .filter(item => typeof item !== 'undefined');

    if (meals.length === 0 || foodList.length === 0) {
      return {
        fulfillmentMessages: [
          {
            text: {
              text: ['Missing item! Try again. For example, "How many calories for 385".'],
            },
          },
        ],
      };
    }

    const textResponses: string[] = foodList.map(item => {
      const kiloCaloryItem = item.energy.find(e => e.unit === FoodUnit.KCAL);
      return `${item.name}: ${kiloCaloryItem.value} KCAL`;
    });

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
}
