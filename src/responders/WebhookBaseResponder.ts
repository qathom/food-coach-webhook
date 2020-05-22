import { WebhookRequest, WebhookResponse, WebhookResponder, I18n } from '../../types';
import { FoodMapper } from '../FoodMapper';

export abstract class WebhookBaseResponder implements WebhookResponder {
  protected readonly i18n: I18n;
  private activeLanguage: string = 'en';
  private webhookResponse: WebhookResponse;

  /**
   * Prepares a default webhook response
   */
  setDefaultResponse(): void {
    const webhookResponse: WebhookResponse = {
      fulfillmentMessages: [],
    };

    this.webhookResponse = webhookResponse;
  }

  /**
   * Handles the incomingt webhook request by setting the language
   * and preparing the default blank response
   * @param webhookRequest
   * @param foodMapper
   */
  // eslint-disable-next-line no-unused-vars
  handle(webhookRequest: WebhookRequest, foodMapper: FoodMapper): WebhookResponse {
    // Set active language
    this.activeLanguage = webhookRequest.queryResult.languageCode;

    this.setDefaultResponse();

    return this.getResponse();
  }

  /**
   * Translates
   * @param key - i18n key
   * @param value - add values by replacing :value
   */
  translate(key: string, value?): string {
    const message = this.i18n[this.activeLanguage][key];

    if (!message) {
      throw new Error(`Undefined message with key: ${key}`);
    }

    return message.replace(':value', value);
  }

  /**
   * Adds a text response tet
   * @param text - the text to append in the response
   */
  addTextResponse(text: string[]) {
    this.webhookResponse.fulfillmentMessages.push({
      text: {
        text,
      },
    });
  }

  /**
   * Adds a translated response text
   * @param text - the text to append in the response
   * @param values - the associated list of values to change in the key messages
   */
  add18nTextResponse(text: string[], values?) {
    const i18nText = text.map((t, i) => this.translate(t, values ? values[i] : ''));

    this.webhookResponse.fulfillmentMessages.push({
      text: {
        text: i18nText,
      },
    });
  }

  /**
   * Returns the response
   */
  getResponse(): WebhookResponse {
    return this.webhookResponse;
  }
}
