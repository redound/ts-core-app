/// <reference path="Api/RequestHandler.ts" />
/// <reference path="Data/Transformer.ts" />

module TSCore.App {

    import RequestHandler = TSCore.App.Api.RequestHandler;
    import ITransformer = TSCore.App.Data.ITransformer;
    import IModel = TSCore.Data.IModel;

    export class Resource {

        protected _prefix: string;
        protected _singleKey: string;
        protected _multipleKey: string;
        protected _model: IModel;
        protected _requestHandler: RequestHandler;
        protected _transformer: ITransformer;
        protected _queryTransformer: any;

        public prefix(prefix: string): Resource {
            this._prefix = prefix;
            return this;
        }

        public getPrefix(): string {
            return this._prefix;
        }

        public singleKey(singleKey: string): Resource {
            this._singleKey = singleKey;
            return this;
        }

        public getSingleKey(): string {
            return this._singleKey;
        }

        public multipleKey(multipleKey: string): Resource {
            this._multipleKey = multipleKey;
            return this;
        }

        public getMultipleKey(): string {
            return this._multipleKey;
        }

        public requestHandler(handler: RequestHandler): Resource {
            this._requestHandler = handler;
            return this;
        }

        public getRequestHandler(): RequestHandler {
            return this._requestHandler;
        }

        public model(model: IModel): Resource {
            this._model = model;
            return this;
        }

        public getModel(): IModel {
            return this._model;
        }

        public transformer(transformer: ITransformer): Resource {
            this._transformer = transformer;
            return this;
        }

        public getTransformer(): ITransformer {
            return this._transformer;
        }
    }
}