const {
  NODE_ENV = 'production'
} = process.env;

export const config = {
  env: {
    NODE_ENV,
  },
};
