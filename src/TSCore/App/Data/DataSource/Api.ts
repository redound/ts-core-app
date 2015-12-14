module TSCore.App.Data.DataSource {

    import DataQuery = TSCore.App.Data.Query.DataQuery;
    import Dictionary = TSCore.Data.Dictionary;
    import DataResultSet = TSCore.App.Data.ResultSet.DataResultSet;

    export class Api implements IDataSource {

        get(query: DataQuery): ng.IPromise<DataResultSet>
        {
            throw 'ApiDatasource - Get - Not implemented yet';
        }

        create(key: any, value: any): ng.IPromise<any>
        {
            throw 'ApiDatasource - Create - Not implemented yet';
        }

        update(key: any, value: any): ng.IPromise<any>
        {
            throw 'ApiDatasource - Update - Not implemented yet';
        }

        remove(key: any): ng.IPromise<any>
        {
            throw 'ApiDatasource - Remove - Not implemented yet';
        }

        clear(): ng.IPromise<any>
        {
            throw 'ApiDatasource - Clear - Not implemented yet';
        }

        importResultSet(resultSet: DataResultSet)
        {
            throw 'ApiDatasource - ImportResultSet - Not implemented yet';
        }
    }
}