const routes =  require('next-routes');

module.exports = routes()
  .add({
    name: 'home',
    pattern: '/',
    page: 'category'
  })
  .add({
    name: 'category',
    pattern: '/category/:firstCategory?/:secondCategory?',
    page: 'category'
  })
  .add({
    name: 'archives',
    pattern: '/archives/:id',
    page: 'archives'
  });