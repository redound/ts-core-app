///<reference path="../Data/Query/Query.ts"/>
///<reference path="../Data/IDataSourceResponse.ts"/>

module TSCore.App.Data {

    import Query = TSCore.App.Data.Query.Query;
    import IDataSourceResponse = TSCore.App.Data.IDataSourceResponse;

    export interface IDataSource {

        setDataService(dataService: Service);
        getDataService(): Service

        execute(query: Query): ng.IPromise<IDataSourceResponse>;
        create(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>;
        update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>;
        remove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>;

        notifyExecute(query: Query, response: IDataSourceResponse): ng.IPromise<void>;
        notifyCreate(response: IDataSourceResponse): ng.IPromise<void>;
        notifyUpdate(response: IDataSourceResponse): ng.IPromise<void>;
        notifyRemove(response: IDataSourceResponse): ng.IPromise<void>;

        clear(): ng.IPromise<any>;
    }

}