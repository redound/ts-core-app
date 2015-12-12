module TSCore.App.Data.Query {

    import Exception = TSCore.Exception.Exception;

    export enum ConditionOperator {
        EQUALS,
        NOT_EQUALS,
        GREATER_THAN,
        GREATER_THAN_EQUALS,
        LESS_THAN,
        LESS_THAN_EQUALS,
    }

    export class Condition extends TSCore.BaseObject
    {
        private static VALUE_REGEX = /^["|'](?:[^("|')\\]|\\.)*["|']$/;

        protected _property: string;
        protected _operator: ConditionOperator;
        protected _value: any;

        public constructor(property: string, operator: ConditionOperator, value: any) {

            super();

            this._property = property;
            this._operator = operator;
            this._value = value;
        }

        public getProperty(): string {

            return this._property;
        }

        public getOperator(): ConditionOperator {

            return this._operator;
        }

        public getValue(): any {

            return this._value;
        }


        public static parse(conditionString: string): Condition {

            var conditionParts: string[] = conditionString.split(' ');

            if(conditionParts.length != 3){
                throw new Exception('Condition "' + conditionString + '" invalid');
            }

            var property = conditionParts.shift().trim();
            var operatorRaw = conditionParts.shift().trim();
            var valueRaw = conditionParts.join(' ').trim();

            // Resolve operator
            var operator: ConditionOperator = null;

            switch(operatorRaw){

                case '===':
                case '==': operator = ConditionOperator.EQUALS; break;
                case '<>':
                case '!==':
                case '!=': operator = ConditionOperator.NOT_EQUALS; break;
                case '>': operator = ConditionOperator.GREATER_THAN; break;
                case '>=': operator = ConditionOperator.GREATER_THAN_EQUALS; break;
                case '<': operator = ConditionOperator.LESS_THAN; break;
                case '<=': operator = ConditionOperator.LESS_THAN_EQUALS; break;
            }

            if(operator === null){
                throw new Exception('Condition "' + conditionString + '" contains invalid operator: "' + operatorRaw + '"');
            }

            // Resolve value
            var value = null;

            var stringValue: string = this.VALUE_REGEX.test(valueRaw) ? valueRaw.substring(1, valueRaw.length-1) : null;
            var numberValue: number = parseInt(valueRaw);

            if(valueRaw.toUpperCase() == 'NULL'){
                value = null;
            }
            else if(stringValue){
                value = stringValue;
            }
            else if(!_.isNaN(numberValue)){
                value = numberValue;
            }
            else {
                throw new Exception('Condition "' + conditionString + '" contains invalid formatted value: "' + valueRaw + '"');
            }

            return new Condition(property, operator, value);
        }
    }
}