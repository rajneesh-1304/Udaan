import { Controller, Get } from '@nestjs/common';

@Controller()
class AppController {
  @Get()
  root() {
    return { message: 'NestJS Backend is running!' };
  }
}

export default AppController;