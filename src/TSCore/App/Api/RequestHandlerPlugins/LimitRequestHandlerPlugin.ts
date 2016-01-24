///<reference path="../../Data/Query/Query.ts"/>
///<reference path="../../Http/RequestOptions.ts"/>
///<reference path="../RequestHandler.ts"/>
///<reference path="../IRequestHandlerPlugin.ts"/>


module TSCore.App.Api.RequestHandlerPlugins {

    import RequestOptions = TSCore.App.Http.RequestOptions;
    import Query = TSCore.App.Data.Query.Query;

    export class LimitRequestHandlerPlugin implements IRequestHandlerPlugin {

        public execute(requestOptions: RequestOptions, query: Query<any>): RequestHandlerFeatures|RequestHandlerFeatures[] {

            if (query.hasLimit()) {
                requestOptions.param('limit', query.getLimit());
            }

            return [RequestHandlerFeatures.LIMIT];
        }
    }
}