module TSCore.App.Data {

    export interface ITransformer {
        new(): Transformer;
        item(data);
        collection(data);
    }

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

                var includeMethod = 'include' + TSCore.Utils.Text.ucFirst(include);

                if (result[include] && this[includeMethod]) {
                    result[include] = this[includeMethod](result);
                }
            });

            return result;
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