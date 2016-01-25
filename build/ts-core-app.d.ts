/// <reference path="../../ts-core/build/ts-core.d.ts" />
declare module TSCore.App.Http {
    class RequestOptions {
        protected _headers: ng.IHttpRequestConfigHeaders;
        protected _method: string;
        protected _url: string;
        protected _data: {};
        protected _options: {};
        protected _params: {};
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
        param(name: string, value?: any): RequestOptions;
        getParams(): any;
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
        setData(data: any): void;
        getData(): any;
        get(path?: any[], callback?: any): any;
        setValue(): void;
        getValue(path?: any[]): any;
        getGraphForPath(path: any[]): Graph;
        getGraphForReferences(references: Reference[]): Graph;
        _getValueForPath(path: any): any;
        protected _optimizePath(path?: any[]): any[];
        set(path: any[], value: any): Graph;
        unset(path: any[]): Graph;
        hasItem(resourceName: string, resourceId: any): boolean;
        setItem(resourceName: string, resourceId: any, resource: any): void;
        getItem(resourceName: string, resourceId: any): any;
        setItems(resourceName: string, items: any): void;
        getItems(resourceName: string): any;
        countItems(resourceName: string): number;
        removeItems(resourceName: string): void;
        removeItem(resourceName: string, resourceId: number): void;
        getReferences(resourceName: string): Reference[];
        merge(graph: Graph): void;
        mergeData(data: any): void;
        protected _isReference(value: any): boolean;
        protected _extractReferences(data: any, callback: any): void;
        protected _resolveValueRecursive(parentKey: any, key: any, value: any, callback?: any): any;
        protected _isResourceName(resourceName: string): boolean;
    }
}
declare module TSCore.App.Data {
    import Reference = TSCore.App.Data.Graph.Reference;
    import Graph = TSCore.App.Data.Graph.Graph;
    interface IDataSourceResponseMeta {
        total?: number;
    }
    interface IDataSourceResponse {
        meta: IDataSourceResponseMeta;
        graph: Graph;
        references: Reference[];
    }
}
declare module TSCore.App.Data {
    import Query = TSCore.App.Data.Query.Query;
    import IDataSourceResponse = TSCore.App.Data.IDataSourceResponse;
    interface IDataSource {
        setDataService(dataService: Service): any;
        getDataService(): Service;
        execute(query: Query<any>): ng.IPromise<IDataSourceResponse>;
        create(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>;
        update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>;
        remove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>;
        notifyExecute(query: Query<any>, response: IDataSourceResponse): ng.IPromise<void>;
        notifyCreate(response: IDataSourceResponse): ng.IPromise<void>;
        notifyUpdate(response: IDataSourceResponse): ng.IPromise<void>;
        notifyRemove(response: IDataSourceResponse): ng.IPromise<void>;
        clear(): ng.IPromise<any>;
    }
}
declare module TSCore.App.Data.Query {
    class Condition {
        protected _type: TSCore.App.Data.Query.Condition.Type;
        protected _field: string;
        protected _operator: TSCore.App.Data.Query.Condition.Operator;
        protected _value: any;
        constructor(type: TSCore.App.Data.Query.Condition.Type, field: string, operator: TSCore.App.Data.Query.Condition.Operator, value: any);
        getType(): TSCore.App.Data.Query.Condition.Type;
        getField(): string;
        getOperator(): TSCore.App.Data.Query.Condition.Operator;
        getValue(): any;
    }
    module Condition {
        enum Type {
            AND = 0,
            OR = 1,
        }
        enum Operator {
            IS_EQUAL = 0,
            IS_GREATER_THAN = 1,
            IS_GREATER_THAN_OR_EQUAL = 2,
            IS_IN = 3,
            IS_LESS_THAN = 4,
            IS_LESS_THAN_OR_EQUAL = 5,
            IS_LIKE = 6,
            IS_NOT_EQUAL = 7,
        }
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
    class Query<T> {
        protected _from: string;
        protected _offset: number;
        protected _limit: number;
        protected _fields: string[];
        protected _conditions: Condition[];
        protected _sorters: Sorter[];
        protected _includes: string[];
        protected _find: any;
        protected _executor: IQueryExecutor;
        constructor(executor?: IQueryExecutor);
        executor(executor: IQueryExecutor): Query<T>;
        getExecutor(): IQueryExecutor;
        hasExecutor(): boolean;
        from(from: string): Query<T>;
        getFrom(): string;
        hasFrom(): boolean;
        field(field: string): Query<T>;
        addManyFields(fields: string[]): Query<T>;
        getFields(): string[];
        hasFields(): boolean;
        offset(offset: number): Query<T>;
        getOffset(): number;
        hasOffset(): boolean;
        limit(limit: number): Query<T>;
        getLimit(): number;
        hasLimit(): boolean;
        condition(condition: Condition): Query<T>;
        addManyConditions(conditions: Condition[]): Query<T>;
        getConditions(): Condition[];
        hasConditions(): boolean;
        sorter(sorter: Sorter): Query<T>;
        addManySorters(sorters: Sorter[]): Query<T>;
        getSorters(): Sorter[];
        hasSorters(): boolean;
        include(include: string): Query<T>;
        addManyIncludes(includes: string[]): Query<T>;
        getIncludes(): string[];
        hasIncludes(): boolean;
        find(id: any): Query<T>;
        getFind(): any;
        hasFind(): boolean;
        execute(): ng.IPromise<IDataServiceResponse<T>>;
        merge(query: Query<T>): Query<T>;
        serialize(opts: string[]): string;
        static from(from: any): Query<{}>;
    }
}
declare module TSCore.App.Data.Query {
    interface IQueryExecutor {
        execute(query: Query<any>): ng.IPromise<any>;
    }
}
declare module TSCore.App.Api {
    import Query = TSCore.App.Data.Query.Query;
    import IQueryExecutor = TSCore.App.Data.Query.IQueryExecutor;
    class Service implements IQueryExecutor {
        protected $q: any;
        constructor($q: any);
        protected _resources: TSCore.Data.Dictionary<string, IResource>;
        setResources(resources: TSCore.Data.Dictionary<string, IResource>): Service;
        resource(name: string, resource: IResource): Service;
        getResource(name: string): IResource;
        getResourceAsync(name: string): ng.IPromise<IResource>;
        getRequestHandler(resourceName: string): RequestHandler;
        getRequestHandlerAsync(resourceName: string): ng.IPromise<RequestHandler>;
        execute(query: Query<any>): ng.IPromise<any>;
        all(resourceName: string): ng.IPromise<any>;
        find(resourceName: string, resourceId: number): ng.IPromise<any>;
        create(resourceName: string, data: any): ng.IPromise<any>;
        update(resourceName: string, resourceId: any, data: any): ng.IPromise<any>;
        remove(resourceName: string, resourceId: any): ng.IPromise<any>;
    }
}
declare module TSCore.App.Api {
    import Query = TSCore.App.Data.Query.Query;
    import IQueryExecutor = TSCore.App.Data.Query.IQueryExecutor;
    import RequestOptions = TSCore.App.Http.RequestOptions;
    import List = TSCore.Data.List;
    enum RequestHandlerFeatures {
        OFFSET = 0,
        LIMIT = 1,
        FIELDS = 2,
        CONDITIONS = 3,
        SORTERS = 4,
        INCLUDES = 5,
    }
    class RequestHandler implements IQueryExecutor {
        protected $q: ng.IQService;
        protected httpService: TSCore.App.Http.Service;
        _apiService: Service;
        _resourceName: string;
        _resource: IResource;
        _plugins: List<IRequestHandlerPlugin>;
        constructor($q: ng.IQService, httpService: TSCore.App.Http.Service);
        setApiService(apiService: Service): void;
        getApiService(): Service;
        setResourceName(name: string): void;
        getResourceName(): string;
        setResource(resource: IResource): void;
        getResource(): IResource;
        plugin(plugin: IRequestHandlerPlugin): RequestHandler;
        request(requestOptions: RequestOptions): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
        execute(query: Query<any>): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
        protected _getUsedFeatures(query: Query<any>): RequestHandlerFeatures[];
        all(): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
        find(id: number): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
        create(data: {}): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
        update(id: number, data: {}): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
        remove(id: number): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
    }
}
declare module TSCore.App.Api {
    import Query = TSCore.App.Data.Query.Query;
    import RequestOptions = TSCore.App.Http.RequestOptions;
    interface IRequestHandlerPlugin {
        execute(requestOptions: RequestOptions, query: Query<any>): RequestHandlerFeatures | RequestHandlerFeatures[];
    }
}
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
declare module TSCore.App.Api.RequestHandlerPlugins {
    import RequestOptions = TSCore.App.Http.RequestOptions;
    import Query = TSCore.App.Data.Query.Query;
    class LimitRequestHandlerPlugin implements IRequestHandlerPlugin {
        execute(requestOptions: RequestOptions, query: Query<any>): RequestHandlerFeatures | RequestHandlerFeatures[];
    }
}
declare module TSCore.App.Api.RequestHandlerPlugins {
    import RequestOptions = TSCore.App.Http.RequestOptions;
    import Query = TSCore.App.Data.Query.Query;
    class OffsetRequestHandlerPlugin implements IRequestHandlerPlugin {
        execute(requestOptions: RequestOptions, query: Query<any>): RequestHandlerFeatures | RequestHandlerFeatures[];
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
        deactivate(): void;
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
    import ModelList = TSCore.Data.ModelList;
    import Query = TSCore.App.Data.Query.Query;
    import IDataSource = TSCore.App.Data.IDataSource;
    import IDataSourceResponse = TSCore.App.Data.IDataSourceResponse;
    import Model = TSCore.Data.Model;
    import IQueryExecutor = TSCore.App.Data.Query.IQueryExecutor;
    interface IDataSourceExecutionResult {
        response: IDataSourceResponse;
        source: IDataSource;
    }
    interface IDataServiceResponse<T> {
        response: IDataSourceResponse;
        data: T;
    }
    class Service implements IQueryExecutor {
        protected $q: ng.IQService;
        protected _sources: List<IDataSource>;
        protected _resources: TSCore.Data.Dictionary<string, IResource>;
        protected _resourceDelegateCache: TSCore.Data.Dictionary<string, ResourceDelegate<Model>>;
        constructor($q: ng.IQService);
        source(source: IDataSource): Service;
        getSources(): List<IDataSource>;
        setResources(resources: TSCore.Data.Dictionary<string, IResource>): Service;
        resource(name: string, resource: IResource): Service;
        getResources(): TSCore.Data.Dictionary<string, IResource>;
        getResource(name: string): IResource;
        getResourceAsync(name: string): ng.IPromise<Resource>;
        getResourceDelegate<T extends Model>(resourceName: string): ResourceDelegate<T>;
        query(resourceName: string): Query<ModelList<any>>;
        all(resourceName: string): ng.IPromise<IDataServiceResponse<ModelList<any>>>;
        find(resourceName: string, resourceId: any): ng.IPromise<IDataServiceResponse<any>>;
        execute(query: Query<ModelList<any>>): ng.IPromise<IDataServiceResponse<ModelList<any>>>;
        protected _createModels(response: IDataSourceResponse): ModelList<any>;
        create(resourceName: string, data: any): ng.IPromise<IDataServiceResponse<any>>;
        createModel(resourceName: string, model: any, data?: any): ng.IPromise<IDataServiceResponse<any>>;
        protected _executeCreate(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>;
        update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataServiceResponse<Model>>;
        updateModel(resourceName: string, model: any, data?: any): ng.IPromise<void>;
        protected _executeUpdate(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>;
        remove(resourceName: string, resourceId: any): ng.IPromise<void>;
        removeModel(resourceName: string, model: Model): ng.IPromise<void>;
        protected _executeRemove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>;
        protected _notifySources(startIndex: number, executor: (source: IDataSource) => ng.IPromise<any>): ng.IPromise<any>;
        protected _executeSources(executor: (source: IDataSource) => ng.IPromise<any>): ng.IPromise<IDataSourceExecutionResult>;
        protected static _updateModel(model: any, data: any): any;
        protected static _removeModel(model: any): any;
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
    import Reference = TSCore.App.Data.Graph.Reference;
    import IQueryExecutor = TSCore.App.Data.Query.IQueryExecutor;
    import Graph = TSCore.App.Data.Graph.Graph;
    class ApiDataSource implements IDataSource, IQueryExecutor {
        protected $q: ng.IQService;
        protected apiService: TSCore.App.Api.Service;
        protected logger: TSCore.Logger.Logger;
        protected _dataService: DataService;
        protected _resourceAliasMap: TSCore.Data.Dictionary<string, string>;
        constructor($q: ng.IQService, apiService: TSCore.App.Api.Service, logger?: TSCore.Logger.Logger);
        setDataService(service: DataService): void;
        getDataService(): DataService;
        execute(query: Query<any>): ng.IPromise<IDataSourceResponse>;
        create(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>;
        update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>;
        remove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>;
        notifyExecute(query: Query<any>, response: IDataSourceResponse): ng.IPromise<void>;
        notifyCreate(response: IDataSourceResponse): ng.IPromise<void>;
        notifyUpdate(response: IDataSourceResponse): ng.IPromise<void>;
        notifyRemove(response: IDataSourceResponse): ng.IPromise<void>;
        clear(): ng.IPromise<any>;
        protected _transformResponse(resourceName: string, response: any): ng.IPromise<{
            meta: any;
            graph: Graph;
            references: Reference[];
        }>;
        protected _createDataSourceResponse(resourceName: any, resource: any, response: any): {
            meta: any;
            graph: Graph;
            references: Reference[];
        };
        protected _createGraph(data: any): Graph;
        protected _extractResource(results: any, callback: any): void;
        protected _getResourcesAliasMap(): TSCore.Data.Dictionary<string, string>;
    }
}
declare module TSCore.App.Data.DataSources {
    import IDataSource = TSCore.App.Data.IDataSource;
    import Query = TSCore.App.Data.Query.Query;
    import DataService = TSCore.App.Data.Service;
    import Graph = TSCore.App.Data.Graph.Graph;
    import Reference = TSCore.App.Data.Graph.Reference;
    import DynamicList = TSCore.Data.DynamicList;
    interface IQueryResult {
        query: Query<any>;
        references: DynamicList<Reference>;
        meta: {};
    }
    enum ResourceFlag {
        DATA_COMPLETE = 0,
    }
    class MemoryDataSource implements IDataSource {
        protected $q: ng.IQService;
        protected logger: any;
        static QUERY_SERIALIZE_FIELDS: string[];
        protected _dataService: DataService;
        protected _graph: Graph;
        protected _queryResultMap: TSCore.Data.Dictionary<string, IQueryResult>;
        protected _resourceFlags: TSCore.Data.Dictionary<string, TSCore.Data.Collection<ResourceFlag>>;
        constructor($q: ng.IQService, logger?: any);
        setDataService(service: DataService): void;
        getDataService(): DataService;
        execute(query: Query<any>): ng.IPromise<IDataSourceResponse>;
        create(resourceName: string, data: any): ng.IPromise<IDataSourceResponse>;
        update(resourceName: string, resourceId: any, data: any): ng.IPromise<IDataSourceResponse>;
        remove(resourceName: string, resourceId: any): ng.IPromise<IDataSourceResponse>;
        notifyExecute(query: Query<any>, response: IDataSourceResponse): ng.IPromise<void>;
        protected _resourceHasFlag(resourceName: string, flag: ResourceFlag): boolean;
        protected _setResourceFlag(resourceName: string, flag: ResourceFlag): void;
        notifyCreate(response: IDataSourceResponse): ng.IPromise<void>;
        notifyUpdate(response: IDataSourceResponse): ng.IPromise<void>;
        notifyRemove(response: IDataSourceResponse): ng.IPromise<void>;
        clear(): ng.IPromise<any>;
    }
}
declare module TSCore.App.Data {
    interface IResource {
        getModel(): TSCore.Data.IModel;
        getTransformer(): Transformer;
        getSingleKey(): string;
        getMultipleKey(): string;
    }
}
declare module TSCore.App.Data {
    import Model = TSCore.Data.Model;
    import Query = TSCore.App.Data.Query.Query;
    import ModelList = TSCore.Data.ModelList;
    class ResourceDelegate<T extends Model> {
        protected _dataService: Service;
        protected _resourceName: string;
        constructor(dataService: Service, resourceName: string);
        query(): Query<ModelList<T>>;
        all(): ng.IPromise<IDataServiceResponse<ModelList<T>>>;
        find(resourceId: any): ng.IPromise<IDataServiceResponse<T>>;
        create(data: any): ng.IPromise<IDataServiceResponse<T>>;
        createModel(model: T, data?: any): ng.IPromise<IDataServiceResponse<T>>;
        update(resourceId: any, data: any): ng.IPromise<IDataServiceResponse<T>>;
        updateModel(model: T, data?: any): ng.IPromise<void>;
        remove(resourceId: any): ng.IPromise<void>;
        removeModel(model: Model): ng.IPromise<void>;
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
