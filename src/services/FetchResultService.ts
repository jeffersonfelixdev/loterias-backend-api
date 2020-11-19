import axios from 'axios';
import ResultRepository from '../repositories/ResultRepository';
import UrlRepository from '../repositories/UrlRepository';
import AppError from '../errors/AppError';

interface Request {
  lotteryName: string;
  resultNumber: string;
}

class FetchResultService {
  public async execute({
    lotteryName,
    resultNumber,
  }: Request): Promise<unknown> {
    const urlRepository = new UrlRepository();

    const lottery = await urlRepository.find(lotteryName);

    if (!lottery) {
      throw new AppError('Tipo de concurso inválido.');
    }

    const resultRepository = new ResultRepository();

    if (resultNumber !== 'latest') {
      const savedResult = await resultRepository.findByNumber({
        lottery: lotteryName,
        resultNumber: parseInt(resultNumber, 10),
      });

      if (savedResult) {
        return savedResult.data;
      }
    }

    const response = await axios.get(
      `${lottery.url}${
        resultNumber !== 'latest' ? `p=concurso=${resultNumber}` : ''
      }`,
      {
        headers: {
          Cookie: 'security=true',
        },
      },
    );

    if (!response.data) {
      throw new AppError(
        'A resposta da requisição não é um objeto JSON válido.',
      );
    }

    if (response.data.erro) {
      throw new AppError(response.data.mensagem);
    }

    const findByNumber = await resultRepository.findByNumber({
      lottery: lotteryName,
      resultNumber: response.data.numero,
    });

    if (!findByNumber) {
      await resultRepository.create({
        lottery: lotteryName,
        resultNumber: response.data.numero,
        data: response.data,
      });
    }

    return response.data;
  }
}

export default FetchResultService;
