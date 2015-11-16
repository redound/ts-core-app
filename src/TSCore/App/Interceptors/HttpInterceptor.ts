module TSCore.App.Interceptors {

    export module HttpInterceptorEvents {
        export const REQUEST = 'httpRequest';
        export const REQUEST_ERROR = 'httpRequestError';
        export const RESPONSE = 'httpResponse';
        export const RESPONSE_ERROR = 'httpResponseError';
        export const RESPONSE_500_ERRORS = 'httpResponse500Errors';
        export const RESPONSE_401_ERROR = 'httpResponseError404';

        export interface IErrorParams {
            rejection: any;
        }

        export interface IRequestParams {
            config: any;
        }

        export interface IResponseParams {
            response: any;
        }

        export interface IRequestErrorParams extends IErrorParams {}
        export interface IResponseErrorParams extends IErrorParams {}
        export interface IResponse500ErrorsParams extends IErrorParams {}
        export interface IResponseError401 extends IErrorParams {}
    }

    export class HttpInterceptor {

        static $inject = ['$q'];

        public events: TSCore.Events.EventEmitter = new TSCore.Events.EventEmitter();

        constructor(protected $q: any) {

        }

        public request = (config) => {

            this.events.trigger(HttpInterceptorEvents.REQUEST, { config: config });
            return config;
        };

        public requestError = (rejection) => {

            this.events.trigger(HttpInterceptorEvents.REQUEST_ERROR, { rejection: rejection });
            return this.$q.reject(rejection);
        };

        public response = (response) => {

            this.events.trigger(HttpInterceptorEvents.RESPONSE, { response: response });
            return response;
        };

        public responseError = (rejection) => {

            this.events.trigger(HttpInterceptorEvents.RESPONSE_ERROR, { rejection: rejection });

            /**
             * eg 503, 501, etc. server errors.
             */
            if (rejection.status === 0 || String(rejection.status).charAt(0) === '5') {
                this.events.trigger(HttpInterceptorEvents.RESPONSE_500_ERRORS, { rejection: rejection });
            }

            /**
             * Handle the case where the user is not authenticated
             */
            if (rejection.status === 401) {
                this.events.trigger(HttpInterceptorEvents.RESPONSE_401_ERROR, { rejection: rejection });
            }

            return this.$q.reject(rejection);
        };
    }
}