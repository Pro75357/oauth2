var code = 'NGT9cTGZNxPm9%2f7fNiWdjk%2brfp91BWzBUdo68nt0tcV0ZpYYI2IgPQ%2bWV6Wf%2fNQj84x4NAegK%2f6qfb2lg0cPqPxb9igg18fF5ycJi06BG2f64uDj3PTIa%2bA60LA3THoQ'

Meteor.methods({
    'getTokens': function () {

        const endpoint = 'https://open-ic.epic.com/Argonaut/oauth2/token';

        /**
         * Attempt the exchange of code for token
         */
        let response;
        try {
            response = HTTP.post(
                endpoint, {
                    params: {
                        code: code,
                        client_id: '1c3615fd-4b92-4f58-96dd-4cb2cf213e6f',
                        //      client_secret: OAuth.openSecret(config.secret),
                        grant_type: 'authorization_code',
                        redirect_uri: 'https://localhost:3000/test'
                    }
                });

        } catch (err) {
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
            console.log(response.data)
            return response.data
        }
    }
})
