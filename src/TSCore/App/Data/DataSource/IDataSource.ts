module TSCore.App.Data.DataSource {

    import DataQuery = TSCore.App.Data.Query.DataQuery;
    import DataResultSet = TSCore.App.Data.ResultSet.DataResultSet;

    export interface IDataSource {

        get(query: DataQuery): ng.IPromise<DataResultSet>;
        create(key: any, value: any): ng.IPromise<any>;
        update(key: any, value: any): ng.IPromise<any>;
        remove(key: any): ng.IPromise<any>;

        clear(): ng.IPromise<any>;
        importResultSet(resultSet: DataResultSet);
    }
}