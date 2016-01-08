module TSCore.App.Data.DataSources {

    import Query = TSCore.App.Data.Query.Query;
    import IDataSourceResponse = TSCore.App.Data.Responses.IDataSourceResponse;

    export class MemoryDataSource implements IDataSource {

        query(query: Query): ng.IPromise<IDataSourceResponse>
        {
            throw 'ApiDataSource - Query - Not implemented yet';
        }

        create(key: any, value: any): ng.IPromise<any>
        {
            throw 'ApiDataSource - Create - Not implemented yet';
        }

        update(key: any, value: any): ng.IPromise<any>
        {
            throw 'ApiDataSource - Update - Not implemented yet';
        }

        remove(key: any): ng.IPromise<any>
        {
            throw 'ApiDataSource - Remove - Not implemented yet';
        }

        clear(): ng.IPromise<any>
        {
            throw 'ApiDataSource - Clear - Not implemented yet';
        }

        importResponse(response: IDataSourceResponse)
        {
            throw 'ApiDataSource - ImportResultSet - Not implemented yet';
        }
    }
}