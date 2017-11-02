import { Session } from 'meteor/session'

var mkFhir = require('fhir.js');

Meteor.methods({
    'fhir': function () {
        var mkFhir = require('fhir.js');
        var config = Meteor.user().config
        var client = mkFhir(config);

        client
            .search({ type: 'Observation', query: { 'Temperature': '37' } })
            .then(function (res) {
                var bundle = res.data;
                var count = (bundle.entry && bundle.entry.length) || 0;
                console.log("# Patients born in 1974: ", count);
                return bundle
            })
            .catch(function (res) {
                //Error responses
                if (res.status) {
                    console.log('Error', res.status);
                }

                //Errors
                if (res.message) {
                    console.log('Error', res.message);
                }
            });

    },
    'getData': function (resource, option) {
        if (resource === 'patient') {
            // Using the Oauth data in Meteor.user(), we need to make an HTTP call to fetch the patient resource. 
            var endpoint = Meteor.user().services.epic.endpoint + '/' + resource + '/' + Meteor.user().services.epic.id
            //var endpoint = Meteor.user().services.epic.endpoint + '/' + resource
            var accessToken = Meteor.user().services.epic.accessToken
            try {
                res = HTTP.call(
                    'GET',
                    endpoint, {
                        params: {
                            patient: Meteor.user().services.epic.id
                        },
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            Accept: 'application/json'
                        }
                    })
               // console.dir(res)
                return res.data
            } catch (e) {
                console.log(e)
            }
        //Session.set('patient', res.data)
        } else {
            // Using the Oauth data in Meteor.user(), we need to make an HTTP call to fetch the patient resource. 
            //var endpoint = Meteor.user().services.epic.endpoint + '/' + resource + '/' + Meteor.user().services.epic.id
            var endpoint = Meteor.user().services.epic.endpoint + '/' + resource
            var accessToken = Meteor.user().services.epic.accessToken
            try {
                res = HTTP.call(
                    'GET',
                    endpoint, {
                        params: {
                            patient: Meteor.user().services.epic.id,
                            category: 'vital-signs',
                            text: option
                        },
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            Accept: 'application/json'
                        }
                    })
               // console.dir(res)
                return res.data
            } catch (e) {
                console.log(e)
                return e
            }
        //Session.set('patient', res.data)
        }
        
        }
})
