const { routeLogger } = require('@backend/middleware/routes');
const Auth = require('./main/classes/Auth');

module.exports = () => {
  if (!app.express){
    logger.error('Экспресс не загружен!');
    return;
  }
  
  app.express.get('/auth/vkontakte', Auth.Passport().authenticate('vkontakte'))

  app.express.get('/auth/vkontakte/callback', 
    Auth.Passport().authenticate('vkontakte', {  
      successRedirect: '/panel/view',
      failureRedirect: '/auth' 
    })
  );

  app.express.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/auth')
  });

  app.express.use(routeLogger);

  app.express.get('*', async (req, res) => res.render('main'));
};
