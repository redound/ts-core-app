module TSCore.App.Data.Query {

    import Collection = TSCore.Data.Collection;
    import List = TSCore.Data.List;
    import Dictionary = TSCore.Data.Dictionary;
    import Model = TSCore.Data.Model;
    import Exception = TSCore.Exception.Exception;
    import ModelResultSet = TSCore.App.Data.ResultSet.ModelResultSet;

    export class ModelQuery<T extends Model> extends TSCore.BaseObject {

        protected _repository: Repository<T>;

        protected _itemId: any;
        protected _includes: Collection<string> = new Collection<string>();
        protected _conditions: List<Condition> = new List<Condition>();
        protected _options: Dictionary<string, any> = new Dictionary<string, any>();

        constructor(){

            super();
        }

        public from(repository: Repository<T>): ModelQuery<T> {

            this._repository = repository;
            return this;
        }

        public getFrom(): Repository<T> {

            return this._repository;
        }


        public find(id: any): ModelQuery<T>  {

            this._itemId = id;
            return this;
        }

        public getItemId(): any {

            return this._itemId;
        }


        public condition(condition: Condition): ModelQuery<T>  {

            this._conditions.add(condition);
            return this;
        }

        public getConditions(): List<Condition> {

            return this._conditions.clone();
        }


        public where(conditions: string, bind?: any): ModelQuery<T> {

            var conditionParts = conditions.split(' AND ');

            _.each(conditionParts, (conditionItem: string) => {

                var resolvedCondition = this._resolveTokens(conditionItem.trim(), bind);
                this.condition(Condition.parse(resolvedCondition));
            });

            return this;
        }

        public having(values: any): ModelQuery<T> {

            _.each(values, (value: string, key: string) => {
                this.condition(new Condition(key, ConditionOperator.EQUALS, value));
            });

            return this;
        }


        public include(...args: string[]): ModelQuery<T>  {

            this._includes.addMany(args);
            return this;
        }

        public getIncludes(): Collection<string> {

            return this._includes.clone();
        }


        public option(key: string, value: any): ModelQuery<T>  {

            this._options.set(key, value);
            return this;
        }

        public getOptions(): Dictionary<string, any> {

            return this._options.clone();
        }


        public execute(): ng.IPromise<ModelResultSet<T>> {

            if(!this._repository){
                throw new Exception('Cannot execute query, unknown repository (from)');
            }

            return this._repository.get(this);
        }

        public executeSingle(): ng.IPromise<T> {

            if(!this._repository){
                throw new Exception('Cannot execute query, unknown repository (from)');
            }

            return this._repository.getFirst(this);
        }


        protected _resolveTokens(input: string, tokens: any): string {

            return input.replace(/:([^:]+):/g, (token: string) => {

                var strippedToken = token.substring(1, token.length-1);

                var tokenValue = tokens[strippedToken];

                if(_.isNull(tokenValue) || _.isNaN(tokenValue) || _.isUndefined(tokenValue)){
                    return 'NULL';
                }
                else if(_.isNumber(tokenValue)){
                    return tokenValue;
                }

                return "'" + tokenValue + "'";
            });
        }
    }
}