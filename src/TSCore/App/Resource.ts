/// <reference path="Api/RequestHandler.ts" />
/// <reference path="Data/Transformer.ts" />

module TSCore.App {

    import RequestHandler = TSCore.App.Api.RequestHandler;
    import ITransformer = TSCore.App.Data.ITransformer;
    import IModel = TSCore.Data.IModel;

    export class Resource {

        protected _prefix: string;
        protected _itemKeys: TSCore.Data.Collection<string> = new TSCore.Data.Collection<string>();
        protected _collectionKeys: TSCore.Data.Collection<string> = new TSCore.Data.Collection<string>();
        protected _model: IModel;
        protected _requestHandler: RequestHandler;
        protected _transformer: ITransformer;
        protected _queryTransformer: any;

        public prefix(prefix: string): this {
            this._prefix = prefix;
            return this;
        }

        public getPrefix(): string {
            return this._prefix;
        }

        public itemKey(...itemKeys: string[]): this {
            this._itemKeys.addMany(itemKeys);
            return this;
        }

        public getItemKeys(): TSCore.Data.Collection<string> {
            return this._itemKeys;
        }

        public collectionKey(...collectionKeys: string[]): this {
            this._collectionKeys.addMany(collectionKeys);
            return this;
        }

        public getCollectionKeys(): TSCore.Data.Collection<string> {
            return this._collectionKeys;
        }

        public requestHandler(handler: RequestHandler): this {
            this._requestHandler = handler;
            return this;
        }

        public getRequestHandler(): RequestHandler {
            return this._requestHandler;
        }

        public model(model: IModel): this {
            this._model = model;
            return this;
        }

        public getModel(): IModel {
            return this._model;
        }

        public transformer(transformer: ITransformer): this {
            this._transformer = transformer;
            return this;
        }

        public getTransformer(): ITransformer {
            return this._transformer;
        }
    }
}