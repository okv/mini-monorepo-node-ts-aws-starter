import { config } from './config';

export async function handler(event: object): Promise<object> {
  const { versions } = process;

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      hello: 'Hello from Lambda!',
      inputEvent: event,
      config,
      versions,
    }),
  };

  return response;
};
