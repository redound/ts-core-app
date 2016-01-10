module TSCore.App.Data.Transformers {

    export class JsonGraphTransformer {

        protected _aliases: TSCore.Data.Dictionary<string, string> = new TSCore.Data.Dictionary<string, string>();

        public resource(key: string, aliases: string[]): JsonGraphTransformer {
            _.each(aliases, alias => this._aliases.set(alias, key));
            return this;
        }

        public transform(rootResourceName: string, data: any): JsonGraph {

            var results = {};

            this._findResourcesRecursive(rootResourceName, data, (resourceName: string, resource: any) => {

                var record = _.clone(resource);
                var childResources: any = {};

                this._findResources(record, (fromArray: boolean, childResourceName: string, childResource: any) => {

                    var childResourceRef = this._createResourceRef(childResourceName, childResource);

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

                results[resourceName] = results[resourceName] || {};
                results[resourceName][record.id] = record;
            });

            results["results"] = _.map(results[rootResourceName], (resource) => {
                return this._createResourceRef(rootResourceName, resource);
            });

            return new JsonGraph(results);
        }

        protected _findResourcesRecursive(alias, data, callback) {

            if (!_.isObject(data)) {
                return;
            }

            if (alias) {

                alias = alias.toString();

                if (this._aliases.contains(alias)) {

                    var resourceName = this._aliases.get(alias);

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

                    if (this._aliases.contains(alias)) {
                        var resourceName = this._aliases.get(alias);

                        if (_.isArray(value)) {

                            _.each(value, resource => callback(true, resourceName, resource));

                        } else {

                            callback(false, resourceName, value);

                        }
                    }
                }
            });
        }

        protected _createResourceRef(resourceName: string, resource: any) {

            return {
                $type: "ref",
                value: [resourceName, resource.id]
            };
        }
    }
}