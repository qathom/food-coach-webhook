import { Get, Controller, Render, QueryParam } from 'routing-controllers';
import * as path from 'path';

@Controller()
export class IndexController {
  @Get('')
  @Render(path.join('index.html'))
  index(@QueryParam('lang') inputLanguage: string): object {
    const i18n = {
      en: {
        name: 'FoodCoach-bot is at your service',
        description: 'Use the chat in the bottom right corner',
        language: 'Language',
        languageCode: 'en',
      },
      fr: {
        name: 'FoodCoach-bot est à votre service',
        description: 'Utilisez le chat en bas à droite',
        language: 'Langue',
        languageCode: 'fr',
      },
    };

    const language = Object.keys(i18n).includes(inputLanguage) ? inputLanguage : 'en';

    return i18n[language];
  }
}
