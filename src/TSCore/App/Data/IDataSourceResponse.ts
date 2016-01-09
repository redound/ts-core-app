module TSCore.App.Data {

    export interface IDataSourceResponse {
        data: JsonGraph,
        results: [IJsonGraphReference]
    }
}