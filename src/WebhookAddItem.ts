import { WebhookRequest, WebhookResponse, WebhookResponder } from '../types';
import { CacheConversation } from './CacheConversation';
import { FoodMapper } from './FoodMapper';

export class WebhookAddItemResponse implements WebhookResponder {
  handle(webhookRequest: WebhookRequest, foodMapper: FoodMapper): WebhookResponse {
    const meals: string[] = webhookRequest.queryResult.parameters?.meal as string[];
    const matches: string[] = meals.toString().match(/\d+/g) || [];
    const list = matches
      .map(match => foodMapper.get(parseInt(match, 10)))
      .filter(item => typeof item !== 'undefined');

    if (meals.length === 0 || list.length === 0) {
      return {
        fulfillmentMessages: [
          {
            text: {
              text: ['Missing meal! Try again to add an item. For example, "Add 385".'],
            },
          },
        ],
      };
    }

    const textResponses: string[] = [];
    textResponses.push(`Added ${list.map(item => item.name).join(',')} | ${list.length} items(s).`);
    textResponses.push('Ask me to sum everything when you want by writing "Calculate".');
    textResponses.push('You can also search for other items.');
    
    const cacheConversation = new CacheConversation();

    cacheConversation.save({
      session: webhookRequest.session,
      items: list.map(item => item.id),
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
