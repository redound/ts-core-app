module TSCore.App.Http {

    export interface IApiRequest {
        method?: string,
        url?: string
        headers?: {},
        data?: {}
        urlParams?: {}
    }

    export var Method = {
        GET: "GET",
        POST: "POST",
        PUT: "PUT",
        DELETE: "DELETE"
    };

    export class Api {

        public protocol:string;
        public hostname:string;
        public defaultHeaders:any = {};

        public constructor(protected $http:ng.IHttpService) {

        }

        public setProtocol(protocol:string) {
            this.protocol = protocol;
        }

        public setHostname(hostname:string) {
            this.hostname = hostname;
        }

        public setDefaultHeader(name, value) {
            this.defaultHeaders[name] = value;
        }

        public unsetDefaultHeader(name) {
            delete this.defaultHeaders[name];
        }

        public request(options:IApiRequest, userOptions:IApiRequest): ng.IHttpPromise<any> {

            options = _.defaults(options, userOptions);
            options = this._parseOptions(options);

            return this.$http(<ng.IRequestConfig>options);
        }

        private _parseOptions(options) {

            options.headers = options.headers || {};
            _.each(this.defaultHeaders, (value, name) => {
                options.headers[name] = value;
            });
            options.url = this._buildUrl(options.url);
            options.url = this._interpolateUrl(options.url, options.urlParams || {});

            return options;
        }

        private _buildUrl(relativeUrl:string) {
            return this.protocol + this.hostname + relativeUrl;
        }

        private _interpolateUrl(url:string, params:{}) {

            params = (params || {});

            // Strip out the delimiter fluff that is only there for readability
            // of the optional label paths.
            url = url.replace(/(\(\s*|\s*\)|\s*\|\s*)/g, "");

            // Replace each label in the URL (ex, :userID).
            url = url.replace(/:([a-z]\w*)/gi, ($0, label) => {
                return (this._popFirstKey(params, label) || "");
            });

            // Strip out any repeating slashes (but NOT the http:// version).
            url = url.replace(/(^|[^:])[\/]{2,}/g, "$1/");

            // Strip out any trailing slash.
            url = url.replace(/\/+$/i, "");

            return url;
        }

        /**
         * Perform a popKey() action on source that contains the given key.
         * @param source
         * @param key
         * @returns {*}
         * @private
         */
        private _popFirstKey(source, key) {

            if (source.hasOwnProperty(key)) {

                return this._popKey(source, key);
            }
        }

        /**
         * Delete the key from the given object and return the value.
         * @param object
         * @param key
         * @returns {*}
         * @private
         */
        private _popKey(object, key) {

            var value = object[key];
            delete(object[key]);
            return (value);
        }
    }
}