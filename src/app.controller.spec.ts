import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(() => {
    appController = new AppController();
  });

  describe('root', () => {
    it('should return home page html', () => {
      expect(appController.getHome()).toContain('<h1>Ana Sayfa</h1>');
    });
  });
});
