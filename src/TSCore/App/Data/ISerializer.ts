///<reference path="../Data/IDataSourceResponse.ts"/>

module TSCore.App.Data {

    import IDataSourceResponse = TSCore.App.Data.IDataSourceResponse;

    export interface ISerializer {

        serialize(data: any): IDataSourceResponse;
    }
}