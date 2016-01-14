module TSCore.App.Data {

    export interface IResource {

        getModel(): TSCore.Data.IModel;
        getSingleKey(): string;
        getMultipleKey(): string;
    }
}