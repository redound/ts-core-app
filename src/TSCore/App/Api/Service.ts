/// <reference path="../Data/Transformers/JsonGraphTransformer.ts" />

module TSCore.App.Api {

    import Query = TSCore.App.Data.Query.Query;
    import IDataSource = TSCore.App.Data.IDataSource;
    import IDataSourceResponse = TSCore.App.Data.IDataSourceResponse;
    import JsonGraphTransformer = TSCore.App.Data.Transformers.JsonGraphTransformer;
    import Resource = TSCore.App.Api.Resource;

    export class Service implements IDataSource {

        protected _queryTransformer;
        protected _resources: TSCore.Data.Dictionary<string, Resource> = new TSCore.Data.Dictionary<string, Resource>();

        public queryTransformer(transformer: any) {
            this._queryTransformer = transformer;
            return this;
        }

        public getQueryTransformer(): any {
            return this._queryTransformer;
        }

        public resource(name: string, resource: Resource) {
            this[name] = resource;
            this._resources.set(name, resource);
            return this;
        }

        public execute(query: Query): ng.IPromise<IDataSourceResponse> {

            var resource = this._resources.get(query.getFrom());

            if (resource) {
                return resource
                    .query(query)
                    .then(response => this._transformQuery(query, response));
            }
        }

        protected _transformQuery(query: Query, response: any): IDataSourceResponse {

            var resourceName = query.getFrom();

            var jsonGraphTransformer = new JsonGraphTransformer;

            this._resources.each((key: string, value: Resource) => {
                jsonGraphTransformer.resource(key, [value.getSingleKey(), value.getMultipleKey()]);
            });

            var graph = jsonGraphTransformer.transform(resourceName, response);

            return graph.get(["results"]);
        }

        public create(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>
        {
            // TODO
            return null;
        }

        public update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>
        {
            // TODO
            return null;
        }

        public remove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>
        {
            // TODO
            return null;
        }

        public clear(): ng.IPromise<any>
        {
            // TODO
            return null;
        }

        public importResponse(response: IDataSourceResponse)
        {
            // TODO
        }
    }
}