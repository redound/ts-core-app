module TSCore.App.Data {

    export interface IJsonGraphReference {
        $type: string,
        value: any
    }

    export class JsonGraph {

        protected _data: any;

        public constructor(data) {
            this._data = data;
        }

        public get(path) {

            path = path || [];

            var depth = 0;
            var pointer = this._data;
            _.each(path, (identifier: any) => {

                if (this.pointerHasValue(pointer[identifier])) {
                    pointer = this.resolvePointerValue(pointer[identifier]);
                }

                depth++;
            });

            if (depth === 1) {
                pointer = _.values(pointer);
            }

            return this.resolvePointerValueRecursive(pointer);
        }

        protected pointerHasValue(value) {

            return value !== undefined;
        }

        protected resolvePointerValueRecursive(value) {

            //alert('resolvePointerValueRecursive ' + JSON.stringify(value));

            value = this.resolvePointerValue(value);

            if (_.isArray(value)) {
                value = _.map(value, (item: any) => {
                    return this.resolvePointerValueRecursive(item);
                });
            } else if (_.isObject(value)) {
                value = _.mapObject(value, (item: any) => {
                    return this.resolvePointerValueRecursive(item);
                });
            }

            return value;
        }

        protected resolvePointerValue(value) {

            if (value && value.$type && value.$type == "ref") {
                value = this.get(value.value);
            }

            return value;
        }
    }
}