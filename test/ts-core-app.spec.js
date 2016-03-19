var object = {
    "leads": {
        "id": 38,
        "amountHours": 0,
        "contactId": 428,
        "childName": "Test",
        "childLastname": "Bad",
        "notes": "do as lorem",
        "phaseStatus": 4,
        "childcareType": 2,
        "locationId": 29,
        "assignedUserId": 17,
        "createdUserId": 5,
        "startDate": "2015-11-09T00:00:00Z",
        "nextContactDate": "2015-10-06T00:00:00Z",
        "dateOfBirth": null,
        "updatedAt": "2016-03-12T12:17:33Z",
        "createdAt": "2015-09-29T00:00:00Z",
        "assignedUser": {
            "id": 17,
            "firstName": "management",
            "lastName": "gebruiker",
            "email": "olivierandriessen@gmail.com",
            "role": 2,
            "hidden": 1,
            "active": 1
        },
        "createdUser": {
            "id": 5,
            "firstName": "Olivier",
            "lastName": "Andriessen",
            "email": "olivierandriessen@gmail.com",
            "role": 1,
            "hidden": 0,
            "active": 1
        },
        "contact": {
            "id": 428,
            "clientNumber": "",
            "familyName": "Test",
            "parentingType": 1,
            "address": "",
            "zipcode": "",
            "city": "?",
            "phonenumber": "0123855429",
            "mobileMother": "",
            "mobileFather": "",
            "emailAddress": "",
            "createdAt": "2015-09-29T09:04:42Z",
            "updatedAt": "2015-10-08T12:00:49Z",
            "state": 1,
            "occasion": ""
        },
        "location": {
            "id": 29,
            "name": "DAP (PG)",
            "address": "Overste 163",
            "zipcode": "1234 HG",
            "city": "SCHEP",
            "phonenumber": "0648456950",
            "emailAddress": "pg-asdf@asdf.nl",
            "createdAt": "2015-09-24T21:13:53Z",
            "updatedAt": "2015-09-24T21:13:53Z"
        }
    }
};
var DefaultSerializer = TSCore.App.Data.Serializers.DefaultSerializer;
describe("TSCore.App.Data.Serializer.DefaultSerializer", function () {
    beforeAll(function () {
    });
    beforeEach(function () {
    });
    describe("serialiaze()", function () {
        it("should return valid datasource response", function () {
            expect(true).toEqual(true);
        });
    });
});
describe("TSCore.App", function () {
    it("test should work", function () {
        expect(true).toEqual(true);
    });
});
var Graph = TSCore.App.Data.Graph.Graph;
describe("TSCore.App.Data.JsonGraph", function () {
    var graph;
    var data;
    beforeAll(function () {
        data = {
            users: {
                1: {
                    id: 1,
                    firstName: "Bart",
                    lastName: "Blok",
                    age: 30
                },
                2: {
                    id: 2,
                    firstName: "Niels",
                    lastName: "Bastian",
                    age: 20
                },
                3: {
                    id: 3,
                    firstName: "Olivier",
                    lastName: "Andriessen",
                    age: 3
                }
            },
            projects: {
                1: {
                    id: 1,
                    title: "Project 1",
                    parts: ["a", "b", "c"],
                    date: new Date(),
                    users: [
                        { $type: "ref", value: ["users", 3] }
                    ]
                },
                2: {
                    id: 2,
                    title: "TheProjectApp",
                    parts: ["a", "b", "c"],
                    date: new Date(),
                    users: { $type: "ref", value: ["users"] },
                    author: { $type: "ref", value: ["users", 3] }
                },
                3: {
                    id: 3,
                    title: "Project 2",
                    parts: ["d", "e", "f"],
                    date: new Date(),
                    users: []
                }
            }
        };
        graph = new Graph();
    });
    beforeEach(function () {
        graph.clear();
    });
});
var Query = TSCore.App.Data.Query.Query;
var Condition = TSCore.App.Data.Query.Condition;
var ConditionType = TSCore.App.Data.Query.ConditionType;
var ConditionOperator = TSCore.App.Data.Query.ConditionOperator;
var Sorter = TSCore.App.Data.Query.Sorter;
var SortDirections = TSCore.App.Data.Query.SortDirections;
describe("TSCore.App.Data.Query.Query", function () {
    describe("serialize()", function () {
        it("should serialize the properties given", function () {
            var query1 = new Query;
            query1.from("projects");
            query1.condition(new Condition(ConditionType.AND, 'a', ConditionOperator.IS_EQUAL, 'g'));
            query1.condition(new Condition(ConditionType.AND, 'b', ConditionOperator.IS_GREATER_THAN, 'h'));
            query1.condition(new Condition(ConditionType.AND, 'c', ConditionOperator.IS_GREATER_THAN_OR_EQUAL, 'i'));
            query1.condition(new Condition(ConditionType.AND, 'd', ConditionOperator.IS_IN, 'j'));
            query1.sorter(new Sorter('a', SortDirections.ASCENDING));
            query1.sorter(new Sorter('b', SortDirections.DESCENDING));
            var query1Conditions = query1.serialize(["from", "conditions", "sorters"]);
            var query2 = new Query;
            query2.from("projects");
            query2.condition(new Condition(ConditionType.AND, 'a', ConditionOperator.IS_EQUAL, 'g'));
            query2.condition(new Condition(ConditionType.AND, 'b', ConditionOperator.IS_GREATER_THAN, 'h'));
            query2.condition(new Condition(ConditionType.AND, 'c', ConditionOperator.IS_GREATER_THAN_OR_EQUAL, 'i'));
            query2.condition(new Condition(ConditionType.AND, 'd', ConditionOperator.IS_IN, 'j'));
            query2.sorter(new Sorter('a', SortDirections.ASCENDING));
            query2.sorter(new Sorter('b', SortDirections.DESCENDING));
            query2.find(1);
            var query2Conditions = query2.serialize(["from", "conditions", "sorters"]);
            console.log(query1Conditions);
            console.log(query2Conditions);
            expect(query1Conditions).toEqual(query2Conditions);
        });
    });
});
