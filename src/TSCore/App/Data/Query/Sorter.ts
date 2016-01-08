module TSCore.App.Data.Query {

    export enum SortDirections {
        ASCENDING,
        DESCENDING
    }

    export class Sorter {

        protected _field: string;
        protected _direction: SortDirections;

        public constructor(field: string, direction: SortDirections) {

            this._field = field;
            this._direction = direction;
        }

        public getField(): string {

            return this._field;
        }

        public getDirection(): SortDirections {

            return this._direction;
        }
    }
}