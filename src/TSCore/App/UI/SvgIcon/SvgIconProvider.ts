///<reference path="SvgIconService.ts"/>

module TSCore.App.UI.SvgIcon {

    export class SvgIconProvider {

        public defaultViewBoxSize: number = 24;

        public iconRegistry: TSCore.Data.Dictionary<string, string> = new TSCore.Data.Dictionary<string, string>();

        public $get = ['$http', '$q', '$log', '$templateCache', ($http, $q, $log, $templateCache) => {
           return new SvgIconService(this.iconRegistry, $http, $q, $log, $templateCache);
        }];

        public icon(id: string, path: string): SvgIconProvider {
            this.iconRegistry.set(id, path);
            return this;
        }
    }
}