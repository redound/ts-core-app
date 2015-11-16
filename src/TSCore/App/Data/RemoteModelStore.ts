module TSCore.App.Data {

    interface ILoadConfig {
        id?: number;
        requestOptions: TSCore.App.Http.IApiRequest;
    }

    export interface IModelQueryOptions {
        include?: string[]
    }

    export class RemoteModelStore<T extends Model> {

        public static $inject = ['$q', '$injector'];

        public store: TSCore.Data.ModelDictionary<any, T>;

        protected _loadedRequestConfigs: TSCore.Data.Collection<string> = new TSCore.Data.Collection<string>();
        protected _pendingRequests: TSCore.Data.Dictionary<string, ng.IPromise<T>> = new TSCore.Data.Dictionary<string, ng.IPromise<T>>();


        public constructor(
            protected $q: ng.IQService,
            protected $injector: any,
            public endpoint: TSCore.App.Http.ApiEndpoint,
            public modelClass: any

        ) {
            this.store = new TSCore.Data.ModelDictionary<any, T>(modelClass);
        }

        public list(queryOptions?: IModelQueryOptions, requestOptions?: TSCore.App.Http.IApiRequest, fresh?:boolean): ng.IPromise<T[]> {

            var loadConfig: ILoadConfig = {
                requestOptions: requestOptions
            };

            var loadConfigString = JSON.stringify(loadConfig);

            if(this._loadedRequestConfigs.contains(loadConfigString) && !fresh){

                var models = this.store.values();
                var promises: ng.IPromise[] = [];

                _.each(models, (model) => {
                    promises.push(this._processRelations(model, queryOptions));
                });

                return this.$q.all(promises);
            }

            if(this._pendingRequests.contains(loadConfigString)){
                return this._pendingRequests.get(loadConfigString);
            }

            var promise = <ng.IPromise<T[]>>this.endpoint.list(queryOptions, requestOptions).then((response: TSCore.App.Http.IApiEndpointResponse) => {

                this._loadedRequestConfigs.add(loadConfigString);
                this._pendingRequests.remove(loadConfigString);

                return this._processListResponse(response, queryOptions);
            });

            this._pendingRequests.set(loadConfigString, promise);

            return promise;
        }

        public get(id: any, queryOptions?: IModelQueryOptions, requestOptions?:{}, fresh?:boolean): ng.IPromise<T> {

            var loadConfig: ILoadConfig = {
                id: id,
                requestOptions: requestOptions
            };

            var loadConfigString = JSON.stringify(loadConfig);

            if(this._loadedRequestConfigs.contains(loadConfigString) && !fresh){

                var model = this.store.get(id);
                return this._processRelations(model, queryOptions);
            }

            if(this._pendingRequests.contains(loadConfigString)){
                return this._pendingRequests.get(loadConfigString);
            }

            var promise = <ng.IPromise<T>>this.endpoint.get(id, queryOptions, requestOptions).then((response: TSCore.App.Http.IApiEndpointResponse) => {

                this._loadedRequestConfigs.add(loadConfigString);
                this._pendingRequests.remove(loadConfigString);

                return this._processGetResponse(response, queryOptions);
            });

            this._pendingRequests.set(loadConfigString, promise);

            return promise;
        }

        public getMany(ids: any[], userOptions?: any, requestOptions?:{}, fresh?:boolean): ng.IPromise<T[]> {

            var promises = [];

            _.each(ids, (id) => {
                promises.push(this.get(id, userOptions, requestOptions, fresh));
            });

            return this.$q.all(promises).then((responses) => {

                return _.filter(responses, (item) => {
                    return item != null && item != undefined;
                })
            });
        }


        public listStored(): T[] {

            return this.store.values();
        }

        public getStored(id: any): T {

            return this.store.get(id);
        }

        public getManyStored(ids: any[]): T[] {

            var results = [];

            _.each(ids, (id) => {
                results.push(this.store.get(id));
            });

            return results;
        }


        public importOne(itemData: any, queryOptions?: IModelQueryOptions): ng.IPromise<T> {

            var createdItem = this.store.addData(itemData);
            return this._processRelations(createdItem, itemData, queryOptions);
        }

        public importMany(data: any[], queryOptions?: IModelQueryOptions): ng.IPromise<T[]> {

            this.store.addManyData(data);
            var promises: ng.IPromise<T>[] = [];

            _.each(data, (itemData) => {

                promises.push(this._processRelations(this.store.get(itemData[this.modelClass.primaryKey()]), itemData, queryOptions));
            });

            return this.$q.all(promises);
        }


        protected _processListResponse(response: TSCore.App.Http.IApiEndpointResponse, queryOptions?: IModelQueryOptions): ng.IPromise<T[]> {

            return this.importMany(response.data, queryOptions);
        }

        protected _processGetResponse(response: TSCore.App.Http.IApiEndpointResponse, queryOptions?: IModelQueryOptions): ng.IPromise<T> {

            return this.importOne(response.data, queryOptions);
        }

        protected _processRelations(itemModel: T, itemData: any, queryOptions?: IModelQueryOptions): ng.IPromise<T> {

            var promises: ng.IPromise<T>[] = [];
            var includes = (queryOptions && queryOptions.include) || [];
            var model = _.clone(itemModel);

            _.each(includes, (relationName: string) => {

                var relationConfig = model.static.relations()[relationName];
                if(!relationConfig){
                    return;
                }

                var relationStore: RemoteModelStore<any> = this.$injector.get(relationConfig.store);
                var localKey = relationConfig.localKey;
                var foreignKey = relationConfig.foreignKey || relationStore.modelClass.primaryKey();
                var dataKey = relationConfig.dataKey;
                var dataValue = dataKey && itemData ? itemData[dataKey] : null;

                switch(relationConfig.type){

                    case ModelRelationType.ONE:

                        var localKeyValue = model[localKey];
                        var getPromise: ng.IPromise<T> = null;

                        if(dataValue){
                            getPromise = relationStore.importOne(dataValue);
                        }
                        else {
                            getPromise = relationStore.get(localKeyValue);
                        }

                        getPromise.then((relationModel) => {

                            model[relationName] = relationModel;
                        });

                        promises.push(getPromise);

                        break;

                    case ModelRelationType.MANY:

                        var localKeyValues = _.isArray(model[localKey]) ? model[localKey] : [];
                        var listPromise: ng.IPromise<T[]> = null;

                        if(dataValue){
                            listPromise = relationStore.importMany(dataValue);
                        }
                        else {
                            listPromise = relationStore.getMany(localKeyValues);
                        }

                        listPromise.then((relationModels) => {

                            model[relationName] = relationModels;
                        });

                        promises.push(listPromise);

                        break;
                }
            });

            return <ng.IPromise<T>>this.$q.all(promises).then(() => {

                return model;
            });
        }
    }
}