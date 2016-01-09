module TSCore.App.Data.Model {

    export class Model extends TSCore.Data.Model {

        public toObject(includeRelations: boolean = true) {

            var result = super.toObject();

            if(includeRelations === false) {

                _.each(_.keys(this.static.relations()), (key:string) => {

                    if (result[key]) {
                        delete result[key];
                    }
                });
            }

            return result;
        }
    }
}