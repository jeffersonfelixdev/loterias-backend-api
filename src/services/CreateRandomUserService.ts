import { getMongoRepository } from 'typeorm';
import { hash as getHash } from 'bcryptjs';
import User from '../models/User';

import AppError from '../errors/AppError';

class CreateRandomUserService {
  public async execute(): Promise<string> {
    const name = `uAx_lc${Math.random()
      .toString(36)
      .replace(/[^a-z0-9]+/g, '')
      .substr(0, 15)}`;

    const password = `Ak_l6tXO${Math.random()
      .toString(25)
      .replace(/[^a-z0-9]+/g, '')}${Math.random()
      .toString(36)
      .replace(/[^a-z0-9]+/g, '')}`;

    const usersRepository = getMongoRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: { name },
    });

    if (checkUserExists) {
      throw new AppError('User already exists on database');
    }

    const hash = await getHash(password, 8);

    const user = usersRepository.create({ name, hash });

    await usersRepository.save(user);

    return `curl -X GET http://localhost:${process.env.PORT}/login?userid=${name}&pw=${password}`;
  }
}

export default CreateRandomUserService;
