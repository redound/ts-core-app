var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Http;
        (function (Http) {
            var RequestOptions = (function () {
                function RequestOptions() {
                }
                RequestOptions.prototype.header = function (name, value) {
                    this._headers = this._headers || {};
                    this._headers[name] = value;
                    return this;
                };
                RequestOptions.prototype.removeHeader = function (name) {
                    delete this._headers[name];
                    return this;
                };
                RequestOptions.prototype.getHeaders = function () {
                    return this._headers;
                };
                RequestOptions.prototype.method = function (method) {
                    this._method = method;
                    return this;
                };
                RequestOptions.prototype.getMethod = function () {
                    return this._method;
                };
                RequestOptions.prototype.url = function (url, params) {
                    this._url = this._interpolateUrl(url, params);
                    return this;
                };
                RequestOptions.prototype._interpolateUrl = function (url, params) {
                    var _this = this;
                    if (params === void 0) { params = {}; }
                    params = (params || {});
                    url = url.replace(/(\(\s*|\s*\)|\s*\|\s*)/g, "");
                    url = url.replace(/:([a-z]\w*)/gi, function ($0, label) {
                        return (_this._popFirstKey(params, label) || "");
                    });
                    url = url.replace(/(^|[^:])[\/]{2,}/g, "$1/");
                    url = url.replace(/\/+$/i, "");
                    return url;
                };
                RequestOptions.prototype._popFirstKey = function (source, key) {
                    if (source.hasOwnProperty(key)) {
                        return this._popKey(source, key);
                    }
                };
                RequestOptions.prototype._popKey = function (object, key) {
                    var value = object[key];
                    delete (object[key]);
                    return (value);
                };
                RequestOptions.prototype.getUrl = function () {
                    return this._url;
                };
                RequestOptions.prototype.data = function (data) {
                    this._data = data;
                    return this;
                };
                RequestOptions.prototype.getData = function () {
                    return this._data;
                };
                RequestOptions.prototype.option = function (name, value) {
                    this._options = this._options || {};
                    this._options[name] = value;
                    return this;
                };
                RequestOptions.prototype.getOptions = function () {
                    return this._options;
                };
                RequestOptions.prototype.getRequestConfig = function () {
                    return _.extend({
                        headers: this.getHeaders(),
                        method: this.getMethod(),
                        url: this.getUrl(),
                        data: this.getData()
                    }, this.getOptions());
                };
                RequestOptions.factory = function () {
                    return new RequestOptions;
                };
                RequestOptions.get = function (url, urlParams) {
                    var request = new RequestOptions;
                    request.method(TSCore.App.Constants.HttpMethods.GET);
                    request.url(url, urlParams);
                    return request;
                };
                RequestOptions.post = function (url, urlParams, data) {
                    var request = new RequestOptions;
                    request.method(TSCore.App.Constants.HttpMethods.POST);
                    request.url(url, urlParams);
                    request.data(data);
                    return request;
                };
                RequestOptions.put = function (url, urlParams, data) {
                    var request = new RequestOptions;
                    request.method(TSCore.App.Constants.HttpMethods.PUT);
                    request.url(url, urlParams);
                    request.data(data);
                    return request;
                };
                RequestOptions.delete = function (url, urlParams) {
                    var request = new RequestOptions;
                    request.method(TSCore.App.Constants.HttpMethods.DELETE);
                    request.url(url, urlParams);
                    return request;
                };
                return RequestOptions;
            })();
            Http.RequestOptions = RequestOptions;
        })(Http = App.Http || (App.Http = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
/// <reference path="../Http/RequestOptions.ts" />
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Api;
        (function (Api) {
            var RequestOptions = TSCore.App.Http.RequestOptions;
            var Resource = (function () {
                function Resource(httpService) {
                    this.httpService = httpService;
                }
                Resource.prototype.prefix = function (prefix) {
                    this._prefix = prefix;
                    return this;
                };
                Resource.prototype.getPrefix = function () {
                    return this._prefix;
                };
                Resource.prototype.singleKey = function (singleKey) {
                    this._singleKey = singleKey;
                    return this;
                };
                Resource.prototype.getSingleKey = function () {
                    return this._singleKey;
                };
                Resource.prototype.multipleKey = function (multipleKey) {
                    this._multipleKey = multipleKey;
                    return this;
                };
                Resource.prototype.getMultipleKey = function () {
                    return this._multipleKey;
                };
                Resource.prototype.transformer = function (transformer) {
                    this._transformer = transformer;
                    return this;
                };
                Resource.prototype.getTransformer = function () {
                    return this._transformer;
                };
                Resource.prototype.request = function (requestOptions) {
                    var relativeUrl = requestOptions.getUrl();
                    requestOptions.url(this.getPrefix() + relativeUrl);
                    return this.httpService.request(requestOptions);
                };
                Resource.prototype.query = function (query) {
                    var _this = this;
                    return this.request(RequestOptions
                        .get('/')).then(function (response) { return _this._transformQuery(response); });
                };
                Resource.prototype.all = function () {
                    var _this = this;
                    return this.request(RequestOptions
                        .get('/')).then(function (response) { return _this._transformAll(response); });
                };
                Resource.prototype.find = function (id) {
                    var _this = this;
                    return this.request(RequestOptions
                        .get('/:id', { id: id })).then(function (response) { return _this._transformFind(response); });
                };
                Resource.prototype.create = function (data) {
                    var _this = this;
                    return this.request(RequestOptions
                        .post('/')
                        .data(data)).then(function (response) { return _this._transformCreate(response); });
                };
                Resource.prototype.update = function (id, data) {
                    var _this = this;
                    return this.request(RequestOptions
                        .put('/:id', { id: id })
                        .data(data)).then(function (response) { return _this._transformUpdate(response); });
                };
                Resource.prototype.remove = function (id) {
                    var _this = this;
                    return this.request(RequestOptions
                        .delete('/:id', { id: id })).then(function (response) { return _this._transformRemove(response); });
                };
                Resource.prototype._transformQuery = function (response) {
                    return this._transformMultiple(response);
                };
                Resource.prototype._transformAll = function (response) {
                    return this._transformMultiple(response);
                };
                Resource.prototype._transformFind = function (response) {
                    return this._transformSingle(response);
                };
                Resource.prototype._transformCreate = function (response) {
                    return this._transformSingle(response);
                };
                Resource.prototype._transformUpdate = function (response) {
                    return this._transformSingle(response);
                };
                Resource.prototype._transformRemove = function (response) {
                    return response;
                };
                Resource.prototype._transformMultiple = function (response) {
                    return this._transformer.collection(response.data[this._multipleKey]);
                };
                Resource.prototype._transformSingle = function (response) {
                    return this._transformer.item(response.data[this._singleKey]);
                };
                return Resource;
            })();
            Api.Resource = Resource;
        })(Api = App.Api || (App.Api = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Api;
        (function (Api) {
            var JsonGraphTransformer = TSCore.App.Data.Transformers.JsonGraphTransformer;
            var Service = (function () {
                function Service() {
                    this._resources = new TSCore.Data.Dictionary();
                }
                Service.prototype.queryTransformer = function (transformer) {
                    this._queryTransformer = transformer;
                    return this;
                };
                Service.prototype.getQueryTransformer = function () {
                    return this._queryTransformer;
                };
                Service.prototype.resource = function (name, resource) {
                    this[name] = resource;
                    this._resources.set(name, resource);
                    return this;
                };
                Service.prototype.execute = function (query) {
                    var _this = this;
                    var resource = this._resources.get(query.getFrom());
                    if (resource) {
                        return resource
                            .query(query)
                            .then(function (response) { return _this._transformQuery(response); });
                    }
                };
                Service.prototype._transformQuery = function (response) {
                    var jsonGraphTransformer = new JsonGraphTransformer;
                    this._resources.each(function (key, value) {
                        jsonGraphTransformer.resource(key, [value.getSingleKey(), value.getMultipleKey()]);
                    });
                    var graph = jsonGraphTransformer.transform(response);
                    console.log('graph', graph);
                    return null;
                };
                Service.prototype.create = function (resourceName, data) {
                    return null;
                };
                Service.prototype.update = function (resourceName, resourceId, data) {
                    return null;
                };
                Service.prototype.remove = function (resourceName, resourceId) {
                    return null;
                };
                Service.prototype.clear = function () {
                    return null;
                };
                Service.prototype.importResponse = function (response) {
                };
                return Service;
            })();
            Api.Service = Service;
        })(Api = App.Api || (App.Api = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
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
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Constants;
        (function (Constants) {
            var HttpMethods;
            (function (HttpMethods) {
                HttpMethods.GET = 'GET';
                HttpMethods.POST = 'POST';
                HttpMethods.PUT = 'PUT';
                HttpMethods.DELETE = 'DELETE';
            })(HttpMethods = Constants.HttpMethods || (Constants.HttpMethods = {}));
        })(Constants = App.Constants || (App.Constants = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var JsonGraph = (function () {
                function JsonGraph(data) {
                    this._data = data || {};
                }
                JsonGraph.prototype.get = function (path) {
                    var _this = this;
                    path = path || [];
                    var depth = 0;
                    var pointer = this._data;
                    _.each(path, function (identifier) {
                        if (_this.pointerHasValue(pointer[identifier])) {
                            pointer = _this.resolvePointerValue(pointer[identifier]);
                        }
                        depth++;
                    });
                    if (depth === 1) {
                        pointer = _.values(pointer);
                    }
                    return this.resolvePointerValueRecursive(pointer);
                };
                JsonGraph.prototype.pointerHasValue = function (value) {
                    return value !== undefined;
                };
                JsonGraph.prototype.resolvePointerValueRecursive = function (value) {
                    //alert('resolvePointerValueRecursive ' + JSON.stringify(value));
                    var _this = this;
                    value = this.resolvePointerValue(value);
                    if (_.isArray(value)) {
                        value = _.map(value, function (item) {
                            return _this.resolvePointerValueRecursive(item);
                        });
                    }
                    else if (_.isObject(value)) {
                        value = _.mapObject(value, function (item) {
                            return _this.resolvePointerValueRecursive(item);
                        });
                    }
                    return value;
                };
                JsonGraph.prototype.resolvePointerValue = function (value) {
                    if (value && value.$type && value.$type == "ref") {
                        value = this.get(value.value);
                    }
                    return value;
                };
                return JsonGraph;
            })();
            Data.JsonGraph = JsonGraph;
        })(Data = App.Data || (App.Data = {}));
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
            var Model;
            (function (Model) {
                var Exception = TSCore.Exception.Exception;
                (function (ActiveModelFlag) {
                    ActiveModelFlag[ActiveModelFlag["ALIVE"] = 0] = "ALIVE";
                    ActiveModelFlag[ActiveModelFlag["CREATED"] = 1] = "CREATED";
                    ActiveModelFlag[ActiveModelFlag["REMOVED"] = 2] = "REMOVED";
                })(Model.ActiveModelFlag || (Model.ActiveModelFlag = {}));
                var ActiveModelFlag = Model.ActiveModelFlag;
                var ActiveModel = (function (_super) {
                    __extends(ActiveModel, _super);
                    function ActiveModel() {
                        _super.apply(this, arguments);
                        this._flags = new TSCore.Data.Collection();
                    }
                    ActiveModel.prototype.makeAlive = function (dataService, resourceName) {
                        this._dataService = dataService;
                        this._resourceName = resourceName;
                        this._flags.addMany([ActiveModelFlag.ALIVE, ActiveModelFlag.CREATED]);
                    };
                    ActiveModel.prototype.die = function () {
                        this._dataService = null;
                        this._resourceName = null;
                        this._flags.removeMany([ActiveModelFlag.ALIVE]);
                    };
                    ActiveModel.prototype.setSavedData = function (data) {
                        this._savedData = data;
                    };
                    ActiveModel.prototype.markRemoved = function () {
                        this._flags.add(ActiveModelFlag.REMOVED);
                    };
                    ActiveModel.prototype.update = function (data) {
                        if (!this.isAlive()) {
                            throw new Exception('Unable to update ' + this.getResourceIdentifier() + ', model is not alive');
                        }
                        return this._dataService.updateModel(this._resourceName, this, data);
                    };
                    ActiveModel.prototype.create = function (dataService, resourceName, data) {
                        return dataService.createModel(resourceName, this, data);
                    };
                    ActiveModel.prototype.remove = function () {
                        if (!this.isAlive()) {
                            throw new Exception('Unable to remove ' + this.getResourceIdentifier() + ', model is not alive');
                        }
                        return this._dataService.removeModel(this._resourceName, this);
                    };
                    ActiveModel.prototype.refresh = function () {
                        var _this = this;
                        if (!this.isAlive()) {
                            throw new Exception('Unable to refresh ' + this.getResourceIdentifier() + ', model is not alive');
                        }
                        return this._dataService.find(this._resourceName, this.getId()).then(function (result) {
                            if (!_this.equals(result)) {
                                _this.merge(result);
                                return true;
                            }
                            return false;
                        });
                    };
                    ActiveModel.prototype.isAlive = function () {
                        return this._flags.contains(ActiveModelFlag.ALIVE);
                    };
                    ActiveModel.prototype.isCreated = function () {
                        return this._flags.contains(ActiveModelFlag.CREATED);
                    };
                    ActiveModel.prototype.isRemoved = function () {
                        return this._flags.contains(ActiveModelFlag.REMOVED);
                    };
                    ActiveModel.prototype.isDirty = function () {
                        return !this._savedData || !this.equals(this._savedData);
                    };
                    ActiveModel.prototype.getResourceIdentifier = function () {
                        if (!this._resourceName && !this.getId()) {
                            return 'unknown model';
                        }
                        var identifier = '';
                        if (this._resourceName) {
                            identifier += this._resourceName;
                        }
                        if (this.getId()) {
                            identifier += '(' + this.getId() + ')';
                        }
                        return identifier;
                    };
                    return ActiveModel;
                })(TSCore.App.Data.Model.Model);
                Model.ActiveModel = ActiveModel;
            })(Model = Data.Model || (Data.Model = {}));
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var Model;
            (function (Model_1) {
                var Model = (function (_super) {
                    __extends(Model, _super);
                    function Model() {
                        _super.apply(this, arguments);
                    }
                    Model.prototype.toObject = function (includeRelations) {
                        if (includeRelations === void 0) { includeRelations = true; }
                        var result = _super.prototype.toObject.call(this);
                        if (includeRelations === false) {
                            _.each(_.keys(this.static.relations()), function (key) {
                                if (result[key]) {
                                    delete result[key];
                                }
                            });
                        }
                        return result;
                    };
                    return Model;
                })(TSCore.Data.Model);
                Model_1.Model = Model;
            })(Model = Data.Model || (Data.Model = {}));
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var Query;
            (function (Query) {
                (function (ConditionTypes) {
                    ConditionTypes[ConditionTypes["AND"] = 0] = "AND";
                    ConditionTypes[ConditionTypes["OR"] = 1] = "OR";
                })(Query.ConditionTypes || (Query.ConditionTypes = {}));
                var ConditionTypes = Query.ConditionTypes;
                (function (ConditionOperators) {
                    ConditionOperators[ConditionOperators["IS_EQUAL"] = 0] = "IS_EQUAL";
                    ConditionOperators[ConditionOperators["IS_GREATER_THAN"] = 1] = "IS_GREATER_THAN";
                    ConditionOperators[ConditionOperators["IS_GREATER_THAN_OR_EQUAL"] = 2] = "IS_GREATER_THAN_OR_EQUAL";
                    ConditionOperators[ConditionOperators["IS_IN"] = 3] = "IS_IN";
                    ConditionOperators[ConditionOperators["IS_LESS_THAN"] = 4] = "IS_LESS_THAN";
                    ConditionOperators[ConditionOperators["IS_LESS_THAN_OR_EQUAL"] = 5] = "IS_LESS_THAN_OR_EQUAL";
                    ConditionOperators[ConditionOperators["IS_LIKE"] = 6] = "IS_LIKE";
                    ConditionOperators[ConditionOperators["IS_NOT_EQUAL"] = 7] = "IS_NOT_EQUAL";
                })(Query.ConditionOperators || (Query.ConditionOperators = {}));
                var ConditionOperators = Query.ConditionOperators;
                var Condition = (function () {
                    function Condition(type, field, operator, value) {
                        this._type = type;
                        this._field = field;
                        this._operator = operator;
                        this._value = value;
                    }
                    Condition.prototype.getType = function () {
                        return this._type;
                    };
                    Condition.prototype.getField = function () {
                        return this._field;
                    };
                    Condition.prototype.getOperator = function () {
                        return this._operator;
                    };
                    Condition.prototype.getValue = function () {
                        return this._value;
                    };
                    return Condition;
                })();
                Query.Condition = Condition;
            })(Query = Data.Query || (Data.Query = {}));
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var Query;
            (function (Query_1) {
                var Query = (function () {
                    function Query() {
                        this._offset = null;
                        this._limit = null;
                        this._fields = [];
                        this._conditions = [];
                        this._sorters = [];
                    }
                    Query.prototype.from = function (from) {
                        this._from = from;
                        return this;
                    };
                    Query.prototype.getFrom = function () {
                        return this._from;
                    };
                    Query.prototype.hasFrom = function () {
                        return !!this._from;
                    };
                    Query.prototype.field = function (field) {
                        this._fields.push(field);
                        return this;
                    };
                    Query.prototype.addManyFields = function (fields) {
                        this._fields = this._fields.concat(fields);
                        return this;
                    };
                    Query.prototype.getFields = function () {
                        return this._fields;
                    };
                    Query.prototype.hasFields = function () {
                        return (this._fields.length > 0);
                    };
                    Query.prototype.offset = function (offset) {
                        this._offset = offset;
                        return this;
                    };
                    Query.prototype.getOffset = function () {
                        return this._offset;
                    };
                    Query.prototype.hasOffset = function () {
                        return _.isNumber(this._offset);
                    };
                    Query.prototype.limit = function (limit) {
                        this._limit = limit;
                        return this;
                    };
                    Query.prototype.getLimit = function () {
                        return this._limit;
                    };
                    Query.prototype.hasLimit = function () {
                        return _.isNumber(this._limit);
                    };
                    Query.prototype.condition = function (condition) {
                        this._conditions.push(condition);
                        return this;
                    };
                    Query.prototype.addManyConditions = function (conditions) {
                        this._conditions = this._conditions.concat(conditions);
                        return this;
                    };
                    Query.prototype.getConditions = function () {
                        return this._conditions;
                    };
                    Query.prototype.hasConditions = function () {
                        return !!(this._conditions.length > 0);
                    };
                    Query.prototype.sorter = function (sorter) {
                        this._sorters.push(sorter);
                        return this;
                    };
                    Query.prototype.addManySorters = function (sorters) {
                        this._sorters = this._sorters.concat(sorters);
                        return this;
                    };
                    Query.prototype.getSorters = function () {
                        return this._sorters;
                    };
                    Query.prototype.hasSorters = function () {
                        return (this._sorters.length > 0);
                    };
                    Query.prototype.find = function (id) {
                        this._find = id;
                        return this;
                    };
                    Query.prototype.getFind = function () {
                        return this._find;
                    };
                    Query.prototype.hasFind = function () {
                        return !!this._find;
                    };
                    Query.prototype.merge = function (query) {
                        if (query.hasFrom()) {
                            this.from(query.getFrom());
                        }
                        if (query.hasFields()) {
                            this.addManyFields(query.getFields());
                        }
                        if (query.hasOffset()) {
                            this.offset(query.getOffset());
                        }
                        if (query.hasLimit()) {
                            this.limit(query.getLimit());
                        }
                        if (query.hasConditions()) {
                            this.addManyConditions(query.getConditions());
                        }
                        if (query.hasSorters()) {
                            this.addManySorters(query.getSorters());
                        }
                        if (query.hasFind()) {
                            this.find(query.getFind());
                        }
                        return this;
                    };
                    Query.from = function (from) {
                        return (new this).from(from);
                    };
                    return Query;
                })();
                Query_1.Query = Query;
            })(Query = Data.Query || (Data.Query = {}));
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var Query;
            (function (Query) {
                (function (SortDirections) {
                    SortDirections[SortDirections["ASCENDING"] = 0] = "ASCENDING";
                    SortDirections[SortDirections["DESCENDING"] = 1] = "DESCENDING";
                })(Query.SortDirections || (Query.SortDirections = {}));
                var SortDirections = Query.SortDirections;
                var Sorter = (function () {
                    function Sorter(field, direction) {
                        this._field = field;
                        this._direction = direction;
                    }
                    Sorter.prototype.getField = function () {
                        return this._field;
                    };
                    Sorter.prototype.getDirection = function () {
                        return this._direction;
                    };
                    return Sorter;
                })();
                Query.Sorter = Sorter;
            })(Query = Data.Query || (Data.Query = {}));
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var List = TSCore.Data.List;
            var Query = TSCore.App.Data.Query.Query;
            var ActiveModel = TSCore.App.Data.Model.ActiveModel;
            var Service = (function () {
                function Service($q) {
                    this.$q = $q;
                    this._sources = new List();
                }
                Service.prototype.source = function (source) {
                    this._sources.add(source);
                    return this;
                };
                Service.prototype.getSources = function () {
                    return this._sources.clone();
                };
                Service.prototype.create = function (resourceName, data) {
                    var _this = this;
                    return this._executeCreate(resourceName, data).then(function (result) {
                        return _this._createModels(result).first();
                    });
                };
                Service.prototype.createModel = function (resourceName, model, data) {
                    var _this = this;
                    if (data) {
                        model.assignAll(data);
                    }
                    return this._executeCreate(resourceName, model.toObject(true)).then(function (result) {
                        _this._updateModel(model, result);
                        if (model instanceof ActiveModel) {
                            model.makeAlive(_this, resourceName);
                        }
                        return model.getId();
                    });
                };
                Service.prototype.update = function (resourceName, resourceId, data) {
                    var _this = this;
                    return this._executeUpdate(resourceName, resourceId, data).then(function (result) {
                        return _this._createModels(result).first();
                    });
                };
                Service.prototype.updateModel = function (resourceName, model, data) {
                    var _this = this;
                    return this._executeUpdate(resourceName, model.getId(), data || model.toObject(true)).then(function (result) {
                        _this._updateModel(model, result);
                        return null;
                    });
                };
                Service.prototype.remove = function (resourceName, resourceId) {
                    return this._executeRemove(resourceName, resourceId).then(function () { return null; });
                };
                Service.prototype.removeModel = function (resourceName, model) {
                    var _this = this;
                    return this._executeRemove(resourceName, model.getId()).then(function () {
                        _this._removeModel(model);
                        return null;
                    });
                };
                Service.prototype.query = function (resourceName) {
                    return Query.from(resourceName);
                };
                Service.prototype.all = function (resourceName) {
                    return this.execute(Query.from(resourceName));
                };
                Service.prototype.find = function (resourceName, resourceId) {
                    return this.execute(Query
                        .from(resourceName)
                        .find(resourceId))
                        .then(function (results) {
                        return results.first();
                    });
                };
                Service.prototype.execute = function (query) {
                    var _this = this;
                    return this._executeQuery(query).then(function (results) {
                        return _this._createModels(results);
                    });
                };
                Service.prototype._executeQuery = function (query) {
                    return this._executeInSources(function (source) {
                        return source.execute(query);
                    });
                };
                Service.prototype._executeCreate = function (resourceName, data) {
                    return null;
                };
                Service.prototype._executeUpdate = function (resourceName, resourceId, data) {
                    return null;
                };
                Service.prototype._executeRemove = function (resourceName, resourceId) {
                    return null;
                };
                Service.prototype._executeInSources = function (executor) {
                    var _this = this;
                    var sourceIndex = 0;
                    var promise = this.$q.defer();
                    var nextSource = function () {
                        if (sourceIndex >= _this._sources.count()) {
                            promise.reject();
                        }
                        var source = _this._sources.get(sourceIndex);
                        executor(source)
                            .then(function (response) { return promise.resolve(response); })
                            .catch(function () { return nextSource(); });
                        sourceIndex++;
                    };
                    nextSource();
                    return promise.promise;
                };
                Service.prototype._createModels = function (data) {
                    // TODO: Create models from source results
                    return null;
                };
                Service.prototype._updateModel = function (model, data) {
                    // TODO: Resolve data
                };
                Service.prototype._removeModel = function (model) {
                    if (model instanceof ActiveModel) {
                        model.setSavedData(null);
                        model.markRemoved();
                        model.die();
                    }
                };
                Service.$inject = ['$q'];
                return Service;
            })();
            Data.Service = Service;
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Transform;
        (function (Transform) {
            var Transformer = (function (_super) {
                __extends(Transformer, _super);
                function Transformer() {
                    _super.apply(this, arguments);
                    this.availableIncludes = [];
                }
                Transformer.prototype.transform = function (item) {
                };
                Transformer.prototype.collection = function (data) {
                    var _this = this;
                    if (!data) {
                        return null;
                    }
                    return _.map(data, function (item) { return _this.item(item); });
                };
                Transformer.prototype.item = function (data) {
                    var _this = this;
                    if (!data) {
                        return null;
                    }
                    var result = this.transform(data);
                    _.each(this.availableIncludes, function (include) {
                        var includeMethod = 'include' + _this._ucFirst(include);
                        if (result[include] && _this[includeMethod]) {
                            result[include] = _this[includeMethod](result);
                        }
                    });
                    return result;
                };
                Transformer.prototype._ucFirst = function (string) {
                    return string.charAt(0).toUpperCase() + string.slice(1);
                };
                Transformer.collection = function (data) {
                    var transformer = new this;
                    return transformer.collection(data);
                };
                Transformer.item = function (data) {
                    var transformer = new this;
                    return transformer.item(data);
                };
                return Transformer;
            })(TSCore.BaseObject);
            Transform.Transformer = Transformer;
        })(Transform = Data.Transform || (Data.Transform = {}));
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var Transformers;
            (function (Transformers) {
                var TreeWalker = (function () {
                    function TreeWalker(data) {
                    }
                    TreeWalker.prototype.walk = function (callback) {
                    };
                    return TreeWalker;
                })();
                var JsonGraphTransformer = (function () {
                    function JsonGraphTransformer() {
                        this._aliases = new TSCore.Data.Dictionary();
                    }
                    JsonGraphTransformer.prototype.resource = function (key, aliases) {
                        var _this = this;
                        _.each(aliases, function (alias) { return _this._aliases.set(alias, key); });
                        return this;
                    };
                    JsonGraphTransformer.prototype.transform = function (data) {
                        var _this = this;
                        var results = new Data.JsonGraph();
                        function resolveResource(resourceName, resource) {
                        }
                        var tree = new TreeWalker(data);
                        tree.walk(function (value, alias) {
                            alias = alias.toString();
                            if (!_this._aliases.contains(alias)) {
                                return;
                            }
                            var resourceName = _this._aliases.get(alias);
                            if (_.isArray(value)) {
                                _.each(value, function (resource) { return resolveResource(resourceName, resource); });
                            }
                            else if (_.isObject(value)) {
                                resolveResource(resourceName, value);
                            }
                        });
                        return results;
                    };
                    return JsonGraphTransformer;
                })();
                Transformers.JsonGraphTransformer = JsonGraphTransformer;
            })(Transformers = Data.Transformers || (Data.Transformers = {}));
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
/// <reference path="./RequestOptions.ts" />
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Http;
        (function (Http) {
            var Service = (function () {
                function Service($http) {
                    this.$http = $http;
                    this.defaultHeaders = {};
                }
                Service.prototype.setProtocol = function (protocol) {
                    this.protocol = protocol;
                };
                Service.prototype.setHostname = function (hostname) {
                    this.hostname = hostname;
                };
                Service.prototype.setDefaultHeader = function (name, value) {
                    this.defaultHeaders[name] = value;
                };
                Service.prototype.unsetDefaultHeader = function (name) {
                    delete this.defaultHeaders[name];
                };
                Service.prototype.request = function (requestOptions) {
                    requestOptions = this._applyDefaults(requestOptions);
                    var requestConfig = requestOptions.getRequestConfig();
                    return this.$http(requestConfig);
                };
                Service.prototype._applyDefaults = function (requestOptions) {
                    _.each(this.defaultHeaders, function (value, name) {
                        requestOptions.header(name, value);
                    });
                    var relativeUrl = requestOptions.getUrl();
                    requestOptions.url(this.protocol + this.hostname + relativeUrl);
                    return requestOptions;
                };
                return Service;
            })();
            Http.Service = Service;
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
/// <reference path="../../ts-core/build/ts-core.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="TSCore/App/Api/Resource.ts" />
/// <reference path="TSCore/App/Api/Service.ts" />
/// <reference path="TSCore/App/App.ts" />
/// <reference path="TSCore/App/Auth/AccountType.ts" />
/// <reference path="TSCore/App/Auth/Manager.ts" />
/// <reference path="TSCore/App/Auth/Session.ts" />
/// <reference path="TSCore/App/Constants/HttpMethods.ts" />
/// <reference path="TSCore/App/Data/IDataSource.ts" />
/// <reference path="TSCore/App/Data/IDataSourceResponse.ts" />
/// <reference path="TSCore/App/Data/JsonGraph.ts" />
/// <reference path="TSCore/App/Data/Model/ActiveModel.ts" />
/// <reference path="TSCore/App/Data/Model/Model.ts" />
/// <reference path="TSCore/App/Data/Query/Condition.ts" />
/// <reference path="TSCore/App/Data/Query/Query.ts" />
/// <reference path="TSCore/App/Data/Query/Sorter.ts" />
/// <reference path="TSCore/App/Data/Service.ts" />
/// <reference path="TSCore/App/Data/Transformer.ts" />
/// <reference path="TSCore/App/Data/Transformers/JsonGraphTransformer.ts" />
/// <reference path="TSCore/App/Http/RequestOptions.ts" />
/// <reference path="TSCore/App/Http/Service.ts" />
/// <reference path="TSCore/App/Interceptors/HttpInterceptor.ts" />
/// <reference path="TSCore/App/Interceptors/StateInterceptor.ts" />
//# sourceMappingURL=ts-core-app.js.map