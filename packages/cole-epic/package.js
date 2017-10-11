Package.describe({
  name: 'cole:epic',
  version: '0.0.1',
  summary: 'OAuth handler for Epic',
  git: 'https://github.com/robfallows/tunguska-epic',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('accounts-ui', ['client', 'server']);
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use(['underscore', 'service-configuration'], ['client', 'server']);
  api.use(['random', 'templating'], 'client');

  api.export('Epic');

  api.addFiles(
    ['epic_configure.html', 'epic_configure.js'],
    'client');

  api.addFiles('epic_server.js', 'server');
  api.addFiles('epic_client.js', 'client');
});
