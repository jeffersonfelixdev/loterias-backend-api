import { createConnection } from 'typeorm';
import CreateRandomUserService from '../services/CreateRandomUserService';

const connect = async (): Promise<void> => {
  await createConnection();
  const url = await new CreateRandomUserService().execute();
  console.log(url);
};

export default connect;
