import { FoodMapper } from "../src/FoodMapper";

export type Conversation = {
  session: string,
  target?: number,
  items?: number[],
  createdAt?: string,
};

export type FoodItemExcelRow = {
  ID: number,
  Nom: string,
  'Synonymes': string,
  'Énergie, kilojoules': number,
  'Énergie, calories': number,
  'Lipides, totaux (g)': number,
  'Acides gras, saturés (g)': number,
  'Acides gras, mono-insaturés (g)': number,
  'Acides gras, poly-insaturés (g)': number,
  'Cholestérol (mg)': number,
  'Glucides, disponibles (g)': number,
  'Fibres alimentaires (g)': number,
  'Proteines (g)': number,
  'Sel (NaCl) (g)': number,
  'Alcool (g)': number,
  'Eau (g)': number,
};

export enum FoodUnit {
  GRAM = 'GRAM',
  KJ = 'KJ',
  'KCAL' = 'KCAL',
}

export enum NutrientType {
  CARBOHYDRATE = 'CARBOHYDRATE',
  SUGAR = 'SUGAR',
  FIBER = 'FIBER',
  PROTEIN = 'PROTEIN',
}

export type Nutrient = {
  type: NutrientType,
  value: number,
  unit: FoodUnit,
};

export type FoodItem = {
  id: number,
  name: string,
  category: string,
  tokens: string[],
  energy: {
    value: number,
    unit: FoodUnit,
  }[],
  nutrients: Nutrient[],
};

export type FoodItemStorage = {
  createdAt: string,
  data: FoodItem[],
};

export interface Reader<Entity> {
  read: (sheetIndex: number, filename: string) => Entity[],
}

export type I18n = {
  [key: string]: {
    [key: string]: string,
  },
};

export type SearchResult<Entity> = {
  score: number,
  item: Entity,
};

export interface WebhookResponder {
  handle(webhookRequest: WebhookRequest, foodMapper: FoodMapper): WebhookResponse,
}

export type WebhookHandler = {
  intentName: string,
  responder: WebhookResponder,
};

export type WebhookRequestOutputContext = {
  name: string,
  lifespanCount: number,
  parameters: {
    [key: string]: string|string[],
  },
}

export type WebhookFulfillmentTextMessage = {
  text: string[],
};

export type FullfillmentMessage = {
  text?: WebhookFulfillmentTextMessage,
};

export type WebhookRequest = {
  responseId: string,
  session: string,
  queryResult: {
    queryText: string,
    parameters: {
      [key: string]:string|string[],
    },
    allRequiredParamsPresent: boolean,
    fulfillmentText: string,
    outputContexts: WebhookRequestOutputContext[],
    intent: {
      name: string,
      displayName: string,
    },
    intentDetectionConfidence: number,
    languageCode: string,
  },
};

export type WebhookSessionEntity = {
  value: string,
  synonyms: string[],
};

export type WebhookSessionEntityTypes = {
  name: string,
  entities: WebhookSessionEntity[],
  entityOverrideMode: string,
};

export type WebhookEventResponse = {
  name: string,
  languageCode: string,
  parameters: {
    [key: string]: string|string[],
  },
};

export type WebhookResponse = {
  fulfillmentMessages?: FullfillmentMessage[],
  sessionEntityTypes?: WebhookSessionEntityTypes[],
  followupEventInput?: WebhookEventResponse
};

