///<reference path="Graph/Reference.ts"/>
///<reference path="Graph/Graph.ts"/>

module TSCore.App.Data {

    import Reference = TSCore.App.Data.Graph.Reference;
    import Graph = TSCore.App.Data.Graph.Graph;

    export interface IDataSourceResponseMeta {
        total?: number
    }

    export interface IDataSourceResponse {
        meta: IDataSourceResponseMeta,
        graph: Graph,
        references: Reference[]
    }
}