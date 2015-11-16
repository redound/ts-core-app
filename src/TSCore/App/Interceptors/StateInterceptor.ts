module TSCore.App.Interceptors {

    module UIRouterEvents {
        export const STATE_CHANGE_START: string = '$stateChangeStart';
        export const STATE_CHANGE_SUCCESS: string = '$stateChangeSuccess';
        export const STATE_CHANGE_ERROR: string = '$stateChangeError';
        export const STATE_NOT_FOUND: string = '$stateNotFound';
    }

    export module StateAccessLevels {

        export const PUBLIC = 'public';
        export const UNAUTHORIZED = 'unauthorized';
        export const AUTHORIZED = 'authorized';
    }

    export module StateInterceptorEvents {
        export const FIRST_ROUTE: string = 'firstRoute';
        export const STATE_CHANGE_START: string = 'stateChangeStart';
        export const ENTERING_AUTHORIZED_AREA: string = 'enteringAuthorizedArea';
        export const ENTERING_UNAUTHORIZED_AREA: string = 'enteringUnauthorizedArea';
        export const ENTERING_PUBLIC_AREA: string = 'enteringPublicArea';

        export interface IStateChangeEventParams {
            event: any,
            toState: any,
            toParams: any,
            fromState: any,
            fromParams: any
        }
    }

    export class StateInterceptor {

        static $inject = ['$rootScope'];

        public events: TSCore.Events.EventEmitter = new TSCore.Events.EventEmitter();
        private _firstRoute: any = null;
        private _lastRoute: any = null;

        constructor(
            protected $rootScope: ng.IRootScopeService
        ) {

        }

        public init() {
            this._attachRouterEvents();
        }

        private _attachRouterEvents() {
            this.$rootScope.$on(UIRouterEvents.STATE_CHANGE_START, _.bind(this._$stateChangeStart, this));
        }

        private _$stateChangeStart(event, toState: any, toParams, fromState: any, fromParams) {

            var params:StateInterceptorEvents.IStateChangeEventParams = {
                event: event,
                toState: toState,
                toParams: toParams,
                fromState: fromState,
                fromParams: fromParams
            };

            if (!fromState || fromState.accessLevel !== toState.accessLevel) {

                var eventName;

                /**
                 * Here we trigger events based on which
                 * area the user is going to enter
                 */
                switch (toState.accessLevel) {

                    case StateAccessLevels.AUTHORIZED:
                        eventName = StateInterceptorEvents.ENTERING_AUTHORIZED_AREA;
                        break;
                    case StateAccessLevels.PUBLIC:
                        eventName = StateInterceptorEvents.ENTERING_PUBLIC_AREA;
                        break;
                    default:
                    case StateAccessLevels.UNAUTHORIZED:
                        eventName = StateInterceptorEvents.ENTERING_UNAUTHORIZED_AREA;
                        break;
                }

                this.events.trigger(eventName, params);
            }

            this._lastRoute = {
                toState: toState,
                toParams: toParams
            };

            if (!this._firstRoute) {
                this._firstRoute = this._lastRoute;
                this.events.trigger(StateInterceptorEvents.FIRST_ROUTE, params);
            }

            this.events.trigger(StateInterceptorEvents.STATE_CHANGE_START, params);
        }

        public getFirstRoute() {
            return this._firstRoute;
        }
    }
}