module TSCore.App.Data {

    export interface IResource {

        getModel(): TSCore.Data.IModelInterface;
        getSingleKey(): string;
        getMultipleKey(): string;
    }
}