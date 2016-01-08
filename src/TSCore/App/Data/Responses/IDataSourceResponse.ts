module TSCore.App.Data.Responses {

    export interface IDataSourceResponse {
        data: JsonGraph,
        results: [IJsonGraphReference]
    }
}