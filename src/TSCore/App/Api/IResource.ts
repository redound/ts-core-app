///<reference path="../Data/Transformer.ts"/>


module TSCore.App.Api {

    import Transformer = TSCore.App.Data.Transformer;

    export interface IResource {

        getPrefix(): string;
        getTransformer(): Transformer;
        getSingleKey(): string;
        getMultipleKey(): string;
        getRequestHandler(): RequestHandler;
    }
}