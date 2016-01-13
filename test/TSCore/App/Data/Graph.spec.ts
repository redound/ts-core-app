/// <reference path="../../TSCore.spec.ts" />

import Graph = TSCore.App.Data.Graph.Graph;
declare var describe, it, expect, jasmine, beforeEach, beforeAll;

describe("TSCore.App.Data.JsonGraph", () => {

    var graph;
    var data;

    beforeAll(() => {


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

    beforeEach(() => {
        graph.clear();
    });

    //describe("setData() / getData()", () => {
    //
    //    it("set and get data", () => {
    //
    //        graph.setData(data);
    //
    //        var results = graph.getData();
    //
    //        expect(results).toEqual(data);
    //    })
    //});
    //
    //describe("clear()", () => {
    //
    //    it("data is empty", () => {
    //
    //        var empty = graph.getData();
    //        graph.setData(data);
    //        graph.clear();
    //        var results = graph.getData();
    //
    //        expect(results).toEqual(empty);
    //    });
    //});
    //
    //describe("set() / get()", () => {
    //
    //    it("set and get multiple resources", () => {
    //
    //        var projects = data.projects;
    //
    //        graph.set(["projects"], projects);
    //
    //        var results = graph.get(["projects"]);
    //
    //        expect(results).toEqual(projects);
    //    });
    //
    //    it("set and get single resource", () => {
    //
    //        var project = data.projects[1];
    //
    //        graph.set(["projects", 1], project);
    //        var result = graph.get(["project", 1]);
    //
    //        expect(result).toEqual(project);
    //    });
    //});
});