///<reference path="Graph.ts"/>

module TSCore.App.Data.Graph {

    export class Builder {

        protected _resourceForResourceNameCallback;
        protected _resourceNameForAliasCallback;

        public resourceForResourceName(callback) {
            this._resourceForResourceNameCallback = callback;
        }

        public resourceNameForAlias(callback) {
            this._resourceNameForAliasCallback = callback;
        }

        /**
         * Build Graph from standard objects
         * @param data
         * @param rootResourceName Optional Resource name for objects that live in the root thus cannot be identified.
         * @returns {TSCore.App.Data.Graph.Graph}
         */
        public build(data: any, rootResourceName = null): Graph {

            var results = {};

            this._findResourcesRecursive(rootResourceName, data, (resourceName: string, resource: any) => {

                var rootResource = this._resourceForResourceNameCallback(rootResourceName);

                var record = _.clone(resource);
                var childResources: any = {};

                this._findResources(record, (fromArray: boolean, childResourceName: string, childItem: any) => {

                    var childResource = this._resourceForResourceNameCallback(childResourceName);
                    var primaryKey = childResource.getModel().primaryKey();
                    var id = childItem[primaryKey];

                    var childResourceRef = new Reference(childResourceName, id);

                    if (fromArray) {
                        childResources[childResourceName] = childResources[childResourceName] || [];
                        childResources[childResourceName].push(childResourceRef);
                    } else {
                        childResources[childResourceName] = childResourceRef;
                    }

                });

                _.each(childResources, (childResource: any, childResourceName: string) => {
                    record[childResourceName] = childResource;
                });

                var primaryKey = rootResource.getModel().primaryKey();
                var id = record[primaryKey];

                results[resourceName] = results[resourceName] || {};
                results[resourceName][id] = record;
            });

            return new Graph(results);
        }

        protected _findResourcesRecursive(alias, data, callback) {

            if (!_.isObject(data)) {
                return;
            }

            if (alias) {

                alias = alias.toString();

                var resourceName = this._resourceNameForAliasCallback(alias);

                if (resourceName) {

                    if (_.isArray(data)) {

                        _.each(data, resource => callback(resourceName, resource));

                    } else {

                        callback(resourceName, data);

                    }
                }
            }

            _.each(data, (value, key) => this._findResourcesRecursive(key, value, callback));
        }

        protected _findResources(data, callback) {

            if (!_.isObject(data)) {
                return;
            }

            _.each(data, (value: any, key) => {

                if (!_.isObject(value)) {
                    return;
                }

                if (key) {

                    var alias = key.toString();

                    var resourceName = this._resourceNameForAliasCallback(alias);

                    if (resourceName) {

                        if (_.isArray(value)) {

                            _.each(value, resource => callback(true, resourceName, resource));

                        } else {

                            callback(false, resourceName, value);

                        }
                    }
                }
            });
        }
    }
}