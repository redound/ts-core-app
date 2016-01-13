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
            protected apiService: TSCore.App.Api.Service
        ) {

        }

        public setDataService(service: DataService) {
            this._dataService = service;
        }

        public getDataService(): DataService {
            return this._dataService;
        }

        public execute(query: Query): ng.IPromise<IDataSourceResponse>
        {
            var resourceName = query.getFrom();

            return this.apiService
                .execute(query)
                .then(response => this._transformResponse(resourceName, response));
        }

        public create(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>
        {
            return this.apiService
                .create(resourceName, data)
                .then(response => this._transformResponse(resourceName, response));
        }

        public update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>
        {
            return this.apiService
                .update(resourceName, resourceId, data)
                .then(response => this._transformResponse(resourceName, response));
        }

        public remove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>
        {
            return this.apiService
                .remove(resourceName, resourceId)
                .then(response => this._transformResponse(resourceName, response));
        }

        public clear(): ng.IPromise<any>
        {
            // Do nothing
            return this.$q.when();
        }

        public importResponse(response: IDataSourceResponse)
        {
            // Do nothing
        }

        protected _transformResponse(resourceName: string, response: any) {

            return this.getDataService()
                .getResourceAsync(resourceName)
                .then(resource => this._createDataSourceResponse(resourceName, resource, response));
        }

        protected _createDataSourceResponse(resourceName, resource, response) {

            var builder = new Builder;

            builder.resourceForKey(key => this._resourceForKey(key));

            var graph = builder.build(response, resourceName);

            var results = graph.getItems(resourceName);

            results = _.map(results, (resource: any, resourceId: any) => {
                return new Reference(resourceName, resourceId);
            });

            return {
                data: graph,
                results: results
            };
        }

        protected _resourceForKey(key: string) {

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