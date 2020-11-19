import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';
import ResultRepository from '../repositories/ResultRepository';
import UrlRepository from '../repositories/UrlRepository';
import FetchResultService from '../services/FetchResultService';
import UpdateUrlsService from '../services/UpdateUrlService';

import authenticated from '../middlewares/authenticated';

const routes = Router();

routes.get('/login', async (request, response) => {
  const { userid, pw } = request.query;
  const authenticateUser = new AuthenticateUserService();

  const { token } = await authenticateUser.execute({
    username: String(userid),
    password: String(pw),
  });

  return response.json({ token });
});

routes.use(authenticated);

routes.get('/jogos/:concurso', async (request, response) => {
  const { concurso } = request.params;

  const resultRepository = new ResultRepository();

  const results = await resultRepository.findAll(concurso);

  return response.json({ success: true, data: results });
});

routes.get('/jogos/:concurso/:numero', async (request, response) => {
  const { concurso, numero } = request.params;

  const fetchResultService = new FetchResultService();

  const result = await fetchResultService.execute({
    lotteryName: concurso,
    resultNumber: numero,
  });

  return response.json({ success: true, data: result });
});

routes.post('/urls/', async (request, response) => {
  const updateUrlsService = new UpdateUrlsService();

  const lotteryNames = [
    'lotofacil',
    'megasena',
    'quina',
    'lotomania',
    'timemania',
    'duplasena',
    'federal',
    'loteca',
    'diadesorte',
    'supersete',
  ];

  lotteryNames.forEach(name => updateUrlsService.execute(name));

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
