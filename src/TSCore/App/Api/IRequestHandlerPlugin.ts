///<reference path="./RequestHandler.ts"/>
///<reference path="../Http/RequestOptions.ts"/>
///<reference path="../Data/Query/Query.ts"/>


module TSCore.App.Api {

    import Query = TSCore.App.Data.Query.Query;
    import RequestOptions = TSCore.App.Http.RequestOptions;

    export interface IRequestHandlerPlugin {
        execute(requestOptions: RequestOptions, query: Query<any>): RequestHandlerFeatures|RequestHandlerFeatures[]
    }
}