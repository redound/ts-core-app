var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Auth;
        (function (Auth) {
            var ManagerEvents;
            (function (ManagerEvents) {
                ManagerEvents.LOGIN_ATTEMPT_FAIL = "login-attempt-fail";
                ManagerEvents.LOGIN_ATTEMPT_SUCCESS = "login-attempt-success";
                ManagerEvents.LOGIN = "login";
                ManagerEvents.LOGOUT = "logout";
                ManagerEvents.SESSION_SET = "session-set";
                ManagerEvents.SESSION_CLEARED = "session-cleared";
            })(ManagerEvents = Auth.ManagerEvents || (Auth.ManagerEvents = {}));
            var Manager = (function () {
                function Manager($q) {
                    this.$q = $q;
                    this.events = new TSCore.Events.EventEmitter();
                    this._accountTypes = new TSCore.Data.Dictionary();
                    this._session = null;
                }
                Manager.prototype.registerAccountType = function (name, account) {
                    this._accountTypes.set(name, account);
                    return this;
                };
                Manager.prototype.getAccountTypes = function () {
                    return this._accountTypes;
                };
                Manager.prototype.getSession = function () {
                    return this._session;
                };
                Manager.prototype.setSession = function (session) {
                    this._session = session;
                    this.events.trigger(ManagerEvents.SESSION_SET, { session: this._session });
                };
                Manager.prototype.clearSession = function () {
                    var session = this._session;
                    this._session = null;
                    this.events.trigger(ManagerEvents.SESSION_CLEARED, { session: session });
                    return this;
                };
                Manager.prototype.loggedIn = function () {
                    return !!this._session;
                };
                Manager.prototype.getAccountType = function (name) {
                    return this._accountTypes.get(name);
                };
                Manager.prototype.login = function (accountTypeName, credentials) {
                    var _this = this;
                    var accountType = this._accountTypes.get(accountTypeName);
                    if (!accountType) {
                        return this.$q.reject();
                    }
                    return accountType.login(credentials).then(function (session) {
                        _this.setSession(session);
                        _this.events.trigger(TSCore.App.Auth.ManagerEvents.LOGIN_ATTEMPT_SUCCESS, {
                            credentials: credentials,
                            session: _this.getSession()
                        });
                        _this.events.trigger(TSCore.App.Auth.ManagerEvents.LOGIN, {
                            credentials: credentials,
                            session: _this.getSession()
                        });
                        return _this.getSession();
                    }).catch(function (e) {
                        _this.events.trigger(TSCore.App.Auth.ManagerEvents.LOGIN_ATTEMPT_FAIL, { credentials: credentials, session: null });
                        throw e;
                        return _this.getSession();
                    });
                };
                Manager.prototype.logout = function (accountTypeName) {
                    var _this = this;
                    var accountType = this._accountTypes.get(accountTypeName);
                    if (!accountType) {
                        return this.$q.reject();
                    }
                    if (!this.loggedIn()) {
                        return this.$q.reject();
                    }
                    return accountType.logout(this.getSession()).then(function () {
                        _this.events.trigger(ManagerEvents.LOGOUT, {
                            session: _this.getSession()
                        });
                    }).finally(function () {
                        _this.clearSession();
                    });
                };
                Manager.$inject = ['$q'];
                return Manager;
            })();
            Auth.Manager = Manager;
        })(Auth = App.Auth || (App.Auth = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Auth;
        (function (Auth) {
            var Session = (function () {
                function Session(_accountTypeName, _identity, _startTime, _expirationTime, _token) {
                    this._accountTypeName = _accountTypeName;
                    this._identity = _identity;
                    this._startTime = _startTime;
                    this._expirationTime = _expirationTime;
                    this._token = _token;
                }
                Session.prototype.setIdentity = function (identity) {
                    this._identity = identity;
                };
                Session.prototype.getIdentity = function () {
                    return this._identity;
                };
                Session.prototype.setToken = function (token) {
                    this._token = token;
                };
                Session.prototype.getToken = function () {
                    return this._token;
                };
                Session.prototype.setExpirationTime = function (time) {
                    this._expirationTime = time;
                };
                Session.prototype.getExpirationTime = function () {
                    return this._expirationTime;
                };
                Session.prototype.setStartTime = function (time) {
                    this._startTime = time;
                };
                Session.prototype.getStartTime = function () {
                    return this._startTime;
                };
                Session.prototype.setAccountTypeName = function (accountTypeName) {
                    this._accountTypeName = accountTypeName;
                };
                Session.prototype.getAccountTypeName = function () {
                    return this._accountTypeName;
                };
                Session.prototype.toJson = function () {
                    return {
                        accountTypeName: this.getAccountTypeName(),
                        identity: this.getIdentity(),
                        startTime: this.getStartTime(),
                        expirationTime: this.getExpirationTime(),
                        token: this.getToken()
                    };
                };
                Session.fromJson = function (obj) {
                    return new TSCore.App.Auth.Session(obj.accountTypeName, obj.identity, obj.startTime, obj.expirationTime, obj.token);
                };
                return Session;
            })();
            Auth.Session = Session;
        })(Auth = App.Auth || (App.Auth = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var Model = (function (_super) {
                __extends(Model, _super);
                function Model(data) {
                    _super.call(this, data);
                    this._relationKeys = new TSCore.Data.Dictionary();
                }
                Model.relations = function () {
                    return {};
                };
                Model.prototype.getRelation = function (type) {
                    var relationStoreName = this.static.relations()[type];
                    if (!relationStoreName) {
                        return null;
                    }
                    var relationKeys = this.getRelationKeys(type);
                    var relationStore = angular.element(document).injector().get(relationStoreName);
                    return relationStore.getMany(relationKeys);
                };
                Model.prototype.getRelationStored = function (type) {
                    var relationStoreName = this.static.relations()[type];
                    if (!relationStoreName) {
                        return null;
                    }
                    var relationKeys = this.getRelationKeys(type);
                    var relationStore = angular.element(document).injector().get(relationStoreName);
                    return relationStore.getManyStored(relationKeys);
                };
                Model.prototype.addRelationKey = function (type, key) {
                    var relationKeys = this._relationKeys.get(type);
                    if (!relationKeys) {
                        relationKeys = new TSCore.Data.Collection();
                        this._relationKeys.set(type, relationKeys);
                    }
                    relationKeys.add(key);
                };
                Model.prototype.addManyRelationKeys = function (type, keys) {
                    var relationKeys = this._relationKeys.get(type);
                    if (!relationKeys) {
                        relationKeys = new TSCore.Data.Collection();
                        this._relationKeys.set(type, relationKeys);
                    }
                    relationKeys.addMany(keys);
                };
                Model.prototype.removeRelationKey = function (type, key) {
                    var relationKeys = this._relationKeys.get(type);
                    if (!relationKeys) {
                        return;
                    }
                    relationKeys.remove(key);
                };
                Model.prototype.getRelationKeys = function (type) {
                    var relationKeys = this._relationKeys.get(type);
                    return relationKeys ? relationKeys.toArray() : [];
                };
                return Model;
            })(TSCore.Data.Model);
            Data.Model = Model;
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var RemoteModelStore = (function () {
                function RemoteModelStore($q, $injector, endpoint, modelClass) {
                    this.$q = $q;
                    this.$injector = $injector;
                    this.endpoint = endpoint;
                    this.modelClass = modelClass;
                    this._storeComplete = false;
                    this.store = new TSCore.Data.ModelDictionary(modelClass);
                    this._processListResponseCallback = _.bind(this._processListResponse, this);
                    this._processGetResponseCallback = _.bind(this._processGetResponse, this);
                }
                RemoteModelStore.prototype.list = function (userOptions, requestOptions, fresh) {
                    if (this._storeComplete && !fresh) {
                        return this.$q.when(this.store.values());
                    }
                    return this.endpoint.list(userOptions, requestOptions).then(this._processListResponseCallback);
                };
                RemoteModelStore.prototype.get = function (id, userOptions, requestOptions, fresh) {
                    if (this.store.contains(id) && !fresh) {
                        return this.$q.when(this.store.get(id));
                    }
                    return this.endpoint.get(id, userOptions, requestOptions).then(this._processGetResponseCallback);
                };
                RemoteModelStore.prototype.getMany = function (ids, userOptions, requestOptions, fresh) {
                    var _this = this;
                    var promises = [];
                    _.each(ids, function (id) {
                        promises.push(_this.get(id, userOptions, requestOptions, fresh));
                    });
                    return this.$q.all(promises);
                };
                RemoteModelStore.prototype.listStored = function () {
                    return this.store.values();
                };
                RemoteModelStore.prototype.getStored = function (id) {
                    return this.store.get(id);
                };
                RemoteModelStore.prototype.getManyStored = function (ids) {
                    var _this = this;
                    var results = [];
                    _.each(ids, function (id) {
                        results.push(_this.store.get(id));
                    });
                    return results;
                };
                RemoteModelStore.prototype.importOne = function (data) {
                    var createdItem = this.store.addData(data);
                    this._processRelations(createdItem, data);
                    return createdItem;
                };
                RemoteModelStore.prototype.importMany = function (data) {
                    var _this = this;
                    var createdItems = this.store.addManyData(data);
                    _.each(data, function (itemData) {
                        _this._processRelations(_this.store.get(itemData[_this.modelClass.primaryKey()]), itemData);
                    });
                    return createdItems;
                };
                RemoteModelStore.prototype._processListResponse = function (response) {
                    this._storeComplete = true;
                    return this.importMany(response.data);
                };
                RemoteModelStore.prototype._processGetResponse = function (response) {
                    return this.importOne(response.data);
                };
                RemoteModelStore.prototype._processRelations = function (itemModel, itemData) {
                    var _this = this;
                    _.each(itemModel.static.relations(), function (relationStoreName, relationName) {
                        var relationValue = itemData[relationName];
                        if (relationValue) {
                            var relationStore = _this.$injector.get(relationStoreName);
                            var relationPrimaryKey = relationStore.modelClass.primaryKey();
                            if (_.isArray(relationValue)) {
                                itemModel.addManyRelationKeys(relationName, _.pluck(relationStore.importMany(relationValue), relationPrimaryKey));
                            }
                            else if (_.isObject(relationValue)) {
                                itemModel.addRelationKey(relationName, relationStore.importOne(relationValue)[relationPrimaryKey]);
                            }
                        }
                    });
                };
                RemoteModelStore.$inject = ['$q', '$injector'];
                return RemoteModelStore;
            })();
            Data.RemoteModelStore = RemoteModelStore;
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Http;
        (function (Http) {
            Http.Method = {
                GET: "GET",
                POST: "POST",
                PUT: "PUT",
                DELETE: "DELETE"
            };
            var Api = (function () {
                function Api($http) {
                    this.$http = $http;
                    this.defaultHeaders = {};
                }
                Api.prototype.setProtocol = function (protocol) {
                    this.protocol = protocol;
                };
                Api.prototype.setHostname = function (hostname) {
                    this.hostname = hostname;
                };
                Api.prototype.setDefaultHeader = function (name, value) {
                    this.defaultHeaders[name] = value;
                };
                Api.prototype.unsetDefaultHeader = function (name) {
                    delete this.defaultHeaders[name];
                };
                Api.prototype.request = function (options, userOptions) {
                    options = _.defaults(options, userOptions);
                    options = this._parseOptions(options);
                    return this.$http(options);
                };
                Api.prototype._parseOptions = function (options) {
                    options.headers = options.headers || {};
                    _.each(this.defaultHeaders, function (value, name) {
                        options.headers[name] = value;
                    });
                    options.url = this._buildUrl(options.url);
                    options.url = this._interpolateUrl(options.url, options.urlParams || {});
                    return options;
                };
                Api.prototype._buildUrl = function (relativeUrl) {
                    return this.protocol + this.hostname + relativeUrl;
                };
                Api.prototype._interpolateUrl = function (url, params) {
                    var _this = this;
                    params = (params || {});
                    url = url.replace(/(\(\s*|\s*\)|\s*\|\s*)/g, "");
                    url = url.replace(/:([a-z]\w*)/gi, function ($0, label) {
                        return (_this._popFirstKey(params, label) || "");
                    });
                    url = url.replace(/(^|[^:])[\/]{2,}/g, "$1/");
                    url = url.replace(/\/+$/i, "");
                    return url;
                };
                Api.prototype._popFirstKey = function (source, key) {
                    if (source.hasOwnProperty(key)) {
                        return this._popKey(source, key);
                    }
                };
                Api.prototype._popKey = function (object, key) {
                    var value = object[key];
                    delete (object[key]);
                    return (value);
                };
                return Api;
            })();
            Http.Api = Api;
        })(Http = App.Http || (App.Http = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Http;
        (function (Http) {
            var ApiEndpoint = (function () {
                function ApiEndpoint(apiService) {
                    this.apiService = apiService;
                    this.extractSingleCallback = _.bind(this.extractSingle, this);
                    this.extractMultipleCallback = _.bind(this.extractMultiple, this);
                }
                ApiEndpoint.prototype.request = function (method, path, urlParams, options, extraOptions) {
                    return this.apiService.request({
                        method: method,
                        url: '/' + this.path + path,
                        urlParams: urlParams
                    }, _.defaults(options || {}, extraOptions || {}));
                };
                ApiEndpoint.prototype.getRequest = function (path, urlParams, options, extraOptions) {
                    return this.request(Http.Method.GET, path, urlParams, options, extraOptions);
                };
                ApiEndpoint.prototype.postRequest = function (path, urlParams, data, options, extraOptions) {
                    return this.request(Http.Method.POST, path, urlParams, _.defaults(options, { data: data }), extraOptions);
                };
                ApiEndpoint.prototype.putRequest = function (path, urlParams, data, options, extraOptions) {
                    return this.request(Http.Method.PUT, path, urlParams, _.defaults(options, { data: data }), extraOptions);
                };
                ApiEndpoint.prototype.deleteRequest = function (path, urlParams, options, extraOptions) {
                    return this.request(Http.Method.DELETE, path, urlParams, options, extraOptions);
                };
                ApiEndpoint.prototype.list = function (userOptions, requestOptions) {
                    return this.getRequest('/', {}, requestOptions).then(this.extractMultipleCallback);
                };
                ApiEndpoint.prototype.get = function (id, userOptions, requestOptions) {
                    return this.getRequest('/:id', { id: id }, requestOptions).then(this.extractSingleCallback);
                };
                ApiEndpoint.prototype.save = function (id, data, userOptions, requestOptions) {
                    return this.putRequest('/:id', { id: id }, data, requestOptions).then(this.extractSingleCallback);
                };
                ApiEndpoint.prototype.create = function (data, userOptions, requestOptions) {
                    return this.postRequest('/', {}, data, requestOptions).then(this.extractSingleCallback);
                };
                ApiEndpoint.prototype.delete = function (id, userOptions, options) {
                    return this.deleteRequest('/:id', { id: id }, options).then(this.extractSingleCallback);
                };
                ApiEndpoint.prototype.extractMultiple = function (response) {
                    return {
                        response: response,
                        fullData: response.data,
                        data: _.map(response.data[this.multipleProperty], this.transformResponse)
                    };
                };
                ApiEndpoint.prototype.extractSingle = function (response) {
                    return {
                        response: response,
                        fullData: response.data,
                        data: this.transformResponse(response.data[this.singleProperty])
                    };
                };
                ApiEndpoint.prototype.transformResponse = function (item) {
                    return item;
                };
                ApiEndpoint.$inject = ['apiService'];
                return ApiEndpoint;
            })();
            Http.ApiEndpoint = ApiEndpoint;
        })(Http = App.Http || (App.Http = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Interceptors;
        (function (Interceptors) {
            var HttpInterceptorEvents;
            (function (HttpInterceptorEvents) {
                HttpInterceptorEvents.REQUEST = 'httpRequest';
                HttpInterceptorEvents.REQUEST_ERROR = 'httpRequestError';
                HttpInterceptorEvents.RESPONSE = 'httpResponse';
                HttpInterceptorEvents.RESPONSE_ERROR = 'httpResponseError';
                HttpInterceptorEvents.RESPONSE_500_ERRORS = 'httpResponse500Errors';
                HttpInterceptorEvents.RESPONSE_401_ERROR = 'httpResponseError404';
            })(HttpInterceptorEvents = Interceptors.HttpInterceptorEvents || (Interceptors.HttpInterceptorEvents = {}));
            var HttpInterceptor = (function () {
                function HttpInterceptor($q) {
                    var _this = this;
                    this.$q = $q;
                    this.events = new TSCore.Events.EventEmitter();
                    this.request = function (config) {
                        _this.events.trigger(HttpInterceptorEvents.REQUEST, { config: config });
                        return config;
                    };
                    this.requestError = function (rejection) {
                        _this.events.trigger(HttpInterceptorEvents.REQUEST_ERROR, { rejection: rejection });
                        return _this.$q.reject(rejection);
                    };
                    this.response = function (response) {
                        _this.events.trigger(HttpInterceptorEvents.RESPONSE, { response: response });
                        return response;
                    };
                    this.responseError = function (rejection) {
                        _this.events.trigger(HttpInterceptorEvents.RESPONSE_ERROR, { rejection: rejection });
                        if (rejection.status === 0 || String(rejection.status).charAt(0) === '5') {
                            _this.events.trigger(HttpInterceptorEvents.RESPONSE_500_ERRORS, { rejection: rejection });
                        }
                        if (rejection.status === 401) {
                            _this.events.trigger(HttpInterceptorEvents.RESPONSE_401_ERROR, { rejection: rejection });
                        }
                        return _this.$q.reject(rejection);
                    };
                }
                HttpInterceptor.$inject = ['$q'];
                return HttpInterceptor;
            })();
            Interceptors.HttpInterceptor = HttpInterceptor;
        })(Interceptors = App.Interceptors || (App.Interceptors = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Interceptors;
        (function (Interceptors) {
            var UIRouterEvents;
            (function (UIRouterEvents) {
                UIRouterEvents.STATE_CHANGE_START = '$stateChangeStart';
                UIRouterEvents.STATE_CHANGE_SUCCESS = '$stateChangeSuccess';
                UIRouterEvents.STATE_CHANGE_ERROR = '$stateChangeError';
                UIRouterEvents.STATE_NOT_FOUND = '$stateNotFound';
            })(UIRouterEvents || (UIRouterEvents = {}));
            var StateAccessLevels;
            (function (StateAccessLevels) {
                StateAccessLevels.PUBLIC = 'public';
                StateAccessLevels.UNAUTHORIZED = 'unauthorized';
                StateAccessLevels.AUTHORIZED = 'authorized';
            })(StateAccessLevels = Interceptors.StateAccessLevels || (Interceptors.StateAccessLevels = {}));
            var StateInterceptorEvents;
            (function (StateInterceptorEvents) {
                StateInterceptorEvents.FIRST_ROUTE = 'firstRoute';
                StateInterceptorEvents.STATE_CHANGE_START = 'stateChangeStart';
                StateInterceptorEvents.ENTERING_AUTHORIZED_AREA = 'enteringAuthorizedArea';
                StateInterceptorEvents.ENTERING_UNAUTHORIZED_AREA = 'enteringUnauthorizedArea';
                StateInterceptorEvents.ENTERING_PUBLIC_AREA = 'enteringPublicArea';
            })(StateInterceptorEvents = Interceptors.StateInterceptorEvents || (Interceptors.StateInterceptorEvents = {}));
            var StateInterceptor = (function () {
                function StateInterceptor($rootScope) {
                    this.$rootScope = $rootScope;
                    this.events = new TSCore.Events.EventEmitter();
                    this._firstRoute = null;
                    this._lastRoute = null;
                }
                StateInterceptor.prototype.init = function () {
                    this._attachRouterEvents();
                };
                StateInterceptor.prototype._attachRouterEvents = function () {
                    this.$rootScope.$on(UIRouterEvents.STATE_CHANGE_START, _.bind(this._$stateChangeStart, this));
                };
                StateInterceptor.prototype._$stateChangeStart = function (event, toState, toParams, fromState, fromParams) {
                    var params = {
                        event: event,
                        toState: toState,
                        toParams: toParams,
                        fromState: fromState,
                        fromParams: fromParams
                    };
                    if (!fromState || fromState.accessLevel !== toState.accessLevel) {
                        var eventName;
                        switch (toState.accessLevel) {
                            case StateAccessLevels.AUTHORIZED:
                                eventName = StateInterceptorEvents.ENTERING_AUTHORIZED_AREA;
                                break;
                            case StateAccessLevels.PUBLIC:
                                eventName = StateInterceptorEvents.ENTERING_PUBLIC_AREA;
                                break;
                            default:
                            case StateAccessLevels.UNAUTHORIZED:
                                eventName = StateInterceptorEvents.ENTERING_UNAUTHORIZED_AREA;
                                break;
                        }
                        this.events.trigger(eventName, params);
                    }
                    this._lastRoute = {
                        toState: toState,
                        toParams: toParams
                    };
                    if (!this._firstRoute) {
                        this._firstRoute = this._lastRoute;
                        this.events.trigger(StateInterceptorEvents.FIRST_ROUTE, params);
                    }
                    this.events.trigger(StateInterceptorEvents.STATE_CHANGE_START, params);
                };
                StateInterceptor.prototype.getFirstRoute = function () {
                    return this._firstRoute;
                };
                StateInterceptor.$inject = ['$rootScope'];
                return StateInterceptor;
            })();
            Interceptors.StateInterceptor = StateInterceptor;
        })(Interceptors = App.Interceptors || (App.Interceptors = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var System;
        (function (System) {
            var Bootstrap = (function () {
                function Bootstrap() {
                }
                Bootstrap.prototype.createModule = function () {
                    return angular.module('app', []);
                };
                Bootstrap.prototype.getValues = function () {
                    return [];
                };
                Bootstrap.prototype.getConfigs = function () {
                    return [];
                };
                Bootstrap.prototype.getServices = function () {
                    return [];
                };
                Bootstrap.prototype.getFactories = function () {
                    return [];
                };
                Bootstrap.prototype.getControllers = function () {
                    return [];
                };
                Bootstrap.prototype.getDirectives = function () {
                    return [];
                };
                Bootstrap.prototype.getRuns = function () {
                    return [];
                };
                Bootstrap.prototype.run = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                };
                Bootstrap.prototype.start = function (moduleName) {
                    var _this = this;
                    this._module = this.createModule();
                    var values = this.getValues();
                    _.each(values, function (value, name) {
                        _this._module.value(name, value);
                    });
                    var configs = this.getConfigs();
                    _.each(configs, function (value) {
                        _this._module.config(value);
                    });
                    var services = this.getServices();
                    _.each(services, function (value, name) {
                        _this._module.service(name, value);
                    });
                    var factories = this.getFactories();
                    _.each(factories, function (value, name) {
                        _this._module.factory(name, value);
                    });
                    var controllers = this.getControllers();
                    _.each(controllers, function (value, name) {
                        _this._module.controller(name, value);
                    });
                    var directives = this.getDirectives();
                    _.each(directives, function (value, name) {
                        var dependencies = value.$inject || [];
                        var self = _this;
                        var block = function () {
                            return new (Function.prototype.bind.apply(value, self._parseArgs(arguments)));
                        };
                        var directive = dependencies.concat([block]);
                        _this._module.directive(name, directive);
                    });
                    var runs = this.getRuns();
                    _.each(runs, function (value) {
                        _this._module.run(value);
                    });
                    if (this.run) {
                        var runConfig = this.$runInject || [];
                        runConfig.push(_.bind(this.run, this));
                        this._module.run(runConfig);
                    }
                    for (var method in this) {
                        if (TSCore.Utils.Text.startsWith(method, "_init") && _.isFunction(method)) {
                            this[method]();
                        }
                    }
                    angular.element(document).ready(function () {
                        angular.bootstrap(document, [moduleName]);
                    });
                    return this._module;
                };
                Bootstrap.prototype._parseArgs = function (args) {
                    var parsed = [null];
                    for (var key in args) {
                        parsed.push(args[key]);
                    }
                    return parsed;
                };
                Bootstrap.prototype.getModule = function () {
                    return this._module;
                };
                return Bootstrap;
            })();
            System.Bootstrap = Bootstrap;
        })(System = App.System || (App.System = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
/// <reference path="../node_modules/ts-core/build/ts-core.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="TSCore/App/App.ts" />
/// <reference path="TSCore/App/Auth/AccountType.ts" />
/// <reference path="TSCore/App/Auth/Manager.ts" />
/// <reference path="TSCore/App/Auth/Session.ts" />
/// <reference path="TSCore/App/Data/Model.ts" />
/// <reference path="TSCore/App/Data/RemoteModelStore.ts" />
/// <reference path="TSCore/App/Http/Api.ts" />
/// <reference path="TSCore/App/Http/ApiEndpoint.ts" />
/// <reference path="TSCore/App/Interceptors/HttpInterceptor.ts" />
/// <reference path="TSCore/App/Interceptors/StateInterceptor.ts" />
/// <reference path="TSCore/App/System/Bootstrap.ts" />
//# sourceMappingURL=ts-core-app.js.map