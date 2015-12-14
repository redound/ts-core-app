module TSCore.App.Data {

    import ModelQuery = TSCore.App.Data.Query.ModelQuery;
    import List = TSCore.Data.List;
    import Exception = TSCore.Exception.Exception;
    import ModelResultSet = TSCore.App.Data.ResultSet.ModelResultSet;
    import DataQuery = TSCore.App.Data.Query.DataQuery;
    import IDataSource = TSCore.App.Data.DataSource.IDataSource;
    import DataResultSet = TSCore.App.Data.ResultSet.DataResultSet;

    export class Repository<T extends TSCore.App.Data.Model> extends TSCore.BaseObject {

        public static $inject = ['$q', '$injector'];

        public dataSources: List<IDataSource> = new List<IDataSource>();

        public constructor(protected $q:ng.IQService,
                           protected $injector) {

            super();
        }


        public addDataSource(dataSource: IDataSource) {

            this.dataSources.add(dataSource);
        }

        public removeDataSource(dataSource: IDataSource) {

            this.dataSources.remove(dataSource);
        }


        public query(): ModelQuery<T> {

            return new ModelQuery<T>().from(this);
        }

        public allQuery(): ModelQuery<T> {

            return this.query();
        }

        public all(): ng.IPromise<T[]> {

            return this.allQuery().execute();
        }

        public findQuery(id: any): ModelQuery<T> {

            return new ModelQuery<T>().find(id).from(this);
        }

        public find(id: any): ng.IPromise<T> {

            return this.findQuery(id).executeSingle();
        }


        public get(query: ModelQuery<T>): ng.IPromise<ModelResultSet<T>> {

            if(query.getFrom() != this){
                throw new Exception('ModelQuery\'s repository doesn\'t match executing repository');
            }

            var mainDataQuery = this._createMainDataQuery(query);

            return this._executeDataQuery(mainDataQuery).then((mainData: DataResultSet) => {

                var relatedDataQueries = this._createRelatedDataQueries(query, mainData);
                var relatedPromises = [];

                relatedDataQueries.each((dataQuery: DataQuery) => {

                    relatedPromises.push(this._executeDataQuery(dataQuery));
                });

                return this.$q.all(relatedPromises);

            });
        }

        public getFirst(query: ModelQuery<T>): ng.IPromise<T> {

            return <ng.IPromise<T>>this.get(query).then((results: ModelResultSet<T>) => {

                return results.length > 0 ? results.first() : null;
            });
        }

        public create() {

        }

        public update() {

        }

        public remove() {

        }


        protected _executeDataQuery(query: DataQuery): ng.IPromise<DataResultSet> {

            throw '_executeDataQuery deprecated';
            var promise = this.$q.defer();

            var currentDataSourceIndex = 0;

            var tryNextDataSource = () => {

                if(currentDataSourceIndex >= this.dataSources.length){

                    promise.reject();
                    return;
                }

                var dataSource: IDataSource = this.dataSources.get(currentDataSourceIndex);
                currentDataSourceIndex++;

                dataSource.get(query).then((dataResult: DataResultSet) => {

                    // Success
                    promise.resolve(dataResult);

                }).catch(() => {

                    // Failed
                    tryNextDataSource();
                });
            }
        }


        protected _createMainDataQuery(modelQuery: ModelQuery<T>): DataQuery {
            throw '_createMainDataQuery deprecated';
        }

        protected _createRelatedDataQueries(modelQuery: ModelQuery<T>, mainDataResult: DataResultSet): List<DataQuery> {
            throw '_createRelatedDataQueries deprecated';
        }
    }
}