module TSCore.App.Data.Query {

    export class Condition {

        public type: TSCore.App.Data.Query.Condition.Type;
        public field: string;
        public operator: TSCore.App.Data.Query.Condition.Operator;
        public value: any;

        public constructor(type: TSCore.App.Data.Query.Condition.Type, field: string, operator: TSCore.App.Data.Query.Condition.Operator, value: any) {

            this.type = type;
            this.field = field;
            this.operator = operator;
            this.value = value;
        }

        public getType(): TSCore.App.Data.Query.Condition.Type {

            return this.type;
        }

        public getField() {

            return this.field;
        }

        public getOperator(): TSCore.App.Data.Query.Condition.Operator {

            return this.operator;
        }

        public getValue() {

            return this.value;
        }
    }

    export module Condition {

        export enum Type {
            AND,
            OR
        }

        export enum Operator {
            IS_EQUAL,
            IS_GREATER_THAN,
            IS_GREATER_THAN_OR_EQUAL,
            IS_IN,
            IS_LESS_THAN,
            IS_LESS_THAN_OR_EQUAL,
            IS_LIKE,
            IS_NOT_EQUAL,
        }
    }
}