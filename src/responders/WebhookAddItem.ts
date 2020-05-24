import { WebhookRequest, WebhookResponse, SearchResult, FoodItem, I18n } from '../../types';
import { CacheConversation } from '../CacheConversation';
import { FoodMapper } from '../FoodMapper';
import { WebhookBaseResponder } from './WebhookBaseResponder';

export class WebhookAddItemResponse extends WebhookBaseResponder {
  protected readonly i18n: I18n = {
    en: {
      targetError: 'Please set your daily KCAL target by writing "Set target 2500 KCAL".' +
        'Women are likely to need between 1600 and 2400 KCAL.' +
        'Men from 2000 to 3000 KCAL.',
      noMatch: 'Missing meal! Try again to add an item. For example, "Add cheese fondue".',
      tooManyResults: 'Please be more specific when adding an item. We found too many results.',
      addedItems: 'Added :value items(s).',
      calculateInfo: 'Ask me to sum everything when you want by writing "Calculate".',
      searchMore: 'You can also search for other items.',
    },
    fr: {
      targetError: 'Veuillez fixer votre objectif quotidien de KCAL en écrivant "Définir mon objectif à 2500 KCAL".' +
        'Les femmes ont généralement besoin de 1600 à 2400 KCAL.' +
        'Les hommes de 2000 à 3000 KCAL.',
      noMatch: 'Repas manquant ! Essayez à nouveau d\'ajouter un article. Par exemple, "Ajouter une fondue au fromage".',
      tooManyResults: 'Veuillez être plus précis-e lorsque vous ajoutez un élément. Nous avons trouvé trop de résultats.',
      addedItems: ':value élément(s) ajouté(s).',
      calculateInfo: 'Demandez-moi de tout additionner quand vous voulez en écrivant "Calculer".',
      searchMore: 'Vous pouvez également rechercher d\'autres éléments.',
    },
  };

  handle(webhookRequest: WebhookRequest, foodMapper: FoodMapper): WebhookResponse {
    super.handle(webhookRequest, foodMapper);

    const meals: string[] = webhookRequest.queryResult.parameters?.meal as string[];
    const list: SearchResult<FoodItem>[][] = meals
      .map(match => foodMapper.search(match));

    const noMatch = list.filter((res) => res.length === 0);
    const cacheConversation = new CacheConversation();

    const currentConversation = cacheConversation.find(webhookRequest.session);

    if (!currentConversation || !Number.isInteger(currentConversation.target)) {
      this.add18nTextResponse(['targetError']);
      return this.getResponse();
    }

    // Verify if there is at least 1 match
    if (noMatch.length > 0) {
      this.add18nTextResponse(['noMatch']);
      return this.getResponse();
    }

    // Verify there are no more than 4 match for each
    const manyMatches = list.filter((res) => res.length > 10);

    if (manyMatches.length > 0) {
      this.add18nTextResponse(['tooManyResults']);
      return this.getResponse();
    }

    const addItems = list.map((res) => res[0]);
    const itemList = `${addItems.map(item => item.item.name).join(',')} | ${addItems.length}`;

    this.add18nTextResponse(['addedItems'], [itemList]);

    this.add18nTextResponse(['calculateInfo']);
    this.add18nTextResponse(['searchMore']);
    
    const itemIds: number[] = addItems.reduce((acc: number[], res) => {
      return [
        ...acc,
        res.item.id,
      ];
    }, []);

    cacheConversation.save({
      session: webhookRequest.session,
      items: itemIds,
    });

    return this.getResponse();
  }
}
