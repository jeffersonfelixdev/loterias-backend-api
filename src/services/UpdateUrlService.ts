import axios from 'axios';
import cheerio from 'cheerio';

import UrlRepository from '../repositories/UrlRepository';
import Url from '../models/Url';

class UpdateUrlService {
  public async execute(lottery: string): Promise<Url> {
    const urlRepository = new UrlRepository();

    await urlRepository.delete(lottery);

    const html: string = (
      await axios.get(
        `http://loterias.caixa.gov.br/wps/portal/loterias/landing/${lottery}`,
        {
          headers: {
            Cookie: 'security=true',
          },
        },
      )
    ).data;

    const $ = cheerio.load(html);

    let url: string =
      $('base').prop('href') + $('input#urlBuscarResultado').prop('value');

    url = url.replace('/=/', '/');

    const urlObj = await urlRepository.create({
      lottery,
      url,
    });

    return urlObj;
  }

  private getUrl(name: string): string {
    return name;
  }
}

export default UpdateUrlService;
