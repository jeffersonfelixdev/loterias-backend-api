import { getMongoRepository, MongoRepository } from 'typeorm';
import Result from '../models/Result';

interface ICreateResultDTO {
  lottery: string;
  resultNumber: number;
  data: unknown;
}

interface IFindResultByNumberDTO {
  lottery: string;
  resultNumber: number;
}

class ResultRepository {
  private ormRepository: MongoRepository<Result>;

  constructor() {
    this.ormRepository = getMongoRepository(Result);
  }

  public async create({
    lottery,
    resultNumber,
    data,
  }: ICreateResultDTO): Promise<Result> {
    const result = this.ormRepository.create({
      data,
      lottery,
      resultNumber,
    });

    await this.ormRepository.save(result);

    return result;
  }

  public async findByNumber({
    lottery,
    resultNumber,
  }: IFindResultByNumberDTO): Promise<Result | undefined> {
    const result = await this.ormRepository.findOne({
      where: { lottery, resultNumber },
    });

    return result;
  }

  public async findAll(lottery: string): Promise<unknown[]> {
    const results = await this.ormRepository.find({
      where: { lottery },
      order: { resultNumber: 'DESC' },
    });

    const lotteryResults = results.map(l => l.data);

    return lotteryResults;
  }
}

export default ResultRepository;
