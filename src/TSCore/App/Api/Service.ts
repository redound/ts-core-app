///<reference path="../Data/Query/Query.ts"/>
///<reference path="../Data/Query/IQueryExecutor.ts"/>

module TSCore.App.Api {

    import Query = TSCore.App.Data.Query.Query;
    import IQueryExecutor = TSCore.App.Data.Query.IQueryExecutor;
    import Model = TSCore.Data.Model;

    export class Service implements IQueryExecutor
    {
        public constructor(protected $q) {
        }

        protected _resources: TSCore.Data.Dictionary<string, IResource> = new TSCore.Data.Dictionary<string, IResource>();

        public setResources(resources: TSCore.Data.Dictionary<string, IResource>): Service {

            this._resources = resources.clone();

            this._resources.each((resourceName, resource) => {

                var requestHandler = resource.getRequestHandler();

                if (requestHandler) {
                    requestHandler.setApiService(this);
                    requestHandler.setResourceName(resourceName);
                    requestHandler.setResource(resource);
                }
            });

            return this;
        }

        public resource(name: string, resource: IResource): Service {

            this._resources.set(name, resource);
            return this;
        }

        public getResource(name: string): IResource {
            return this._resources.get(name);
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

        public getRequestHandler(resourceName: string): RequestHandler {

            var resource = this._resources.get(resourceName);
            if(!resource){
                return null;
            }

            return resource.getRequestHandler();
        }

        public getRequestHandlerAsync(resourceName: string): ng.IPromise<RequestHandler> {

            return this.getResourceAsync(resourceName).then(resource => {
                return resource.getRequestHandler();
            });
        }


        public execute(query: Query<any>): ng.IPromise<any> {

            var resourceName = query.getFrom();

            return this.getRequestHandlerAsync(resourceName).then(requestHandler => {
                return requestHandler.execute(query);
            });
        }

        public all(resourceName: string): ng.IPromise<any> {

            return this.getRequestHandlerAsync(resourceName).then(requestHandler => {
                return requestHandler.all();
            });
        }

        public find(resourceName: string, resourceId: number): ng.IPromise<any> {

            return this.getRequestHandlerAsync(resourceName).then(requestHandler => {
                return requestHandler.find(resourceId);
            });
        }

        public create(resourceName: string, data: any): ng.IPromise<any>
        {
            return this.getRequestHandlerAsync(resourceName).then(requestHandler => {
                return requestHandler.create(data);
            });
        }

        public update(resourceName: string, resourceId: any, data: any): ng.IPromise<any>
        {
            return this.getRequestHandlerAsync(resourceName).then(requestHandler => {
                return requestHandler.update(resourceId, data);
            });
        }

        public remove(resourceName: string, resourceId: any): ng.IPromise<any>
        {
            return this.getRequestHandlerAsync(resourceName).then(requestHandler => {
                return requestHandler.remove(resourceId);
            });
        }
    }
}