import { Session } from 'meteor/session'

Meteor.methods({
    'fhir': function () {
        var mkFhir = require('fhir.js');
        var config = {
            baseUrl: Meteor.user().services.epic.endpoint,
            auth: {
                bearer: Meteor.user().services.epic.accessToken
            },
            credentials: 'same-origin'
        }
        var client = mkFhir(config);
        var pat = Meteor.user().services.epic.id

        try {
            res = client
                .search({ type: 'Observation', patient: pat, query: { category: 'vital-signs' } })
                .then(function (res) {
                    return res
                })
            console.log('result: ' + res)
            return res.data
        } catch (e) {
            console.log('error: '+e)
            return res
        }
        /*
        client
            .search({ type: 'Observation', patient: pat, query: {category: 'vital-signs' } })
            .then(function (res) {
                var bundle = res.data;
                console.log('obs', bundle);
                return bundle
            })
            .catch(function (res) {
                //Error responses
                if (res.status) {
                    console.log('Error', res.status);
                    //console.dir(res.data.issue)
                    return res.status
                }
                //Errors
                if (res.message) {
                    console.log('Error', res.message);
                    return res.message
                }
        */

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
                            Accept: 'application/json, application/json+fhir'
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
