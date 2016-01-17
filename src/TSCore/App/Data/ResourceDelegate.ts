module TSCore.App.Data {

    import Model = TSCore.Data.Model;
    import Query = TSCore.App.Data.Query.Query;
    import IModel = TSCore.Data.IModel;

    export class ResourceDelegate<T extends Model> {

        protected _dataService: Service;
        protected _resourceName: string;

        public constructor(dataService: Service, resourceName: string) {

            this._dataService = dataService;
            this._resourceName = resourceName;
        }

        public query(): Query {
            return this._dataService.query(this._resourceName);
        }

        public all(): ng.IPromise<T[]> {
            return this._dataService.all(this._resourceName);
        }

        public find(resourceId: any): ng.IPromise<T> {
            return this._dataService.find(this._resourceName, resourceId);
        }

        public create(data: any): ng.IPromise<T> {
            return this._dataService.create(this._resourceName, data);
        }

        public createModel(model: T, data?: any): ng.IPromise<T> {
            return this._dataService.createModel(this._resourceName, model, data);
        }

        public update(resourceId: any, data: any): ng.IPromise<T> {
            return this._dataService.update(this._resourceName, resourceId, data);
        }

        public updateModel(model: T, data?: any): ng.IPromise<void> {
            return this._dataService.updateModel(this._resourceName, model, data);
        }

        public remove(resourceId: any): ng.IPromise<void> {
            return this._dataService.remove(this._resourceName, resourceId);
        }

        public removeModel(model: Model): ng.IPromise<void> {
            return this._dataService.removeModel(this._resourceName, model);
        }
    }
}