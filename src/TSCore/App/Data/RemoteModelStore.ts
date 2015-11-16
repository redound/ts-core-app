module TSCore.App.Data {

    export class RemoteModelStore<T extends Model> {

        public static $inject = ['$q', '$injector'];

        public store: TSCore.Data.ModelDictionary<any, T>;

        protected _storeComplete = false;

        private _processListResponseCallback;
        private _processGetResponseCallback;


        public constructor(
            protected $q: ng.IQService,
            protected $injector: any,
            public endpoint: TSCore.App.Http.ApiEndpoint,
            public modelClass: TSCore.App.Data.IModelInterface

        ) {
            this.store = new TSCore.Data.ModelDictionary<any, T>(modelClass);

            this._processListResponseCallback = _.bind(this._processListResponse, this);
            this._processGetResponseCallback = _.bind(this._processGetResponse, this);
        }

        public list(userOptions?: any, requestOptions?: TSCore.App.Http.IApiRequest, fresh?:boolean): ng.IPromise<T[]> {

            if(this._storeComplete && !fresh) {
                return this.$q.when(this.store.values());
            }

            return <ng.IPromise<T[]>>this.endpoint.list(userOptions, requestOptions).then(this._processListResponseCallback);
        }

        public get(id: any, userOptions?: any, requestOptions?:{}, fresh?:boolean): ng.IPromise<T> {

            if(this.store.contains(id) && !fresh){
                return this.$q.when(this.store.get(id));
            }

            return <ng.IPromise<T>>this.endpoint.get(id, userOptions, requestOptions).then(this._processGetResponseCallback);
        }

        public getMany(ids: any[], userOptions?: any, requestOptions?:{}, fresh?:boolean): ng.IPromise<T[]> {

            var promises = [];

            _.each(ids, (id) => {
                promises.push(this.get(id, userOptions, requestOptions, fresh));
            });

            return this.$q.all(promises);
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


        public importOne(data: any): T {

            var createdItem = this.store.addData(data);
            this._processRelations(createdItem, data);

            return createdItem;
        }

        public importMany(data: any[]): T[] {

            var createdItems = this.store.addManyData(data);

            _.each(data, (itemData) => {
                this._processRelations(this.store.get(itemData[this.modelClass.primaryKey()]), itemData);
            });

            return createdItems;
        }


        protected _processListResponse(response: TSCore.App.Http.IApiEndpointResponse): T[] {

            this._storeComplete = true;
            return this.importMany(response.data);
        }

        protected _processGetResponse(response: TSCore.App.Http.IApiEndpointResponse): T {

            return this.importOne(response.data);
        }

        protected _processRelations(itemModel: T, itemData: any) {

            _.each(itemModel.static.relations(), (relationStoreName:string, relationName: string) => {

                var relationValue = itemData[relationName];

                if(relationValue){

                    var relationStore: RemoteModelStore<any> = this.$injector.get(relationStoreName);
                    var relationPrimaryKey = relationStore.modelClass.primaryKey();

                    if(_.isArray(relationValue)) {
                        itemModel.addManyRelationKeys(relationName, _.pluck(relationStore.importMany(relationValue), relationPrimaryKey));
                    }
                    else if(_.isObject(relationValue)) {
                        itemModel.addRelationKey(relationName, relationStore.importOne(relationValue)[relationPrimaryKey]);
                    }
                }
            });
        }
    }
}
