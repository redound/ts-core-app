///<reference path="SvgIcon.ts"/>

module TSCore.App.UI.SvgIcon {

    export class SvgIconService {

        protected static URL_REGEX: RegExp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/i;

        protected iconCache: TSCore.Data.Dictionary<string, HTMLElement> = new TSCore.Data.Dictionary<string, HTMLElement>();

        public constructor(protected iconRegistry:TSCore.Data.Dictionary<string, string>,
                           protected $http:ng.IHttpService,
                           protected $q:ng.IQService,
                           protected $log: ng.ILogService,
                           protected $templateCache:ng.ITemplateCacheService) {

        }

        public preloadIcons(ids: string[]): ng.IPromise<any> {

            var promises = _.map(ids, id => {
                return this.getIcon(id);
            });

            return this.$q.all(promises);
        }

        public getIcon(id:string): ng.IPromise<HTMLElement> {

            if (this.iconCache.contains(id)) {
                return this.$q.when(this.iconCache.get(id));
            }

            var url;

            // Resolve url from icon registry
            if (this.iconRegistry.contains(id)) {
                url = this.iconRegistry.get(id);
            }

            if (SvgIconService.URL_REGEX.test(url)) {

                return this.loadByURL(url).then(icon => {
                    this.cacheIcon(id, icon);
                    return icon;
                });
            }

            return this.$q.reject();
        }

        public instant(id: string): HTMLElement {

            if (this.iconCache.contains(id)) {
                return this.iconCache.get(id);
            }

            return null;
        }

        /**
         * Load the icon by URL (may use the $templateCache).
         * Extract the data for later conversion to Icon
         */
        public loadByURL(url: string): ng.IPromise<HTMLElement> {

            return this.$http
                .get(url, {
                    templateCache: this.$templateCache
                })
                .then((response:any) => {
                    return angular.element('<div>').append(response.data).find('svg')[0];
                }).catch(this.announceNotFound);
        }

        /**
         * Catch HTTP or generic errors not related to incorrect icon IDs.
         */
        public announceNotFound(err) {
            var msg = angular.isString(err) ? err : (err.message || err.data || err.statusText);
            this.$log.warn(msg);

            return this.$q.reject(msg);
        }

        public cacheIcon(id: string, icon: HTMLElement) {

            var svgIcon = new SvgIcon(icon);
            svgIcon.prepareAndStyle();
            var cloned = svgIcon.cloneSVG();
            this.iconCache.set(id, cloned);
            return cloned;
        }
    }
}