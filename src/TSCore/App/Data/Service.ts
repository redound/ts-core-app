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
    import Exception = TSCore.Exception.Exception;
    import IQueryExecutor = TSCore.App.Data.Query.IQueryExecutor;

    export interface IDataSourceExecutionResult {
        response: IDataSourceResponse,
        source: IDataSource
    }

    export class Service implements IQueryExecutor
    {
        protected _sources: List<IDataSource> = new List<IDataSource>();
        protected _resources: TSCore.Data.Dictionary<string, IResource> = new TSCore.Data.Dictionary<string, IResource>();

        protected _resourceDelegateCache: TSCore.Data.Dictionary<string, ResourceDelegate<Model>> = new TSCore.Data.Dictionary<string, ResourceDelegate<Model>>();

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

        public setResources(resources: TSCore.Data.Dictionary<string, IResource>): Service {

            this._resources = resources.clone();
            return this;
        }

        public resource(name: string, resource: IResource) {

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

        public getResourceDelegate<T extends Model>(resourceName: string): ResourceDelegate<T> {

            if(this._resourceDelegateCache.contains(resourceName)){
                return this._resourceDelegateCache.get(resourceName)
            }

            var delegate = new ResourceDelegate<T>(this, resourceName);
            this._resourceDelegateCache.set(resourceName, delegate);

            return delegate;
        }

        /** Query **/

        public query(resourceName: string): Query {

            return new Query(this).from(resourceName);
        }

        public all(resourceName: string): ng.IPromise<Model[]> {

            return this.execute(this.query(resourceName));
        }

        public find(resourceName: string, resourceId: any): ng.IPromise<Model> {

            return this.execute(

                this.query(resourceName)
                    .find(resourceId)

            ).then(results => {

                return results.length > 0 ? results[0] : null;
            });
        }

        public execute(query: Query): ng.IPromise<Model[]> {

            var response;

            return this._executeSources((source: IDataSource) => {
                return source.execute(query);
            })
            .then(result => {

                response = result.response;

                var sourceIndex = this._sources.indexOf(result.source);

                if (sourceIndex === 0) {
                    return this.$q.when();
                }

                return this._notifySources(sourceIndex - 1, source => {
                    return source.notifyExecute(query, response);
                });
            })
            .then(() => {
                return this._createModels(response);
            });
        }

        protected _createModels(response: IDataSourceResponse): Model[] {

            var data = response.data;
            var results = response.results;

            var models = [];

            _.each(results, (result) => {

                var resolveModel = data.get(result.value, (resourceName: string, item: any) => {

                    var resource = this.getResource(resourceName);
                    var modelClass = resource.getModel();

                    var model = new modelClass(item);

                    if (model instanceof ActiveModel) {

                        model.activate(this, resourceName);
                        model.setSavedData(data);
                    }

                    return model;
                });

                if (resolveModel) {

                    models.push(resolveModel);
                }
            });

            return models;
        }

        /** Create **/

        public create(resourceName: string, data: any): ng.IPromise<Model> {

            return this
                ._executeCreate(resourceName, data)
                .then(response => {
                    return this._createModels(response)[0] || null;
                });
        }

        public createModel(resourceName: string, model: Model, data?: any): ng.IPromise<Model> {

            if (data) {
                model.assignAll(data);
            }

            return this
                ._executeCreate(resourceName, model.toObject(true))
                .then(response => {

                model = Service._updateModel(model, response.results);

                if (model instanceof ActiveModel) {
                    model.activate(this, resourceName);
                }

                return model;
            });
        }

        protected _executeCreate(resourceName: string, data: any): ng.IPromise<IDataSourceResponse> {

            var response;

            return this
                ._executeSources((source: IDataSource) => {
                    return source.create(resourceName, data);
                })
                .then(result => {

                    response = result.response;

                    var sourceIndex = this._sources.indexOf(result.source);

                    if (sourceIndex === 0) {
                        return this.$q.when();
                    }

                    return this._notifySources(sourceIndex - 1, source => {
                        return source.notifyCreate(response);
                    });
                })
                .then(() => {
                    return response;
                });
        }

        /** Update **/

        public update(resourceName: string, resourceId: any, data: any): ng.IPromise<Model> {

            return this._executeUpdate(resourceName, resourceId, data).then(results => {
                return this._createModels(results)[0] || null;
            });
        }

        public updateModel(resourceName: string, model: Model, data?: any): ng.IPromise<void> {

            return this._executeUpdate(resourceName, model.getId(), data || model.toObject(true)).then(results => {

                Service._updateModel(model, results);
                return null;
            });
        }

        protected _executeUpdate(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse> {

            var response;

            return this
                ._executeSources((source: IDataSource) => {
                    return source.update(resourceName, resourceId, data);
                })
                .then(result => {

                    response = result.response;

                    var sourceIndex = this._sources.indexOf(result.source);

                    if (sourceIndex === 0) {
                        return this.$q.when();
                    }

                    return this._notifySources(sourceIndex - 1, source => {
                        return source.notifyUpdate(response);
                    });
                })
                .then(() => {
                    return response;
                });
        }

        /** Remove **/

        public remove(resourceName: string, resourceId: any): ng.IPromise<void> {

            return this._executeRemove(resourceName, resourceId).then(() => { return null; });
        }

        public removeModel(resourceName: string, model: Model): ng.IPromise<void> {

            return this._executeRemove(resourceName, model.getId()).then(() => {

                Service._removeModel(model);
                return null;
            });
        }

        protected _executeRemove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse> {

            var response;

            return this
                ._executeSources((source: IDataSource) => {
                    return source.remove(resourceName, resourceId);
                })
                .then(result => {

                    response = result.response;

                    var sourceIndex = this._sources.indexOf(result.source);

                    if (sourceIndex === 0) {
                        return this.$q.when();
                    }

                    return this._notifySources(sourceIndex - 1, source => {
                        return source.notifyRemove(response);
                    });
                })
                .then(() => {
                    return response;
                });
        }

        /** Source **/

        protected _notifySources(startIndex: number, executor: (source:IDataSource) => ng.IPromise<any>): ng.IPromise<any> {

            var promises = [];

            for (var sourceIndex = startIndex; sourceIndex >= 0; sourceIndex--) {

                var source = this._sources.get(sourceIndex);
                promises.push(executor(source));
            }

            return this.$q.all(promises);
        }

        protected _executeSources(executor: (source:IDataSource) => ng.IPromise<any>): ng.IPromise<IDataSourceExecutionResult> {

            var sourceIndex = 0;
            var deferred: ng.IDeferred<any> = this.$q.defer();

            var nextSource = () => {

                if(sourceIndex >= this._sources.count()){
                    deferred.reject('No dataSources left');
                    return;
                }

                var source: IDataSource = this._sources.get(sourceIndex);

                executor(source)
                    .then(response => deferred.resolve({
                        response: response,
                        source: source
                    }))
                    .catch(() => nextSource());

                sourceIndex++;
            };

            nextSource();

            return deferred.promise;
        }

        /** Model Helpers **/

        protected static _updateModel(model, data): Model {

            model.assignAll(data);

            if (model instanceof ActiveModel) {
                model.setSavedData(data);
            }

            return model;
        }

        protected static _removeModel(model): Model {

            if (model instanceof ActiveModel) {

                model.setSavedData(null);
                model.markRemoved();
                model.deactivate();
            }

            return model;
        }
    }
}