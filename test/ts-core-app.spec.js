/// <reference path="../../build/ts-core-app.d.ts" />
describe("TSCore.App", function () {
    it("test should work", function () {
        expect(true).toEqual(true);
    });
});
/// <reference path="../../TSCore.spec.ts" />
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
