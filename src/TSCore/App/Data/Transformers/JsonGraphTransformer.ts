module TSCore.App.Data.Transformers {

    class TreeWalker {

        public constructor(data) {

        }

        public walk(callback) {


        }
    }

    export class JsonGraphTransformer {

        protected _aliases: TSCore.Data.Dictionary<string, string> = new TSCore.Data.Dictionary<string, string>();

        public resource(key: string, aliases: string[]): JsonGraphTransformer {
            _.each(aliases, alias => this._aliases.set(alias, key));
            return this;
        }

        public transform(data: any): JsonGraph {

            var results = new JsonGraph();

            function resolveResource(resourceName: string, resource: any) {


            }

            var tree = new TreeWalker(data);

            tree.walk((value: any, alias: any) => {

                alias = alias.toString();

                if (!this._aliases.contains(alias)) {
                    return;
                }

                var resourceName = this._aliases.get(alias);

                if (_.isArray(value)) {

                    _.each(value, resource => resolveResource(resourceName, resource));
                }
                else if (_.isObject(value)) {

                    resolveResource(resourceName, value);
                }
            });

            return results;
        }
    }
}