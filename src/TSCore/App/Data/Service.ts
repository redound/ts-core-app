module TSCore.App.Data {

    import List = TSCore.Data.List;
    import Model = TSCore.App.Data.Model.Model;
    import Query = TSCore.App.Data.Query.Query;
    import Dictionary = TSCore.Data.Dictionary;
    import ActiveModel = TSCore.App.Data.Model.ActiveModel;
    import IDataSource = TSCore.App.Data.IDataSource;
    import IDataSourceResponse = TSCore.App.Data.IDataSourceResponse;

    export class Service {

        protected _sources: List<IDataSource> = new List<IDataSource>();

        public static $inject = ['$q'];

        public constructor(
            protected $q: ng.IQService
        ) {

        }

        public source(source: IDataSource)
        {
            this._sources.add(source);
            return this;
        }

        public getSources(): List<IDataSource>
        {
            return this._sources.clone();
        }


        public create(resourceName: string, data: any): ng.IPromise<Model>
        {
            return this._executeCreate(resourceName, data).then(result => {
                return this._createModels(result).first();
            });
        }

        public createModel(resourceName: string, model: Model, data?: any): ng.IPromise<any>
        {
            if(data){
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

        public update(resourceName: string, resourceId: any, data: any): ng.IPromise<Model>
        {
            return this._executeUpdate(resourceName, resourceId, data).then(result => {
                return this._createModels(result).first();
            });
        }

        public updateModel(resourceName: string, model: Model, data?: any): ng.IPromise<void>
        {
            return this._executeUpdate(resourceName, model.getId(), data || model.toObject(true)).then(result => {

                this._updateModel(model, result);
                return null;
            });
        }

        public remove(resourceName: string, resourceId: any): ng.IPromise<void>
        {
            return this._executeRemove(resourceName, resourceId).then(() => { return null; });
        }

        public removeModel(resourceName: string, model: Model): ng.IPromise<void>
        {
            return this._executeRemove(resourceName, model.getId()).then(() => {

                this._removeModel(model);
                return null;
            });
        }

        public query(resourceName: string): Query
        {
            return Query.from(resourceName);
        }

        public all(resourceName: string): ng.IPromise<List<Model>>
        {
            return this.execute(Query.from(resourceName));
        }

        public find(resourceName: string, resourceId: any): ng.IPromise<Model>
        {
            return this.execute(
                Query
                    .from(resourceName)
                    .find(resourceId))
                .then((results: List<Model>) => {

                return results.first();
            });
        }

        public execute(query: Query): ng.IPromise<List<Model>>
        {
            return this._executeQuery(query).then(results => {
                return this._createModels(results);
            });
        }

        protected _executeQuery(query: Query): ng.IPromise<IDataSourceResponse>
        {
            return this._executeInSources((source: IDataSource) => {
                return source.execute(query);
            });
        }

        protected _executeCreate(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>
        {
            // TODO: Create
            return null;
        }

        protected _executeUpdate(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>
        {
            // TODO: Update
            return null;
        }

        protected _executeRemove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>
        {
            // TODO: Remove
            return null;
        }

        protected _executeInSources(executor: (source:IDataSource) => ng.IPromise<any>): ng.IPromise<any>
        {
            var sourceIndex = 0;
            var promise: ng.IDeferred<any> = this.$q.defer();

            var nextSource = () => {

                if(sourceIndex >= this._sources.count()){
                    promise.reject();
                }

                var source: IDataSource = this._sources.get(sourceIndex);
                executor(source)
                    .then(response => promise.resolve(response))
                    .catch(() => nextSource());

                sourceIndex++;
            };

            nextSource();

            return promise.promise;
        }

        protected _createModels(data: IDataSourceResponse): List<Model>
        {
            // TODO: Create models from source results

            /*
            var modelClass = this._resourceModels.get(resourceName);
            if(!modelClass){
                return data;
            }

            var model: Model = new modelClass(data);

            if(model instanceof ActiveModel) {
                model.makeAlive(this, resourceName);
                model.setSavedData(data);
            }

            return model;
            */

            return null;
        }

        protected _updateModel(model: Model, data: IDataSourceResponse)
        {
            // TODO: Resolve data

            /*
            model.assignAll(data);

            if(model instanceof ActiveModel){
                model.setSavedData(data);
            }
            */
        }

        protected _removeModel(model)
        {
            if(model instanceof ActiveModel){

                model.setSavedData(null);
                model.markRemoved();
                model.die();
            }
        }
    }
}