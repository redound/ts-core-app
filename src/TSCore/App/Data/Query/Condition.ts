module TSCore.App.Data.Query {

    export class Condition {

        protected _type: TSCore.App.Data.Query.Condition.Type;
        protected _field: string;
        protected _operator: TSCore.App.Data.Query.Condition.Operator;
        protected _value: any;

        public constructor(type: TSCore.App.Data.Query.Condition.Type, field: string, operator: TSCore.App.Data.Query.Condition.Operator, value: any) {

            this._type = type;
            this._field = field;
            this._operator = operator;
            this._value = value;
        }

        public getType(): TSCore.App.Data.Query.Condition.Type {

            return this._type;
        }

        public getField() {

            return this._field;
        }

        public getOperator(): TSCore.App.Data.Query.Condition.Operator {

            return this._operator;
        }

        public getValue() {

            return this._value;
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