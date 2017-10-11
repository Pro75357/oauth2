// This will use Oauth2 to connect to Open.epic.com

// Epic OAUTH2 tutorial: https://open.epic.com/Tutorial/OAuth

import { HTTP } from 'meteor/http'

//Root URLs for easier coding
var baseURL = 'https://open-ic.epic.com/'; // Root URL of the epic API
var metadataURL = 'https://open-ic.epic.com/Argonaut/api/FHIR/Argonaut/metadata' // MetaData Endpoint
//var authURL = 'https://open-ic.epic.com/mychart/Authentication/OAuth/Start' // Authorization URL
var authURL = 'https://open-ic.epic.com/Argonaut/oauth2/authorize' // Authorization URL
var tokenURL = 'https://open-ic.epic.com/Argonaut/oauth2/token' //token URL

 // app variables
var client_id = 'f6588529-fc65-442a-97eb-d03cbd6f4378' //from Cole's Epic App
//var ClientSecret = ''

var redirect_uri = 'http://localhost:3000/test'
var Scope = '*'

//On our sandbox server you can test using patient username fhirjessica or fhirjason, each of which have password epicepic1.

if (Meteor.isServer) {
    Meteor.methods({
        //gets the metadata from Epic servers
        'getMetadata': function () {
            try {
                this.call = HTTP.call("GET", baseURL + 'argonaut/api/FHIR/Argonaut/metadata');
                console.log('Metadata Get status: ' + this.call.statusCode);
                console.log(this.call.content);
                metadata = this.call.content; // Store in TGT after parsing json
                //console.log("newTGT: " + TGT); // Print the parsing  
                return metadata;
            } catch (e) {
                console.log(e);
                return false;
            }
        },

        'getAuthToken': function () {
            try {
                this.call = HTTP.call("GET", authURL, {
                    params:
                    {
                        response_type: 'code',
                        client_id: client_id,
                        redirect_uri: redirect_uri
                    }

                });
                console.log('AuthToken Get status: ' + this.call.statusCode);
                console.log(this.call.content);
                //metadata = this.call.content; // Store in TGT after parsing json
                //console.log("newTGT: " + TGT); // Print the parsing  
                return true;
            } catch (e) {
                console.log(e);
                return false;
            }
        },
        })
    }

	/*
	Meteor.methods({
			// Gets the initial Ticket Granting Ticket using the API key
			'getTGT': function (){
				console.log('TGT apiKey: '+thisApiKey); //print API key=
				try{
					this.call = HTTP.call("POST", authroot+'/cas/v1/api-key', {params: { apikey: thisApiKey }} );
					console.log('TGT get status: '+ this.call.statusCode);
					//console.log(this.call.headers);
					TGT = this.call.headers.location; // Store in TGT after parsing json
                    //console.log("newTGT: " + TGT); // Print the parsing  
					return true;
				} catch (e) {
					console.log(e);
					return false;
				}
			},
			
			//Get one-time ticket using TGT
			'getTicket': function(){
				//console.log('getting new single ticket')
				//console.log('Using TGT: '+TGT);
				try{
					this.call = HTTP.call("POST", TGT, {params: {service: 'http://umlsks.nlm.nih.gov'}});
					var ticket = this.call.content;
					//console.log('New single-use ticket: '+ticket);
					return ticket;
				} catch (e) {
					console.log(e);
					return false;
				}
			},
		
        })

		// These functions will just run on startup (on the server). 

        Meteor.call('getTGT'); // Get TGT for the session. Good for like 8 hours. On production will need better solution. 
		//Meteor.call('ticketTest');
		console.log('Ready to Search!')
}

    */
    