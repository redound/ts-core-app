module TSCore.App.Data {

    export interface IResource {

        getModel(): TSCore.Data.Model;
        getSingleKey(): string;
        getMultipleKey(): string;
    }
}