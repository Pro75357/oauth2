import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

var baseURL = 'https://open-ic.epic.com/'; // Root URL of the epic API
var metadataURL = 'https://open-ic.epic.com/Argonaut/api/FHIR/Argonaut/metadata' // MetaData Endpoint
//var authURL = 'https://open-ic.epic.com/mychart/Authentication/OAuth/Start' // Authorization URL
var authURL = 'https://open-ic.epic.com/Argonaut/oauth2/authorize' // Authorization URL
var tokenURL = 'https://open-ic.epic.com/Argonaut/oauth2/token' //token URL

// app variables
var client_id = '1c3615fd-4b92-4f58-96dd-4cb2cf213e6f' //from Epic
//var ClientSecret = ''

var redirect_uri = 'http://localhost:3000/test'

const loginUrl = authURL + '?response_type=code' + '&client_id=' + client_id +  '&redirect_uri=' + redirect_uri

Template.main.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
      var test
      Meteor.call('getMetadata'), function (err, res) {
          test = res;
      }
      console.log(test)

  },
});

Template.auth.events({
    'click button'(event, instance) {
        // increment the counter when button is clicked
        var win = window.open(loginUrl,'_blank')
        }
    })