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
                        var includeMethod = 'include' + TSCore.Utils.Text.ucFirst(include);
                        if (result[include] && _this[includeMethod]) {
                            result[include] = _this[includeMethod](result);
                        }
                    });
                    return result;
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
            Data.Transformer = Transformer;
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
///<reference path="../Data/Transformer.ts"/>
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
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var Graph;
            (function (Graph) {
                var Reference = (function () {
                    function Reference(resourceName, resourceId) {
                        this.$type = "ref";
                        this.value = [resourceName, resourceId];
                    }
                    return Reference;
                })();
                Graph.Reference = Reference;
            })(Graph = Data.Graph || (Data.Graph = {}));
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var Graph;
            (function (Graph_1) {
                var Graph = (function () {
                    function Graph(data) {
                        this._data = data || {};
                    }
                    Graph.prototype.clear = function () {
                        this._data = {};
                    };
                    Graph.prototype.get = function (path, callback) {
                        if (!path) {
                            return this._resolveValueRecursive(null, null, this._data, callback);
                        }
                        path = this._optimizePath(path);
                        if (!path) {
                            return null;
                        }
                        var root = this._data;
                        var parentKey = null;
                        var key = null;
                        for (var i = 0; i < path.length; i++) {
                            var part = path[i];
                            if (root[part] !== void 0) {
                                root = root[part];
                                parentKey = key;
                                key = part;
                            }
                            else {
                                root = null;
                                break;
                            }
                        }
                        return this._resolveValueRecursive(parentKey, key, root, callback);
                    };
                    Graph.prototype._optimizePath = function (path) {
                        if (!path) {
                            return null;
                        }
                        var root = this._data;
                        for (var i = 0; i < path.length; i++) {
                            var part = path[i];
                            var end = path.slice(i + 1, path.length);
                            if (root[part] === void 0) {
                                root = null;
                                break;
                            }
                            root = root[part];
                            if (this._isReference(root)) {
                                var optimizedPath = root.value.concat(end);
                                return this._optimizePath(optimizedPath);
                            }
                        }
                        return root ? path : null;
                    };
                    Graph.prototype.set = function (path, value) {
                        var originalPath = path;
                        path = this._optimizePath(path);
                        if (!path) {
                            path = originalPath;
                        }
                        if (path && path.length) {
                            var root = this._data;
                            for (var i = 0; i < path.length; i++) {
                                var part = path[i];
                                if (root[part] === void 0 && i !== path.length - 1) {
                                    root[part] = {};
                                }
                                if (i === path.length - 1) {
                                    root[part] = value;
                                }
                                root = root[part];
                            }
                            return this;
                        }
                        this._data = value;
                        return this;
                    };
                    Graph.prototype.unset = function (path) {
                        path = this._optimizePath(path);
                        if (path && path.length) {
                            var root = this._data;
                            for (var i = 0; i < path.length; i++) {
                                var part = path[i];
                                if (i === path.length - 1) {
                                    delete root[part];
                                }
                                root = root[part];
                            }
                        }
                        return this;
                    };
                    Graph.prototype.setItem = function (resourceName, resourceId, resource) {
                        this.set([resourceName, resourceId], resource);
                    };
                    Graph.prototype.getItem = function (resourceName, resourceId) {
                        return this.get([resourceName, resourceId]);
                    };
                    Graph.prototype.setItems = function (resourceName, items) {
                        this.set([resourceName], items);
                    };
                    Graph.prototype.getItems = function (resourceName) {
                        return this.get([resourceName]);
                    };
                    Graph.prototype.removeItems = function (resourceName) {
                        this.unset([resourceName]);
                    };
                    Graph.prototype.removeItem = function (resourceName, resourceId) {
                        this.unset([resourceName, resourceId]);
                    };
                    Graph.prototype.merge = function (graph) {
                        this.mergeData(graph.get());
                    };
                    Graph.prototype.mergeData = function (data) {
                        var _this = this;
                        _.each(data, function (resources, resourceName) {
                            _.each(resources, function (item, resourceId) {
                                var currentItem = _this.getItem(resourceName, resourceId);
                                if (!currentItem) {
                                    _this.setItem(resourceName, resourceId, item);
                                }
                                else {
                                    _this.setItem(resourceName, resourceId, _.extend(currentItem, item));
                                }
                            });
                        });
                    };
                    Graph.prototype._isReference = function (value) {
                        return (value && value.$type && value.$type == "ref");
                    };
                    Graph.prototype._resolveValueRecursive = function (parentKey, key, value, callback) {
                        var _this = this;
                        if (this._isReference(value)) {
                            return this.get(value.value, callback);
                        }
                        if (_.isArray(value)) {
                            value = _.map(value, function (subValue, subKey) {
                                return _this._resolveValueRecursive(key, subKey, subValue, callback);
                            });
                        }
                        else if (_.isObject(value)) {
                            value = _.mapObject(value, function (subValue, subKey) {
                                return _this._resolveValueRecursive(key, subKey, subValue, callback);
                            });
                            if (this._isResourceName(key)) {
                                value = _.values(value);
                            }
                        }
                        if (!_.isArray(value) && callback) {
                            if (this._isResourceName(key)) {
                                value = callback(key, value);
                            }
                            else if (this._isResourceName(parentKey)) {
                                value = callback(parentKey, value);
                            }
                        }
                        return value;
                    };
                    Graph.prototype._isResourceName = function (resourceName) {
                        return (this._data[resourceName] !== void 0);
                    };
                    return Graph;
                })();
                Graph_1.Graph = Graph;
            })(Graph = Data.Graph || (Data.Graph = {}));
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
///<reference path="Graph/Reference.ts"/>
///<reference path="Graph/Graph.ts"/>
///<reference path="../Data/Query/Query.ts"/>
///<reference path="../Data/IDataSourceResponse.ts"/>
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
///<reference path="../IDataSource.ts"/>
///<reference path="../Query/Condition.ts"/>
///<reference path="../Query/Sorter.ts"/>
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
                    Query.prototype.serialize = function (opts) {
                        var obj = {};
                        if (_.contains(opts, "from")) {
                            obj.from = this._from;
                        }
                        if (_.contains(opts, "conditions")) {
                            obj.conditions = this.getConditions();
                        }
                        if (_.contains(opts, "sorters")) {
                            obj.sorters = this.getSorters();
                        }
                        return JSON.stringify(obj);
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
///<reference path="../Http/RequestOptions.ts"/>
///<reference path="../Data/Query/Query.ts"/>
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Api;
        (function (Api) {
            var RequestOptions = TSCore.App.Http.RequestOptions;
            var RequestHandler = (function () {
                function RequestHandler(httpService) {
                    this.httpService = httpService;
                }
                RequestHandler.prototype.setResource = function (resource) {
                    this._resource = resource;
                };
                RequestHandler.prototype.getResource = function () {
                    return this._resource;
                };
                RequestHandler.prototype.request = function (requestOptions) {
                    var prefix = this.getResource().getPrefix();
                    var relativeUrl = requestOptions.getUrl();
                    requestOptions.url(prefix + relativeUrl);
                    return this.httpService.request(requestOptions);
                };
                RequestHandler.prototype.query = function (query) {
                    var _this = this;
                    return this.request(RequestOptions
                        .get('/')).then(function (response) { return _this._transformQuery(response); });
                };
                RequestHandler.prototype.all = function () {
                    var _this = this;
                    return this.request(RequestOptions
                        .get('/')).then(function (response) { return _this._transformAll(response); });
                };
                RequestHandler.prototype.find = function (id) {
                    var _this = this;
                    return this.request(RequestOptions
                        .get('/:id', { id: id })).then(function (response) { return _this._transformFind(response); });
                };
                RequestHandler.prototype.create = function (data) {
                    var _this = this;
                    return this.request(RequestOptions
                        .post('/')
                        .data(data)).then(function (response) { return _this._transformCreate(response); });
                };
                RequestHandler.prototype.update = function (id, data) {
                    var _this = this;
                    return this.request(RequestOptions
                        .put('/:id', { id: id })
                        .data(data)).then(function (response) { return _this._transformUpdate(response); });
                };
                RequestHandler.prototype.remove = function (id) {
                    var _this = this;
                    return this.request(RequestOptions
                        .delete('/:id', { id: id })).then(function (response) { return _this._transformRemove(response); });
                };
                RequestHandler.prototype._transformQuery = function (response) {
                    return this._transformMultiple(response);
                };
                RequestHandler.prototype._transformAll = function (response) {
                    return this._transformMultiple(response);
                };
                RequestHandler.prototype._transformFind = function (response) {
                    return this._transformSingle(response);
                };
                RequestHandler.prototype._transformCreate = function (response) {
                    return this._transformSingle(response);
                };
                RequestHandler.prototype._transformUpdate = function (response) {
                    return this._transformSingle(response);
                };
                RequestHandler.prototype._transformRemove = function (response) {
                    return response;
                };
                RequestHandler.prototype._transformMultiple = function (response) {
                    var transformer = this.getResource().getTransformer();
                    var multipleKey = this.getResource().getMultipleKey();
                    return transformer.collection(response.data[multipleKey]);
                };
                RequestHandler.prototype._transformSingle = function (response) {
                    var transformer = this.getResource().getTransformer();
                    var singleKey = this.getResource().getSingleKey();
                    return transformer.item(response.data[singleKey]);
                };
                return RequestHandler;
            })();
            Api.RequestHandler = RequestHandler;
        })(Api = App.Api || (App.Api = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
///<reference path="../Data/Query/Query.ts"/>
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Api;
        (function (Api) {
            var Service = (function () {
                function Service($q) {
                    this.$q = $q;
                    this._resources = new TSCore.Data.Dictionary();
                }
                Service.prototype.manyResources = function (resources) {
                    var _this = this;
                    resources.each(function (resourceName, resource) { return _this.resource(resourceName, resource); });
                    return this;
                };
                Service.prototype.resource = function (name, resource) {
                    this[name] = resource;
                    this._resources.set(name, resource);
                    this._registerRequestHandler(name, resource);
                    return this;
                };
                Service.prototype._registerRequestHandler = function (name, resource) {
                    var requestHandler = resource.getRequestHandler();
                    requestHandler.setResource(resource);
                    this[name] = requestHandler;
                };
                Service.prototype.getResourceAsync = function (name) {
                    var deferred = this.$q.defer();
                    var resource = this._resources.get(name);
                    if (!resource) {
                        throw new TSCore.Exception.Exception('Resource `' + name + '` cannot be found');
                    }
                    deferred.resolve(resource);
                    return deferred.promise;
                };
                Service.prototype._getRequestHandler = function (resourceName) {
                    return this.getResourceAsync(resourceName).then(function (resource) {
                        return resource.getRequestHandler();
                    });
                };
                Service.prototype.execute = function (query) {
                    var resourceName = query.getFrom();
                    if (query.hasFind()) {
                        return this.find(resourceName, query.getFind());
                    }
                    return this._getRequestHandler(resourceName).then(function (requestHandler) {
                        return requestHandler.query(query);
                    });
                };
                Service.prototype.all = function (resourceName) {
                    return this._getRequestHandler(resourceName).then(function (requestHandler) {
                        return requestHandler.all();
                    });
                };
                Service.prototype.find = function (resourceName, resourceId) {
                    return this._getRequestHandler(resourceName).then(function (requestHandler) {
                        return requestHandler.find(resourceId);
                    });
                };
                Service.prototype.create = function (resourceName, data) {
                    return this._getRequestHandler(resourceName).then(function (requestHandler) {
                        return requestHandler.create(data);
                    });
                };
                Service.prototype.update = function (resourceName, resourceId, data) {
                    return this._getRequestHandler(resourceName).then(function (requestHandler) {
                        return requestHandler.update(resourceId, data);
                    });
                };
                Service.prototype.remove = function (resourceName, resourceId) {
                    return this._getRequestHandler(resourceName).then(function (requestHandler) {
                        return requestHandler.remove(resourceId);
                    });
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
            var Model;
            (function (Model_1) {
                var Exception = TSCore.Exception.Exception;
                var Model = TSCore.Data.Model;
                (function (ActiveModelFlag) {
                    ActiveModelFlag[ActiveModelFlag["ACTIVATED"] = 0] = "ACTIVATED";
                    ActiveModelFlag[ActiveModelFlag["CREATED"] = 1] = "CREATED";
                    ActiveModelFlag[ActiveModelFlag["REMOVED"] = 2] = "REMOVED";
                })(Model_1.ActiveModelFlag || (Model_1.ActiveModelFlag = {}));
                var ActiveModelFlag = Model_1.ActiveModelFlag;
                var ActiveModel = (function (_super) {
                    __extends(ActiveModel, _super);
                    function ActiveModel() {
                        _super.apply(this, arguments);
                        this._flags = new TSCore.Data.Collection();
                    }
                    ActiveModel.prototype.activate = function (dataService, resourceName) {
                        this._dataService = dataService;
                        this._resourceName = resourceName;
                        this._flags.addMany([ActiveModelFlag.ACTIVATED, ActiveModelFlag.CREATED]);
                    };
                    ActiveModel.prototype.deactivate = function () {
                        this._dataService = null;
                        this._resourceName = null;
                        this._flags.removeMany([ActiveModelFlag.ACTIVATED]);
                    };
                    ActiveModel.prototype.setSavedData = function (data) {
                        this._savedData = data;
                    };
                    ActiveModel.prototype.markRemoved = function () {
                        this._flags.add(ActiveModelFlag.REMOVED);
                    };
                    ActiveModel.prototype.update = function (data) {
                        if (!this.isActivated()) {
                            throw new Exception('Unable to update ' + this.getResourceIdentifier() + ', model is not alive');
                        }
                        return this._dataService.updateModel(this._resourceName, this, data);
                    };
                    ActiveModel.prototype.create = function (dataService, resourceName, data) {
                        return dataService.createModel(resourceName, this, data);
                    };
                    ActiveModel.prototype.remove = function () {
                        if (!this.isActivated()) {
                            throw new Exception('Unable to remove ' + this.getResourceIdentifier() + ', model is not alive');
                        }
                        return this._dataService.removeModel(this._resourceName, this);
                    };
                    ActiveModel.prototype.refresh = function () {
                        var _this = this;
                        if (!this.isActivated()) {
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
                    ActiveModel.prototype.isActivated = function () {
                        return this._flags.contains(ActiveModelFlag.ACTIVATED);
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
                })(Model);
                Model_1.ActiveModel = ActiveModel;
            })(Model = Data.Model || (Data.Model = {}));
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
///<reference path="Model/ActiveModel.ts"/>
///<reference path="Query/Query.ts"/>
///<reference path="IDataSource.ts"/>
///<reference path="IDataSourceResponse.ts"/>
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
                    this._resources = new TSCore.Data.Dictionary();
                }
                Service.prototype.source = function (source) {
                    this._sources.add(source);
                    source.setDataService(this);
                    return this;
                };
                Service.prototype.getSources = function () {
                    return this._sources.clone();
                };
                Service.prototype.manyResources = function (resources) {
                    var _this = this;
                    resources.each(function (resourceName, resource) {
                        _this._resources.set(resourceName, resource);
                    });
                    return this;
                };
                Service.prototype.resource = function (name, resource) {
                    this[name] = resource;
                    this._resources.set(name, resource);
                    return this;
                };
                Service.prototype.getResources = function () {
                    return this._resources.clone();
                };
                Service.prototype.getResource = function (name) {
                    return this._resources.get(name);
                };
                Service.prototype.getResourceAsync = function (name) {
                    var deferred = this.$q.defer();
                    var resource = this._resources.get(name);
                    if (!resource) {
                        throw new TSCore.Exception.Exception('Resource `' + name + '` cannot be found');
                    }
                    deferred.resolve(resource);
                    return deferred.promise;
                };
                Service.prototype.query = function (resourceName) {
                    return Query.from(resourceName);
                };
                Service.prototype.all = function (resourceName) {
                    return this.execute(Query
                        .from(resourceName));
                };
                Service.prototype.find = function (resourceName, resourceId) {
                    return this.execute(Query
                        .from(resourceName)
                        .find(resourceId)).then(function (results) {
                        return results[0] || null;
                    });
                };
                Service.prototype.execute = function (query) {
                    var _this = this;
                    var response;
                    return this._executeSources(function (source) {
                        return source.execute(query);
                    })
                        .then(function (result) {
                        response = result.response;
                        var sourceIndex = _this._sources.indexOf(result.source);
                        if (sourceIndex === 0) {
                            return _this.$q.when();
                        }
                        return _this._notifySources(sourceIndex - 1, function (source) {
                            return source.notifyExecute(query, response);
                        });
                    })
                        .then(function () {
                        return _this._createModels(response);
                    });
                };
                Service.prototype._createModels = function (response) {
                    var _this = this;
                    var data = response.data;
                    var results = response.results;
                    var models = [];
                    _.each(results, function (result) {
                        var resolveModel = data.get(result.value, function (resourceName, item) {
                            var resource = _this.getResource(resourceName);
                            var modelClass = resource.getModel();
                            var model = new modelClass(item);
                            if (model instanceof ActiveModel) {
                                model.activate(_this, resourceName);
                                model.setSavedData(data);
                            }
                            return model;
                        });
                        if (resolveModel) {
                            models.push(resolveModel);
                        }
                    });
                    return models;
                };
                Service.prototype.create = function (resourceName, data) {
                    var _this = this;
                    return this
                        ._executeCreate(resourceName, data)
                        .then(function (response) {
                        return _this._createModels(response)[0] || null;
                    });
                };
                Service.prototype.createModel = function (resourceName, model, data) {
                    var _this = this;
                    if (data) {
                        model.assignAll(data);
                    }
                    return this
                        ._executeCreate(resourceName, model.toObject(true))
                        .then(function (response) {
                        model = Service._updateModel(model, response.results);
                        if (model instanceof ActiveModel) {
                            model.activate(_this, resourceName);
                        }
                        return model;
                    });
                };
                Service.prototype._executeCreate = function (resourceName, data) {
                    var _this = this;
                    var response;
                    return this
                        ._executeSources(function (source) {
                        return source.create(resourceName, data);
                    })
                        .then(function (result) {
                        response = result.response;
                        var sourceIndex = _this._sources.indexOf(result.source);
                        if (sourceIndex === 0) {
                            return _this.$q.when();
                        }
                        return _this._notifySources(sourceIndex - 1, function (source) {
                            return source.notifyCreate(response);
                        });
                    })
                        .then(function () {
                        return response;
                    });
                };
                Service.prototype.update = function (resourceName, resourceId, data) {
                    var _this = this;
                    return this._executeUpdate(resourceName, resourceId, data).then(function (results) {
                        return _this._createModels(results)[0] || null;
                    });
                };
                Service.prototype.updateModel = function (resourceName, model, data) {
                    return this._executeUpdate(resourceName, model.getId(), data || model.toObject(true)).then(function (results) {
                        Service._updateModel(model, results);
                        return null;
                    });
                };
                Service.prototype._executeUpdate = function (resourceName, resourceId, data) {
                    var _this = this;
                    var response;
                    return this
                        ._executeSources(function (source) {
                        return source.update(resourceName, resourceId, data);
                    })
                        .then(function (result) {
                        response = result.response;
                        var sourceIndex = _this._sources.indexOf(result.source);
                        if (sourceIndex === 0) {
                            return _this.$q.when();
                        }
                        return _this._notifySources(sourceIndex - 1, function (source) {
                            return source.notifyUpdate(response);
                        });
                    })
                        .then(function () {
                        return response;
                    });
                };
                Service.prototype.remove = function (resourceName, resourceId) {
                    return this._executeRemove(resourceName, resourceId).then(function () { return null; });
                };
                Service.prototype.removeModel = function (resourceName, model) {
                    return this._executeRemove(resourceName, model.getId()).then(function () {
                        Service._removeModel(model);
                        return null;
                    });
                };
                Service.prototype._executeRemove = function (resourceName, resourceId) {
                    var _this = this;
                    var response;
                    return this
                        ._executeSources(function (source) {
                        return source.remove(resourceName, resourceId);
                    })
                        .then(function (result) {
                        response = result.response;
                        var sourceIndex = _this._sources.indexOf(result.source);
                        if (sourceIndex === 0) {
                            return _this.$q.when();
                        }
                        return _this._notifySources(sourceIndex - 1, function (source) {
                            return source.notifyRemove(response);
                        });
                    })
                        .then(function () {
                        return response;
                    });
                };
                Service.prototype._notifySources = function (startIndex, executor) {
                    var promises = [];
                    for (var sourceIndex = startIndex; sourceIndex >= 0; sourceIndex--) {
                        var source = this._sources.get(sourceIndex);
                        promises.push(executor(source));
                    }
                    return this.$q.all(promises);
                };
                Service.prototype._executeSources = function (executor) {
                    var _this = this;
                    var sourceIndex = 0;
                    var deferred = this.$q.defer();
                    var nextSource = function () {
                        if (sourceIndex >= _this._sources.count()) {
                            deferred.reject('No dataSources left');
                            return;
                        }
                        var source = _this._sources.get(sourceIndex);
                        executor(source)
                            .then(function (response) { return deferred.resolve({
                            response: response,
                            source: source
                        }); })
                            .catch(function () { return nextSource(); });
                        sourceIndex++;
                    };
                    nextSource();
                    return deferred.promise;
                };
                Service._updateModel = function (model, data) {
                    model.assignAll(data);
                    if (model instanceof ActiveModel) {
                        model.setSavedData(data);
                    }
                    return model;
                };
                Service._removeModel = function (model) {
                    if (model instanceof ActiveModel) {
                        model.setSavedData(null);
                        model.markRemoved();
                        model.deactivate();
                    }
                    return model;
                };
                return Service;
            })();
            Data.Service = Service;
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
///<reference path="Graph.ts"/>
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var Graph;
            (function (Graph) {
                var Builder = (function () {
                    function Builder() {
                    }
                    Builder.prototype.resourceForResourceName = function (callback) {
                        this._resourceForResourceNameCallback = callback;
                    };
                    Builder.prototype.resourceNameForAlias = function (callback) {
                        this._resourceNameForAliasCallback = callback;
                    };
                    Builder.prototype.build = function (data, rootResourceName) {
                        var _this = this;
                        if (rootResourceName === void 0) { rootResourceName = null; }
                        var results = {};
                        this._findResourcesRecursive(rootResourceName, data, function (resourceName, resource) {
                            var rootResource = _this._resourceForResourceNameCallback(rootResourceName);
                            var record = _.clone(resource);
                            var childResources = {};
                            _this._findResources(record, function (fromArray, childResourceName, childItem) {
                                var childResource = _this._resourceForResourceNameCallback(childResourceName);
                                var primaryKey = childResource.getModel().primaryKey();
                                var id = childItem[primaryKey];
                                var childResourceRef = new Graph.Reference(childResourceName, id);
                                if (fromArray) {
                                    childResources[childResourceName] = childResources[childResourceName] || [];
                                    childResources[childResourceName].push(childResourceRef);
                                }
                                else {
                                    childResources[childResourceName] = childResourceRef;
                                }
                            });
                            _.each(childResources, function (childResource, childResourceName) {
                                record[childResourceName] = childResource;
                            });
                            var primaryKey = rootResource.getModel().primaryKey();
                            var id = record[primaryKey];
                            results[resourceName] = results[resourceName] || {};
                            results[resourceName][id] = record;
                        });
                        return new Graph.Graph(results);
                    };
                    Builder.prototype._findResourcesRecursive = function (alias, data, callback) {
                        var _this = this;
                        if (!_.isObject(data)) {
                            return;
                        }
                        if (alias) {
                            alias = alias.toString();
                            var resourceName = this._resourceNameForAliasCallback(alias);
                            if (resourceName) {
                                if (_.isArray(data)) {
                                    _.each(data, function (resource) { return callback(resourceName, resource); });
                                }
                                else {
                                    callback(resourceName, data);
                                }
                            }
                        }
                        _.each(data, function (value, key) { return _this._findResourcesRecursive(key, value, callback); });
                    };
                    Builder.prototype._findResources = function (data, callback) {
                        var _this = this;
                        if (!_.isObject(data)) {
                            return;
                        }
                        _.each(data, function (value, key) {
                            if (!_.isObject(value)) {
                                return;
                            }
                            if (key) {
                                var alias = key.toString();
                                var resourceName = _this._resourceNameForAliasCallback(alias);
                                if (resourceName) {
                                    if (_.isArray(value)) {
                                        _.each(value, function (resource) { return callback(true, resourceName, resource); });
                                    }
                                    else {
                                        callback(false, resourceName, value);
                                    }
                                }
                            }
                        });
                    };
                    return Builder;
                })();
                Graph.Builder = Builder;
            })(Graph = Data.Graph || (Data.Graph = {}));
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
///<reference path="../IDataSource.ts"/>
///<reference path="../Query/Query.ts"/>
///<reference path="../Service.ts"/>
///<reference path="../Graph/Builder.ts"/>
///<reference path="../Graph/Reference.ts"/>
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var DataSources;
            (function (DataSources) {
                var Builder = TSCore.App.Data.Graph.Builder;
                var Reference = TSCore.App.Data.Graph.Reference;
                var ApiDataSource = (function () {
                    function ApiDataSource($q, logger, apiService) {
                        this.$q = $q;
                        this.logger = logger;
                        this.apiService = apiService;
                        this.logger = this.logger.child('ApiDataSource');
                    }
                    ApiDataSource.prototype.setDataService = function (service) {
                        this._dataService = service;
                    };
                    ApiDataSource.prototype.getDataService = function () {
                        return this._dataService;
                    };
                    ApiDataSource.prototype.execute = function (query) {
                        var _this = this;
                        this.logger.info('execute');
                        var resourceName = query.getFrom();
                        return this.apiService
                            .execute(query)
                            .then(function (response) { return _this._transformResponse(resourceName, response); });
                    };
                    ApiDataSource.prototype.create = function (resourceName, data) {
                        var _this = this;
                        this.logger.info('create');
                        return this.apiService
                            .create(resourceName, data)
                            .then(function (response) { return _this._transformResponse(resourceName, response); });
                    };
                    ApiDataSource.prototype.update = function (resourceName, resourceId, data) {
                        var _this = this;
                        this.logger.info('update');
                        return this.apiService
                            .update(resourceName, resourceId, data)
                            .then(function (response) { return _this._transformResponse(resourceName, response); });
                    };
                    ApiDataSource.prototype.remove = function (resourceName, resourceId) {
                        var _this = this;
                        this.logger.info('remove');
                        return this.apiService
                            .remove(resourceName, resourceId)
                            .then(function (response) { return _this._transformResponse(resourceName, response); });
                    };
                    ApiDataSource.prototype.notifyExecute = function (query, response) {
                        this.logger.info('notifyExecute - query ', query, ' - response', response);
                        return this.$q.when();
                    };
                    ApiDataSource.prototype.notifyCreate = function (response) {
                        this.logger.info('notifyCreate - response', response);
                        return this.$q.when();
                    };
                    ApiDataSource.prototype.notifyUpdate = function (response) {
                        this.logger.info('notifyUpdate - response', response);
                        return this.$q.when();
                    };
                    ApiDataSource.prototype.notifyRemove = function (response) {
                        this.logger.info('notifyRemove - response', response);
                        return this.$q.when();
                    };
                    ApiDataSource.prototype.clear = function () {
                        return this.$q.when();
                    };
                    ApiDataSource.prototype._transformResponse = function (resourceName, response) {
                        var _this = this;
                        return this.getDataService()
                            .getResourceAsync(resourceName)
                            .then(function (resource) { return _this._createDataSourceResponse(resourceName, resource, response); });
                    };
                    ApiDataSource.prototype._createDataSourceResponse = function (resourceName, resource, response) {
                        var _this = this;
                        var builder = new Builder;
                        builder.resourceForResourceName(function (name) { return _this._resourceForResourceName(name); });
                        builder.resourceNameForAlias(function (key) { return _this._resourceNameForAlias(key); });
                        var graph = builder.build(response, resourceName);
                        var results = graph.getItems(resourceName);
                        var primaryKey = resource.getModel().primaryKey();
                        results = _.map(results, function (resource, resourceId) {
                            return new Reference(resourceName, resource[primaryKey]);
                        });
                        return {
                            data: graph,
                            results: results
                        };
                    };
                    ApiDataSource.prototype._resourceForResourceName = function (name) {
                        return this.getDataService().getResource(name);
                    };
                    ApiDataSource.prototype._resourceNameForAlias = function (key) {
                        var aliases = this._getResourcesAliasMap();
                        return aliases.get(key);
                    };
                    ApiDataSource.prototype._getResourcesAliasMap = function () {
                        var _this = this;
                        if (this._resourceAliasMap) {
                            return this._resourceAliasMap;
                        }
                        this._resourceAliasMap = new TSCore.Data.Dictionary();
                        var resources = this.getDataService().getResources();
                        resources.each(function (resourceName, resource) {
                            _this._resourceAliasMap.set(resource.getSingleKey(), resourceName);
                            _this._resourceAliasMap.set(resource.getMultipleKey(), resourceName);
                        });
                        return this._resourceAliasMap;
                    };
                    return ApiDataSource;
                })();
                DataSources.ApiDataSource = ApiDataSource;
            })(DataSources = Data.DataSources || (Data.DataSources = {}));
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
///<reference path="../IDataSource.ts"/>
///<reference path="../Query/Query.ts"/>
///<reference path="../Graph/Graph.ts"/>
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var DataSources;
            (function (DataSources) {
                var Graph = TSCore.App.Data.Graph.Graph;
                var MemoryDataSource = (function () {
                    function MemoryDataSource($q, logger) {
                        this.$q = $q;
                        this.logger = logger;
                        this._graph = new Graph;
                        this._queryResultMap = new TSCore.Data.Dictionary();
                        this.logger = this.logger.child('MemoryDataSource');
                    }
                    MemoryDataSource.prototype.setDataService = function (service) {
                        this._dataService = service;
                    };
                    MemoryDataSource.prototype.getDataService = function () {
                        return this._dataService;
                    };
                    MemoryDataSource.prototype.execute = function (query) {
                        this.logger.info('execute');
                        var serializedQuery = query.serialize(MemoryDataSource.QUERY_SERIALIZE_FIELDS);
                        var queryResult = this._queryResultMap.get(serializedQuery);
                        if (queryResult) {
                            this.logger.info('resolve cached results');
                            return this.$q.when({
                                data: this._graph,
                                results: _.clone(queryResult.references)
                            });
                        }
                        return this.$q.reject();
                    };
                    MemoryDataSource.prototype.create = function (resourceName, data) {
                        this.logger.info('create');
                        return this.$q.reject();
                    };
                    MemoryDataSource.prototype.update = function (resourceName, resourceId, data) {
                        this.logger.info('update');
                        return this.$q.reject();
                    };
                    MemoryDataSource.prototype.remove = function (resourceName, resourceId) {
                        this.logger.info('remove');
                        return this.$q.reject();
                    };
                    MemoryDataSource.prototype.notifyExecute = function (query, response) {
                        this.logger.info('notifyExecute - query ', query, ' - response', response);
                        var serializedQuery = query.serialize(MemoryDataSource.QUERY_SERIALIZE_FIELDS);
                        this._graph.merge(response.data);
                        this._queryResultMap.set(serializedQuery, {
                            query: _.clone(query),
                            references: _.clone(response.results)
                        });
                        return this.$q.when();
                    };
                    MemoryDataSource.prototype.notifyCreate = function (response) {
                        this.logger.info('notifyCreate - response', response);
                        return this.$q.when();
                    };
                    MemoryDataSource.prototype.notifyUpdate = function (response) {
                        this.logger.info('notifyUpdate - response', response);
                        return this.$q.when();
                    };
                    MemoryDataSource.prototype.notifyRemove = function (response) {
                        this.logger.info('notifyRemove - response', response);
                        return this.$q.when();
                    };
                    MemoryDataSource.prototype.clear = function () {
                        return null;
                    };
                    MemoryDataSource.QUERY_SERIALIZE_FIELDS = ["from", "conditions", "sorters"];
                    return MemoryDataSource;
                })();
                DataSources.MemoryDataSource = MemoryDataSource;
            })(DataSources = Data.DataSources || (Data.DataSources = {}));
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
/// <reference path="Api/RequestHandler.ts" />
/// <reference path="Data/Transformer.ts" />
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Resource = (function () {
            function Resource() {
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
            Resource.prototype.requestHandler = function (handler) {
                this._requestHandler = handler;
                return this;
            };
            Resource.prototype.getRequestHandler = function () {
                return this._requestHandler;
            };
            Resource.prototype.model = function (model) {
                this._model = model;
                return this;
            };
            Resource.prototype.getModel = function () {
                return this._model;
            };
            Resource.prototype.transformer = function (transformer) {
                this._transformer = transformer;
                return this;
            };
            Resource.prototype.getTransformer = function () {
                return this._transformer;
            };
            return Resource;
        })();
        App.Resource = Resource;
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
/// <reference path="../../ts-core/build/ts-core.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="TSCore/App/Api/IResource.ts" />
/// <reference path="TSCore/App/Api/RequestHandler.ts" />
/// <reference path="TSCore/App/Api/Service.ts" />
/// <reference path="TSCore/App/App.ts" />
/// <reference path="TSCore/App/Auth/AccountType.ts" />
/// <reference path="TSCore/App/Auth/Manager.ts" />
/// <reference path="TSCore/App/Auth/Session.ts" />
/// <reference path="TSCore/App/Constants/HttpMethods.ts" />
/// <reference path="TSCore/App/Data/DataSources/ApiDataSource.ts" />
/// <reference path="TSCore/App/Data/DataSources/MemoryDataSource.ts" />
/// <reference path="TSCore/App/Data/Graph/Builder.ts" />
/// <reference path="TSCore/App/Data/Graph/Graph.ts" />
/// <reference path="TSCore/App/Data/Graph/Reference.ts" />
/// <reference path="TSCore/App/Data/IDataSource.ts" />
/// <reference path="TSCore/App/Data/IDataSourceResponse.ts" />
/// <reference path="TSCore/App/Data/IResource.ts" />
/// <reference path="TSCore/App/Data/Model/ActiveModel.ts" />
/// <reference path="TSCore/App/Data/Query/Condition.ts" />
/// <reference path="TSCore/App/Data/Query/Query.ts" />
/// <reference path="TSCore/App/Data/Query/Sorter.ts" />
/// <reference path="TSCore/App/Data/Service.ts" />
/// <reference path="TSCore/App/Data/Transformer.ts" />
/// <reference path="TSCore/App/Http/RequestOptions.ts" />
/// <reference path="TSCore/App/Http/Service.ts" />
/// <reference path="TSCore/App/Interceptors/HttpInterceptor.ts" />
/// <reference path="TSCore/App/Interceptors/StateInterceptor.ts" />
/// <reference path="TSCore/App/Resource.ts" />
//# sourceMappingURL=ts-core-app.js.map