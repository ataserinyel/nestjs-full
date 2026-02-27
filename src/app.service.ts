import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class AppService
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    OnApplicationShutdown
{
  onModuleDestroy() {
    console.log('Module destroyed.');
  }
  onApplicationBootstrap() {
    console.log(
      'Tüm bağımlılıklar yüklenir, mikroservis, 3rd party uyg, database vs',
    );
  }
  onModuleInit() {
    console.log('Appservice başlatıldı.');
  }
  onApplicationShutdown(signal?: string) {
    console.log('On App shutdown' + signal);
  }
  getHello(): string {
    return 'Hello World!!xwdw!';
  }
}
// Port dinleme: netstat -aon | findstr :3000
// Task silme: tasklist /FI "PID eq <PID>" (PID burada en sondaki sayı görev idsi yani)
