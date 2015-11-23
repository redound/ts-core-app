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

        store: string,
        type: ModelRelationType,
        localKey?: string,
        foreignKey?: string,
        dataKey?: string
    }


    export class Model extends TSCore.Data.Model {

        public static relations(): IModelRelationsInterface {
            return {};
        }

        public toObject(includeRelations: boolean = true) {

            var result = super.toObject();

            if(includeRelations === false) {

                _.each(_.keys(this.static.relations()), (key:string) => {

                    if (result[key]) {
                        delete result[key];
                    }
                });
            }

            return result;
        }
    }
}