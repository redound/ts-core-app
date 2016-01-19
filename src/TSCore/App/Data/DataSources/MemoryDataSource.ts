///<reference path="../IDataSource.ts"/>
///<reference path="../Query/Query.ts"/>
///<reference path="../Graph/Graph.ts"/>


module TSCore.App.Data.DataSources {

    import IDataSource = TSCore.App.Data.IDataSource;
    import Query = TSCore.App.Data.Query.Query;
    import DataService = TSCore.App.Data.Service;
    import Graph = TSCore.App.Data.Graph.Graph;
    import Reference = TSCore.App.Data.Graph.Reference;
    import DynamicList = TSCore.Data.DynamicList;

    export interface IQueryResult {
        query: Query<any>,
        references: DynamicList<Reference>,
        meta: {}
    }

    export enum ResourceFlag {
        DATA_COMPLETE
    }

    export class MemoryDataSource implements IDataSource {

        public static QUERY_SERIALIZE_FIELDS = ["from", "conditions", "sorters"];

        protected _dataService: DataService;
        protected _graph: Graph = new Graph;
        protected _queryResultMap: TSCore.Data.Dictionary<string, IQueryResult> = new TSCore.Data.Dictionary<string, IQueryResult>();
        protected _resourceFlags: TSCore.Data.Dictionary<string, TSCore.Data.Collection<ResourceFlag>> = new TSCore.Data.Dictionary<string, TSCore.Data.Collection<ResourceFlag>>();

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

        public execute(query: Query<any>): ng.IPromise<IDataSourceResponse>
        {
            this.logger.info('execute');

            if (query.hasFind()) {

                var resourceName = query.getFrom();
                var resourceId = query.getFind();

                if (this._graph.hasItem(resourceName, resourceId)) {

                    var references = [new Reference(resourceName, resourceId)];

                    var response = {
                        meta: {},
                        graph: this._graph.getGraphForReferences(references),
                        references: references
                    };

                    this.logger.info('resolve', response);

                    return this.$q.when(response);

                } else {
                    return this.$q.reject();
                }
            }

            var serializedQuery = query.serialize(MemoryDataSource.QUERY_SERIALIZE_FIELDS);

            var queryResult = this._queryResultMap.get(serializedQuery);

            if (queryResult) {

                // TODO: Implement
                //if (this._resourceHasFlag(query.getFrom(), ResourceFlag.DATA_COMPLETE)) {
                //
                //}

                var referenceList = queryResult.references;
                var offset = query.getOffset();
                var limit = query.getLimit();

                if (!referenceList.containsRange(offset, limit)) {

                    return this.$q.reject();
                }

                var references = referenceList.getRange(offset, limit);

                this.logger.info('resolve cached results');

                var response = {
                    meta: queryResult.meta,
                    graph: this._graph.getGraphForReferences(references),
                    references: _.clone(references)
                };

                this.logger.info('resolve', response);

                return this.$q.when(response);
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

        public notifyExecute(query: Query<any>, response: IDataSourceResponse): ng.IPromise<void> {

            this.logger.info('notifyExecute - query ', query, ' - response', response);

            this._graph.merge(response.graph);

            var serializedQuery = query.serialize(MemoryDataSource.QUERY_SERIALIZE_FIELDS);

            var references = _.clone(response.references);

            var offset = query.getOffset() || 0;

            if ((response.meta.total && this._graph.countItems(query.getFrom()) === response.meta.total) || (!query.hasOffset() && !query.hasLimit())) {

                this._setResourceFlag(query.getFrom(), ResourceFlag.DATA_COMPLETE);
            }

            var queryResult = this._queryResultMap.get(serializedQuery);

            if (!queryResult) {

                queryResult = {
                    meta: response.meta,
                    query: _.clone(query),
                    references: new DynamicList<Reference>()
                };
            }

            queryResult.references.setRange(offset, references);

            console.log('update queryResult', queryResult);

            this._queryResultMap.set(serializedQuery, queryResult);

            return this.$q.when();
        }

        protected _resourceHasFlag(resourceName: string, flag: ResourceFlag): boolean {

            var flags = this._resourceFlags.get(resourceName);

            if (!flags) {
                return false;
            }

            return flags.contains(flag);
        }

        protected _setResourceFlag(resourceName: string, flag: ResourceFlag) {

            console.log('resourceName', resourceName, 'flag', flag);

            var flags = this._resourceFlags.get(resourceName);

            if (!flags) {
                flags = new TSCore.Data.Collection<ResourceFlag>();
                this._resourceFlags.set(resourceName, flags);
            }

            flags.add(flag);
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