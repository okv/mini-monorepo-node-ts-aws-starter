export const handler = async (event) => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  const response = {
    statusCode: 200,
    body: JSON.stringify({ hello: 'Hello from Lambda!' }),
  };
  return response;
};
