module TSCore.App.Data.ResultSet {

    import Model = TSCore.App.Data.Model;
    import ModelList = TSCore.Data.ModelList;

    export class ModelResultSet<T extends Model> extends ModelList<T>
    {

    }
}