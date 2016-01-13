///<reference path="../Data/Query/Query.ts"/>

module TSCore.App.Api {

    import Query = TSCore.App.Data.Query.Query;

    export class Service {

        public constructor(protected $q) {

        }

        protected _resources: TSCore.Data.Dictionary<string, IResource> = new TSCore.Data.Dictionary<string, IResource>();

        public manyResources(resources: TSCore.Data.Dictionary<string, IResource>): Service {

            resources.each((resourceName, resource) => this.resource(resourceName, resource));

            return this;
        }

        public resource(name: string, resource: IResource): Service {
            this[name] = resource;
            this._resources.set(name, resource);

            this._registerRequestHandler(name, resource);
            return this;
        }

        protected _registerRequestHandler(name, resource) {
            var requestHandler = resource.getRequestHandler();
            requestHandler.setResource(resource);
            this[name] = requestHandler;
        }

        public getResourceAsync(name: string): ng.IPromise<IResource> {

            var deferred = this.$q.defer();
            var resource = this._resources.get(name);

            if (!resource) {
                throw new TSCore.Exception.Exception('Resource `' + name + '` cannot be found');
            }

            deferred.resolve(resource);

            return deferred.promise;
        }

        protected _getRequestHandler(resourceName: string): ng.IPromise<RequestHandler> {
            return this.getResourceAsync(resourceName).then(resource => {
                return resource.getRequestHandler();
            });
        }

        public execute(query: Query): ng.IPromise<any> {

            var resourceName = query.getFrom();

            if (query.hasFind()) {
                return this.find(resourceName, query.getFind());
            }

            return this._getRequestHandler(resourceName).then(requestHandler => {
                return requestHandler.query(query);
            });
        }

        public all(resourceName: string): ng.IPromise<any> {

            return this._getRequestHandler(resourceName).then(requestHandler => {
                return requestHandler.all();
            });
        }

        public find(resourceName: string, resourceId: number): ng.IPromise<any> {

            return this._getRequestHandler(resourceName).then(requestHandler => {
                return requestHandler.find(resourceId);
            });
        }

        public create(resourceName: string, data: any): ng.IPromise<any>
        {
            return this._getRequestHandler(resourceName).then(requestHandler => {
                return requestHandler.create(data);
            });
        }

        public update(resourceName: string, resourceId: any, data: any): ng.IPromise<any>
        {
            return this._getRequestHandler(resourceName).then(requestHandler => {
                return requestHandler.update(resourceId, data);
            });
        }

        public remove(resourceName: string, resourceId: any): ng.IPromise<any>
        {
            return this._getRequestHandler(resourceName).then(requestHandler => {
                return requestHandler.remove(resourceId);
            });
        }
    }
}