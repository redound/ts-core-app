module TSCore.App.Data.Model {

    import Exception = TSCore.Exception.Exception;
    import Model = TSCore.Data.Model;

    export enum ActiveModelFlag {
        ALIVE,
        CREATED,
        REMOVED
    }

    export class ActiveModel extends Model {

        protected _flags: TSCore.Data.Collection<ActiveModelFlag> = new TSCore.Data.Collection<ActiveModelFlag>();

        protected _dataService: TSCore.App.Data.Service;
        protected _resourceName: string;

        protected _savedData: any;


        public makeAlive(dataService: TSCore.App.Data.Service, resourceName: string)
        {
            this._dataService = dataService;
            this._resourceName = resourceName;

            this._flags.addMany([ActiveModelFlag.ALIVE, ActiveModelFlag.CREATED]);
        }

        public die()
        {
            this._dataService = null;
            this._resourceName = null;

            this._flags.removeMany([ActiveModelFlag.ALIVE]);
        }

        public setSavedData(data: any)
        {
            this._savedData = data;
        }

        public markRemoved()
        {
            this._flags.add(ActiveModelFlag.REMOVED);
        }

        public update(data?: any): ng.IPromise<void>
        {
            if(!this.isAlive()) {
                throw new Exception('Unable to update ' + this.getResourceIdentifier() + ', model is not alive');
            }

            return this._dataService.updateModel(this._resourceName, this, data);
        }

        public create(dataService: TSCore.App.Data.Service, resourceName: string, data?: any): ng.IPromise<any>
        {
            return dataService.createModel(resourceName, this, data);
        }

        public remove(): ng.IPromise<void>
        {
            if(!this.isAlive()) {
                throw new Exception('Unable to remove ' + this.getResourceIdentifier() + ', model is not alive');
            }

            return this._dataService.removeModel(this._resourceName, this);
        }

        public refresh(): ng.IPromise<boolean>
        {
            if(!this.isAlive()) {
                throw new Exception('Unable to refresh ' + this.getResourceIdentifier() + ', model is not alive');
            }

            return this._dataService.find(this._resourceName, this.getId()).then((result: Model) => {

                if(!this.equals(result)) {

                    this.merge(result);
                    return true;
                }

                return false;

                //TODO: When the query fails because of a 404, remove the model
            });
        }

        // Flag helpers
        public isAlive(): boolean
        {
            return this._flags.contains(ActiveModelFlag.ALIVE);
        }

        public isCreated(): boolean
        {
            return this._flags.contains(ActiveModelFlag.CREATED);
        }

        public isRemoved(): boolean
        {
            return this._flags.contains(ActiveModelFlag.REMOVED);
        }

        public isDirty(): boolean
        {
            return !this._savedData || !this.equals(this._savedData);
        }

        public getResourceIdentifier(): string
        {
            if(!this._resourceName && !this.getId()){
                return 'unknown model';
            }

            var identifier = '';

            if(this._resourceName){
                identifier += this._resourceName;
            }

            if(this.getId()){
                identifier += '(' + this.getId() + ')';
            }

            return identifier;
        }
    }
}