/// <reference path="../Http/RequestOptions.ts" />

module TSCore.App.Api {

    import HttpMethods = TSCore.App.Constants.HttpMethods;
    import Transformer = TSCore.Data.Transform.Transformer;
    import Query = TSCore.App.Data.Query.Query;
    import JsonGraph = TSCore.App.Data.JsonGraph;
    import RequestOptions = TSCore.App.Http.RequestOptions;

    export class Resource {

        protected _prefix: string;
        protected _singleKey: string;
        protected _multipleKey: string;
        protected _transformer: any;

        public constructor(
            protected httpService: TSCore.App.Http.Service
        ) {
        }

        public prefix(prefix: string) {
            this._prefix = prefix;
            return this;
        }

        public getPrefix(): string {
            return this._prefix;
        }

        public singleKey(singleKey: string) {
            this._singleKey = singleKey;
            return this;
        }

        public getSingleKey(): string {
            return this._singleKey;
        }

        public multipleKey(multipleKey: string) {
            this._multipleKey = multipleKey;
            return this;
        }

        public getMultipleKey(): string {
            return this._multipleKey;
        }

        public transformer(transformer: any) {
            this._transformer = transformer;
            return this;
        }

        public getTransformer(): any {
            return this._transformer;
        }

        public request(requestOptions: RequestOptions): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>> {

            var relativeUrl = requestOptions.getUrl();
            requestOptions.url(this.getPrefix() + relativeUrl);

            return this.httpService.request(requestOptions);
        }

        public query(query: Query): ng.IPromise<any> {

            return this.request(

                RequestOptions
                    .get('/')

            ).then(response => this._transformQuery(response));
        }

        public all(): ng.IPromise<any> {

            return this.request(

                RequestOptions
                     .get('/')

            ).then(response => this._transformAll(response));
        }

        public find(id: number): ng.IPromise<any> {

            return this.request(

                RequestOptions
                    .get('/:id', { id: id })

            ).then(response => this._transformFind(response));
        }

        public create(data: {}): ng.IPromise<any> {

            return this.request(

                RequestOptions
                    .post('/')
                    .data(data)

            ).then(response => this._transformCreate(response));
        }

        public update(id: number, data: {}): ng.IPromise<any> {

            return this.request(

                RequestOptions
                    .put('/:id', { id: id })
                    .data(data)

            ).then(response => this._transformUpdate(response));
        }

        public remove(id: number): ng.IPromise<any> {

            return this.request(

                RequestOptions
                    .delete('/:id', { id: id })

            ).then(response => this._transformRemove(response));
        }

        protected _transformQuery(response: ng.IHttpPromiseCallbackArg<{}>): any {

            return this._transformMultiple(response);
        }

        protected _transformAll(response: ng.IHttpPromiseCallbackArg<{}>): any {

            return this._transformMultiple(response);
        }

        protected _transformFind(response: ng.IHttpPromiseCallbackArg<{}>): any {

            return this._transformSingle(response);
        }

        protected _transformCreate(response: ng.IHttpPromiseCallbackArg<{}>): any {

            return this._transformSingle(response);
        }

        protected _transformUpdate(response: ng.IHttpPromiseCallbackArg<{}>): any {

            return this._transformSingle(response);
        }

        protected _transformRemove(response: ng.IHttpPromiseCallbackArg<{}>): any {

            return response;
        }

        protected _transformMultiple(response: ng.IHttpPromiseCallbackArg<{}>): any {

            return this._transformer.collection(response.data[this._multipleKey]);
        }

        protected _transformSingle(response: ng.IHttpPromiseCallbackArg<{}>): any {

            return this._transformer.item(response.data[this._singleKey]);
        }
    }
}