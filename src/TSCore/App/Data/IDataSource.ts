module TSCore.App.Data {

    import Query = TSCore.App.Data.Query.Query;
    import IDataSourceResponse = TSCore.App.Data.IDataSourceResponse;

    export interface IDataSource {

        execute(query: Query): ng.IPromise<IDataSourceResponse>;
        create(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>;
        update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>;
        remove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>;

        clear(): ng.IPromise<any>;
        importResponse(response: IDataSourceResponse);
    }
}