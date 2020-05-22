import { WebhookRequest, WebhookResponse, FoodUnit, I18n } from '../../types';
import { FoodMapper } from '../FoodMapper';
import { WebhookBaseResponder } from './WebhookBaseResponder';

export class WebhookSearchResponse extends WebhookBaseResponder {
  protected readonly i18n: I18n = {
    en: {
      noResult: 'Oh no! No result. Try again - be less specific.',
      wrongTarget: 'Please set your daily KCAL target by writing "Set target 2500 KCAL".' +
        'Women are likely to need between 1600 and 2400 calories.' +
        'Men from 2000 to 3000.',
      foundItems: 'Found :value items.',
      addItemInfo: 'Add an item by using its specific name "Add :value".'
    },
    fr: {
      noResult: 'Oh non ! Pas de résultat. Essayez à nouveau - soyez moins précis.',
      wrongTarget: 'Veuillez définir votre objectif quotidien de KCAL en écrivant "Définir l\'objectif à 2500 KCAL".' +
        'Les femmes ont généralement besoin de 1600 à 2400 calories.' +
        'Les hommes de 2000 à 3000.',
      foundItems: ':value résultats.',
      addItemInfo: 'Ajouter un élément en utilisant son nom "Ajouter :value".'
    },
  };

  handle(webhookRequest: WebhookRequest, foodMapper: FoodMapper): WebhookResponse {
    super.handle(webhookRequest, foodMapper);

    const foodQuery = webhookRequest.queryResult.queryText;
    const resQuery = foodMapper.search(foodQuery);

    if (resQuery.length > 0) {
      this.add18nTextResponse(['foundItems'], [resQuery.length]);
    }
  
    if (resQuery.length === 0) {
      this.add18nTextResponse(['noResult']);

    } else {
      this.add18nTextResponse(['addItemInfo'], [resQuery[0].item.name]);
    }

    const detailResponses: string[] = resQuery.map((r) => {
      const kiloCaloryItem = r.item.energy.find(e => e.unit === FoodUnit.KCAL);
      return `${r.item.name} | ${kiloCaloryItem.value} KCAL`;
    });

    this.addTextResponse(detailResponses);

    return this.getResponse();
  }
}
