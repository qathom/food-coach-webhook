import { WebhookRequest, WebhookResponse, FoodUnit, FoodItem, SearchResult, I18n, NutrientType } from '../../types';
import { FoodMapper } from '../FoodMapper';
import { WebhookBaseResponder } from './WebhookBaseResponder';

export class WebhookItemCaloryResponse extends WebhookBaseResponder {
  protected readonly i18n: I18n = {
    en: {
      missingItem: 'Missing item! Try again. For example, "How many calories for cheese fondue".',
      FIBER: 'fiber',
      PROTEIN: 'protein',
      CARBOHYDRATE: 'carbohydrate',
      SUGAR: 'sugar',
    },
    fr: {
      deleted: 'Element manquant ! Essayez à nouveau. Par exemple, "Combien de calories pour une fondue au fromage".',
      FIBER: 'fibres',
      PROTEIN: 'protéines',
      CARBOHYDRATE: 'glucides',
      SUGAR: 'sucre',
    },
  };

  handle(webhookRequest: WebhookRequest, foodMapper: FoodMapper): WebhookResponse {
    super.handle(webhookRequest, foodMapper);

    const meals: string[] = webhookRequest.queryResult.parameters?.meal as string[];
    const list: SearchResult<FoodItem>[][] = meals
      .map(match => foodMapper.search(match));

    if (meals.length === 0 || list.length === 0) {
      this.add18nTextResponse(['missingItem']);
      return this.getResponse();
    }

    const items = list
      .filter(res => res.length > 0)
      .map((res) => res[0]);

    const textResponses: string[] = items.map(res => {
      const items = res.item.energy;
      const { nutrients } = res.item;
      const nutrientStr: string[] = nutrients.map((nutrient) => {
        const nutrientUnit = nutrient.unit === FoodUnit.GRAM ? 'g' : FoodUnit.GRAM.toLowerCase();
        return `${this.translate(nutrient.type)}: ${nutrient.value}${nutrientUnit}`;
      });
      return `${res.item.name}: ${items.map(item => `${item.value} ${item.unit}`).join(', ').toLowerCase()} | ${nutrientStr.join(', ').toLowerCase()}`;
    });

    this.addTextResponse(textResponses);

    return this.getResponse();
  }
}
