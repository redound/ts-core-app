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
                RequestOptions.prototype.param = function (name, value) {
                    this._params = this._params || {};
                    this._params[name] = value;
                    return this;
                };
                RequestOptions.prototype.getParams = function () {
                    return this._params;
                };
                RequestOptions.prototype.getRequestConfig = function () {
                    return _.extend({
                        headers: this.getHeaders(),
                        method: this.getMethod(),
                        url: this.getUrl(),
                        data: this.getData(),
                        params: this.getParams()
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
///<reference path="Reference.ts"/>
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
                    Graph.prototype.setData = function (data) {
                        this._data = data;
                    };
                    Graph.prototype.getData = function () {
                        return this._data;
                    };
                    Graph.prototype.get = function (path, callback) {
                        path = this._optimizePath(path);
                        var value = this._getValueForPath(path);
                        function getAtEndIndex(path, index) {
                            path = _.clone(path) || [];
                            path.reverse();
                            return path[index] || null;
                        }
                        var parentKey = getAtEndIndex(path, 1);
                        var key = getAtEndIndex(path, 0);
                        return this._resolveValueRecursive(parentKey, key, value, callback);
                    };
                    Graph.prototype.setValue = function () {
                    };
                    Graph.prototype.getValue = function (path) {
                        path = this._optimizePath(path);
                        return this._getValueForPath(path);
                    };
                    Graph.prototype.getGraphForPath = function (path) {
                        var _this = this;
                        var graph = new Graph();
                        var value = this.getValue(path);
                        this._extractReferences(value, function (reference) {
                            var referencePath = reference.value;
                            var referenceValue = _this.getValue(referencePath);
                            if (referenceValue) {
                                graph.set(referencePath, referenceValue);
                            }
                        });
                        if (value) {
                            graph.set(path, value);
                        }
                        return graph;
                    };
                    Graph.prototype.getGraphForReferences = function (references) {
                        var _this = this;
                        var graph = new Graph;
                        _.each(references, function (reference) {
                            var pathGraph = _this.getGraphForPath(reference.value);
                            graph.merge(pathGraph);
                        });
                        return graph;
                    };
                    Graph.prototype._getValueForPath = function (path) {
                        var root = path ? this._data : null;
                        var pathLength = path && path.length ? path.length : 0;
                        for (var i = 0; i < pathLength; i++) {
                            var part = path[i];
                            if (root[part] !== void 0) {
                                root = root[part];
                            }
                            else {
                                root = null;
                                break;
                            }
                        }
                        return root;
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
                    Graph.prototype.hasItem = function (resourceName, resourceId) {
                        return !!this._optimizePath([resourceName, resourceId]);
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
                    Graph.prototype.countItems = function (resourceName) {
                        return this.getItems(resourceName).length;
                    };
                    Graph.prototype.removeItems = function (resourceName) {
                        this.unset([resourceName]);
                    };
                    Graph.prototype.removeItem = function (resourceName, resourceId) {
                        this.unset([resourceName, resourceId]);
                    };
                    Graph.prototype.getReferences = function (resourceName) {
                        return _.map(this._data[resourceName], function (item, resourceId) {
                            return new Graph_1.Reference(resourceName, resourceId);
                        });
                    };
                    Graph.prototype.merge = function (graph) {
                        this.mergeData(graph.getData());
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
                    Graph.prototype._extractReferences = function (data, callback) {
                        var _this = this;
                        if (!_.isObject(data)) {
                            return;
                        }
                        _.each(data, function (value) {
                            if (_this._isReference(value)) {
                                var reference = value;
                                value = _this.getValue(reference.value);
                                _this._extractReferences(value, callback);
                                callback(reference);
                            }
                            else {
                                _this._extractReferences(value, callback);
                            }
                        });
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
                        if (_.isObject(value) && !_.isArray(value) && callback) {
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
                (function (ConditionType) {
                    ConditionType[ConditionType["AND"] = 0] = "AND";
                    ConditionType[ConditionType["OR"] = 1] = "OR";
                })(Query.ConditionType || (Query.ConditionType = {}));
                var ConditionType = Query.ConditionType;
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
                (function (ConditionOperator) {
                    ConditionOperator[ConditionOperator["IS_EQUAL"] = 0] = "IS_EQUAL";
                    ConditionOperator[ConditionOperator["IS_GREATER_THAN"] = 1] = "IS_GREATER_THAN";
                    ConditionOperator[ConditionOperator["IS_GREATER_THAN_OR_EQUAL"] = 2] = "IS_GREATER_THAN_OR_EQUAL";
                    ConditionOperator[ConditionOperator["IS_IN"] = 3] = "IS_IN";
                    ConditionOperator[ConditionOperator["IS_LESS_THAN"] = 4] = "IS_LESS_THAN";
                    ConditionOperator[ConditionOperator["IS_LESS_THAN_OR_EQUAL"] = 5] = "IS_LESS_THAN_OR_EQUAL";
                    ConditionOperator[ConditionOperator["IS_LIKE"] = 6] = "IS_LIKE";
                    ConditionOperator[ConditionOperator["IS_NOT_EQUAL"] = 7] = "IS_NOT_EQUAL";
                })(Query.ConditionOperator || (Query.ConditionOperator = {}));
                var ConditionOperator = Query.ConditionOperator;
            })(Query = Data.Query || (Data.Query = {}));
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
///<reference path="ConditionType.ts"/>
///<reference path="ConditionOperator.ts"/>
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var Query;
            (function (Query) {
                var Condition = (function () {
                    function Condition(type, field, operator, value) {
                        this.type = type;
                        this.field = field;
                        this.operator = operator;
                        this.value = value;
                    }
                    Condition.prototype.getType = function () {
                        return this.type;
                    };
                    Condition.prototype.getField = function () {
                        return this.field;
                    };
                    Condition.prototype.getOperator = function () {
                        return this.operator;
                    };
                    Condition.prototype.getValue = function () {
                        return this.value;
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
                        this.field = field;
                        this.direction = direction;
                    }
                    Sorter.prototype.getField = function () {
                        return this.field;
                    };
                    Sorter.prototype.getDirection = function () {
                        return this.direction;
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
                    function Query(executor) {
                        this._offset = null;
                        this._limit = null;
                        this._fields = [];
                        this._conditions = [];
                        this._sorters = [];
                        this._includes = [];
                        this._executor = executor;
                    }
                    Query.prototype.executor = function (executor) {
                        this._executor = executor;
                        return this;
                    };
                    Query.prototype.getExecutor = function () {
                        return this._executor;
                    };
                    Query.prototype.hasExecutor = function () {
                        return !!this._executor;
                    };
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
                    Query.prototype.multipleConditions = function (conditions) {
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
                    Query.prototype.multipleSorters = function (sorters) {
                        this._sorters = this._sorters.concat(sorters);
                        return this;
                    };
                    Query.prototype.getSorters = function () {
                        return this._sorters;
                    };
                    Query.prototype.hasSorters = function () {
                        return (this._sorters.length > 0);
                    };
                    Query.prototype.include = function (include) {
                        this._includes.push(include);
                        return this;
                    };
                    Query.prototype.multipleIncludes = function (includes) {
                        this._includes = this._includes.concat(includes);
                        return this;
                    };
                    Query.prototype.getIncludes = function () {
                        return this._includes;
                    };
                    Query.prototype.hasIncludes = function () {
                        return (this._includes.length > 0);
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
                    Query.prototype.execute = function () {
                        if (!this.hasExecutor()) {
                            throw 'Unable to execute query, no executor set';
                        }
                        return this._executor.execute(this);
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
                            this.multipleConditions(query.getConditions());
                        }
                        if (query.hasSorters()) {
                            this.multipleSorters(query.getSorters());
                        }
                        if (query.hasIncludes()) {
                            this.multipleIncludes(query.getIncludes());
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
///<reference path="../Data/Query/Query.ts"/>
///<reference path="../Data/Query/IQueryExecutor.ts"/>
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
                Service.prototype.setResources = function (resources) {
                    var _this = this;
                    this._resources = resources.clone();
                    this._resources.each(function (resourceName, resource) {
                        var requestHandler = resource.getRequestHandler();
                        if (requestHandler) {
                            requestHandler.setApiService(_this);
                            requestHandler.setResourceName(resourceName);
                            requestHandler.setResource(resource);
                        }
                    });
                    return this;
                };
                Service.prototype.resource = function (name, resource) {
                    this._resources.set(name, resource);
                    return this;
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
                Service.prototype.getRequestHandler = function (resourceName) {
                    var resource = this._resources.get(resourceName);
                    if (!resource) {
                        return null;
                    }
                    return resource.getRequestHandler();
                };
                Service.prototype.getRequestHandlerAsync = function (resourceName) {
                    return this.getResourceAsync(resourceName).then(function (resource) {
                        return resource.getRequestHandler();
                    });
                };
                Service.prototype.execute = function (query) {
                    var resourceName = query.getFrom();
                    return this.getRequestHandlerAsync(resourceName).then(function (requestHandler) {
                        return requestHandler.execute(query);
                    });
                };
                Service.prototype.all = function (resourceName) {
                    return this.getRequestHandlerAsync(resourceName).then(function (requestHandler) {
                        return requestHandler.all();
                    });
                };
                Service.prototype.find = function (resourceName, resourceId) {
                    return this.getRequestHandlerAsync(resourceName).then(function (requestHandler) {
                        return requestHandler.find(resourceId);
                    });
                };
                Service.prototype.create = function (resourceName, data) {
                    return this.getRequestHandlerAsync(resourceName).then(function (requestHandler) {
                        return requestHandler.create(data);
                    });
                };
                Service.prototype.update = function (resourceName, resourceId, data) {
                    return this.getRequestHandlerAsync(resourceName).then(function (requestHandler) {
                        return requestHandler.update(resourceId, data);
                    });
                };
                Service.prototype.remove = function (resourceName, resourceId) {
                    return this.getRequestHandlerAsync(resourceName).then(function (requestHandler) {
                        return requestHandler.remove(resourceId);
                    });
                };
                return Service;
            })();
            Api.Service = Service;
        })(Api = App.Api || (App.Api = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
///<reference path="../Http/RequestOptions.ts"/>
///<reference path="../Data/Query/Query.ts"/>
///<reference path="../Data/Query/IQueryExecutor.ts"/>
///<reference path="./Service.ts"/>
///<reference path="./IRequestHandlerPlugin.ts"/>
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Api;
        (function (Api) {
            var RequestOptions = TSCore.App.Http.RequestOptions;
            var List = TSCore.Data.List;
            (function (RequestHandlerFeatures) {
                RequestHandlerFeatures[RequestHandlerFeatures["OFFSET"] = 0] = "OFFSET";
                RequestHandlerFeatures[RequestHandlerFeatures["LIMIT"] = 1] = "LIMIT";
                RequestHandlerFeatures[RequestHandlerFeatures["FIELDS"] = 2] = "FIELDS";
                RequestHandlerFeatures[RequestHandlerFeatures["CONDITIONS"] = 3] = "CONDITIONS";
                RequestHandlerFeatures[RequestHandlerFeatures["SORTERS"] = 4] = "SORTERS";
                RequestHandlerFeatures[RequestHandlerFeatures["INCLUDES"] = 5] = "INCLUDES";
            })(Api.RequestHandlerFeatures || (Api.RequestHandlerFeatures = {}));
            var RequestHandlerFeatures = Api.RequestHandlerFeatures;
            var RequestHandler = (function () {
                function RequestHandler($q, httpService) {
                    this.$q = $q;
                    this.httpService = httpService;
                    this._plugins = new List();
                }
                RequestHandler.prototype.setApiService = function (apiService) {
                    this._apiService = apiService;
                };
                RequestHandler.prototype.getApiService = function () {
                    return this._apiService;
                };
                RequestHandler.prototype.setResourceName = function (name) {
                    this._resourceName = name;
                };
                RequestHandler.prototype.getResourceName = function () {
                    return this._resourceName;
                };
                RequestHandler.prototype.setResource = function (resource) {
                    this._resource = resource;
                };
                RequestHandler.prototype.getResource = function () {
                    return this._resource;
                };
                RequestHandler.prototype.plugin = function (plugin) {
                    this._plugins.add(plugin);
                    return this;
                };
                RequestHandler.prototype.request = function (requestOptions) {
                    var prefix = this.getResource().getPrefix();
                    var relativeUrl = requestOptions.getUrl();
                    requestOptions.url(prefix + relativeUrl);
                    return this.httpService.request(requestOptions);
                };
                RequestHandler.prototype.execute = function (query) {
                    var requestOptions = RequestOptions.get('/');
                    if (query.hasFind()) {
                        var id = query.getFind();
                        requestOptions = RequestOptions.get('/:id', { id: id });
                    }
                    var allowedFeatures = [];
                    this._plugins.each(function (plugin) {
                        allowedFeatures.push(plugin.execute(requestOptions, query));
                    });
                    allowedFeatures = _.flatten(allowedFeatures);
                    var usedFeatures = this._getUsedFeatures(query);
                    var forbiddenFeatures = _.difference(usedFeatures, allowedFeatures);
                    if (forbiddenFeatures.length > 0) {
                        return this.$q.reject();
                    }
                    return this.request(requestOptions);
                };
                RequestHandler.prototype._getUsedFeatures = function (query) {
                    var features = [];
                    if (query.hasOffset()) {
                        features.push(RequestHandlerFeatures.OFFSET);
                    }
                    if (query.hasLimit()) {
                        features.push(RequestHandlerFeatures.LIMIT);
                    }
                    if (query.hasFields()) {
                        features.push(RequestHandlerFeatures.FIELDS);
                    }
                    if (query.hasConditions()) {
                        features.push(RequestHandlerFeatures.CONDITIONS);
                    }
                    if (query.hasSorters()) {
                        features.push(RequestHandlerFeatures.SORTERS);
                    }
                    if (query.hasIncludes()) {
                        features.push(RequestHandlerFeatures.INCLUDES);
                    }
                    return features;
                };
                RequestHandler.prototype.all = function () {
                    return this.request(RequestOptions
                        .get('/'));
                };
                RequestHandler.prototype.find = function (id) {
                    return this.request(RequestOptions
                        .get('/:id', { id: id }));
                };
                RequestHandler.prototype.create = function (data) {
                    return this.request(RequestOptions
                        .post('/')
                        .data(data));
                };
                RequestHandler.prototype.update = function (id, data) {
                    return this.request(RequestOptions
                        .put('/:id', { id: id })
                        .data(data));
                };
                RequestHandler.prototype.remove = function (id) {
                    return this.request(RequestOptions
                        .delete('/:id', { id: id }));
                };
                return RequestHandler;
            })();
            Api.RequestHandler = RequestHandler;
        })(Api = App.Api || (App.Api = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
///<reference path="./RequestHandler.ts"/>
///<reference path="../Http/RequestOptions.ts"/>
///<reference path="../Data/Query/Query.ts"/>
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
                Transformer.prototype.transformRequest = function (data) {
                    return data;
                };
                Transformer.prototype.transform = function (item) {
                    return item;
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
                Transformer.transformRequest = function (data) {
                    var transformer = new this;
                    return transformer.transformRequest(data);
                };
                return Transformer;
            })(TSCore.BaseObject);
            Data.Transformer = Transformer;
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
///<reference path="../Data/Transformer.ts"/>
///<reference path="../../Data/Query/Query.ts"/>
///<reference path="../../Http/RequestOptions.ts"/>
///<reference path="../RequestHandler.ts"/>
///<reference path="../IRequestHandlerPlugin.ts"/>
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Api;
        (function (Api) {
            var RequestHandlerPlugins;
            (function (RequestHandlerPlugins) {
                var LimitRequestHandlerPlugin = (function () {
                    function LimitRequestHandlerPlugin() {
                    }
                    LimitRequestHandlerPlugin.prototype.execute = function (requestOptions, query) {
                        if (query.hasLimit()) {
                            requestOptions.param('limit', query.getLimit());
                        }
                        return [Api.RequestHandlerFeatures.LIMIT];
                    };
                    return LimitRequestHandlerPlugin;
                })();
                RequestHandlerPlugins.LimitRequestHandlerPlugin = LimitRequestHandlerPlugin;
            })(RequestHandlerPlugins = Api.RequestHandlerPlugins || (Api.RequestHandlerPlugins = {}));
        })(Api = App.Api || (App.Api = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
///<reference path="../../Data/Query/Query.ts"/>
///<reference path="../../Http/RequestOptions.ts"/>
///<reference path="../RequestHandler.ts"/>
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Api;
        (function (Api) {
            var RequestHandlerPlugins;
            (function (RequestHandlerPlugins) {
                var OffsetRequestHandlerPlugin = (function () {
                    function OffsetRequestHandlerPlugin() {
                    }
                    OffsetRequestHandlerPlugin.prototype.execute = function (requestOptions, query) {
                        if (query.hasOffset()) {
                            requestOptions.param('offset', query.getOffset());
                        }
                        return [Api.RequestHandlerFeatures.OFFSET];
                    };
                    return OffsetRequestHandlerPlugin;
                })();
                RequestHandlerPlugins.OffsetRequestHandlerPlugin = OffsetRequestHandlerPlugin;
            })(RequestHandlerPlugins = Api.RequestHandlerPlugins || (Api.RequestHandlerPlugins = {}));
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
                        return this._dataService.find(this._resourceName, this.getId()).then(function (response) {
                            var model = response.data;
                            if (model instanceof Model && !_this.equals(model)) {
                                _this.merge(model);
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
            var ModelList = TSCore.Data.ModelList;
            var Query = TSCore.App.Data.Query.Query;
            var ActiveModel = TSCore.App.Data.Model.ActiveModel;
            var Service = (function () {
                function Service($q) {
                    this.$q = $q;
                    this._sources = new List();
                    this._resources = new TSCore.Data.Dictionary();
                    this._resourceDelegateCache = new TSCore.Data.Dictionary();
                }
                Service.prototype.source = function (source) {
                    this._sources.add(source);
                    source.setDataService(this);
                    return this;
                };
                Service.prototype.getSources = function () {
                    return this._sources.clone();
                };
                Service.prototype.setResources = function (resources) {
                    this._resources = resources.clone();
                    return this;
                };
                Service.prototype.resource = function (name, resource) {
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
                Service.prototype.getResourceDelegate = function (resourceName) {
                    if (this._resourceDelegateCache.contains(resourceName)) {
                        return this._resourceDelegateCache.get(resourceName);
                    }
                    var delegate = new Data.ResourceDelegate(this, resourceName);
                    this._resourceDelegateCache.set(resourceName, delegate);
                    return delegate;
                };
                Service.prototype.query = function (resourceName) {
                    return new Query(this).from(resourceName);
                };
                Service.prototype.all = function (resourceName) {
                    return this.execute(this.query(resourceName));
                };
                Service.prototype.find = function (resourceName, resourceId) {
                    return this.execute(this.query(resourceName)
                        .find(resourceId)).then(function (response) {
                        return {
                            response: response.response,
                            data: response.data.first()
                        };
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
                        return {
                            response: response,
                            data: _this._createModels(response)
                        };
                    });
                };
                Service.prototype._createModels = function (response) {
                    var _this = this;
                    var graph = response.graph;
                    var references = response.references;
                    var models = new ModelList();
                    _.each(references, function (reference) {
                        var resolveModel = graph.get(reference.value, function (resourceName, item) {
                            var resource = _this.getResource(resourceName);
                            var modelClass = resource.getModel();
                            var model = new modelClass(item);
                            if (model instanceof ActiveModel) {
                                model.activate(_this, resourceName);
                                model.setSavedData(graph);
                            }
                            return model;
                        });
                        if (resolveModel) {
                            models.add(resolveModel);
                        }
                    });
                    return models;
                };
                Service.prototype.create = function (resourceName, data) {
                    var _this = this;
                    return this._executeCreate(resourceName, data).then(function (response) {
                        return {
                            response: response,
                            data: _this._createModels(response)[0] || null
                        };
                    });
                };
                Service.prototype.createModel = function (resourceName, model, data) {
                    var _this = this;
                    if (data) {
                        model.assignAll(data);
                    }
                    return this._executeCreate(resourceName, model.toObject(true)).then(function (response) {
                        model = Service._updateModel(model, response.references);
                        if (model instanceof ActiveModel) {
                            model.activate(_this, resourceName);
                        }
                        return {
                            response: response,
                            data: model
                        };
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
                    return this._executeUpdate(resourceName, resourceId, data).then(function (response) {
                        return {
                            response: response,
                            data: _this._createModels(response)[0] || null
                        };
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
///<reference path="../Query/IQueryExecutor.ts"/>
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
                var Reference = TSCore.App.Data.Graph.Reference;
                var Graph = TSCore.App.Data.Graph.Graph;
                var Exception = TSCore.Exception.Exception;
                var ApiDataSource = (function () {
                    function ApiDataSource($q, apiService, logger) {
                        this.$q = $q;
                        this.apiService = apiService;
                        this.logger = logger;
                        this.logger = (this.logger || new TSCore.Logger.Logger()).child('ApiDataSource');
                    }
                    ApiDataSource.prototype.setDataService = function (service) {
                        this._dataService = service;
                    };
                    ApiDataSource.prototype.getDataService = function () {
                        return this._dataService;
                    };
                    ApiDataSource.prototype.execute = function (query) {
                        var _this = this;
                        this.logger.info('execute', query);
                        var resourceName = query.getFrom();
                        return this.apiService
                            .execute(query)
                            .then(function (response) { return _this._transformResponse(resourceName, response); });
                    };
                    ApiDataSource.prototype.create = function (resourceName, data) {
                        var _this = this;
                        this.logger.info('create');
                        data = this._transformRequest(resourceName, data);
                        return this.apiService
                            .create(resourceName, data)
                            .then(function (response) { return _this._transformResponse(resourceName, response); });
                    };
                    ApiDataSource.prototype.update = function (resourceName, resourceId, data) {
                        var _this = this;
                        this.logger.info('update');
                        data = this._transformRequest(resourceName, data);
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
                    ApiDataSource.prototype._transformRequest = function (resourceName, data) {
                        var resource = this.getDataService().getResource(resourceName);
                        if (!resource) {
                            throw new Exception('Resource `' + resourceName + '` could not be found!');
                        }
                        var transformer = resource.getTransformer();
                        return transformer.transformRequest(data);
                    };
                    ApiDataSource.prototype._transformResponse = function (resourceName, response) {
                        var _this = this;
                        return this.getDataService()
                            .getResourceAsync(resourceName)
                            .then(function (resource) { return _this._createDataSourceResponse(resourceName, resource, response); });
                    };
                    ApiDataSource.prototype._createDataSourceResponse = function (resourceName, resource, response) {
                        var total = response.data.total;
                        var data = response.data.data;
                        var included = response.data.included;
                        var dataGraph = this._createGraph(data);
                        var includedGraph = this._createGraph(included);
                        dataGraph.merge(includedGraph);
                        var meta = {};
                        if (total) {
                            meta.total = total;
                        }
                        return {
                            meta: meta,
                            graph: dataGraph,
                            references: _.map(data, function (item) {
                                return new Reference(resourceName, item.id);
                            })
                        };
                    };
                    ApiDataSource.prototype._createGraph = function (data) {
                        var _this = this;
                        var graph = new Graph();
                        this._extractResource(data, function (resourceName, resourceId, attributes, relationships) {
                            var resource = _this.getDataService().getResource(resourceName);
                            if (!resource) {
                                throw new Exception('Resource `' + resourceName + '` could not be found!');
                            }
                            var transformer = resource.getTransformer();
                            var model = resource.getModel();
                            var primaryKey = model.primaryKey();
                            attributes[primaryKey] = parseInt(resourceId);
                            var item = attributes;
                            item = transformer.item(attributes);
                            _.each(relationships, function (relationship, propertyName) {
                                if (_.isArray(relationship.data)) {
                                    item[propertyName] = _.map(relationship.data, function (ref) {
                                        var resourceName = ref.type;
                                        var resourceId = ref.id;
                                        return new Reference(resourceName, resourceId);
                                    });
                                    return;
                                }
                                if (_.isObject(relationship.data)) {
                                    var ref = relationship.data;
                                    var resourceName = ref.type;
                                    var resourceId = ref.id;
                                    item[propertyName] = new Reference(resourceName, resourceId);
                                    return;
                                }
                                item[propertyName] = relationship.data;
                            });
                            graph.setItem(resourceName, resourceId, item);
                        });
                        return graph;
                    };
                    ApiDataSource.prototype._extractResource = function (results, callback) {
                        if (_.isArray(results)) {
                            _.each(results, function (result) { return callback(result.type, result.id, result.attributes, result.relationships); });
                        }
                        else if (_.isObject(results)) {
                            callback(results.type, results.id, results.attributes, results.relationships);
                        }
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
                var Reference = TSCore.App.Data.Graph.Reference;
                var DynamicList = TSCore.Data.DynamicList;
                (function (ResourceFlag) {
                    ResourceFlag[ResourceFlag["DATA_COMPLETE"] = 0] = "DATA_COMPLETE";
                })(DataSources.ResourceFlag || (DataSources.ResourceFlag = {}));
                var ResourceFlag = DataSources.ResourceFlag;
                var MemoryDataSource = (function () {
                    function MemoryDataSource($q, logger) {
                        this.$q = $q;
                        this.logger = logger;
                        this._graph = new Graph;
                        this._queryResultMap = new TSCore.Data.Dictionary();
                        this._resourceFlags = new TSCore.Data.Dictionary();
                        this.logger = (this.logger || new TSCore.Logger.Logger()).child('MemoryDataSource');
                    }
                    MemoryDataSource.prototype.setDataService = function (service) {
                        this._dataService = service;
                    };
                    MemoryDataSource.prototype.getDataService = function () {
                        return this._dataService;
                    };
                    MemoryDataSource.prototype.execute = function (query) {
                        this.logger.info('execute');
                        return this.$q.reject();
                        if (query.hasFind()) {
                            var resourceName = query.getFrom();
                            var resourceId = query.getFind();
                            if (this._graph.hasItem(resourceName, resourceId)) {
                                var references = [new Reference(resourceName, resourceId)];
                                var response = {
                                    meta: {},
                                    graph: this._graph.getGraphForReferences(references),
                                    references: references
                                };
                                this.logger.info('resolve', response);
                                return this.$q.when(response);
                            }
                            else {
                                return this.$q.reject();
                            }
                        }
                        var serializedQuery = query.serialize(MemoryDataSource.QUERY_SERIALIZE_FIELDS);
                        var queryResult = this._queryResultMap.get(serializedQuery);
                        if (queryResult) {
                            var referenceList = queryResult.references;
                            var offset = query.getOffset();
                            var limit = query.getLimit();
                            if (!referenceList.containsRange(offset, limit)) {
                                return this.$q.reject();
                            }
                            var references = referenceList.getRange(offset, limit);
                            this.logger.info('resolve cached results');
                            var response = {
                                meta: queryResult.meta,
                                graph: this._graph.getGraphForReferences(references),
                                references: _.clone(references)
                            };
                            this.logger.info('resolve', response);
                            return this.$q.when(response);
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
                        this._graph.merge(response.graph);
                        var serializedQuery = query.serialize(MemoryDataSource.QUERY_SERIALIZE_FIELDS);
                        var references = _.clone(response.references);
                        var offset = query.getOffset() || 0;
                        if ((response.meta.total && this._graph.countItems(query.getFrom()) === response.meta.total) || (!query.hasOffset() && !query.hasLimit())) {
                        }
                        var queryResult = this._queryResultMap.get(serializedQuery);
                        if (!queryResult) {
                            queryResult = {
                                meta: response.meta,
                                query: _.clone(query),
                                references: new DynamicList()
                            };
                        }
                        queryResult.references.setRange(offset, references);
                        this._queryResultMap.set(serializedQuery, queryResult);
                        return this.$q.when();
                    };
                    MemoryDataSource.prototype._resourceHasFlag = function (resourceName, flag) {
                        var flags = this._resourceFlags.get(resourceName);
                        if (!flags) {
                            return false;
                        }
                        return flags.contains(flag);
                    };
                    MemoryDataSource.prototype._setResourceFlag = function (resourceName, flag) {
                        console.log('resourceName', resourceName, 'flag', flag);
                        var flags = this._resourceFlags.get(resourceName);
                        if (!flags) {
                            flags = new TSCore.Data.Collection();
                            this._resourceFlags.set(resourceName, flags);
                        }
                        flags.add(flag);
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
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var ResourceDelegate = (function () {
                function ResourceDelegate(dataService, resourceName) {
                    this._dataService = dataService;
                    this._resourceName = resourceName;
                }
                ResourceDelegate.prototype.query = function () {
                    return this._dataService.query(this._resourceName);
                };
                ResourceDelegate.prototype.all = function () {
                    return this._dataService.all(this._resourceName);
                };
                ResourceDelegate.prototype.find = function (resourceId) {
                    return this._dataService.find(this._resourceName, resourceId);
                };
                ResourceDelegate.prototype.create = function (data) {
                    return this._dataService.create(this._resourceName, data);
                };
                ResourceDelegate.prototype.createModel = function (model, data) {
                    return this._dataService.createModel(this._resourceName, model, data);
                };
                ResourceDelegate.prototype.update = function (resourceId, data) {
                    return this._dataService.update(this._resourceName, resourceId, data);
                };
                ResourceDelegate.prototype.updateModel = function (model, data) {
                    return this._dataService.updateModel(this._resourceName, model, data);
                };
                ResourceDelegate.prototype.remove = function (resourceId) {
                    return this._dataService.remove(this._resourceName, resourceId);
                };
                ResourceDelegate.prototype.removeModel = function (model) {
                    return this._dataService.removeModel(this._resourceName, model);
                };
                return ResourceDelegate;
            })();
            Data.ResourceDelegate = ResourceDelegate;
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
/// <reference path="TSCore/App/Api/IRequestHandlerPlugin.ts" />
/// <reference path="TSCore/App/Api/IResource.ts" />
/// <reference path="TSCore/App/Api/RequestHandler.ts" />
/// <reference path="TSCore/App/Api/RequestHandlerPlugins/LimitRequestHandlerPlugin.ts" />
/// <reference path="TSCore/App/Api/RequestHandlerPlugins/OffsetRequestHandlerPlugin.ts" />
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
/// <reference path="TSCore/App/Data/Query/ConditionOperator.ts" />
/// <reference path="TSCore/App/Data/Query/ConditionType.ts" />
/// <reference path="TSCore/App/Data/Query/IQueryExecutor.ts" />
/// <reference path="TSCore/App/Data/Query/Query.ts" />
/// <reference path="TSCore/App/Data/Query/Sorter.ts" />
/// <reference path="TSCore/App/Data/ResourceDelegate.ts" />
/// <reference path="TSCore/App/Data/Service.ts" />
/// <reference path="TSCore/App/Data/Transformer.ts" />
/// <reference path="TSCore/App/Http/RequestOptions.ts" />
/// <reference path="TSCore/App/Http/Service.ts" />
/// <reference path="TSCore/App/Resource.ts" />
//# sourceMappingURL=ts-core-app.js.map