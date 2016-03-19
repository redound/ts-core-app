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

    export class JsonApiSerializer implements ISerializer {

        public constructor(protected resources: TSCore.Data.Dictionary<string, Resource>) {

        }

        public deserialize(resourceName: string, response: any): IDataSourceResponse {

            var total = response.data.total;
            var data = response.data.data;
            var included = response.data.included;
            var resource = this.resources.get(resourceName);
            var primaryKey = resource.getModel().primaryKey();

            var dataGraph = this.createGraph(data);
            var includedGraph = this.createGraph(included);

            dataGraph.merge(includedGraph);

            var meta = {
                total: total
            };

            return {
                meta: meta,
                graph: dataGraph,
                references: _.map(data, (itemData: any) => {

                    return new Reference(resourceName, itemData[primaryKey]);
                })
            }
        }

        protected createGraph(data): Graph {

            var graph = new Graph();

            this.extractResource(data, (resourceName: string, resourceId: any, attributes: any, relationships: any) => {

                var resource = this.resources.get(resourceName);

                if (!resource) {
                    throw new Exception('Resource `' + resourceName + '` could not be found!');
                }

                var transformer = resource.getTransformer();
                var model = resource.getModel();
                var primaryKey = model.primaryKey();

                attributes[primaryKey] = parseInt(resourceId);

                var item = attributes;

                item = transformer.item(attributes);

                _.each(relationships, (relationship: any, propertyName: string) => {

                    if (_.isArray(relationship.data)) {

                        item[propertyName] = _.map(relationship.data, (ref:any) => {

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
        }

        protected extractResource(results, callback) {

            if (_.isArray(results)) {

                _.each(results, (result: any) => callback(result.type, result.id, result.attributes, result.relationships));

            } else if (_.isObject(results)) {

                callback(results.type, results.id, results.attributes, results.relationships);
            }
        }
    }
}