import { WebhookRequest, WebhookResponse, WebhookResponder, FoodUnit } from '../types';
import { FoodMapper } from './FoodMapper';

export class WebhookSearchResponse implements WebhookResponder {
  handle(webhookRequest: WebhookRequest, foodMapper: FoodMapper): WebhookResponse {
    const foodQuery = webhookRequest.queryResult.queryText;
    const resQuery = foodMapper.search(foodQuery);

    const textResponses: string[] = [];

    if (resQuery.length > 0) {
      textResponses.push(`Found ${resQuery.length} items.`);
    }

    resQuery.forEach((r) => {
      const kiloCaloryItem = r.item.energy.find(e => e.unit === FoodUnit.KCAL);
      textResponses.push(`#${r.item.id}: ${r.item.name} (${kiloCaloryItem.value} KCAL)`);
    });
  
    if (resQuery.length === 0) {
      textResponses.push('Oh no! No result. Try again - be less specific.');
    } else {
      textResponses.push(`Add an item by using its id such as "Add ${resQuery[0].item.id}".`);
    }
  
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
