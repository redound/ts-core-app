module TSCore.App.Data.Graph {

    import Exception = TSCore.Exception.Exception;
    export class Graph {

        protected _data: any;

        public constructor(data?) {
            this.clear();
            this._data = data || {};
        }

        public clear() {
            this._data = {};
        }

        public get(path?: any[], callback?: any) {

            path = this._optimizePath(path);

            if (!path) {
                return this._resolveValueRecursive(null, null, this._data, callback);
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
                } else {
                    root = null;
                    break;
                }
            }
            console.log('parentKey', parentKey, 'key', key);
            return this._resolveValueRecursive(parentKey, key, root, callback);
        }

        protected _optimizePath(path?: any[]): any[] {

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
        }

        public set(path: any[], value: any)
        {
            path = this._optimizePath(path);

            if (path && path.length) {

                var root = this._data;

                for (var i = 0; i < path.length; i++) {

                    var part = path[i];

                    if (i === path.length - 1) {
                        root[part] = value;
                    }

                    root = root[part];
                }

                return this;
            }

            this._data = value;

            return this;
        }

        public setItem(resourceName: string, resourceId: any, resource: any) {
            this.set([resourceName, resourceId], resource);
        }

        public getItem(resourceName: string, resourceId: any) {
            return this.get([resourceName, resourceId]);
        }

        public setItems(resourceName: string, items: any) {
            this.set([resourceName], items);
        }

        public getItems(resourceName: string) {
            return this.get([resourceName]);
        }

        public merge(graph: Graph)
        {
            this.mergeData(graph.get());
        }

        public mergeData(data: any){

            // TODO: Implement
        }

        protected _isReference(value: any): boolean {
            return (value && value.$type && value.$type == "ref");
        }

        protected _resolveValueRecursive(parentKey, key, value, callback?: any) {

            if (this._isReference(value)) {
                value = this.get(value.value, callback);
            }

            if (_.isArray(value)) {

                value = _.map(value, (subValue, subKey) => {
                    return this._resolveValueRecursive(key, subKey, subValue, callback);
                });
            }
            else if (_.isObject(value)) {

                value = _.mapObject(value, (subValue, subKey) => {
                    return this._resolveValueRecursive(key, subKey, subValue, callback);
                });

                if (this._isResourceName(key)) {
                    value = _.values(value);
                }
            }

            if (!_.isArray(value) && callback) {

                if (this._isResourceName(key)) {
                    value = callback(key, value);
                } else if (this._isResourceName(parentKey)) {
                    value = callback(parentKey, value);
                }
            }

            return value;
        }

        protected _isResourceName(resourceName: string): boolean {
            return (this._data[resourceName] !== void 0);
        }
    }
}