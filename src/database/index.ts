import { createConnection } from 'typeorm';
import CreateRandomUserService from '../services/CreateRandomUserService';

const connect = async (): Promise<void> => {
  await createConnection();
  const url = await new CreateRandomUserService().execute();
  console.log('To use this API, retrieve your TOKEN with the command bellow:');
  console.log(url);
};

export default connect;
