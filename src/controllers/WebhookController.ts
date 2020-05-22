import { WebhookRequest, WebhookResponse, WebhookHandler } from '../../types';
import { FoodMapper } from '../FoodMapper';
import { JsonController, Post, Body } from 'routing-controllers';
import { WebhookSearchResponse } from '../responders/WebhookSearchResponse';
import { WebhookCalculateResponse } from '../responders/WebhookCalculateResponse';
import { WebhookAddItemResponse } from '../responders/WebhookAddItem';
import { WebhookItemCaloryResponse } from '../responders/WebhookItemCalory';
import { WebhookSetTargetResponse } from '../responders/WebhookSetTarget';
import { WebhookResetResponse } from '../responders/WebhookReset';

@JsonController('/hooks')
export class WebhookController {
  private readonly handlers: WebhookHandler[] = [
    { intentName: 'Search', responder: new WebhookSearchResponse() },
    { intentName: 'AddItem', responder: new WebhookAddItemResponse() },
    { intentName: 'Calculate', responder: new WebhookCalculateResponse() },
    { intentName: 'HowManyCalories', responder: new WebhookItemCaloryResponse() },
    { intentName: 'SetTarget', responder: new WebhookSetTargetResponse() },
    { intentName: 'AskReset', responder: new WebhookResetResponse() },
  ];

  private dispatchResponder(webhookRequest: WebhookRequest, foodMapper: FoodMapper) {
    const intentName = webhookRequest?.queryResult?.intent?.displayName;
    const match = this.handlers.find(h => h.intentName.toLowerCase() === intentName.toLowerCase());

    if (!match) {
      throw new Error(`Unsupported intent: ${intentName}`);
    }

    return match.responder.handle(webhookRequest, foodMapper);
  }

  @Post('')
  hook(@Body() webhookRequest: WebhookRequest) {
    try {
      const foodMapper = new FoodMapper();
      foodMapper.select(webhookRequest.queryResult.languageCode);

      const webhookRes = this.dispatchResponder(webhookRequest, foodMapper);
      return webhookRes;
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }
}
