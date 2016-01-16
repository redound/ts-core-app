///<reference path="../Http/RequestOptions.ts"/>
///<reference path="../Data/Query/Query.ts"/>
///<reference path="Service.ts"/>

module TSCore.App.Api {

    import RequestOptions = TSCore.App.Http.RequestOptions;
    import Query = TSCore.App.Data.Query.Query;

    export class RequestHandler {

        public _apiService: Service;
        public _resourceName: string;
        public _resource: IResource;

        public constructor(protected httpService: TSCore.App.Http.Service) {

        }

        public setApiService(apiService: Service) {
            this._apiService = apiService;
        }

        public getApiService(): Service {
            return this._apiService;
        }

        public setResourceName(name: string) {
            this._resourceName = name;
        }

        public getResourceName(): string {
            return this._resourceName;
        }

        public setResource(resource: IResource) {
            this._resource = resource;
        }

        public getResource(): IResource {
            return this._resource;
        }

        public request(requestOptions: RequestOptions): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>> {

            var prefix = this.getResource().getPrefix();
            var relativeUrl = requestOptions.getUrl();

            requestOptions.url(prefix + relativeUrl);

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

            var transformer = this.getResource().getTransformer();
            var multipleKey = this.getResource().getMultipleKey();

            return transformer.collection(response.data[multipleKey]);
        }

        protected _transformSingle(response: ng.IHttpPromiseCallbackArg<{}>): any {

            var transformer = this.getResource().getTransformer();
            var singleKey = this.getResource().getSingleKey();

            return transformer.item(response.data[singleKey]);
        }
    }
}