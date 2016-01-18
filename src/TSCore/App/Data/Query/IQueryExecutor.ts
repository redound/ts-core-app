
module TSCore.App.Data.Query
{
    import Model = TSCore.Data.Model;
    export interface IQueryExecutor
    {
        execute(query: Query<any>): ng.IPromise<any>;
    }
}