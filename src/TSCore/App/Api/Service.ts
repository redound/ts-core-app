module TSCore.App.Api {

    import Query = TSCore.App.Data.Query.Query;
    import IDataSource = TSCore.App.Data.IDataSource;
    import IDataSourceResponse = TSCore.App.Data.Responses.IDataSourceResponse;
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

        public query(query: Query): ng.IPromise<IDataSourceResponse> {

            var resource = this._resources.get(query.getFrom());

            if (resource) {
                return resource
                    .query(query)
                    .then(response => this._transformQuery(response));
            }
        }

        protected _transformQuery(response: any): IDataSourceResponse {


            var jsonGraphTransformer = new JsonGraphTransformer;

            this._resources.each((key: string, value: Resource) => {
                jsonGraphTransformer.resource(key, [value.getSingleKey(), value.getMultipleKey()]);
            });

            var graph = jsonGraphTransformer.transform(response);

            console.log('graph', graph);

            return null;
        }

        public create(key: any, value: any): ng.IPromise<any>
        {
            throw 'ApiDataSource - Create - Not implemented yet';
        }

        public update(key: any, value: any): ng.IPromise<any>
        {
            throw 'ApiDataSource - Update - Not implemented yet';
        }

        public remove(key: any): ng.IPromise<any>
        {
            throw 'ApiDataSource - Remove - Not implemented yet';
        }

        public clear(): ng.IPromise<any>
        {
            throw 'ApiDataSource - Clear - Not implemented yet';
        }

        public importResponse(response: IDataSourceResponse)
        {
            throw 'ApiDataSource - ImportResultSet - Not implemented yet';
        }
    }
}