module TSCore.App.Data.DataSource {

    import DataQuery = TSCore.App.Data.Query.DataQuery;
    import Dictionary = TSCore.Data.Dictionary

    export class Memory implements IDataSource {

        protected _store: Dictionary<any, any> = new Dictionary<any, any>();


        get(query: DataQuery): ng.IPromise<DataResultSet>
        {

        }

        create(key: any, value: any): ng.IPromise<any>
        {

        }

        update(key: any, value: any): ng.IPromise<any>
        {

        }

        remove(key: any): ng.IPromise<any>
        {

        }

        clear(): ng.IPromise<any>
        {

        }

        importResultSet(resultSet: DataResultSet)
        {

        }
    }
}