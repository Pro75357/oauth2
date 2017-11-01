import { Session } from 'meteor/session'

Meteor.methods({
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
