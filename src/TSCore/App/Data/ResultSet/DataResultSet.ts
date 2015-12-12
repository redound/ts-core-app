module TSCore.App.Data.ResultSet {

    import IModelInterface = TSCore.Data.IModelInterface;
    export class DataResultSet
    {
        protected _model: IModelInterface;

        protected _data: any;
        protected _receiveDate: Date;

        protected _containsAllData: boolean;
    }
}