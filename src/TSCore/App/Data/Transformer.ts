module TSCore.Data.Transform {

    export class Transformer extends TSCore.BaseObject {

        public availableIncludes = [];

        public transform(item) {

        }

        public collection(data) {

            if (!data) {
                return null;
            }

            return _.map(data, item => this.item(item));
        }

        public item(data) {

            if (!data) {
                return null;
            }

            var result = this.transform(data);

            _.each(this.availableIncludes, (include: any) => {

                var includeMethod = 'include' + this._ucFirst(include);

                if (result[include] && this[includeMethod]) {
                    result[include] = this[includeMethod](result);
                }
            });

            return result;
        }

        // TODO: Should be helper
        protected _ucFirst(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        public static collection(data) {
            var transformer = new this;
            return transformer.collection(data);
        }

        public static item(data) {
            var transformer = new this;
            return transformer.item(data);
        }
    }
}