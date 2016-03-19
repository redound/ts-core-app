var object = {
    "leads":{
        "id":38,
        "amountHours":0,
        "contactId":428,
        "childName":"Test",
        "childLastname":"Bad",
        "notes":"do as lorem",
        "phaseStatus":4,
        "childcareType":2,
        "locationId":29,
        "assignedUserId":17,
        "createdUserId":5,
        "startDate":"2015-11-09T00:00:00Z",
        "nextContactDate":"2015-10-06T00:00:00Z",
        "dateOfBirth":null,
        "updatedAt":"2016-03-12T12:17:33Z",
        "createdAt":"2015-09-29T00:00:00Z",
        "assignedUser":{
            "id":17,
            "firstName":"management",
            "lastName":"gebruiker",
            "email":"olivierandriessen@gmail.com",
            "role":2,
            "hidden":1,
            "active":1
        },
        "createdUser":{
            "id":5,
            "firstName":"Olivier",
            "lastName":"Andriessen",
            "email":"olivierandriessen@gmail.com",
            "role":1,
            "hidden":0,
            "active":1
        },
        "contact":{
            "id":428,
            "clientNumber":"",
            "familyName":"Test",
            "parentingType":1,
            "address":"",
            "zipcode":"",
            "city":"?",
            "phonenumber":"0123855429",
            "mobileMother":"",
            "mobileFather":"",
            "emailAddress":"",
            "createdAt":"2015-09-29T09:04:42Z",
            "updatedAt":"2015-10-08T12:00:49Z",
            "state":1,
            "occasion":""
        },
        "location":{
            "id":29,
            "name":"DAP (PG)",
            "address":"Overste 163",
            "zipcode":"1234 HG",
            "city":"SCHEP",
            "phonenumber":"0648456950",
            "emailAddress":"pg-asdf@asdf.nl",
            "createdAt":"2015-09-24T21:13:53Z",
            "updatedAt":"2015-09-24T21:13:53Z"
        }
    }
};

/// <reference path="../../TSCore.spec.ts" />

import Serializer = TSCore.App.Api.Serializer;
declare var describe, it, expect, jasmine, beforeEach, beforeAll;

describe("TSCore.App.Api.Serializer", () => {

    beforeAll(() => {

    });

    beforeEach(() => {

    });

    describe("serialiaze()", () => {

        it("should return valid datasource response", () => {

            expect(true).toEqual(true);
        });
    });
});