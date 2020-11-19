import { compare } from 'bcryptjs';
import { getMongoRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
  username: string;
  password: string;
}

class AuthenticateUserService {
  public async execute({
    username,
    password,
  }: Request): Promise<{ token: string }> {
    const usersRepository = getMongoRepository(User);

    const user = await usersRepository.findOne({ where: { name: username } });

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await compare(password, user.hash);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const token = sign(
      {
        subject: user.name,
      },
      String(process.env.API_SECRET),
    );

    return {
      token,
    };
  }
}

export default AuthenticateUserService;
