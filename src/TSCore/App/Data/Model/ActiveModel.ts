module TSCore.App.Data.Model {

    import Exception = TSCore.Exception.Exception;
    import Model = TSCore.Data.Model;

    export enum ActiveModelFlag {
        ACTIVATED,
        CREATED,
        REMOVED
    }

    export class ActiveModel extends Model {

        protected _flags: TSCore.Data.Collection<ActiveModelFlag> = new TSCore.Data.Collection<ActiveModelFlag>();

        protected _dataService: TSCore.App.Data.Service;

        protected _resourceName: string;

        protected _savedData: any;

        protected _errorMessages:TSCore.Data.Collection<TSValidate.MessageInterface> = new TSCore.Data.Collection<TSValidate.MessageInterface>();

        protected validate(validation: TSValidate.Validation): TSCore.Data.Collection<TSValidate.MessageInterface> {

            return this._errorMessages = validation.validate(null, this);
        }

        public validationHasFailed(): boolean {

            if (_.isArray(this._errorMessages)) {
                return this._errorMessages.count() > 0;
            }

            return false;
        }

        public activate(dataService: TSCore.App.Data.Service, resourceName: string)
        {
            this._dataService = dataService;
            this._resourceName = resourceName;

            this._flags.addMany([ActiveModelFlag.ACTIVATED, ActiveModelFlag.CREATED]);
        }

        public getMessages() {

            return this._errorMessages;
        }

        public deactivate()
        {
            this._dataService = null;
            this._resourceName = null;

            this._flags.removeMany([ActiveModelFlag.ACTIVATED]);
        }

        public setSavedData(data: any)
        {
            this._savedData = data;
        }

        public makeSnapshot() {
            this.setSavedData(this.toObject());
        }

        public markRemoved()
        {
            this._flags.add(ActiveModelFlag.REMOVED);
        }

        public update(data?: any): ng.IPromise<void>
        {
            if(!this.isActivated()) {
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
            if(!this.isActivated()) {
                throw new Exception('Unable to remove ' + this.getResourceIdentifier() + ', model is not alive');
            }

            return this._dataService.removeModel(this._resourceName, this);
        }

        public refresh(): ng.IPromise<boolean>
        {
            if(!this.isActivated()) {
                throw new Exception('Unable to refresh ' + this.getResourceIdentifier() + ', model is not alive');
            }

            return this._dataService.find(this._resourceName, this.getId()).then((response: IDataServiceResponse<Model>) => {

                var model = response.data;

                if(model instanceof Model && !this.equals(model)) {

                    this.merge(model);
                    return true;
                }

                return false;

                //TODO: When the query fails because of a 404, remove the model
            });
        }

        // Flag helpers
        public isActivated(): boolean
        {
            return this._flags.contains(ActiveModelFlag.ACTIVATED);
        }

        public isCreated(): boolean
        {
            return this._flags.contains(ActiveModelFlag.CREATED);
        }

        public isRemoved(): boolean
        {
            return this._flags.contains(ActiveModelFlag.REMOVED);
        }

        public isDirty(field?: string): boolean
        {
            if (field) {
                return this[field] != this._savedData[field];
            }

            return !this._savedData || !this.equals(this._savedData);
        }

        public isValid(field?: string) {

            if (this['validation']) {
                var messages: TSCore.Data.Collection<TSValidate.Message> = this['validation']();

                var valid = true;

                if (field) {

                    messages.each(message => {

                        if (message.getField() === field) {
                            valid = false;
                        }
                    });

                    return valid;

                } else {

                    return !!messages.count();
                }
            }

            return true;
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