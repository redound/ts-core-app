///<reference path="../../Data/Query/Query.ts"/>
///<reference path="../../Http/RequestOptions.ts"/>
///<reference path="../RequestHandler.ts"/>


module TSCore.App.Api.RequestHandlerPlugins {

    import RequestOptions = TSCore.App.Http.RequestOptions;
    import Query = TSCore.App.Data.Query.Query;

    export class OffsetRequestHandlerPlugin implements IRequestHandlerPlugin {

        public execute(requestOptions: RequestOptions, query: Query<any>): RequestHandlerFeatures|RequestHandlerFeatures[] {

            if (query.hasOffset()) {
                requestOptions.param('offset', query.getOffset());
            }

            return [RequestHandlerFeatures.OFFSET];
        }
    }
}