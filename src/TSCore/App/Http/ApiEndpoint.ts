module TSCore.App.Http {

    export interface IApiEndpointResponse {
        response: ng.IHttpPromiseCallbackArg<{}>,
        fullData: {},
        data: any
    }

    export class ApiEndpoint {

        static $inject = ['apiService'];

        public path: string;
        public singleProperty: string;
        public multipleProperty: string;

        protected extractSingleCallback;
        protected extractMultipleCallback;


        public constructor(
            protected apiService: TSCore.App.Http.Api
        ) {
            this.extractSingleCallback = _.bind(this.extractSingle, this);
            this.extractMultipleCallback = _.bind(this.extractMultiple, this);
        }

        public request(method: string, path: string, urlParams: {}, options?: IApiRequest, extraOptions?: IApiRequest): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>> {

            return this.apiService.request({

                method: method,
                url: '/' + this.path + path,
                urlParams: urlParams

            }, _.defaults(options || {}, extraOptions || {}));
        }

        public getRequest(path: string, urlParams: {}, options?: IApiRequest, extraOptions?: IApiRequest): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>> {

            return this.request(Method.GET, path, urlParams, options, extraOptions);
        }

        public postRequest(path: string, urlParams: {}, data: {}, options?: IApiRequest, extraOptions?: IApiRequest): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>> {

            return this.request(Method.POST, path, urlParams, _.defaults(options || {}, { data: data }), extraOptions);
        }

        public putRequest(path: string, urlParams: {}, data: {}, options?: IApiRequest, extraOptions?: IApiRequest): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>> {

            return this.request(Method.PUT, path, urlParams, _.defaults(options || {}, { data: data }), extraOptions);
        }

        public deleteRequest(path: string, urlParams: {}, options?: IApiRequest, extraOptions?: IApiRequest): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>> {

            return this.request(Method.DELETE, path, urlParams, options, extraOptions);
        }


        public list(userOptions?: any, requestOptions?: IApiRequest): ng.IPromise<IApiEndpointResponse> {

            return this.getRequest('/', {}, requestOptions).then(this.extractMultipleCallback);
        }

        public get(id: number, userOptions?: any, requestOptions?: IApiRequest): ng.IPromise<IApiEndpointResponse> {

            return this.getRequest('/:id', { id: id }, requestOptions).then(this.extractSingleCallback);
        }

        public update(id: number, data: {}, userOptions?: any, requestOptions?: IApiRequest): ng.IPromise<IApiEndpointResponse> {

            return this.putRequest('/:id', { id: id }, data, requestOptions).then(this.extractSingleCallback);
        }

        public create(data: {}, userOptions?: any, requestOptions?: IApiRequest): ng.IPromise<IApiEndpointResponse> {

            return this.postRequest('/', {}, data, requestOptions).then(this.extractSingleCallback);
        }

        public delete(id: number, userOptions?: any, options?: IApiRequest): ng.IPromise<IApiEndpointResponse> {

            return this.deleteRequest('/:id', { id: id }, options).then(this.extractSingleCallback);
        }


        public extractMultiple(response: ng.IHttpPromiseCallbackArg<{}>): IApiEndpointResponse {

            return {
                response: response,
                fullData: response.data,
                data: _.map(response.data[this.multipleProperty], this.transformResponse)
            }
        }

        public extractSingle(response: ng.IHttpPromiseCallbackArg<{}>): IApiEndpointResponse {

            return {
                response: response,
                fullData: response.data,
                data: this.transformResponse(response.data[this.singleProperty])
            }
        }

        public transformResponse(item) {
            return item;
        }
    }
}