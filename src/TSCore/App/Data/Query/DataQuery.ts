module TSCore.App.Data.Query {

    import Collection = TSCore.Data.Collection;
    import IModelInterface = TSCore.Data.IModelInterface;

    export interface IDataQueryRelationConstraint {
        model: IModelInterface,
        itemId: any
    }

    export class DataQuery extends TSCore.BaseObject
    {
        protected _model: IModelInterface;

        protected _itemId: any;
        protected _relationConstraints: Collection<IDataQueryRelationConstraint>;


        public find(id: any): DataQuery {

            this._itemId = id;
            return this;
        }

        public getItemId(): any {

            return this._itemId;
        }


        public withRelationConstraint(model: IModelInterface, itemId: any): DataQuery {

            this._relationConstraints.add({
                model: model,
                itemId: itemId
            });

            return this;
        }

        public getRelationConstraints(): Collection<IDataQueryRelationConstraint> {

            return this._relationConstraints.clone();
        }
    }
}