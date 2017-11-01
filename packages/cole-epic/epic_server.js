'use strict';

/**
 * Define the base object namespace. By convention we use the service name
 * in PascalCase (aka UpperCamelCase). Note that this is defined as a package global.
 */
Epic = {};

/**
 * Boilerplate hook for use by underlying Meteor code
 */
Epic.retrieveCredential = (credentialToken, credentialSecret) => {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};

/**
 * Define the fields we want. Note that they come from various places...
 * Note that we *must* have an id. Also, this array is referenced in the
 * accounts-epic package, so we should probably keep this name and structure.
 */
Epic.whitelistedFields = ['id', 'name'];

Epic.redirect_uri = Meteor.absoluteUrl() + '_oauth/epic' // should work no matter the base URL
Epic.endpoint = 'https://open-ic.epic.com/Argonaut/api/FHIR/Argonaut'
Epic.oauthEndpoint = 'https://open-ic.epic.com/Argonaut/oauth2'
/**
 * Register this service with the underlying OAuth handler
 * (name, oauthVersion, urls, handleOauthRequest):
 *  name = 'epic'
 *  oauthVersion = 2
 *  urls = null for OAuth 2
 *  handleOauthRequest = function(query) returns {serviceData, options} where options is optional
 * serviceData will end up in the user's services.epic
 */
OAuth.registerService('epic', 2, null, function(query) {

  const state = query.state

  /**
   * Make sure we have a config object for subsequent use (boilerplate)
   */
  const config = ServiceConfiguration.configurations.findOne({
    service: 'epic'
    });
  if (!config) {
    throw new ServiceConfiguration.ConfigError();
  }

  /**
   * Get the token and username (Meteor handles the underlying authorization flow).
   * Note that the username comes from from this request in Epic.
   */
  const response = getTokens(config, query, Epic.redirect_uri);
  const accessToken = response.accessToken;
  const username = response.username;

    //console.dir(response)
  /**
   * If we got here, we can now request data from the account endpoints
   * to complete our serviceData request.
   * The identity object will contain the username plus *all* properties
   * retrieved from the account and settings methods.
  */
  const identity = _.extend(
      { username },
      patientName = getPatientName(config, username, accessToken),
  //  getSettings(config, username, accessToken)
  );

  /**
   * Build our serviceData object. This needs to contain
   *  accessToken
   *  expiresAt, as a ms epochtime
   *  refreshToken, if there is one
   *  id - note that there *must* be an id property for Meteor to work with
    * we will also add the redirect_uri and the endpoint for easy access later. Also since this will change with each different server, if we don't hard code it into our methods
      it will be much easier to add multi-server functionality later. Hopefully.

   * We'll just put the username into the user's profile as 'firstname + lastname'
   */
  const serviceData = {
    accessToken,
    expiresAt: (+new Date) + (1000 * response.expiresIn),
    id: response.username, // comes from the token request
    redirect_uri: Epic.redirect_uri, // manually input from above
    endpoint: Epic.endpoint // manually from above
  };
  if (response.refreshToken) {
      serviceData.refreshToken = response.refreshToken;
  }

  /**
   * Return the serviceData object along with an options object containing
   * the initial profile object with the username.
   */
  return {
    serviceData: serviceData,
    options: {
      profile: {
          name: patientName
        },
    }
  };
});

/**
 * The following functions are called in the above code to get
 *  the access_token, refresh_token and username (getTokens)
 *  Patient Name (getPatientName)
 */

/** getTokens exchanges a code for a token in line with Epic's documentation
 *
 *  returns an object containing:
 *   accessToken        {String}
 *   expiresIn          {Integer}   Lifetime of token in seconds
 *   refreshToken       {String}    If this is the first authorization request
 *   account_username   {String}    User name of the current user
 *   token_type         {String}    Set to 'Bearer'
 *
 * @param   {Object} config       The OAuth configuration object
 * @param   {Object} query        The OAuth query object
 * @return  {Object}              The response from the token request (see above)
 */
const getTokens = function (config, query, redirect_uri) {

    const endpoint = Epic.oauthEndpoint + '/token'
   // const endpoint = 'https://open-ic.epic.com/Argonaut/oauth2/token'
   
  /**
   * Attempt the exchange of code for token
   */
  let response;
  try {
    response = HTTP.post(
      endpoint, {
        params: {
          code: query.code,
          client_id: config.clientId,
    //      client_secret: OAuth.openSecret(config.secret),
          grant_type: 'authorization_code',
          redirect_uri: redirect_uri
        }
      });

  } catch (err) {
      console.dir(err)
    throw _.extend(new Error(`Failed to complete OAuth handshake with Epic. ${err.message}`), {
        response: err.response
    });
  }

  if (response.data.error) {

    /**
     * The http response was a json object with an error attribute
     */
    throw new Error(`Failed to complete OAuth handshake with Epic. ${response.data.error}`);

  } else {

    /** The exchange worked. We have an object containing
     *   access_token
     *   refresh_token
     *   expires_in
     *   token_type
     *   account_username
     *
     * Return an appropriately constructed object
     */
      return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,  // Epic does not support this (no client secret)
      expiresIn: response.data.expires_in,
      username: response.data.patient,
    };
  }
};

/**
 * getAccount gets the patient's information for the Patient FHIR resource
 *  returns an object containing just the First name. 
 */

const getPatientName = function (config, username, accessToken) {
    //const endpoint = 'https://open-ic.epic.com/argonaut/api/FHIR/Argonaut/Patient/' + username;
    const endpoint = Epic.endpoint + '/patient/' + username
    let patientName;

    /**
     * Here we get actual data back from the first token request
     */
    try {
        patientCall = HTTP.get(
            endpoint, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json'
                }
            }
        )
        patientName = patientCall.data.name[0].given[0] + ' ' + patientCall.data.name[0].family[0]  //Gives the first given name + 
        console.log(patientName)
        return patientName;

    } catch (err) {
        throw _.extend(new Error(`Failed to fetch patient data from Epic. ${err.message}`), {
            response: err.response
        });
    }
}