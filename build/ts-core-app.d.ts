/// <reference path="../../ts-core/build/ts-core.d.ts" />
declare module TSCore.App.Http {
    class RequestOptions {
        protected _headers: ng.IHttpRequestConfigHeaders;
        protected _method: string;
        protected _url: string;
        protected _data: {};
        protected _options: {};
        header(name: any, value: any): RequestOptions;
        removeHeader(name: any): RequestOptions;
        getHeaders(): ng.IHttpRequestConfigHeaders;
        method(method: string): RequestOptions;
        getMethod(): string;
        url(url: string, params?: {}): RequestOptions;
        private _interpolateUrl(url, params?);
        private _popFirstKey(source, key);
        private _popKey(object, key);
        getUrl(): string;
        data(data: {}): RequestOptions;
        getData(): {};
        option(name: string, value?: any): RequestOptions;
        getOptions(): {};
        getRequestConfig(): ng.IRequestConfig;
        static factory(): RequestOptions;
        static get(url?: string, urlParams?: {}): RequestOptions;
        static post(url?: string, urlParams?: {}, data?: {}): RequestOptions;
        static put(url?: string, urlParams?: {}, data?: {}): RequestOptions;
        static delete(url?: string, urlParams?: {}): RequestOptions;
    }
}
declare module TSCore.App.Api {
    import Query = TSCore.App.Data.Query.Query;
    import RequestOptions = TSCore.App.Http.RequestOptions;
    class Resource {
        protected httpService: TSCore.App.Http.Service;
        protected _prefix: string;
        protected _singleKey: string;
        protected _multipleKey: string;
        protected _transformer: any;
        constructor(httpService: TSCore.App.Http.Service);
        prefix(prefix: string): Resource;
        getPrefix(): string;
        singleKey(singleKey: string): Resource;
        getSingleKey(): string;
        multipleKey(multipleKey: string): Resource;
        getMultipleKey(): string;
        transformer(transformer: any): Resource;
        getTransformer(): any;
        request(requestOptions: RequestOptions): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
        query(query: Query): ng.IPromise<any>;
        all(): ng.IPromise<any>;
        find(id: number): ng.IPromise<any>;
        create(data: {}): ng.IPromise<any>;
        update(id: number, data: {}): ng.IPromise<any>;
        remove(id: number): ng.IPromise<any>;
        protected _transformQuery(response: ng.IHttpPromiseCallbackArg<{}>): any;
        protected _transformAll(response: ng.IHttpPromiseCallbackArg<{}>): any;
        protected _transformFind(response: ng.IHttpPromiseCallbackArg<{}>): any;
        protected _transformCreate(response: ng.IHttpPromiseCallbackArg<{}>): any;
        protected _transformUpdate(response: ng.IHttpPromiseCallbackArg<{}>): any;
        protected _transformRemove(response: ng.IHttpPromiseCallbackArg<{}>): any;
        protected _transformMultiple(response: ng.IHttpPromiseCallbackArg<{}>): any;
        protected _transformSingle(response: ng.IHttpPromiseCallbackArg<{}>): any;
    }
}
declare module TSCore.App.Api {
    import Query = TSCore.App.Data.Query.Query;
    import IDataSource = TSCore.App.Data.IDataSource;
    import IDataSourceResponse = TSCore.App.Data.IDataSourceResponse;
    import Resource = TSCore.App.Api.Resource;
    class Service implements IDataSource {
        protected _queryTransformer: any;
        protected _resources: TSCore.Data.Dictionary<string, Resource>;
        queryTransformer(transformer: any): Service;
        getQueryTransformer(): any;
        resource(name: string, resource: Resource): Service;
        execute(query: Query): ng.IPromise<IDataSourceResponse>;
        protected _transformQuery(response: any): IDataSourceResponse;
        create(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>;
        update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>;
        remove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>;
        clear(): ng.IPromise<any>;
        importResponse(response: IDataSourceResponse): void;
    }
}
declare module TSCore.App {
}
declare module TSCore.App.Auth {
    interface AccountType {
        login(data: any): ng.IPromise<Session>;
        authenticate(identity: any): ng.IPromise<void>;
        logout(session: any): ng.IPromise<void>;
    }
}
declare module TSCore.App.Auth {
    module ManagerEvents {
        const LOGIN_ATTEMPT_FAIL: string;
        const LOGIN_ATTEMPT_SUCCESS: string;
        const LOGIN: string;
        const LOGOUT: string;
        const SESSION_SET: string;
        const SESSION_CLEARED: string;
    }
    class Manager {
        protected $q: ng.IQService;
        events: TSCore.Events.EventEmitter;
        protected _accountTypes: TSCore.Data.Dictionary<any, AccountType>;
        protected _session: Session;
        static $inject: string[];
        constructor($q: ng.IQService);
        registerAccountType(name: any, account: AccountType): Manager;
        getAccountTypes(): TSCore.Data.Dictionary<any, AccountType>;
        getSession(): Session;
        setSession(session: Session): void;
        clearSession(): Manager;
        loggedIn(): boolean;
        getAccountType(name: any): AccountType;
        login(accountTypeName: any, credentials: {}): ng.IPromise<Session>;
        logout(accountTypeName: any): ng.IPromise<void>;
    }
}
declare module TSCore.App.Auth {
    class Session {
        protected _accountTypeName: string;
        protected _identity: number;
        protected _startTime: number;
        protected _expirationTime: number;
        protected _token: string;
        constructor(_accountTypeName: string, _identity: number, _startTime: number, _expirationTime: number, _token: string);
        setIdentity(identity: any): void;
        getIdentity(): number;
        setToken(token: any): void;
        getToken(): string;
        setExpirationTime(time: any): void;
        getExpirationTime(): number;
        setStartTime(time: any): void;
        getStartTime(): number;
        setAccountTypeName(accountTypeName: any): void;
        getAccountTypeName(): string;
        toJson(): {
            accountTypeName: string;
            identity: number;
            startTime: number;
            expirationTime: number;
            token: string;
        };
        static fromJson(obj: any): Session;
    }
}
declare module TSCore.App.Constants.HttpMethods {
    const GET: string;
    const POST: string;
    const PUT: string;
    const DELETE: string;
}
declare module TSCore.App.Data {
    import Query = TSCore.App.Data.Query.Query;
    import IDataSourceResponse = TSCore.App.Data.IDataSourceResponse;
    interface IDataSource {
        execute(query: Query): ng.IPromise<IDataSourceResponse>;
        create(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>;
        update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>;
        remove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>;
        clear(): ng.IPromise<any>;
        importResponse(response: IDataSourceResponse): any;
    }
}
declare module TSCore.App.Data {
    interface IDataSourceResponse {
        data: JsonGraph;
        results: [IJsonGraphReference];
    }
}
declare module TSCore.App.Data {
    interface IJsonGraphReference {
        $type: string;
        value: any;
    }
    class JsonGraph {
        protected _data: any;
        constructor(data?: any);
        get(path: any): any;
        protected pointerHasValue(value: any): boolean;
        protected resolvePointerValueRecursive(value: any): any;
        protected resolvePointerValue(value: any): any;
    }
}
declare module TSCore.App.Data.Model {
    enum ActiveModelFlag {
        ALIVE = 0,
        CREATED = 1,
        REMOVED = 2,
    }
    class ActiveModel extends TSCore.App.Data.Model.Model {
        protected _flags: TSCore.Data.Collection<ActiveModelFlag>;
        protected _dataService: TSCore.App.Data.Service;
        protected _resourceName: string;
        protected _savedData: any;
        makeAlive(dataService: TSCore.App.Data.Service, resourceName: string): void;
        die(): void;
        setSavedData(data: any): void;
        markRemoved(): void;
        update(data?: any): ng.IPromise<void>;
        create(dataService: TSCore.App.Data.Service, resourceName: string, data?: any): ng.IPromise<any>;
        remove(): ng.IPromise<void>;
        refresh(): ng.IPromise<boolean>;
        isAlive(): boolean;
        isCreated(): boolean;
        isRemoved(): boolean;
        isDirty(): boolean;
        getResourceIdentifier(): string;
    }
}
declare module TSCore.App.Data.Model {
    class Model extends TSCore.Data.Model {
        toObject(includeRelations?: boolean): {};
    }
}
declare module TSCore.App.Data.Query {
    enum ConditionTypes {
        AND = 0,
        OR = 1,
    }
    enum ConditionOperators {
        IS_EQUAL = 0,
        IS_GREATER_THAN = 1,
        IS_GREATER_THAN_OR_EQUAL = 2,
        IS_IN = 3,
        IS_LESS_THAN = 4,
        IS_LESS_THAN_OR_EQUAL = 5,
        IS_LIKE = 6,
        IS_NOT_EQUAL = 7,
    }
    class Condition {
        protected _type: ConditionTypes;
        protected _field: string;
        protected _operator: ConditionOperators;
        protected _value: any;
        constructor(type: ConditionTypes, field: string, operator: ConditionOperators, value: any);
        getType(): ConditionTypes;
        getField(): string;
        getOperator(): ConditionOperators;
        getValue(): any;
    }
}
declare module TSCore.App.Data.Query {
    import Condition = TSCore.App.Data.Query.Condition;
    import Sorter = TSCore.App.Data.Query.Sorter;
    class Query {
        protected _from: string;
        protected _offset: number;
        protected _limit: number;
        protected _fields: string[];
        protected _conditions: Condition[];
        protected _sorters: Sorter[];
        protected _find: any;
        from(from: string): Query;
        getFrom(): string;
        hasFrom(): boolean;
        field(field: string): Query;
        addManyFields(fields: string[]): Query;
        getFields(): string[];
        hasFields(): boolean;
        offset(offset: number): Query;
        getOffset(): number;
        hasOffset(): boolean;
        limit(limit: number): Query;
        getLimit(): number;
        hasLimit(): boolean;
        condition(condition: Condition): Query;
        addManyConditions(conditions: Condition[]): Query;
        getConditions(): Condition[];
        hasConditions(): boolean;
        sorter(sorter: Sorter): Query;
        addManySorters(sorters: Sorter[]): Query;
        getSorters(): Sorter[];
        hasSorters(): boolean;
        find(id: any): Query;
        getFind(): any;
        hasFind(): boolean;
        merge(query: Query): Query;
        static from(from: any): Query;
    }
}
declare module TSCore.App.Data.Query {
    enum SortDirections {
        ASCENDING = 0,
        DESCENDING = 1,
    }
    class Sorter {
        protected _field: string;
        protected _direction: SortDirections;
        constructor(field: string, direction: SortDirections);
        getField(): string;
        getDirection(): SortDirections;
    }
}
declare module TSCore.App.Data {
    import List = TSCore.Data.List;
    import Model = TSCore.App.Data.Model.Model;
    import Query = TSCore.App.Data.Query.Query;
    import IDataSource = TSCore.App.Data.IDataSource;
    import IDataSourceResponse = TSCore.App.Data.IDataSourceResponse;
    class Service {
        protected $q: ng.IQService;
        protected _sources: List<IDataSource>;
        static $inject: string[];
        constructor($q: ng.IQService);
        source(source: IDataSource): Service;
        getSources(): List<IDataSource>;
        create(resourceName: string, data: any): ng.IPromise<Model>;
        createModel(resourceName: string, model: Model, data?: any): ng.IPromise<any>;
        update(resourceName: string, resourceId: any, data: any): ng.IPromise<Model>;
        updateModel(resourceName: string, model: Model, data?: any): ng.IPromise<void>;
        remove(resourceName: string, resourceId: any): ng.IPromise<void>;
        removeModel(resourceName: string, model: Model): ng.IPromise<void>;
        query(resourceName: string): Query;
        all(resourceName: string): ng.IPromise<List<Model>>;
        find(resourceName: string, resourceId: any): ng.IPromise<Model>;
        execute(query: Query): ng.IPromise<List<Model>>;
        protected _executeQuery(query: Query): ng.IPromise<IDataSourceResponse>;
        protected _executeCreate(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>;
        protected _executeUpdate(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>;
        protected _executeRemove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>;
        protected _executeInSources(executor: (source: IDataSource) => ng.IPromise<any>): ng.IPromise<any>;
        protected _createModels(data: IDataSourceResponse): List<Model>;
        protected _updateModel(model: Model, data: IDataSourceResponse): void;
        protected _removeModel(model: any): void;
    }
}
declare module TSCore.Data.Transform {
    class Transformer extends TSCore.BaseObject {
        availableIncludes: any[];
        transform(item: any): void;
        collection(data: any): void[];
        item(data: any): void;
        protected _ucFirst(string: any): any;
        static collection(data: any): void[];
        static item(data: any): void;
    }
}
declare module TSCore.App.Data.Transformers {
    class JsonGraphTransformer {
        protected _aliases: TSCore.Data.Dictionary<string, string>;
        resource(key: string, aliases: string[]): JsonGraphTransformer;
        transform(data: any): JsonGraph;
    }
}
declare module TSCore.App.Http {
    import RequestOptions = TSCore.App.Http.RequestOptions;
    class Service {
        protected $http: ng.IHttpService;
        protocol: string;
        hostname: string;
        defaultHeaders: any;
        constructor($http: ng.IHttpService);
        setProtocol(protocol: string): void;
        setHostname(hostname: string): void;
        setDefaultHeader(name: any, value: any): void;
        unsetDefaultHeader(name: any): void;
        request(requestOptions: RequestOptions): ng.IHttpPromise<any>;
        private _applyDefaults(requestOptions);
    }
}
declare module TSCore.App.Interceptors {
    module HttpInterceptorEvents {
        const REQUEST: string;
        const REQUEST_ERROR: string;
        const RESPONSE: string;
        const RESPONSE_ERROR: string;
        const RESPONSE_500_ERRORS: string;
        const RESPONSE_401_ERROR: string;
        interface IErrorParams {
            rejection: any;
        }
        interface IRequestParams {
            config: any;
        }
        interface IResponseParams {
            response: any;
        }
        interface IRequestErrorParams extends IErrorParams {
        }
        interface IResponseErrorParams extends IErrorParams {
        }
        interface IResponse500ErrorsParams extends IErrorParams {
        }
        interface IResponseError401 extends IErrorParams {
        }
    }
    class HttpInterceptor {
        protected $q: any;
        static $inject: string[];
        events: TSCore.Events.EventEmitter;
        constructor($q: any);
        request: (config: any) => any;
        requestError: (rejection: any) => any;
        response: (response: any) => any;
        responseError: (rejection: any) => any;
    }
}
declare module TSCore.App.Interceptors {
    module StateAccessLevels {
        const PUBLIC: string;
        const UNAUTHORIZED: string;
        const AUTHORIZED: string;
    }
    module StateInterceptorEvents {
        const FIRST_ROUTE: string;
        const STATE_CHANGE_START: string;
        const ENTERING_AUTHORIZED_AREA: string;
        const ENTERING_UNAUTHORIZED_AREA: string;
        const ENTERING_PUBLIC_AREA: string;
        interface IStateChangeEventParams {
            event: any;
            toState: any;
            toParams: any;
            fromState: any;
            fromParams: any;
        }
    }
    class StateInterceptor {
        protected $rootScope: ng.IRootScopeService;
        static $inject: string[];
        events: TSCore.Events.EventEmitter;
        private _firstRoute;
        private _lastRoute;
        constructor($rootScope: ng.IRootScopeService);
        init(): void;
        private _attachRouterEvents();
        private _$stateChangeStart(event, toState, toParams, fromState, fromParams);
        getFirstRoute(): any;
    }
}
