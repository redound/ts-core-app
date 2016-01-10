/// <reference path="../../build/ts-core-app.d.ts" />
describe("TSCore.App", function () {
    it("test should work", function () {
        expect(true).toEqual(true);
    });
});
/// <reference path="../../TSCore.spec.ts" />
var JsonGraph = TSCore.App.Data.JsonGraph;
describe("TSCore.App.Data.JsonGraph", function () {
    var graph;
    beforeAll(function () {
        graph = new JsonGraph({
            users: {
                1: {
                    id: 1,
                    firstName: "Bart",
                    lastName: "Blok",
                    city: "Middelharnis",
                    age: 30
                },
                2: {
                    id: 2,
                    firstName: "Niels",
                    lastName: "Bastian",
                    city: "Middelburg",
                    age: 20
                },
                3: {
                    id: 3,
                    firstName: "Olivier",
                    lastName: "Andriessen",
                    city: "Oude-Tonge",
                    age: 3
                }
            },
            projects: {
                1: {
                    id: 1,
                    title: "WarecoWaterData",
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
                    users: [
                        { $type: "ref", value: ["users", 1] },
                        { $type: "ref", value: ["users", 2] },
                        { $type: "ref", value: ["users", 3] }
                    ]
                },
                3: {
                    id: 3,
                    title: "WarecoGevelData",
                    parts: ["d", "e", "f"],
                    date: new Date(),
                    users: []
                }
            },
            results: [{
                    $type: "ref",
                    value: ["projects", 1]
                }, {
                    $type: "ref",
                    value: ["projects", 2]
                }, {
                    $type: "ref",
                    value: ["projects", 3]
                }]
        });
    });
    describe("get()", function () {
        it("should resolve references from an array", function () {
            var results = graph.get(["results"]);
            console.log(results);
            expect(1).toEqual(1);
        });
        it("should return all users", function () {
            var users = graph.get(["users"]);
            console.log(users);
            expect(1).toEqual(1);
        });
        it("should return one user", function () {
            var user = graph.get(["users", 1]);
            console.log(user);
            expect(1).toEqual(1);
        });
        it("should return the users of a project", function () {
            var users = graph.get(["projects", 2, "users"]);
            console.log(users);
            expect(1).toEqual(1);
        });
        it("should return projects with users", function () {
            var projects = graph.get(["projects"]);
            console.log(projects);
            expect(1).toEqual(1);
        });
    });
});
