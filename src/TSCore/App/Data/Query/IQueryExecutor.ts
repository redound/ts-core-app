
module TSCore.App.Data.Query
{
    export interface IQueryExecutor
    {
        execute(query: Query): ng.IPromise<any>;
    }
}