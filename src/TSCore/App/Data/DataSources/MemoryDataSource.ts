///<reference path="../IDataSource.ts"/>
///<reference path="../Query/Query.ts"/>
///<reference path="../Graph/Graph.ts"/>


module TSCore.App.Data.DataSources {

    import IDataSource = TSCore.App.Data.IDataSource;
    import Query = TSCore.App.Data.Query.Query;
    import DataService = TSCore.App.Data.Service;
    import Graph = TSCore.App.Data.Graph.Graph;
    import Reference = TSCore.App.Data.Graph.Reference;

    export interface IQueryResult {
        query: Query,
        references: Reference[]
    }

    export class MemoryDataSource implements IDataSource {

        public static QUERY_SERIALIZE_FIELDS = ["from", "conditions", "sorters"];

        protected _dataService: DataService;
        protected _graph: Graph = new Graph;
        protected _queryResultMap: TSCore.Data.Dictionary<string, IQueryResult> = new TSCore.Data.Dictionary<string, IQueryResult>();

        public constructor(
            protected $q: ng.IQService,
            protected logger?
        ) {
            this.logger = (this.logger || new TSCore.Logger.Logger()).child('MemoryDataSource');
        }

        public setDataService(service: DataService) {
            this._dataService = service;
        }

        public getDataService(): DataService {
            return this._dataService;
        }

        public execute(query: Query): ng.IPromise<IDataSourceResponse>
        {
            this.logger.info('execute');

            var serializedQuery = query.serialize(MemoryDataSource.QUERY_SERIALIZE_FIELDS);

            var queryResult = this._queryResultMap.get(serializedQuery);

            if (queryResult) {

                this.logger.info('resolve cached results');

                // TODO: Just send part of graph needed
                return this.$q.when({
                    data: this._graph,
                    results: _.clone(queryResult.references)
                });
            }

            // TODO
            return this.$q.reject();
        }

        public create(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>
        {
            this.logger.info('create');

            // TODO
            return this.$q.reject();
        }

        public update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>
        {
            this.logger.info('update');

            // TODO
            return this.$q.reject();
        }

        public remove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>
        {
            this.logger.info('remove');

            // TODO
            return this.$q.reject();
        }


        public notifyExecute(query: Query, response: IDataSourceResponse): ng.IPromise<void> {

            this.logger.info('notifyExecute - query ', query, ' - response', response);

            var serializedQuery = query.serialize(MemoryDataSource.QUERY_SERIALIZE_FIELDS);

            this._graph.merge(response.data);

            this._queryResultMap.set(serializedQuery, {
                query: _.clone(query),
                references: _.clone(response.results)
            });

            return this.$q.when();
        }

        public notifyCreate(response: IDataSourceResponse): ng.IPromise<void> {

            this.logger.info('notifyCreate - response', response);

            return this.$q.when();
        }

        public notifyUpdate(response: IDataSourceResponse): ng.IPromise<void> {

            this.logger.info('notifyUpdate - response', response);

            return this.$q.when();
        }

        public notifyRemove(response: IDataSourceResponse): ng.IPromise<void> {

            this.logger.info('notifyRemove - response', response);

            return this.$q.when();
        }

        public clear(): ng.IPromise<any>
        {
            // TODO
            return null;
        }
    }
}