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
declare module TSCore.App.Data {
    enum ModelRelationType {
        ONE = 0,
        MANY = 1,
    }
    interface IModelInterface extends TSCore.Data.IModelInterface {
    }
    interface IModelRelationsInterface {
        [name: string]: IModelRelationConfigInterface;
    }
    interface IModelRelationConfigInterface {
        store: string;
        type: ModelRelationType;
        localKey?: string;
        foreignKey?: string;
        dataKey?: string;
    }
    class Model extends TSCore.Data.Model {
        static relations(): IModelRelationsInterface;
        toObject(includeRelations?: boolean): {};
    }
}
declare module TSCore.App.Data {
    interface IModelQueryOptions {
        include?: IModelQueryOptionRelation[];
    }
    interface IModelQueryOptionRelation {
        relation: string;
        queryOptions?: IModelQueryOptions;
    }
    class RemoteModelStore<T extends Model> {
        protected $q: ng.IQService;
        protected $injector: any;
        endpoint: TSCore.App.Http.ApiEndpoint;
        modelClass: any;
        static $inject: string[];
        store: TSCore.Data.ModelDictionary<any, T>;
        protected _loadedRequestConfigs: TSCore.Data.Collection<string>;
        protected _pendingRequests: TSCore.Data.Dictionary<string, ng.IPromise<any>>;
        constructor($q: ng.IQService, $injector: any, endpoint: TSCore.App.Http.ApiEndpoint, modelClass: any);
        list(queryOptions?: IModelQueryOptions, requestOptions?: TSCore.App.Http.IApiRequest, fresh?: boolean): ng.IPromise<T[]>;
        get(id: any, queryOptions?: IModelQueryOptions, requestOptions?: {}, fresh?: boolean): ng.IPromise<T>;
        create(model: T, requestOptions?: {}): ng.IPromise<T>;
        update(model: T, requestOptions?: {}): ng.IPromise<T>;
        queryCached(id: any, queryOptions: any): boolean;
        getMany(ids: any[], userOptions?: any, requestOptions?: {}, fresh?: boolean): ng.IPromise<T[]>;
        listStored(): T[];
        getStored(id: any): T;
        getManyStored(ids: any[]): T[];
        importOne(itemData: any): T;
        importMany(data: any[]): T[];
        protected _processListResponse(response: TSCore.App.Http.IApiEndpointResponse, queryOptions?: IModelQueryOptions): ng.IPromise<T[]>;
        protected _processGetResponse(response: TSCore.App.Http.IApiEndpointResponse, queryOptions?: IModelQueryOptions): ng.IPromise<T>;
        protected _composeModel(itemModel: T, queryOptions?: IModelQueryOptions): ng.IPromise<any>;
        protected _extractRelationData(itemData: any): void;
    }
}
declare module TSCore.App.Http {
    interface IApiRequest {
        method?: string;
        url?: string;
        headers?: {};
        data?: {};
        urlParams?: {};
    }
    var Method: {
        GET: string;
        POST: string;
        PUT: string;
        DELETE: string;
    };
    class Api {
        protected $http: ng.IHttpService;
        protocol: string;
        hostname: string;
        defaultHeaders: any;
        constructor($http: ng.IHttpService);
        setProtocol(protocol: string): void;
        setHostname(hostname: string): void;
        setDefaultHeader(name: any, value: any): void;
        unsetDefaultHeader(name: any): void;
        request(options: IApiRequest, userOptions: IApiRequest): ng.IHttpPromise<any>;
        private _parseOptions(options);
        buildUrl(relativeUrl: string): string;
        private _interpolateUrl(url, params);
        private _popFirstKey(source, key);
        private _popKey(object, key);
    }
}
declare module TSCore.App.Http {
    interface IApiEndpointResponse {
        response: ng.IHttpPromiseCallbackArg<{}>;
        fullData: {};
        data: any;
    }
    class ApiEndpoint {
        protected apiService: TSCore.App.Http.Api;
        static $inject: string[];
        path: string;
        singleProperty: string;
        multipleProperty: string;
        protected extractSingleCallback: any;
        protected extractMultipleCallback: any;
        constructor(apiService: TSCore.App.Http.Api);
        request(method: string, path: string, urlParams: {}, options?: IApiRequest, extraOptions?: IApiRequest): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
        getRequest(path: string, urlParams: {}, options?: IApiRequest, extraOptions?: IApiRequest): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
        postRequest(path: string, urlParams: {}, data: {}, options?: IApiRequest, extraOptions?: IApiRequest): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
        putRequest(path: string, urlParams: {}, data: {}, options?: IApiRequest, extraOptions?: IApiRequest): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
        deleteRequest(path: string, urlParams: {}, options?: IApiRequest, extraOptions?: IApiRequest): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
        list(userOptions?: any, requestOptions?: IApiRequest): ng.IPromise<IApiEndpointResponse>;
        get(id: number, userOptions?: any, requestOptions?: IApiRequest): ng.IPromise<IApiEndpointResponse>;
        update(id: number, data: {}, userOptions?: any, requestOptions?: IApiRequest): ng.IPromise<IApiEndpointResponse>;
        create(data: {}, userOptions?: any, requestOptions?: IApiRequest): ng.IPromise<IApiEndpointResponse>;
        delete(id: number, userOptions?: any, options?: IApiRequest): ng.IPromise<IApiEndpointResponse>;
        extractMultiple(response: ng.IHttpPromiseCallbackArg<{}>): IApiEndpointResponse;
        extractSingle(response: ng.IHttpPromiseCallbackArg<{}>): IApiEndpointResponse;
        transformResponse(item: any): any;
        transformRequest(item: any): any;
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
declare module TSCore.App.System {
    class Bootstrap {
        protected _module: ng.IModule;
        protected createModule(): ng.IModule;
        protected getValues(): {} | any[];
        protected getConfigs(): any[];
        protected getServices(): {} | any[];
        protected getFactories(): {} | any[];
        protected getFilters(): {} | any[];
        protected getControllers(): {} | any[];
        protected getDirectives(): {} | any[];
        protected getRuns(): any[];
        protected $runInject: string[];
        protected run(...args: any[]): void;
        start(moduleName: string): ng.IModule;
        protected _parseArgs(args: any): any[];
        getModule(): ng.IModule;
    }
}
