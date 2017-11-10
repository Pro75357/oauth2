import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session'
import './main.html';


Template.getdata.events({
    'click .patient'(event, instance) {
        // this is essentially a testing button
        setData('patient')
    },
});

Template.obsSearch.events({
    'submit form'(event, instance) {
        event.preventDefault()
        Meteor.call('fhir', function (err, res) {
            if (err) {
                console.log(err)
            }
            Session.set('Observation',res)
        })
        /*
        if (event.target.value == ''){
            option = 'Temperature'
        } else {
            option = event.target.value
        }
        setData('Observation', option)
        */
    }
})

Template.display.helpers({ 
// There is probably a better way... ?
    data() {
        return Session.get('patient')
    },
    givenName() {
        return Session.get('patient').name[0].given[0]
    },
    familyName() {
        return Session.get('patient').name[0].family[0]
    },
    birthDate() {
        return Session.get('patient').birthDate
    },
    address() {
        return Session.get('patient').address[0]
    },
    gender() {
        return Session.get('patient').gender
    },

    obsString() {
        return JSON.stringify(Session.get('Observation'),null,2)
    }
    // Observation data here



})

//Define client-side methods here. These can set the session variables for us in a object-based way
    function setData(resource) {
        Meteor.call('getData', resource, function (err, res) {
            if (err) {
                console.log(err)
            }
            Session.set(resource, res)
        })
    }

