import { getMongoRepository, MongoRepository } from 'typeorm';
import Url from '../models/Url';

interface ICreateUrlDTO {
  lottery: string;
  url: string;
}

class UrlRepository {
  private ormRepository: MongoRepository<Url>;

  constructor() {
    this.ormRepository = getMongoRepository(Url);
  }

  public async create({ lottery, url }: ICreateUrlDTO): Promise<Url> {
    const res = this.ormRepository.create({
      lottery,
      url,
    });

    await this.ormRepository.save(res);

    return res;
  }

  public async find(lottery: string): Promise<Url | undefined> {
    const res = await this.ormRepository.findOne({
      where: { lottery },
    });

    return res;
  }
}

export default UrlRepository;
