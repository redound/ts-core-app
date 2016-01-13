///<reference path="Model/ActiveModel.ts"/>
///<reference path="Query/Query.ts"/>
///<reference path="IDataSource.ts"/>
///<reference path="IDataSourceResponse.ts"/>

module TSCore.App.Data {

    import Dictionary = TSCore.Data.Dictionary;
    import List = TSCore.Data.List;
    import ModelList = TSCore.Data.ModelList;
    import Query = TSCore.App.Data.Query.Query;
    import ActiveModel = TSCore.App.Data.Model.ActiveModel;
    import IDataSource = TSCore.App.Data.IDataSource;
    import IDataSourceResponse = TSCore.App.Data.IDataSourceResponse;
    import Model = TSCore.Data.Model;

    export class Service {

        protected _sources: List<IDataSource> = new List<IDataSource>();
        protected _resources: TSCore.Data.Dictionary<string, IResource> = new TSCore.Data.Dictionary<string, IResource>();

        public constructor(protected $q: ng.IQService) {

        }

        /** Data Sources **/

        public source(source: IDataSource) {
            this._sources.add(source);
            source.setDataService(this);
            return this;
        }

        public getSources(): List<IDataSource> {
            return this._sources.clone();
        }

        /** Resources **/

        public manyResources(resources: TSCore.Data.Dictionary<string, IResource>): Service {

            resources.each((resourceName, resource) => {
                this._resources.set(resourceName, resource);
            });

            return this;
        }

        public resource(name: string, resource: IResource) {
            this[name] = resource;
            this._resources.set(name, resource);
            return this;
        }

        public getResources(): TSCore.Data.Dictionary<string, IResource> {
            return this._resources.clone();
        }

        public getResource(name: string): IResource {
            return this._resources.get(name);
        }

        public getResourceAsync(name: string): ng.IPromise<Resource> {

            var deferred = this.$q.defer();
            var resource = this._resources.get(name);

            if (!resource) {
                throw new TSCore.Exception.Exception('Resource `' + name + '` cannot be found');
            }

            deferred.resolve(resource);

            return deferred.promise;
        }

        /** Query **/

        public query(resourceName: string): Query {
            return Query.from(resourceName);
        }

        public all(resourceName: string): ng.IPromise<any> {

            return this.execute(

                Query
                    .from(resourceName)

            );
        }

        public find(resourceName: string, resourceId: any): ng.IPromise<Model> {

            return this.execute(

                Query
                    .from(resourceName)
                    .find(resourceId)

            ).then(results => {

                return results[0] || null;
            });
        }

        protected _executeQuery(query: Query): ng.IPromise<IDataSourceResponse> {

            return this._executeInSources((source: IDataSource) => {
                return source.execute(query);
            });
        }

        protected _createModels(response: IDataSourceResponse): Model[] {

            var data = response.data;
            var results = response.results;

            var models = [];

            _.each(results, (result) => {

                var model = data.get(result.value, (resourceName: string, item: any) => {

                    var resource = this.getResource(resourceName);
                    var modelClass = resource.getModel();

                    return new modelClass(item);
                });

                if (model) {

                    models.push(model);

                    if (model instanceof ActiveModel) {

                        model.makeAlive
                        model.setSavedData(data);
                    }
                }
            });

            return models;
        }

        /** Execute **/

        public execute(query: Query): ng.IPromise<any> {

            return this._executeQuery(query).then(results => {
                return this._createModels(results);
            });
        }

        protected _executeInSources(executor: (source:IDataSource) => ng.IPromise<any>): ng.IPromise<any> {

            var sourceIndex = 0;
            var deferred: ng.IDeferred<any> = this.$q.defer();

            var nextSource = () => {

                if(sourceIndex >= this._sources.count()){
                    deferred.reject();
                }

                var source: IDataSource = this._sources.get(sourceIndex);
                executor(source)
                    .then(response => deferred.resolve(response))
                    .catch(() => nextSource());

                sourceIndex++;
            };

            nextSource();

            return deferred.promise;
        }

        /** Create **/

        public create(resourceName: string, data: any): ng.IPromise<any> {

            return this._executeCreate(resourceName, data).then(result => {
                return this._createModels(result)[0] || null;
            });
        }

        // TODO: Walk through
        public createModel(resourceName: string, model: Model, data?: any): ng.IPromise<any> {

            if (data) {
                model.assignAll(data);
            }

            return this._executeCreate(resourceName, model.toObject(true)).then((result: any) => {

                this._updateModel(model, result);

                if(model instanceof ActiveModel) {
                    model.makeAlive(this, resourceName);
                }

                return model.getId();
            });
        }

        // TODO: Create
        protected _executeCreate(resourceName: string, data: any): ng.IPromise<IDataSourceResponse> {

            return null;
        }

        /** Update **/

        public update(resourceName: string, resourceId: any, data: any): ng.IPromise<any> {

            return this._executeUpdate(resourceName, resourceId, data).then(result => {
                return this._createModels(result)[0] || null;
            });
        }

        // TODO: Update
        protected _executeUpdate(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse> {

            return null;
        }

        // TODO: Walk through
        public updateModel(resourceName: string, model: Model, data?: any): ng.IPromise<void> {

            return this._executeUpdate(resourceName, model.getId(), data || model.toObject(true)).then(result => {

                this._updateModel(model, result);
                return null;
            });
        }

        protected _updateModel(model: Model, data: IDataSourceResponse) {

            // TODO: Resolve data

            /*
             model.assignAll(data);

             if(model instanceof ActiveModel){
             model.setSavedData(data);
             }
             */
        }

        /** Remove **/

        public remove(resourceName: string, resourceId: any): ng.IPromise<void> {

            return this._executeRemove(resourceName, resourceId).then(() => { return null; });
        }

        public removeModel(resourceName: string, model: Model): ng.IPromise<void> {

            return this._executeRemove(resourceName, model.getId()).then(() => {

                this._removeModel(model);
                return null;
            });
        }

        // TODO: Remove
        protected _executeRemove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse> {

            return null;
        }

        protected _removeModel(model) {

            if(model instanceof ActiveModel){

                model.setSavedData(null);
                model.markRemoved();
                model.die();
            }
        }
    }
}