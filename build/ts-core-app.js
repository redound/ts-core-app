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
        var Data;
        (function (Data) {
            var DataSource;
            (function (DataSource) {
                var Api = (function () {
                    function Api() {
                    }
                    Api.prototype.get = function (query) {
                        throw 'ApiDatasource - Get - Not implemented yet';
                    };
                    Api.prototype.create = function (key, value) {
                        throw 'ApiDatasource - Create - Not implemented yet';
                    };
                    Api.prototype.update = function (key, value) {
                        throw 'ApiDatasource - Update - Not implemented yet';
                    };
                    Api.prototype.remove = function (key) {
                        throw 'ApiDatasource - Remove - Not implemented yet';
                    };
                    Api.prototype.clear = function () {
                        throw 'ApiDatasource - Clear - Not implemented yet';
                    };
                    Api.prototype.importResultSet = function (resultSet) {
                        throw 'ApiDatasource - ImportResultSet - Not implemented yet';
                    };
                    return Api;
                })();
                DataSource.Api = Api;
            })(DataSource = Data.DataSource || (Data.DataSource = {}));
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var DataSource;
            (function (DataSource) {
                var Dictionary = TSCore.Data.Dictionary;
                var Memory = (function () {
                    function Memory() {
                        this._store = new Dictionary();
                    }
                    Memory.prototype.get = function (query) {
                        throw 'MemoryDataSource - Get - Not implemented yet';
                    };
                    Memory.prototype.create = function (key, value) {
                        throw 'MemoryDataSource - Create - Not implemented yet';
                    };
                    Memory.prototype.update = function (key, value) {
                        throw 'MemoryDataSource - Update - Not implemented yet';
                    };
                    Memory.prototype.remove = function (key) {
                        throw 'MemoryDataSource - Remove - Not implemented yet';
                    };
                    Memory.prototype.clear = function () {
                        throw 'MemoryDataSource - Clear - Not implemented yet';
                    };
                    Memory.prototype.importResultSet = function (resultSet) {
                        throw 'MemoryDataSource - ImportResultSet - Not implemented yet';
                    };
                    return Memory;
                })();
                DataSource.Memory = Memory;
            })(DataSource = Data.DataSource || (Data.DataSource = {}));
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
            (function (ModelRelationType) {
                ModelRelationType[ModelRelationType["ONE"] = 0] = "ONE";
                ModelRelationType[ModelRelationType["MANY"] = 1] = "MANY";
            })(Data.ModelRelationType || (Data.ModelRelationType = {}));
            var ModelRelationType = Data.ModelRelationType;
            var Model = (function (_super) {
                __extends(Model, _super);
                function Model() {
                    _super.apply(this, arguments);
                }
                Model.relations = function () {
                    return {};
                };
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
            var Query;
            (function (Query) {
                var Exception = TSCore.Exception.Exception;
                (function (ConditionOperator) {
                    ConditionOperator[ConditionOperator["EQUALS"] = 0] = "EQUALS";
                    ConditionOperator[ConditionOperator["NOT_EQUALS"] = 1] = "NOT_EQUALS";
                    ConditionOperator[ConditionOperator["GREATER_THAN"] = 2] = "GREATER_THAN";
                    ConditionOperator[ConditionOperator["GREATER_THAN_EQUALS"] = 3] = "GREATER_THAN_EQUALS";
                    ConditionOperator[ConditionOperator["LESS_THAN"] = 4] = "LESS_THAN";
                    ConditionOperator[ConditionOperator["LESS_THAN_EQUALS"] = 5] = "LESS_THAN_EQUALS";
                })(Query.ConditionOperator || (Query.ConditionOperator = {}));
                var ConditionOperator = Query.ConditionOperator;
                var Condition = (function (_super) {
                    __extends(Condition, _super);
                    function Condition(property, operator, value) {
                        _super.call(this);
                        this._property = property;
                        this._operator = operator;
                        this._value = value;
                    }
                    Condition.prototype.getProperty = function () {
                        return this._property;
                    };
                    Condition.prototype.getOperator = function () {
                        return this._operator;
                    };
                    Condition.prototype.getValue = function () {
                        return this._value;
                    };
                    Condition.parse = function (conditionString) {
                        var conditionParts = conditionString.split(' ');
                        if (conditionParts.length != 3) {
                            throw new Exception('Condition "' + conditionString + '" invalid');
                        }
                        var property = conditionParts.shift().trim();
                        var operatorRaw = conditionParts.shift().trim();
                        var valueRaw = conditionParts.join(' ').trim();
                        var operator = null;
                        switch (operatorRaw) {
                            case '===':
                            case '==':
                                operator = ConditionOperator.EQUALS;
                                break;
                            case '<>':
                            case '!==':
                            case '!=':
                                operator = ConditionOperator.NOT_EQUALS;
                                break;
                            case '>':
                                operator = ConditionOperator.GREATER_THAN;
                                break;
                            case '>=':
                                operator = ConditionOperator.GREATER_THAN_EQUALS;
                                break;
                            case '<':
                                operator = ConditionOperator.LESS_THAN;
                                break;
                            case '<=':
                                operator = ConditionOperator.LESS_THAN_EQUALS;
                                break;
                        }
                        if (operator === null) {
                            throw new Exception('Condition "' + conditionString + '" contains invalid operator: "' + operatorRaw + '"');
                        }
                        var value = null;
                        var stringValue = this.VALUE_REGEX.test(valueRaw) ? valueRaw.substring(1, valueRaw.length - 1) : null;
                        var numberValue = parseInt(valueRaw);
                        if (valueRaw.toUpperCase() == 'NULL') {
                            value = null;
                        }
                        else if (stringValue) {
                            value = stringValue;
                        }
                        else if (!_.isNaN(numberValue)) {
                            value = numberValue;
                        }
                        else {
                            throw new Exception('Condition "' + conditionString + '" contains invalid formatted value: "' + valueRaw + '"');
                        }
                        return new Condition(property, operator, value);
                    };
                    Condition.VALUE_REGEX = /^["|'](?:[^("|')\\]|\\.)*["|']$/;
                    return Condition;
                })(TSCore.BaseObject);
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
                var DataQuery = (function (_super) {
                    __extends(DataQuery, _super);
                    function DataQuery() {
                        _super.apply(this, arguments);
                    }
                    DataQuery.prototype.find = function (id) {
                        this._itemId = id;
                        return this;
                    };
                    DataQuery.prototype.getItemId = function () {
                        return this._itemId;
                    };
                    DataQuery.prototype.withRelationConstraint = function (model, itemId) {
                        this._relationConstraints.add({
                            model: model,
                            itemId: itemId
                        });
                        return this;
                    };
                    DataQuery.prototype.getRelationConstraints = function () {
                        return this._relationConstraints.clone();
                    };
                    return DataQuery;
                })(TSCore.BaseObject);
                Query.DataQuery = DataQuery;
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
                var Collection = TSCore.Data.Collection;
                var List = TSCore.Data.List;
                var Dictionary = TSCore.Data.Dictionary;
                var Exception = TSCore.Exception.Exception;
                var ModelQuery = (function (_super) {
                    __extends(ModelQuery, _super);
                    function ModelQuery() {
                        _super.call(this);
                        this._includes = new Collection();
                        this._conditions = new List();
                        this._options = new Dictionary();
                    }
                    ModelQuery.prototype.from = function (repository) {
                        this._repository = repository;
                        return this;
                    };
                    ModelQuery.prototype.getFrom = function () {
                        return this._repository;
                    };
                    ModelQuery.prototype.find = function (id) {
                        this._itemId = id;
                        return this;
                    };
                    ModelQuery.prototype.getItemId = function () {
                        return this._itemId;
                    };
                    ModelQuery.prototype.condition = function (condition) {
                        this._conditions.add(condition);
                        return this;
                    };
                    ModelQuery.prototype.getConditions = function () {
                        return this._conditions.clone();
                    };
                    ModelQuery.prototype.where = function (conditions, bind) {
                        var _this = this;
                        var conditionParts = conditions.split(' AND ');
                        _.each(conditionParts, function (conditionItem) {
                            var resolvedCondition = _this._resolveTokens(conditionItem.trim(), bind);
                            _this.condition(Query.Condition.parse(resolvedCondition));
                        });
                        return this;
                    };
                    ModelQuery.prototype.having = function (values) {
                        var _this = this;
                        _.each(values, function (value, key) {
                            _this.condition(new Query.Condition(key, Query.ConditionOperator.EQUALS, value));
                        });
                        return this;
                    };
                    ModelQuery.prototype.include = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i - 0] = arguments[_i];
                        }
                        this._includes.addMany(args);
                        return this;
                    };
                    ModelQuery.prototype.getIncludes = function () {
                        return this._includes.clone();
                    };
                    ModelQuery.prototype.option = function (key, value) {
                        this._options.set(key, value);
                        return this;
                    };
                    ModelQuery.prototype.getOptions = function () {
                        return this._options.clone();
                    };
                    ModelQuery.prototype.execute = function () {
                        if (!this._repository) {
                            throw new Exception('Cannot execute query, unknown repository (from)');
                        }
                        return this._repository.get(this);
                    };
                    ModelQuery.prototype.executeSingle = function () {
                        if (!this._repository) {
                            throw new Exception('Cannot execute query, unknown repository (from)');
                        }
                        return this._repository.getFirst(this);
                    };
                    ModelQuery.prototype._resolveTokens = function (input, tokens) {
                        return input.replace(/:([^:]+):/g, function (token) {
                            var strippedToken = token.substring(1, token.length - 1);
                            var tokenValue = tokens[strippedToken];
                            if (_.isNull(tokenValue) || _.isNaN(tokenValue) || _.isUndefined(tokenValue)) {
                                return 'NULL';
                            }
                            else if (_.isNumber(tokenValue)) {
                                return tokenValue;
                            }
                            return "'" + tokenValue + "'";
                        });
                    };
                    return ModelQuery;
                })(TSCore.BaseObject);
                Query.ModelQuery = ModelQuery;
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
            var RemoteModelStore = (function () {
                function RemoteModelStore($q, $injector, endpoint, modelClass) {
                    this.$q = $q;
                    this.$injector = $injector;
                    this.endpoint = endpoint;
                    this.modelClass = modelClass;
                    this._loadedRequestConfigs = new TSCore.Data.Collection();
                    this._pendingRequests = new TSCore.Data.Dictionary();
                    this.store = new TSCore.Data.ModelDictionary(modelClass);
                }
                RemoteModelStore.prototype.list = function (queryOptions, requestOptions, fresh) {
                    var _this = this;
                    var loadConfig = {
                        requestOptions: requestOptions
                    };
                    var loadConfigString = JSON.stringify(loadConfig);
                    if (this._loadedRequestConfigs.contains(loadConfigString) && !fresh) {
                        var models = this.store.values();
                        var promises = [];
                        _.each(models, function (model) {
                            promises.push(_this._composeModel(model, queryOptions));
                        });
                        return this.$q.all(promises);
                    }
                    if (this._pendingRequests.contains(loadConfigString)) {
                        return this._pendingRequests.get(loadConfigString);
                    }
                    if (fresh) {
                        requestOptions = _.defaults(requestOptions || {}, { cache: false });
                    }
                    var promise = this.endpoint.list(queryOptions, requestOptions).then(function (response) {
                        _this._loadedRequestConfigs.add(loadConfigString);
                        _this._pendingRequests.remove(loadConfigString);
                        return _this._processListResponse(response, queryOptions);
                    });
                    this._pendingRequests.set(loadConfigString, promise);
                    return promise;
                };
                RemoteModelStore.prototype.get = function (id, queryOptions, requestOptions, fresh) {
                    var _this = this;
                    var loadConfig = {
                        id: id,
                        requestOptions: requestOptions
                    };
                    var loadConfigString = JSON.stringify(loadConfig);
                    if (this.queryCached(id, queryOptions) && !fresh) {
                        var model = this.store.get(id);
                        return this._composeModel(model, queryOptions);
                    }
                    if (this._pendingRequests.contains(loadConfigString)) {
                        return this._pendingRequests.get(loadConfigString);
                    }
                    if (fresh) {
                        requestOptions = _.defaults(requestOptions || {}, { cache: false });
                    }
                    var promise = this.endpoint.get(id, queryOptions, requestOptions).then(function (response) {
                        _this._loadedRequestConfigs.add(loadConfigString);
                        _this._pendingRequests.remove(loadConfigString);
                        return _this._processGetResponse(response, queryOptions);
                    });
                    this._pendingRequests.set(loadConfigString, promise);
                    return promise;
                };
                RemoteModelStore.prototype.create = function (model, requestOptions) {
                    var _this = this;
                    return this.endpoint.create(this.endpoint.transformRequest(model.toObject(false)), requestOptions).then(function (response) {
                        var resultModel = model;
                        if (response.data) {
                            resultModel = _this.importOne(response.data);
                        }
                        else {
                            _this.store.set(model[_this.modelClass.primaryKey()], model);
                        }
                        return resultModel;
                    });
                };
                RemoteModelStore.prototype.update = function (model, requestOptions) {
                    var _this = this;
                    var modelId = model[this.modelClass.primaryKey()];
                    return this.endpoint.update(modelId, this.endpoint.transformRequest(model.toObject(false)), requestOptions).then(function (response) {
                        var resultModel = model;
                        if (response.data) {
                            resultModel = _this.importOne(model);
                        }
                        else {
                            _this.store.set(model[_this.modelClass.primaryKey()], model);
                        }
                        return resultModel;
                    });
                };
                RemoteModelStore.prototype.delete = function (modelId, requestOptions) {
                    var _this = this;
                    return this.endpoint.delete(modelId, requestOptions).then(function (response) {
                        _this.store.remove(modelId);
                    });
                };
                RemoteModelStore.prototype.queryCached = function (id, queryOptions) {
                    var _this = this;
                    if (!this.store.contains(id)) {
                        return false;
                    }
                    var itemModel = this.store.get(id);
                    var includes = (queryOptions && queryOptions.include) || [];
                    if (!includes.length) {
                        return true;
                    }
                    var oneNotInCache = false;
                    _.each(includes, function (includeConfig) {
                        if (oneNotInCache) {
                            return;
                        }
                        var relationConfig = itemModel.static.relations()[includeConfig.relation];
                        var relationStore = _this.$injector.get(relationConfig.store);
                        var localKey = relationConfig.localKey;
                        switch (relationConfig.type) {
                            case Data.ModelRelationType.ONE:
                                var relationId = itemModel[localKey];
                                if (!relationStore.queryCached(relationId, includeConfig.queryOptions)) {
                                    oneNotInCache = true;
                                }
                                break;
                            case Data.ModelRelationType.MANY:
                                var relationIds = itemModel[localKey];
                                _.each(relationIds, function (relationId) {
                                    if (!relationStore.queryCached(relationId, includeConfig.queryOptions)) {
                                        oneNotInCache = true;
                                    }
                                });
                                break;
                        }
                    });
                    return !oneNotInCache;
                };
                RemoteModelStore.prototype.getMany = function (ids, userOptions, requestOptions, fresh) {
                    var _this = this;
                    var promises = [];
                    _.each(ids, function (id) {
                        promises.push(_this.get(id, userOptions, requestOptions, fresh));
                    });
                    return this.$q.all(promises).then(function (responses) {
                        return _.filter(responses, function (item) {
                            return item != null && item != undefined;
                        });
                    });
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
                RemoteModelStore.prototype.importOne = function (itemData) {
                    this._extractRelationData(itemData);
                    return this.store.addData(itemData);
                };
                RemoteModelStore.prototype.importMany = function (data) {
                    var _this = this;
                    _.each(data, function (itemData) {
                        _this._extractRelationData(itemData);
                    });
                    return this.store.addManyData(data);
                };
                RemoteModelStore.prototype._processListResponse = function (response, queryOptions) {
                    var _this = this;
                    var itemModels = this.importMany(response.data);
                    var promises = [];
                    _.each(itemModels, function (itemModel) {
                        promises.push(_this._composeModel(itemModel, queryOptions));
                    });
                    return this.$q.all(promises);
                };
                RemoteModelStore.prototype._processGetResponse = function (response, queryOptions) {
                    var itemModel = this.importOne(response.data);
                    return this._composeModel(itemModel, queryOptions);
                };
                RemoteModelStore.prototype._composeModel = function (itemModel, queryOptions) {
                    var _this = this;
                    var promises = [];
                    var includes = (queryOptions && queryOptions.include) || [];
                    var model = _.clone(itemModel);
                    _.each(includes, function (relationObject) {
                        var relationConfig = model.static.relations()[relationObject.relation];
                        if (!relationConfig) {
                            return;
                        }
                        var relationStore = _this.$injector.get(relationConfig.store);
                        var localKey = relationConfig.localKey;
                        switch (relationConfig.type) {
                            case Data.ModelRelationType.ONE:
                                var localKeyValue = model[localKey];
                                var getPromise = relationStore.get(localKeyValue, relationObject.queryOptions);
                                getPromise.then(function (relationModel) {
                                    model[relationObject.relation] = relationModel;
                                });
                                promises.push(getPromise);
                                break;
                            case Data.ModelRelationType.MANY:
                                var localKeyValues = _.isArray(model[localKey]) ? model[localKey] : [];
                                var listPromise = relationStore.getMany(localKeyValues, relationObject.queryOptions);
                                listPromise.then(function (relationModels) {
                                    model[relationObject.relation] = relationModels;
                                });
                                promises.push(listPromise);
                                break;
                        }
                    });
                    return this.$q.all(promises).then(function () {
                        return model;
                    });
                };
                RemoteModelStore.prototype._extractRelationData = function (itemData) {
                    var _this = this;
                    _.each(this.modelClass.relations(), function (relationConfig) {
                        var dataKey = relationConfig.dataKey;
                        var dataValue = dataKey && itemData ? itemData[dataKey] : null;
                        if (!dataValue) {
                            return;
                        }
                        var relationStore = _this.$injector.get(relationConfig.store);
                        switch (relationConfig.type) {
                            case Data.ModelRelationType.ONE:
                                relationStore.importOne(relationStore.endpoint.transformResponse(dataValue));
                                break;
                            case Data.ModelRelationType.MANY:
                                relationStore.importMany(_.map(dataValue, relationStore.endpoint.transformResponse));
                                break;
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
        var Data;
        (function (Data) {
            var ModelQuery = TSCore.App.Data.Query.ModelQuery;
            var List = TSCore.Data.List;
            var Exception = TSCore.Exception.Exception;
            var Repository = (function (_super) {
                __extends(Repository, _super);
                function Repository($q, $injector) {
                    _super.call(this);
                    this.$q = $q;
                    this.$injector = $injector;
                    this.dataSources = new List();
                }
                Repository.prototype.addDataSource = function (dataSource) {
                    this.dataSources.add(dataSource);
                };
                Repository.prototype.removeDataSource = function (dataSource) {
                    this.dataSources.remove(dataSource);
                };
                Repository.prototype.query = function () {
                    return new ModelQuery().from(this);
                };
                Repository.prototype.allQuery = function () {
                    return this.query();
                };
                Repository.prototype.all = function () {
                    return this.allQuery().execute();
                };
                Repository.prototype.findQuery = function (id) {
                    return new ModelQuery().find(id).from(this);
                };
                Repository.prototype.find = function (id) {
                    return this.findQuery(id).executeSingle();
                };
                Repository.prototype.get = function (query) {
                    var _this = this;
                    if (query.getFrom() != this) {
                        throw new Exception('ModelQuery\'s repository doesn\'t match executing repository');
                    }
                    var mainDataQuery = this._createMainDataQuery(query);
                    return this._executeDataQuery(mainDataQuery).then(function (mainData) {
                        var relatedDataQueries = _this._createRelatedDataQueries(query, mainData);
                        var relatedPromises = [];
                        relatedDataQueries.each(function (dataQuery) {
                            relatedPromises.push(_this._executeDataQuery(dataQuery));
                        });
                        return _this.$q.all(relatedPromises);
                    });
                };
                Repository.prototype.getFirst = function (query) {
                    return this.get(query).then(function (results) {
                        return results.length > 0 ? results.first() : null;
                    });
                };
                Repository.prototype.create = function () {
                };
                Repository.prototype.update = function () {
                };
                Repository.prototype.remove = function () {
                };
                Repository.prototype._executeDataQuery = function (query) {
                    var _this = this;
                    throw '_executeDataQuery deprecated';
                    var promise = this.$q.defer();
                    var currentDataSourceIndex = 0;
                    var tryNextDataSource = function () {
                        if (currentDataSourceIndex >= _this.dataSources.length) {
                            promise.reject();
                            return;
                        }
                        var dataSource = _this.dataSources.get(currentDataSourceIndex);
                        currentDataSourceIndex++;
                        dataSource.get(query).then(function (dataResult) {
                            promise.resolve(dataResult);
                        }).catch(function () {
                            tryNextDataSource();
                        });
                    };
                };
                Repository.prototype._createMainDataQuery = function (modelQuery) {
                    throw '_createMainDataQuery deprecated';
                };
                Repository.prototype._createRelatedDataQueries = function (modelQuery, mainDataResult) {
                    throw '_createRelatedDataQueries deprecated';
                };
                Repository.$inject = ['$q', '$injector'];
                return Repository;
            })(TSCore.BaseObject);
            Data.Repository = Repository;
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var ResultSet;
            (function (ResultSet) {
                var DataResultSet = (function () {
                    function DataResultSet() {
                    }
                    return DataResultSet;
                })();
                ResultSet.DataResultSet = DataResultSet;
            })(ResultSet = Data.ResultSet || (Data.ResultSet = {}));
        })(Data = App.Data || (App.Data = {}));
    })(App = TSCore.App || (TSCore.App = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var App;
    (function (App) {
        var Data;
        (function (Data) {
            var ResultSet;
            (function (ResultSet) {
                var ModelResultSet = (function (_super) {
                    __extends(ModelResultSet, _super);
                    function ModelResultSet() {
                        _super.apply(this, arguments);
                    }
                    return ModelResultSet;
                })(ModelList);
                ResultSet.ModelResultSet = ModelResultSet;
            })(ResultSet = Data.ResultSet || (Data.ResultSet = {}));
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
                    options.url = this.buildUrl(options.url);
                    options.url = this._interpolateUrl(options.url, options.urlParams || {});
                    return options;
                };
                Api.prototype.buildUrl = function (relativeUrl) {
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
                    return this.request(Http.Method.POST, path, urlParams, _.defaults(options || {}, { data: data }), extraOptions);
                };
                ApiEndpoint.prototype.putRequest = function (path, urlParams, data, options, extraOptions) {
                    return this.request(Http.Method.PUT, path, urlParams, _.defaults(options || {}, { data: data }), extraOptions);
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
                ApiEndpoint.prototype.update = function (id, data, userOptions, requestOptions) {
                    return this.putRequest('/:id', { id: id }, data, requestOptions).then(this.extractSingleCallback);
                };
                ApiEndpoint.prototype.create = function (data, userOptions, requestOptions) {
                    return this.postRequest('/', {}, data, requestOptions).then(this.extractSingleCallback);
                };
                ApiEndpoint.prototype.delete = function (id, userOptions, options) {
                    return this.deleteRequest('/:id', { id: id }, options).then(this.extractSingleCallback);
                };
                ApiEndpoint.prototype.extractMultiple = function (response) {
                    var data = null;
                    if (response.data[this.multipleProperty]) {
                        data = _.map(response.data[this.multipleProperty], this.transformResponse);
                    }
                    return {
                        response: response,
                        fullData: response.data,
                        data: data
                    };
                };
                ApiEndpoint.prototype.extractSingle = function (response) {
                    var data = null;
                    if (response.data[this.singleProperty]) {
                        data = this.transformResponse(response.data[this.singleProperty]);
                    }
                    return {
                        response: response,
                        fullData: response.data,
                        data: data
                    };
                };
                ApiEndpoint.prototype.transformResponse = function (item) {
                    return item;
                };
                ApiEndpoint.prototype.transformRequest = function (item) {
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
                Bootstrap.prototype.getFilters = function () {
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
                    var filters = this.getFilters();
                    _.each(filters, function (value, name) {
                        _this._module.filter(name, value);
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
                        var dependencies = this.$runInject || [];
                        var self = this;
                        var block = function () {
                            return new (Function.prototype.bind.apply(self.run, self._parseArgs(arguments)));
                        };
                        var runConfig = dependencies.concat([block]);
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
/// <reference path="TSCore/App/Data/DataSource/Api.ts" />
/// <reference path="TSCore/App/Data/DataSource/IDataSource.ts" />
/// <reference path="TSCore/App/Data/DataSource/Memory.ts" />
/// <reference path="TSCore/App/Data/Model.ts" />
/// <reference path="TSCore/App/Data/Query/Condition.ts" />
/// <reference path="TSCore/App/Data/Query/DataQuery.ts" />
/// <reference path="TSCore/App/Data/Query/ModelQuery.ts" />
/// <reference path="TSCore/App/Data/RemoteModelStore.ts" />
/// <reference path="TSCore/App/Data/Repository.ts" />
/// <reference path="TSCore/App/Data/ResultSet/DataResultSet.ts" />
/// <reference path="TSCore/App/Data/ResultSet/ModelResultSet.ts" />
/// <reference path="TSCore/App/Http/Api.ts" />
/// <reference path="TSCore/App/Http/ApiEndpoint.ts" />
/// <reference path="TSCore/App/Interceptors/HttpInterceptor.ts" />
/// <reference path="TSCore/App/Interceptors/StateInterceptor.ts" />
/// <reference path="TSCore/App/System/Bootstrap.ts" />
//# sourceMappingURL=ts-core-app.js.map