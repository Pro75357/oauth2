Package.describe({
  name: 'cole:accounts-epic',
  version: '0.0.1',
  summary: 'OAuth2 for Epic',
  git: 'https://github.com/pro75357/Oauth2',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use(['underscore', 'random']);
  api.use('accounts-base', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);

  api.use('accounts-oauth', ['client', 'server']);
  api.use('cole:epic@0.0.1', ['client', 'server']);

  api.addFiles('accounts-epic_login_button.css', 'client');

  api.addFiles('accounts-epic.js');
});
