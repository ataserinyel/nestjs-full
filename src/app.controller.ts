import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('selamver')
  getHi(): string {
    return 'Selam';
  }

  @Get('merhabalar')
  getMerhabalar(): string {
    return '2+2';
  }
}
