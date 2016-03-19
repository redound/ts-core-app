///<reference path="../ISerializer.ts"/>
///<reference path="../../Data/IDataSourceResponse.ts"/>
///<reference path="../../Data/Graph/Graph.ts"/>
///<reference path="../../Data/Graph/Reference.ts"/>
///<reference path="../../Resource.ts"/>


module TSCore.App.Data.Serializers {

    import ISerializer = TSCore.App.Data.ISerializer;
    import IDataSourceResponse = TSCore.App.Data.IDataSourceResponse;
    import Graph = TSCore.App.Data.Graph.Graph;
    import Reference = TSCore.App.Data.Graph.Reference;
    import Resource = TSCore.App.Resource;
    import Exception = TSCore.Exception.Exception;

    export class DefaultSerializer implements ISerializer {

        protected resources: TSCore.Data.Dictionary<string, Resource>;

        protected resourceAliasMap: TSCore.Data.Dictionary<string, string>;

        public constructor(resources: TSCore.Data.Dictionary<string, Resource>) {

            this.setResources(resources);
        }

        public setResources(resources: TSCore.Data.Dictionary<string, Resource>) {

            this.resources = resources;

            this.resourceAliasMap = new TSCore.Data.Dictionary<string, string>();

            this.resources.each((resourceName, resource) => {

                var itemKeys = resource.getItemKeys();
                var collectionKeys = resource.getCollectionKeys();

                itemKeys.each(key => {
                    this.resourceAliasMap.set(key, resourceName);
                });

                collectionKeys.each(key => {
                    this.resourceAliasMap.set(key, resourceName);
                });
            });
        }

        public deserialize(resourceName: string, response: any): IDataSourceResponse {

            var data = response.data;
            var total = response.data.total;

            var resource = this.resources.get(resourceName);
            var primaryKey = resource.getModel().primaryKey();
            var itemKeys = resource.getItemKeys();
            var collectionKeys = resource.getCollectionKeys();

            var keys = new TSCore.Data.Collection<string>();

            itemKeys.each(key => {
                keys.add(key);
            });

            collectionKeys.each(key => {
                keys.add(key);
            });

            var result;

            _.each(response.data, (value, key: string) => {

                if (!result && keys.contains(key)) {
                    result = value;
                }
            });

            if (!result) {
                throw new Exception('No result under existing keys found');
            }

            var references;

            if (_.isArray(result)) {

                references = _.map(result, (itemData) => {
                    return new Reference(resourceName, itemData[primaryKey]);
                });
            }
            else {
                references = [new Reference(resourceName, result[primaryKey])];
            }

            var meta:any = {};

            if (total) {
                meta.total = total;
            }

            return {
                meta: meta,
                graph: this.createGraph(data),
                references: references
            };
        }

        protected createGraph(data: any): Graph {

            var graph = new Graph();

            this.extractResources(null, data, (resourceName, data: any, key) => {

                console.log('resourceName', resourceName, 'data', data);

                var resource = this.resources.get(resourceName);
                var primaryKey = resource.getModel().primaryKey();
                var resourceId = data[primaryKey];

                graph.setItem(resourceName, resourceId, data);

            }, (parentResourceName, parentData, key, resourceName, data) => {

                console.log('resourceName', resourceName, 'key', key, 'data', data);

                var parentResource = this.resources.get(parentResourceName);
                var parentPrimaryKey = parentResource.getModel().primaryKey();
                var parentResourceId = parentData[parentPrimaryKey];

                var parentItem = graph.getItem(parentResourceName, parentResourceId);

                var resource = this.resources.get(resourceName);
                var primaryKey = resource.getModel().primaryKey();

                if (_.isArray(data)) {

                    parentItem[key] = _.map(data, itemData =>  {

                        return new Reference(resourceName, itemData[primaryKey]);
                    });
                }
                else if (_.isObject(data)) {

                    parentItem[key] = new Reference(resourceName, data[primaryKey]);
                }
            });

            return graph;
        }

        protected extractResources(parentResourceName: string, data: any, resourceCallback: any, referenceCallback: any) {

            _.each(data, (value: any, key: string) => {

                if (!_.isArray(data) && this.resourceAliasMap.contains(key)) {

                    var resourceName = this.resourceAliasMap.get(key);

                    this.extractResources(parentResourceName, value, resourceCallback, referenceCallback);

                    if (_.isArray(value)) {
                        _.each(value, itemData => resourceCallback(resourceName, itemData));
                    }
                    else if (_.isObject(value)) {
                        resourceCallback(resourceName, value);
                    }

                    if (parentResourceName) {
                        referenceCallback(parentResourceName, data, key, resourceName, value);
                    }

                }
                else if (_.isObject(data)) {
                    this.extractResources(null, value, resourceCallback, referenceCallback);
                }
            });
        }
    }
}