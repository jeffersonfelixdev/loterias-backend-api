import { Router } from 'express';
import ResultRepository from '../repositories/ResultRepository';
import UrlRepository from '../repositories/UrlRepository';
import FetchResultService from '../services/FetchResultService';
import UpdateUrlsService from '../services/UpdateUrlService';

const routes = Router();

routes.get('/jogos/:concurso', async (request, response) => {
  const { concurso } = request.params;

  const resultRepository = new ResultRepository();

  const results = await resultRepository.findAll(concurso);

  return response.json({ success: true, data: results });
});

routes.get('/jogos/:concurso/:numero', async (request, response) => {
  try {
    const { concurso, numero } = request.params;

    const fetchResultService = new FetchResultService();

    const result = await fetchResultService.execute({
      lotteryName: concurso,
      resultNumber: numero,
    });

    return response.json({ success: true, data: result });
  } catch (err) {
    return response.status(400).json({ succes: false, message: err.message });
  }
});

routes.post('/urls/', async (request, response) => {
  const updateUrlsService = new UpdateUrlsService();

  updateUrlsService.execute('lotofacil');
  updateUrlsService.execute('megasena');
  updateUrlsService.execute('quina');
  updateUrlsService.execute('lotomania');
  updateUrlsService.execute('timemania');
  updateUrlsService.execute('duplasena');
  updateUrlsService.execute('federal');
  updateUrlsService.execute('loteca');
  updateUrlsService.execute('diadesorte');
  updateUrlsService.execute('supersete');

  return response.status(201).send();
});

routes.post('/urls/:concurso', async (request, response) => {
  const { concurso } = request.params;

  const urlRepository = new UrlRepository();

  await urlRepository.delete(concurso);

  const updateUrlsService = new UpdateUrlsService();

  const url = await updateUrlsService.execute(concurso);

  return response.json({ success: true, data: url });
});

export default routes;
