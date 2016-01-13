/// <reference path="../../ts-core/build/ts-core.d.ts" />
declare module TSCore.App.Data {
    interface ITransformer {
        new (): Transformer;
        item(data: any): any;
        collection(data: any): any;
    }
    class Transformer extends TSCore.BaseObject {
        availableIncludes: any[];
        transform(item: any): void;
        collection(data: any): void[];
        item(data: any): void;
        static collection(data: any): void[];
        static item(data: any): void;
    }
}
declare module TSCore.App.Api {
    import Transformer = TSCore.App.Data.Transformer;
    interface IResource {
        getPrefix(): string;
        getTransformer(): Transformer;
        getSingleKey(): string;
        getMultipleKey(): string;
        getRequestHandler(): RequestHandler;
    }
}
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
declare module TSCore.App.Data.Graph {
    class Reference {
        $type: string;
        value: any[];
        constructor(resourceName: string, resourceId: any);
    }
}
declare module TSCore.App.Data.Graph {
    class Graph {
        protected _data: any;
        constructor(data?: any);
        clear(): void;
        get(path?: any[], callback?: any): any;
        protected _optimizePath(path?: any[]): any[];
        set(path: any[], value: any): Graph;
        setItem(resourceName: string, resourceId: any, resource: any): void;
        getItem(resourceName: string, resourceId: any): any;
        setItems(resourceName: string, items: any): void;
        getItems(resourceName: string): any;
        merge(graph: Graph): void;
        mergeData(data: any): void;
        protected _isReference(value: any): boolean;
        protected _resolveValueRecursive(parentKey: any, key: any, value: any, callback?: any): any;
        protected _isResourceName(resourceName: string): boolean;
    }
}
declare module TSCore.App.Data {
    import Reference = TSCore.App.Data.Graph.Reference;
    import Graph = TSCore.App.Data.Graph.Graph;
    interface IDataSourceResponse {
        data: Graph;
        results: Reference[];
    }
}
declare module TSCore.App.Data {
    import Query = TSCore.App.Data.Query.Query;
    import IDataSourceResponse = TSCore.App.Data.IDataSourceResponse;
    interface IDataSource {
        setDataService(dataService: Service): any;
        getDataService(): Service;
        execute(query: Query): ng.IPromise<IDataSourceResponse>;
        create(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>;
        update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>;
        remove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>;
        clear(): ng.IPromise<any>;
        importResponse(response: IDataSourceResponse): any;
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
declare module TSCore.App.Api {
    import RequestOptions = TSCore.App.Http.RequestOptions;
    import Query = TSCore.App.Data.Query.Query;
    class RequestHandler {
        protected httpService: TSCore.App.Http.Service;
        _resource: IResource;
        constructor(httpService: TSCore.App.Http.Service);
        setResource(resource: IResource): void;
        getResource(): IResource;
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
    class Service {
        protected $q: any;
        constructor($q: any);
        protected _resources: TSCore.Data.Dictionary<string, IResource>;
        manyResources(resources: TSCore.Data.Dictionary<string, IResource>): Service;
        resource(name: string, resource: IResource): Service;
        protected _registerRequestHandler(name: any, resource: any): void;
        getResourceAsync(name: string): ng.IPromise<IResource>;
        protected _getRequestHandler(resourceName: string): ng.IPromise<RequestHandler>;
        execute(query: Query): ng.IPromise<any>;
        all(resourceName: string): ng.IPromise<any>;
        find(resourceName: string, resourceId: number): ng.IPromise<any>;
        create(resourceName: string, data: any): ng.IPromise<any>;
        update(resourceName: string, resourceId: any, data: any): ng.IPromise<any>;
        remove(resourceName: string, resourceId: any): ng.IPromise<any>;
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
declare module TSCore.App.Data.Model {
    import Model = TSCore.Data.Model;
    enum ActiveModelFlag {
        ACTIVATED = 0,
        CREATED = 1,
        REMOVED = 2,
    }
    class ActiveModel extends Model {
        protected _flags: TSCore.Data.Collection<ActiveModelFlag>;
        protected _dataService: TSCore.App.Data.Service;
        protected _resourceName: string;
        protected _savedData: any;
        activate(dataService: TSCore.App.Data.Service, resourceName: string): void;
        die(): void;
        setSavedData(data: any): void;
        markRemoved(): void;
        update(data?: any): ng.IPromise<void>;
        create(dataService: TSCore.App.Data.Service, resourceName: string, data?: any): ng.IPromise<any>;
        remove(): ng.IPromise<void>;
        refresh(): ng.IPromise<boolean>;
        isActivated(): boolean;
        isCreated(): boolean;
        isRemoved(): boolean;
        isDirty(): boolean;
        getResourceIdentifier(): string;
    }
}
declare module TSCore.App.Data {
    import List = TSCore.Data.List;
    import Query = TSCore.App.Data.Query.Query;
    import IDataSource = TSCore.App.Data.IDataSource;
    import IDataSourceResponse = TSCore.App.Data.IDataSourceResponse;
    import Model = TSCore.Data.Model;
    class Service {
        protected $q: ng.IQService;
        protected _sources: List<IDataSource>;
        protected _resources: TSCore.Data.Dictionary<string, IResource>;
        constructor($q: ng.IQService);
        source(source: IDataSource): Service;
        getSources(): List<IDataSource>;
        manyResources(resources: TSCore.Data.Dictionary<string, IResource>): Service;
        resource(name: string, resource: IResource): Service;
        getResources(): TSCore.Data.Dictionary<string, IResource>;
        getResource(name: string): IResource;
        getResourceAsync(name: string): ng.IPromise<Resource>;
        query(resourceName: string): Query;
        all(resourceName: string): ng.IPromise<any>;
        find(resourceName: string, resourceId: any): ng.IPromise<Model>;
        protected _executeQuery(query: Query): ng.IPromise<IDataSourceResponse>;
        protected _createModels(response: IDataSourceResponse): Model[];
        protected _buildModels(response: IDataSourceResponse): Model[];
        execute(query: Query): ng.IPromise<any>;
        protected _executeInSources(executor: (source: IDataSource) => ng.IPromise<any>): ng.IPromise<any>;
        create(resourceName: string, data: any): ng.IPromise<any>;
        createModel(resourceName: string, model: Model, data?: any): ng.IPromise<any>;
        protected _executeCreate(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>;
        update(resourceName: string, resourceId: any, data: any): ng.IPromise<any>;
        protected _executeUpdate(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>;
        updateModel(resourceName: string, model: Model, data?: any): ng.IPromise<void>;
        protected _updateModel(model: Model, data: IDataSourceResponse): void;
        remove(resourceName: string, resourceId: any): ng.IPromise<void>;
        removeModel(resourceName: string, model: Model): ng.IPromise<void>;
        protected _executeRemove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>;
        protected _removeModel(model: any): void;
    }
}
declare module TSCore.App.Data.Graph {
    class Builder {
        protected _resourceForResourceNameCallback: any;
        protected _resourceNameForAliasCallback: any;
        resourceForResourceName(callback: any): void;
        resourceNameForAlias(callback: any): void;
        build(data: any, rootResourceName?: any): Graph;
        protected _findResourcesRecursive(alias: any, data: any, callback: any): void;
        protected _findResources(data: any, callback: any): void;
    }
}
declare module TSCore.App.Data.DataSources {
    import IDataSource = TSCore.App.Data.IDataSource;
    import Query = TSCore.App.Data.Query.Query;
    import DataService = TSCore.App.Data.Service;
    class ApiDataSource implements IDataSource {
        protected $q: ng.IQService;
        protected apiService: TSCore.App.Api.Service;
        protected _dataService: DataService;
        protected _resourceAliasMap: TSCore.Data.Dictionary<string, string>;
        constructor($q: ng.IQService, apiService: TSCore.App.Api.Service);
        setDataService(service: DataService): void;
        getDataService(): DataService;
        execute(query: Query): ng.IPromise<IDataSourceResponse>;
        create(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>;
        update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>;
        remove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>;
        clear(): ng.IPromise<any>;
        importResponse(response: IDataSourceResponse): void;
        protected _transformResponse(resourceName: string, response: any): ng.IPromise<{
            data: Graph.Graph;
            results: any;
        }>;
        protected _createDataSourceResponse(resourceName: any, resource: any, response: any): {
            data: Graph.Graph;
            results: any;
        };
        protected _resourceForResourceName(name: string): IResource;
        protected _resourceNameForAlias(key: string): string;
        protected _getResourcesAliasMap(): TSCore.Data.Dictionary<string, string>;
    }
}
declare module TSCore.App.Data.DataSources {
    import IDataSource = TSCore.App.Data.IDataSource;
    import Query = TSCore.App.Data.Query.Query;
    import DataService = TSCore.App.Data.Service;
    class MemoryDataSource implements IDataSource {
        protected _dataService: DataService;
        setDataService(service: DataService): void;
        getDataService(): DataService;
        execute(query: Query): ng.IPromise<IDataSourceResponse>;
        create(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>;
        update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>;
        remove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>;
        clear(): ng.IPromise<any>;
        importResponse(response: IDataSourceResponse): void;
    }
}
declare module TSCore.App.Data {
    interface IResource {
        getModel(): TSCore.Data.IModel;
        getSingleKey(): string;
        getMultipleKey(): string;
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
declare module TSCore.App {
    import RequestHandler = TSCore.App.Api.RequestHandler;
    import ITransformer = TSCore.App.Data.ITransformer;
    import IModel = TSCore.Data.IModel;
    class Resource {
        protected _prefix: string;
        protected _singleKey: string;
        protected _multipleKey: string;
        protected _model: IModel;
        protected _requestHandler: RequestHandler;
        protected _transformer: ITransformer;
        protected _queryTransformer: any;
        prefix(prefix: string): Resource;
        getPrefix(): string;
        singleKey(singleKey: string): Resource;
        getSingleKey(): string;
        multipleKey(multipleKey: string): Resource;
        getMultipleKey(): string;
        requestHandler(handler: RequestHandler): Resource;
        getRequestHandler(): RequestHandler;
        model(model: IModel): Resource;
        getModel(): IModel;
        transformer(transformer: ITransformer): Resource;
        getTransformer(): ITransformer;
    }
}
