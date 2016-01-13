///<reference path="../IDataSource.ts"/>
///<reference path="../Query/Query.ts"/>


module TSCore.App.Data.DataSources {

    import IDataSource = TSCore.App.Data.IDataSource;
    import Query = TSCore.App.Data.Query.Query;
    import DataService = TSCore.App.Data.Service;

    export class MemoryDataSource implements IDataSource {

        protected _dataService: DataService;

        public setDataService(service: DataService) {
            this._dataService = service;
        }

        public getDataService(): DataService {
            return this._dataService;
        }

        public execute(query: Query): ng.IPromise<IDataSourceResponse>
        {
            // TODO
            return null;
        }

        public create(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>
        {
            // TODO
            return null;
        }

        public update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>
        {
            // TODO
            return null;
        }

        public remove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>
        {
            // TODO
            return null;
        }

        public clear(): ng.IPromise<any>
        {
            // TODO
            return null;
        }

        public importResponse(response: IDataSourceResponse)
        {
            // TODO
        }
    }
}