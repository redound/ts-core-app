module TSCore.App.Data {

    interface ILoadConfig {
        id?: number;
        requestOptions: TSCore.App.Http.IApiRequest;
    }

    export interface IModelQueryOptions {
        include?: IModelQueryOptionRelation[]
    }

    export interface IModelQueryOptionRelation {
        relation: string,
        queryOptions?: IModelQueryOptions
    }

    export class RemoteModelStore<T extends Model> {

        public static $inject = ['$q', '$injector'];

        public store: TSCore.Data.ModelDictionary<any, T>;

        protected _loadedRequestConfigs: TSCore.Data.Collection<string> = new TSCore.Data.Collection<string>();
        protected _pendingRequests: TSCore.Data.Dictionary<string, ng.IPromise<any>> = new TSCore.Data.Dictionary<string, ng.IPromise<any>>();


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
                var promises: ng.IPromise<T>[] = [];

                _.each(models, (model) => {
                    promises.push(this._composeModel(model, queryOptions));
                });

                return this.$q.all(promises);
            }

            if(this._pendingRequests.contains(loadConfigString)){
                return this._pendingRequests.get(loadConfigString);
            }

            if(fresh){
                requestOptions = _.defaults(requestOptions || {}, { cache: false });
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

            if(this.queryCached(id, queryOptions) && !fresh){

                var model = this.store.get(id);
                return this._composeModel(model, queryOptions);
            }

            if(this._pendingRequests.contains(loadConfigString)){
                return this._pendingRequests.get(loadConfigString);
            }

            if(fresh){
                requestOptions = _.defaults(requestOptions || {}, { cache: false });
            }

            var promise = <ng.IPromise<T>>this.endpoint.get(id, queryOptions, requestOptions).then((response: TSCore.App.Http.IApiEndpointResponse) => {

                this._loadedRequestConfigs.add(loadConfigString);
                this._pendingRequests.remove(loadConfigString);

                return this._processGetResponse(response, queryOptions);
            });

            this._pendingRequests.set(loadConfigString, promise);

            return promise;
        }

        public create(model: T, requestOptions?:{}): ng.IPromise<T> {

            return this.endpoint.create(this.endpoint.transformRequest(model.toObject(false)), requestOptions).then((response:  TSCore.App.Http.IApiEndpointResponse) => {

                var resultModel = model;

                if(response.data){
                    resultModel = this.importOne(response.data);
                }
                else {
                    this.store.set(model[this.modelClass.primaryKey()], model);
                }

                return resultModel;
            });
        }

        public update(model: T, requestOptions?:{}): ng.IPromise<T> {

            var modelId = model[this.modelClass.primaryKey()];

            return this.endpoint.update(modelId, this.endpoint.transformRequest(model.toObject(false)), requestOptions).then((response:  TSCore.App.Http.IApiEndpointResponse) => {

                var resultModel = model;

                if(response.data){
                    resultModel = this.importOne(model);
                }
                else {
                    this.store.set(model[this.modelClass.primaryKey()], model);
                }

                return resultModel;
            });
        }


        public queryCached(id, queryOptions) {

            if (!this.store.contains(id)) {
                return false;
            }

            var itemModel = this.store.get(id);

            var includes = (queryOptions && queryOptions.include) || [];

            if(!includes.length) {
                return true;
            }

            var oneNotInCache = false;

            _.each(includes, (includeConfig: IModelQueryOptionRelation) => {

                if(oneNotInCache){
                    return;
                }

                var relationConfig = itemModel.static.relations()[includeConfig.relation];
                var relationStore = this.$injector.get(relationConfig.store);
                var localKey = relationConfig.localKey;

                switch(relationConfig.type) {

                    case ModelRelationType.ONE:

                        var relationId = itemModel[localKey];

                        if(!relationStore.queryCached(relationId, includeConfig.queryOptions)){
                            oneNotInCache = true;
                        }
                        break;

                    case ModelRelationType.MANY:

                        var relationIds = itemModel[localKey];

                        _.each(relationIds, (relationId) => {

                            if(!relationStore.queryCached(relationId, includeConfig.queryOptions)){
                                oneNotInCache = true;
                            }
                        });
                        break;
                }
            });

            return !oneNotInCache;
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


        public importOne(itemData: any): T {

            this._extractRelationData(itemData);

            return this.store.addData(itemData);
        }

        public importMany(data: any[]): T[] {

            _.each(data, (itemData) => {
                this._extractRelationData(itemData);
            });

            return this.store.addManyData(data);
        }

        protected _processListResponse(response: TSCore.App.Http.IApiEndpointResponse, queryOptions?: IModelQueryOptions): ng.IPromise<T[]> {

            var itemModels = this.importMany(response.data);

            var promises: ng.IPromise<T>[] = [];

            _.each(itemModels, (itemModel) => {
                promises.push(this._composeModel(itemModel, queryOptions));
            });

            return this.$q.all(promises);
        }

        protected _processGetResponse(response: TSCore.App.Http.IApiEndpointResponse, queryOptions?: IModelQueryOptions): ng.IPromise<T> {

            var itemModel = this.importOne(response.data);

            return this._composeModel(itemModel, queryOptions);
        }

        protected _composeModel(itemModel: T, queryOptions?: IModelQueryOptions): ng.IPromise<any> {

            var promises: ng.IPromise<any>[] = [];

            var includes = (queryOptions && queryOptions.include) || [];
            var model = _.clone(itemModel);

            _.each(includes, (relationObject: IModelQueryOptionRelation) => {

                var relationConfig = model.static.relations()[relationObject.relation];
                if(!relationConfig){
                    return;
                }

                var relationStore: RemoteModelStore<any> = this.$injector.get(relationConfig.store);
                var localKey = relationConfig.localKey;

                switch(relationConfig.type){

                    case ModelRelationType.ONE:

                        var localKeyValue = model[localKey];
                        var getPromise: ng.IPromise<T> = relationStore.get(localKeyValue, relationObject.queryOptions);

                        getPromise.then((relationModel) => {

                            model[relationObject.relation] = relationModel;
                        });

                        promises.push(getPromise);

                        break;

                    case ModelRelationType.MANY:

                        var localKeyValues = _.isArray(model[localKey]) ? model[localKey] : [];
                        var listPromise: ng.IPromise<T[]> = relationStore.getMany(localKeyValues, relationObject.queryOptions);

                        listPromise.then((relationModels) => {

                            model[relationObject.relation] = relationModels;
                        });

                        promises.push(listPromise);

                        break;
                }
            });

            return <ng.IPromise<T>>this.$q.all(promises).then(() => {

                return model;
            });
        }

        protected _extractRelationData(itemData) {

            _.each(this.modelClass.relations(), (relationConfig: IModelRelationConfigInterface) => {

                var dataKey = relationConfig.dataKey;
                var dataValue = dataKey && itemData ? itemData[dataKey] : null;

                if (!dataValue) {
                    return;
                }

                var relationStore: RemoteModelStore<any> = this.$injector.get(relationConfig.store);

                switch(relationConfig.type) {

                    case ModelRelationType.ONE:
                        relationStore.importOne(relationStore.endpoint.transformResponse(dataValue));
                        break;

                    case ModelRelationType.MANY:
                        relationStore.importMany(_.map(dataValue, relationStore.endpoint.transformResponse));
                        break;
                }
            });
        }
    }
}