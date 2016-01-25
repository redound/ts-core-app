///<reference path="../IDataSource.ts"/>
///<reference path="../Query/Query.ts"/>
///<reference path="../Query/IQueryExecutor.ts"/>
///<reference path="../Service.ts"/>
///<reference path="../Graph/Builder.ts"/>
///<reference path="../Graph/Reference.ts"/>

module TSCore.App.Data.DataSources {

    import IDataSource = TSCore.App.Data.IDataSource;
    import Query = TSCore.App.Data.Query.Query;
    import DataService = TSCore.App.Data.Service;
    import Builder = TSCore.App.Data.Graph.Builder;
    import Reference = TSCore.App.Data.Graph.Reference;
    import IQueryExecutor = TSCore.App.Data.Query.IQueryExecutor;
    import Graph = TSCore.App.Data.Graph.Graph;
    import Exception = TSCore.Exception.Exception;

    export class ApiDataSource implements IDataSource, IQueryExecutor
    {
        protected _dataService: DataService;
        protected _resourceAliasMap: TSCore.Data.Dictionary<string, string>;

        public constructor(
            protected $q: ng.IQService,
            protected apiService: TSCore.App.Api.Service,
            protected logger?: TSCore.Logger.Logger
        ) {
            this.logger = (this.logger || new TSCore.Logger.Logger()).child('ApiDataSource');
        }

        public setDataService(service: DataService) {

            this._dataService = service;
        }

        public getDataService(): DataService {

            return this._dataService;
        }

        public execute(query: Query<any>): ng.IPromise<IDataSourceResponse> {

            this.logger.info('execute', query);

            var resourceName = query.getFrom();

            return this.apiService
                .execute(query)
                .then(response => this._transformResponse(resourceName, response));
        }

        public create(resourceName: string, data: any): ng.IPromise<IDataSourceResponse> {

            this.logger.info('create');

            return this.apiService
                .create(resourceName, data)
                .then(response => this._transformResponse(resourceName, response));
        }

        public update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse> {

            this.logger.info('update');

            return this.apiService
                .update(resourceName, resourceId, data)
                .then(response => this._transformResponse(resourceName, response));
        }

        public remove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse> {

            this.logger.info('remove');

            return this.apiService
                .remove(resourceName, resourceId)
                .then(response => this._transformResponse(resourceName, response));
        }

        public notifyExecute(query: Query<any>, response: IDataSourceResponse): ng.IPromise<void> {

            this.logger.info('notifyExecute - query ', query, ' - response', response);

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
            // Do nothing
            return this.$q.when();
        }

        protected _transformResponse(resourceName: string, response: any) {

            return this.getDataService()
                .getResourceAsync(resourceName)
                .then(resource => this._createDataSourceResponse(resourceName, resource, response));
        }

        protected _createDataSourceResponse(resourceName, resource, response) {

            var total = response.data.total;
            var data = response.data.data;
            var included = response.data.included;

            var dataGraph = this._createGraph(data);
            var includedGraph = this._createGraph(included);

            dataGraph.merge(includedGraph);

            var meta:any = {};

            if (total) {
                meta.total = total;
            }

            return {
                meta: meta,
                graph: dataGraph,
                references: _.map(data, (item: any) => {

                    return new Reference(resourceName, item.id);
                })
            };
        }

        protected _createGraph(data): Graph {

            var graph = new Graph();

            this._extractResource(data, (resourceName: string, resourceId: any, attributes: any, relationships: any) => {

                var resource = this.getDataService().getResource(resourceName);

                if (!resource) {
                    throw new Exception('Resource `' + resourceName + '` could not be found!');
                }

                var transformer = resource.getTransformer();
                var model = resource.getModel();
                var primaryKey = model.primaryKey();

                attributes[primaryKey] = parseInt(resourceId);

                var item = attributes;

                if (transformer) {
                    item = transformer.item(attributes);
                }

                _.each(relationships, (relationship: any, propertyName: string) => {

                    if (_.isArray(relationship.data)) {

                        item[propertyName] = _.map(relationship.data, (ref:any) => {

                            var resourceName = ref.type;
                            var resourceId = ref.id;

                            return new Reference(resourceName, resourceId);
                        });

                        return;
                    }

                    if (_.isObject(relationship.data)) {

                        var ref = relationship.data;
                        var resourceName = ref.type;
                        var resourceId = ref.id;

                        item[propertyName] = new Reference(resourceName, resourceId);

                        return;
                    }

                    item[propertyName] = relationship.data;
                });

                graph.setItem(resourceName, resourceId, item);
            });

            return graph;
        }

        protected _extractResource(results, callback) {

            if (_.isArray(results)) {

                _.each(results, (result: any) => callback(result.type, result.id, result.attributes, result.relationships));

            } else if (_.isObject(results)) {

                callback(results.type, results.id, results.attributes, results.relationships);

            }
        }

        protected _getResourcesAliasMap() {

            if (this._resourceAliasMap) {
                return this._resourceAliasMap;
            }

            this._resourceAliasMap = new TSCore.Data.Dictionary<string, string>();

            var resources = this.getDataService().getResources();

            resources.each((resourceName, resource) => {

                this._resourceAliasMap.set(resource.getSingleKey(), resourceName);
                this._resourceAliasMap.set(resource.getMultipleKey(), resourceName);
            });

            return this._resourceAliasMap;
        }
    }
}