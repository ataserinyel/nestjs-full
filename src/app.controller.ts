import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  getHome(): string {
    return this.renderPage();
  }

  @Get('hesapla')
  @Header('Content-Type', 'text/html; charset=utf-8')
  calculate(
    @Query('sayi1') sayi1Raw: string,
    @Query('sayi2') sayi2Raw: string,
    @Query('islem') islem: string,
  ): string {
    const sayi1 = Number(sayi1Raw);
    const sayi2 = Number(sayi2Raw);

    if (Number.isNaN(sayi1) || Number.isNaN(sayi2)) {
      throw new BadRequestException('Lütfen geçerli sayılar girin.');
    }

    let sonuc: number;

    switch (islem) {
      case 'topla':
        sonuc = sayi1 + sayi2;
        break;
      case 'cikar':
        sonuc = sayi1 - sayi2;
        break;
      case 'carp':
        sonuc = sayi1 * sayi2;
        break;
      case 'bol':
        if (sayi2 === 0) {
          throw new BadRequestException('Sıfıra bölme yapılamaz.');
        }
        sonuc = sayi1 / sayi2;
        break;
      default:
        throw new BadRequestException('Geçersiz işlem seçimi.');
    }

    return this.renderPage(`Hesaplama sonucu: ${sonuc}`);
  }

  @Post('kelimeler')
  @UseInterceptors(FileInterceptor('textDosyasi'))
  @Header('Content-Type', 'text/html; charset=utf-8')
  showWords(@UploadedFile() textDosyasi?: { buffer: Buffer }): string {
    if (!textDosyasi) {
      throw new BadRequestException('Lütfen bir .txt dosyası yükleyin.');
    }

    const icerik = textDosyasi.buffer.toString('utf-8');
    const kelimeler = icerik.match(/\p{L}+/gu) ?? [];

    const sonuc =
      kelimeler.length > 0
        ? `Dosyadaki kelimeler (${kelimeler.length}): ${kelimeler.join(', ')}`
        : 'Dosyada gösterilecek kelime bulunamadı.';

    return this.renderPage(sonuc);
  }

  private renderPage(sonuc = 'Henüz bir işlem yapılmadı.'): string {
    return `
      <!doctype html>
      <html lang="tr">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Ana Sayfa</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 2rem; background: #f5f7fb; }
            .container { max-width: 900px; margin: 0 auto; }
            .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
            .card { background: #fff; border-radius: 12px; padding: 1rem; box-shadow: 0 1px 8px rgba(0,0,0,.08); }
            label { display: block; margin-top: .5rem; font-size: .9rem; }
            input, select, button { margin-top: .25rem; padding: .5rem; width: 100%; }
            button { background: #2b6ef2; color: #fff; border: 0; border-radius: 8px; cursor: pointer; }
            .result { margin-top: 1rem; background: #edf3ff; border-left: 4px solid #2b6ef2; padding: .8rem; }
          </style>
        </head>
        <body>
          <main class="container">
            <h1>Ana Sayfa</h1>
            <p>2 seçenekten birini kullanabilirsiniz:</p>

            <section class="grid">
              <article class="card">
                <h2>1) Hesap Makinesi</h2>
                <form method="GET" action="/hesapla">
                  <label for="sayi1">1. sayı</label>
                  <input id="sayi1" name="sayi1" type="number" step="any" required />

                  <label for="islem">İşlem</label>
                  <select id="islem" name="islem" required>
                    <option value="topla">Topla</option>
                    <option value="cikar">Çıkar</option>
                    <option value="carp">Çarp</option>
                    <option value="bol">Böl</option>
                  </select>

                  <label for="sayi2">2. sayı</label>
                  <input id="sayi2" name="sayi2" type="number" step="any" required />

                  <button type="submit">Hesapla</button>
                </form>
              </article>

              <article class="card">
                <h2>2) Text Dosyasındaki Kelimeleri Göster</h2>
                <form method="POST" action="/kelimeler" enctype="multipart/form-data">
                  <label for="textDosyasi">.txt dosyası yükleyin</label>
                  <input id="textDosyasi" name="textDosyasi" type="file" accept=".txt" required />
                  <button type="submit">Kelimeleri Göster</button>
                </form>
              </article>
            </section>

            <section class="result">
              <strong>Sonuç:</strong> ${sonuc}
            </section>
          </main>
        </body>
      </html>
    `;
  }
}
