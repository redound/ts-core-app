///<reference path="../ISerializer.ts"/>
///<reference path="../../Data/IDataSourceResponse.ts"/>

module TSCore.App.Data.Serializer {

    import ISerializer = TSCore.App.Data.ISerializer;
    import IDataSourceResponse = TSCore.App.Data.IDataSourceResponse;

    export class DefaultSerializer implements ISerializer {

        public serialize(data: any): IDataSourceResponse {

            return null;
        }
    }
}