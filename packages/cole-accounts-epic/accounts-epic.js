'use strict';

/**
 * Register this service (boilerplate).
 */
Accounts.oauth.registerService('epic');

/**
 * Client functionality (boilerplate).
 */
if (Meteor.isClient) {
  Meteor.loginWithEpic = function(options, callback) {
    
    /**
     * support (options, callback) and (callback)
     */
    if (!callback && typeof options === "function") {
      callback = options;
      options = null;
    }

    /**
     * 
     */
    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    Epic.requestCredential(options, credentialRequestCompleteCallback);
  };

/**
 * Server functionality (boilerplate).
 * Ensures sanity of published user object.
 */
} else {
  Accounts.addAutopublishFields({
    forLoggedInUser: _.map(
      /**
       * Logged in user gets whitelisted fields + accessToken + expiresAt.
       */
      Epic.whitelistedFields.concat(['accessToken', 'expiresAt']), // don't publish refresh token
      function (subfield) {
         // var testing = 'services.epic.' + subfield;
          //console.log(testing)

        return 'services.epic.' + subfield;
      }),

    forOtherUsers: _.map(
      /**
       * Other users get whitelisted fields without emails, because even with
       * autopublish, no legitimate web app should be publishing all users' emails.
       */
      _.without(Epic.whitelistedFields, 'email', 'verified_email'),
      function(subfield) {
        return 'services.epic.' + subfield;
      })
  });
}
