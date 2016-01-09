module TSCore.App.Data {

    export interface IJsonGraphReference {
        $type: string,
        value: any
    }

    export class JsonGraph {

        protected _data: any;

        public constructor(data?) {
            this._data = data || {};
        }

        public getData(): any {
            return this._data;
        }

        public get(path: string|number[]) {

            path = path || [];

            var depth = 0;
            var pointer = this._data;
            _.each(path, (identifier: any) => {

                var pointerValue = pointer[identifier];

                if (pointerValue !== undefined) {
                    pointer = this.resolvePointerValue(pointerValue);
                }

                depth++;
            });

            if (depth === 1) {
                pointer = _.values(pointer);
            }

            return this.resolvePointerValueRecursive(pointer);
        }

        public set(path: string|number[], value: any)
        {
            // TODO: Implement
        }
        
        public merge(graph: JsonGraph){
            this.mergeData(graph.getData());
        }

        public mergeData(data: any){

            // TODO: Implement
        }

        protected resolvePointerValueRecursive(value) {

            //alert('resolvePointerValueRecursive ' + JSON.stringify(value));

            value = this.resolvePointerValue(value);

            if (_.isArray(value)) {

                value = _.map(value, item => {
                    return this.resolvePointerValueRecursive(item);
                });
            }
            else if (_.isObject(value)) {

                value = _.mapObject(value, item => {
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