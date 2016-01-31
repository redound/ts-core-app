///<reference path="ConditionType.ts"/>
///<reference path="ConditionOperator.ts"/>

module TSCore.App.Data.Query {

    export class Condition {

        public type: ConditionType;
        public field: string;
        public operator: ConditionOperator;
        public value: any;

        public constructor(type?: ConditionType, field?: string, operator?: ConditionOperator, value?: any) {

            this.type = type;
            this.field = field;
            this.operator = operator;
            this.value = value;
        }

        public getType(): ConditionType {

            return this.type;
        }

        public getField() {

            return this.field;
        }

        public getOperator(): ConditionOperator {

            return this.operator;
        }

        public getValue() {

            return this.value;
        }
    }
}