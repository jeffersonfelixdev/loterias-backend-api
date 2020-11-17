import { Router } from 'express';
import ResultRepository from '../repositories/ResultRepository';
import FetchResultService from '../services/FetchResultService';

const routes = Router();

routes.post('/update/', async (request, response) => {
  return response.json('Hello, World');
});

routes.get('/:concurso', async (request, response) => {
  const { concurso } = request.params;

  const resultRepository = new ResultRepository();

  const results = await resultRepository.findAll(concurso);

  return response.json({ success: true, data: results });
});

routes.get('/:concurso/:numero', async (request, response) => {
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

export default routes;
