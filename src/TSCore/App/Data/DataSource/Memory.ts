module TSCore.App.Data.DataSource {

    import DataQuery = TSCore.App.Data.Query.DataQuery;
    import Dictionary = TSCore.Data.Dictionary;
    import DataResultSet = TSCore.App.Data.ResultSet.DataResultSet;

    export class Memory implements IDataSource {

        protected _store: Dictionary<any, any> = new Dictionary<any, any>();

        get(query: DataQuery): ng.IPromise<DataResultSet>
        {
            throw 'MemoryDataSource - Get - Not implemented yet';
        }

        create(key: any, value: any): ng.IPromise<any>
        {
            throw 'MemoryDataSource - Create - Not implemented yet';
        }

        update(key: any, value: any): ng.IPromise<any>
        {
            throw 'MemoryDataSource - Update - Not implemented yet';
        }

        remove(key: any): ng.IPromise<any>
        {
            throw 'MemoryDataSource - Remove - Not implemented yet';
        }

        clear(): ng.IPromise<any>
        {
            throw 'MemoryDataSource - Clear - Not implemented yet';
        }

        importResultSet(resultSet: DataResultSet)
        {
            throw 'MemoryDataSource - ImportResultSet - Not implemented yet';
        }
    }
}