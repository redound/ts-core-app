module TSCore.App.Data.Query {

    export enum ConditionTypes {
        AND,
        OR
    }

    export enum ConditionOperators {
        IS_EQUAL,
        IS_GREATER_THAN,
        IS_GREATER_THAN_OR_EQUAL,
        IS_IN,
        IS_LESS_THAN,
        IS_LESS_THAN_OR_EQUAL,
        IS_LIKE,
        IS_NOT_EQUAL,
    }

    export class Condition {



        protected _type: ConditionTypes;
        protected _field: string;
        protected _operator: ConditionOperators;
        protected _value: any;

        public constructor(type: ConditionTypes, field: string, operator: ConditionOperators, value: any) {

            this._type = type;
            this._field = field;
            this._operator = operator;
            this._value = value;
        }

        public getType() {

            return this._type;
        }

        public getField() {

            return this._field;
        }

        public getOperator(): ConditionOperators {

            return this._operator;
        }

        public getValue() {

            return this._value;
        }
    }
}