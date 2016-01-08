module TSCore.App.Data.Query {

    import IataSource = TSCore.App.Data.IDataSource;
    import Condition = TSCore.App.Data.Query.Condition;
    import Sorter = TSCore.App.Data.Query.Sorter;
    import Resource = TSCore.App.Api.Resource;

    export class Query {

        protected _from: string;
        protected _offset: number = null;
        protected _limit: number = null;
        protected _fields: string[] = [];
        protected _conditions: Condition[] = [];
        protected _sorters: Sorter[] = [];
        protected _find: any;

        public from(from: string): Query {

            this._from = from;
            return this;
        }

        public getFrom(): string {
            return this._from;
        }

        public hasFrom(): boolean {

            return !!this._from;
        }

        public field(field: string): Query {

            this._fields.push(field);
            return this;
        }

        public addManyFields(fields: string[]): Query {

            this._fields = this._fields.concat(fields);
            return this;
        }

        public getFields(): string[] {

            return this._fields;
        }

        public hasFields(): boolean {

            return (this._fields.length > 0);
        }

        public offset(offset: number): Query {

            this._offset = offset;
            return this;
        }

        public getOffset(): number {

            return this._offset;
        }

        public hasOffset(): boolean {

            return _.isNumber(this._offset);
        }

        public limit(limit: number): Query {

            this._limit = limit;
            return this;
        }

        public getLimit(): number {

            return this._limit;
        }

        public hasLimit(): boolean {

            return _.isNumber(this._limit);
        }

        public condition(condition: Condition): Query {

            this._conditions.push(condition);
            return this;
        }

        public addManyConditions(conditions: Condition[]): Query {

            this._conditions = this._conditions.concat(conditions);
            return this;
        }

        public getConditions(): Condition[] {

            return this._conditions;
        }

        public hasConditions(): boolean {

            return !!(this._conditions.length > 0);
        }

        public sorter(sorter: Sorter): Query {

            this._sorters.push(sorter);
            return this;
        }

        public addManySorters(sorters: Sorter[]): Query {

            this._sorters = this._sorters.concat(sorters);
            return this;
        }

        public getSorters(): Sorter[] {

            return this._sorters;
        }

        public hasSorters(): boolean {

            return (this._sorters.length > 0);
        }

        public find(id: any): Query {

            this._find = id;
            return this;
        }

        public getFind(): any {

            return this._find;
        }

        public hasFind(): boolean {

            return !!this._find;
        }

        public merge(query: Query): Query {

            if (query.hasFrom()) {
                this.from(query.getFrom());
            }

            if (query.hasFields()) {
                this.addManyFields(query.getFields());
            }

            if (query.hasOffset()) {
                this.offset(query.getOffset());
            }

            if (query.hasLimit()) {
                this.limit(query.getLimit());
            }

            if (query.hasConditions()) {
                this.addManyConditions(query.getConditions());
            }

            if (query.hasSorters()) {
                this.addManySorters(query.getSorters());
            }

            if (query.hasFind()) {
                this.find(query.getFind());
            }

            return this;
        }

        public static from(from) {

            return (new this).from(from);
        }
    }
}