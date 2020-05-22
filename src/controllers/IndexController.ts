import { Get, Controller, Render } from 'routing-controllers';
import * as path from 'path';

@Controller()
export class IndexController {
  @Get('')
  @Render(path.join('index.html'))
  index() {}
}
