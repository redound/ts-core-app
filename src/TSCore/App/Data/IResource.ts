module TSCore.App.Data {

    export interface IResource {

        getModel(): TSCore.Data.IModel;
        getTransformer(): Transformer;
        getSingleKey(): string;
        getMultipleKey(): string;
    }
}