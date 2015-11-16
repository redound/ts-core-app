module TSCore.App.Data {

    import Exception = TSCore.Exception.Exception;
    export enum ModelRelationType {
        ONE,
        MANY
    }

    export interface IModelInterface extends TSCore.Data.IModelInterface {}

    export interface IModelRelationsInterface {

        [name: string]: IModelRelationConfigInterface
    }

    export interface IModelRelationConfigInterface {

        store?: string,
        type?: ModelRelationType,
        localKey?: string,
        foreignKey: string,
        dataKey?: string
    }


    export class Model extends TSCore.Data.Model {

        protected _relationKeys: TSCore.Data.Dictionary<string, any>;

        constructor(data?:{}) {

            super(data);

            this._relationKeys = new TSCore.Data.Dictionary<string, any>();
        }

        public static relations(): IModelRelationsInterface {
            return {};
        }


        public getRelation(name: string): ng.IPromise<any> {

            var relationConfig = this.static.relations()[name];
            if(!relationConfig){
                return null;
            }

            // TODO: Get the store in a proper way
            var relationStore = angular.element(document).injector().get(relationConfig.store);
            var result = null;

            if(relationConfig.type == ModelRelationType.ONE){

                result = relationStore.get(this.getRelationKey(name));
            }
            else {

                result = relationStore.getMany(this.getManyRelationKeys(name));
            }

            return result;
        }

        public getRelationStored(name: string): any {

            var relationConfig = this.static.relations()[name];
            if(!relationConfig){
                return null;
            }

            // TODO: Get the store in a proper way
            var relationStore = angular.element(document).injector().get(relationConfig.store);
            var result = null;

            if(relationConfig.type == ModelRelationType.ONE){

                result = relationStore.getStored(this.getRelationKey(name));
            }
            else {

                result = relationStore.getManyStored(this.getManyRelationKeys(name));
            }

            return result;
        }


        public addRelationKey(name: string, key: any) {

            this.addManyRelationKeys(name, [key]);
        }

        public addManyRelationKeys(name: string, keys: any[]) {

            var relationConfig = this.static.relations()[name];
            if(!relationConfig){
                return null;
            }

            if(relationConfig.type == ModelRelationType.ONE){
                throw new Exception('Attempted to add many relation keys, but relationship is of type ONE', 0, { name: name, keys: keys });
            }

            var relationKeys = this._relationKeys.get(name);

            if(!relationKeys){

                relationKeys = new TSCore.Data.Collection<any>();
                this._relationKeys.set(name, relationKeys);
            }

            relationKeys.addMany(keys);
        }

        public setRelationKey(name: string, key: any) {

            var relationConfig = this.static.relations()[name];
            if(!relationConfig){
                return null;
            }

            if(relationConfig.type == ModelRelationType.MANY){
                throw new Exception('Attempted to add one relation key, but relationship is of type MANY', 0, { name: name, key: key });
            }

            this._relationKeys.set(name, key);
        }


        public removeRelationKey(name: string, key: any) {

            var relationKeys = this._relationKeys.get(name);

            if(!relationKeys){
                return;
            }

            relationKeys.remove(key);
        }

        public getManyRelationKeys(name: string): any[] {

            var relationConfig = this.static.relations()[name];
            if(!relationConfig){
                return null;
            }

            if(relationConfig.type == ModelRelationType.ONE){
                throw new Exception('Attempted to get many relation keys, but relationship is of type ONE', 0, { name: name });
            }

            var relationKeys = this._relationKeys.get(name);
            return relationKeys ? relationKeys.toArray() : [];
        }

        public getRelationKey(name: string): any {

            var relationConfig = this.static.relations()[name];
            if(!relationConfig){
                return null;
            }

            if(relationConfig.type == ModelRelationType.MANY){
                throw new Exception('Attempted to get one relation key, but relationship is of type MANY', 0, { name: name });
            }

            return this._relationKeys.get(name);
        }
    }
}