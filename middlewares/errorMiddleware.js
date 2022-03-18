const errorMiddleware = async (_context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
};

export { errorMiddleware };
