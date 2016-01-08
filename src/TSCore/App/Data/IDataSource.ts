module TSCore.App.Data {

    import Query = TSCore.App.Data.Query.Query;
    import IDataSourceResponse = TSCore.App.Data.Responses.IDataSourceResponse;

    export interface IDataSource {

        query(query: Query): ng.IPromise<IDataSourceResponse>;
        create(key: any, value: any): ng.IPromise<any>;
        update(key: any, value: any): ng.IPromise<any>;
        remove(key: any): ng.IPromise<any>;

        clear(): ng.IPromise<any>;
        importResponse(response: IDataSourceResponse);
    }
}