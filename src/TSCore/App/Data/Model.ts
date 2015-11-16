module TSCore.App.Data {

    export interface IModelInterface extends TSCore.Data.IModelInterface {}

    export class Model extends TSCore.Data.Model {

        protected _relationKeys: TSCore.Data.Dictionary<string, TSCore.Data.Collection<any>>;

        constructor(data?:{}) {

            super(data);

            this._relationKeys = new TSCore.Data.Dictionary<string, TSCore.Data.Collection<any>>();
        }

        public static relations(): any {
            return {};
        }


        public getRelation(type: string): ng.IPromise<any> {

            var relationStoreName = this.static.relations()[type];
            if(!relationStoreName){
                return null;
            }

            var relationKeys = this.getRelationKeys(type);

            // TODO: Get the store in a proper way
            var relationStore = angular.element(document).injector().get(relationStoreName);

            return relationStore.getMany(relationKeys);
        }

        public getRelationStored(type: string): any[] {

            var relationStoreName = this.static.relations()[type];
            if(!relationStoreName){
                return null;
            }

            var relationKeys = this.getRelationKeys(type);

            // TODO: Get the store in a proper way
            var relationStore = angular.element(document).injector().get(relationStoreName);

            return relationStore.getManyStored(relationKeys);
        }


        public addRelationKey(type: string, key: any) {

            var relationKeys = this._relationKeys.get(type);

            if(!relationKeys){

                relationKeys = new TSCore.Data.Collection<any>();
                this._relationKeys.set(type, relationKeys);
            }

            relationKeys.add(key);
        }

        public addManyRelationKeys(type: string, keys: any[]) {

            var relationKeys = this._relationKeys.get(type);

            if(!relationKeys){

                relationKeys = new TSCore.Data.Collection<any>();
                this._relationKeys.set(type, relationKeys);
            }

            relationKeys.addMany(keys);
        }

        public removeRelationKey(type: string, key: any) {

            var relationKeys = this._relationKeys.get(type);

            if(!relationKeys){
                return;
            }

            relationKeys.remove(key);
        }

        public getRelationKeys(type: string): any[] {

            var relationKeys = this._relationKeys.get(type);
            return relationKeys ? relationKeys.toArray() : [];
        }
    }
}