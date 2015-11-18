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
    }
}