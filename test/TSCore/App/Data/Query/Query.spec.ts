/// <reference path="../../../TSCore.spec.ts" />

import Query = TSCore.App.Data.Query.Query;
import Condition = TSCore.App.Data.Query.Condition;
import Type = TSCore.App.Data.Query.Condition.Type;
import Operator = TSCore.App.Data.Query.Condition.Operator;
import Sorter = TSCore.App.Data.Query.Sorter;
import SortDirections = TSCore.App.Data.Query.SortDirections;

declare var describe, it, expect, jasmine, beforeEach, beforeAll;

describe("TSCore.App.Data.Query.Query", () => {

    describe("serialize()", () => {

        it("should serialize the properties given", () => {

            var query1 = new Query;

            // From
            query1.from("projects");

            // Condition
            query1.condition(new Condition(Type.AND, 'a', Operator.IS_EQUAL, 'g'));
            query1.condition(new Condition(Type.AND, 'b', Operator.IS_GREATER_THAN, 'h'));
            query1.condition(new Condition(Type.AND, 'c', Operator.IS_GREATER_THAN_OR_EQUAL, 'i'));
            query1.condition(new Condition(Type.AND, 'd', Operator.IS_IN, 'j'));

            // Sorters
            query1.sorter(new Sorter('a', SortDirections.ASCENDING));
            query1.sorter(new Sorter('b', SortDirections.DESCENDING));

            var query1Conditions = query1.serialize(["from", "conditions", "sorters"]);

            var query2 = new Query;

            // From
            query2.from("projects");

            // Condition
            query2.condition(new Condition(Type.AND, 'a', Operator.IS_EQUAL, 'g'));
            query2.condition(new Condition(Type.AND, 'b', Operator.IS_GREATER_THAN, 'h'));
            query2.condition(new Condition(Type.AND, 'c', Operator.IS_GREATER_THAN_OR_EQUAL, 'i'));
            query2.condition(new Condition(Type.AND, 'd', Operator.IS_IN, 'j'));

            // Sorters
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