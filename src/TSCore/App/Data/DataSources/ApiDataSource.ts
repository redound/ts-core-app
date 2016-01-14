///<reference path="../IDataSource.ts"/>
///<reference path="../Query/Query.ts"/>
///<reference path="../Service.ts"/>
///<reference path="../Graph/Builder.ts"/>
///<reference path="../Graph/Reference.ts"/>

module TSCore.App.Data.DataSources {

    import IDataSource = TSCore.App.Data.IDataSource;
    import Query = TSCore.App.Data.Query.Query;
    import DataService = TSCore.App.Data.Service;
    import Builder = TSCore.App.Data.Graph.Builder;
    import Reference = TSCore.App.Data.Graph.Reference;

    export class ApiDataSource implements IDataSource {

        protected _dataService: DataService;
        protected _resourceAliasMap: TSCore.Data.Dictionary<string, string>;

        public constructor(
            protected $q: ng.IQService,
            protected logger: TSCore.Logger.Logger,
            protected apiService: TSCore.App.Api.Service
        ) {
            this.logger = this.logger.child('apiDataSource');
        }

        public setDataService(service: DataService) {

            this._dataService = service;
        }

        public getDataService(): DataService {

            return this._dataService;
        }

        public execute(query: Query): ng.IPromise<IDataSourceResponse> {

            var resourceName = query.getFrom();

            return this.apiService
                .execute(query)
                .then(response => this._transformResponse(resourceName, response));
        }

        public create(resourceName: string, data: any): ng.IPromise<IDataSourceResponse> {

            return this.apiService
                .create(resourceName, data)
                .then(response => this._transformResponse(resourceName, response));
        }

        public update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse> {

            return this.apiService
                .update(resourceName, resourceId, data)
                .then(response => this._transformResponse(resourceName, response));
        }

        public remove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse> {

            return this.apiService
                .remove(resourceName, resourceId)
                .then(response => this._transformResponse(resourceName, response));
        }

        public notifyExecute(response: IDataSourceResponse): ng.IPromise<void> {

            this.logger.info('notifyExecute - response', response);

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

            var builder = new Builder;

            builder.resourceForResourceName(name => this._resourceForResourceName(name));
            builder.resourceNameForAlias(key => this._resourceNameForAlias(key));

            var graph = builder.build(response, resourceName);

            var results = graph.getItems(resourceName);

            var primaryKey = resource.getModel().primaryKey();

            results = _.map(results, (resource: any, resourceId: any) => {
                return new Reference(resourceName, resource[primaryKey]);
            });

            return {
                data: graph,
                results: results
            };
        }

        protected _resourceForResourceName(name: string) {
            return this.getDataService().getResource(name);
        }

        protected _resourceNameForAlias(key: string) {

            var aliases = this._getResourcesAliasMap();
            return aliases.get(key);
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