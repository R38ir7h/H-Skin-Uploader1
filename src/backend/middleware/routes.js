module.exports = {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {any} next
   */
  routeLogger: (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    logger.debug(`Return '${req.path}' for '${ip}'`);
    next();
  }
};
