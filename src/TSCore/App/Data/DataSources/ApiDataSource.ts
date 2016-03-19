///<reference path="../IDataSource.ts"/>
///<reference path="../Query/Query.ts"/>
///<reference path="../Query/IQueryExecutor.ts"/>
///<reference path="../Service.ts"/>
///<reference path="../Graph/Reference.ts"/>

module TSCore.App.Data.DataSources {

    import IDataSource = TSCore.App.Data.IDataSource;
    import Query = TSCore.App.Data.Query.Query;
    import DataService = TSCore.App.Data.Service;
    import Reference = TSCore.App.Data.Graph.Reference;
    import IQueryExecutor = TSCore.App.Data.Query.IQueryExecutor;
    import Exception = TSCore.Exception.Exception;

    export class ApiDataSource implements IDataSource, IQueryExecutor
    {
        protected _dataService: DataService;

        public constructor(
            protected $q: ng.IQService,
            protected apiService: TSCore.App.Api.Service,
            protected serializer: TSCore.App.Data.ISerializer,
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

            data = this._transformRequest(resourceName, data);

            return this.apiService
                .create(resourceName, data)
                .then(response => this._transformResponse(resourceName, response));
        }

        public update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse> {

            this.logger.info('update');

            data = this._transformRequest(resourceName, data);

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

        protected _transformRequest(resourceName: string, data: any) {

            var resource = this.getDataService().getResource(resourceName);

            if (!resource) {
                throw new Exception('Resource `' + resourceName + '` could not be found!');
            }

            var transformer = resource.getTransformer();

            return transformer.transformRequest(data);
        }

        protected _transformResponse(resourceName: string, response: any) {

            return this.serializer.deserialize(resourceName, response);
        }
    }
}