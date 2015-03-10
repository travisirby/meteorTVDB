Router.route('/', function () {
  // render the Home template with a custom data context
  this.render('userDetails', {data: {title: 'My Title'}});
});

Router.route('/test', function () {
  // render the Home template with a custom data context
  this.render('userDetails', {data: {title: 'My Title'}});
});

Router.route('/modal', function () {
  // render the Home template with a custom data context
  this.render('modal', {data: {title: 'Modal'}});
});
