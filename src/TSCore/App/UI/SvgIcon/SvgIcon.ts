module TSCore.App.UI.SvgIcon {

    export class SvgIcon {

        public element: HTMLElement;

        public viewBoxSize: number = 24;

        public constructor(el: HTMLElement) {
            this.setElement(el);
        }

        public setElement(el: HTMLElement): SvgIcon {

            if (el && el.tagName != 'svg') {
                el = angular.element('<svg xmlns="http://www.w3.org/2000/svg">').append(el)[0];
            }

            // Inject the namespace if not available...
            if ( !el.getAttribute('xmlns') ) {
                el.setAttribute('xmlns', "http://www.w3.org/2000/svg");
            }

            this.element = el;

            return this;
        }

        public setViewBoxSize(viewBoxSize: number): SvgIcon {
            this.viewBoxSize = viewBoxSize;
            return this;
        }

        /**
         *  Prepare the DOM element that will be cached in the
         *  loaded iconCache store.
         */
        public prepareAndStyle() {

            angular.forEach({
                'fit'   : '',
                'height': '100%',
                'width' : '100%',
                'preserveAspectRatio': 'xMidYMid meet',
                'viewBox' : this.element.getAttribute('viewBox') || ('0 0 ' + this.viewBoxSize + ' ' + this.viewBoxSize)
            }, function(val, attr) {
                this.element.setAttribute(attr, val);
            }, this);
        }


        /**
         * Clone the Icon DOM element.
         */
        public cloneSVG(): HTMLElement {
            // If the element or any of its children have a style attribute, then a CSP policy without
            // 'unsafe-inline' in the style-src directive, will result in a violation.
            return <HTMLElement>this.element.cloneNode(true);
        }
    }
}