module TSCore.App.Auth {

    export module ManagerEvents {

        export const LOGIN_ATTEMPT_FAIL: string = "login-attempt-fail";
        export const LOGIN_ATTEMPT_SUCCESS: string = "login-attempt-success";
        export const LOGIN: string = "login";
        export const LOGOUT: string = "logout";
        export const SESSION_SET: string = "session-set";
        export const SESSION_CLEARED: string = "session-cleared";
    }

    export class Manager {

        public events: TSCore.Events.EventEmitter = new TSCore.Events.EventEmitter();

        protected _accountTypes: TSCore.Data.Dictionary<any, AccountType> = new TSCore.Data.Dictionary<any, AccountType>();
        protected _session: Session = null;

        public static $inject = ['$q'];

        public constructor(
            protected $q: ng.IQService
        ) {

        }

        public registerAccountType(name, account: AccountType) {
            this._accountTypes.set(name, account);
            return this;
        }

        public getAccountTypes() {
            return this._accountTypes;
        }

        public getSession() {
            return this._session;
        }

        public setSession(session: Session) {
            this._session = session;
            this.events.trigger(ManagerEvents.SESSION_SET, { session: this._session });
        }

        public clearSession() {
            var session = this._session;
            this._session = null;
            this.events.trigger(ManagerEvents.SESSION_CLEARED, { session: session });
            return this;
        }

        public loggedIn() {
            return !!this._session;
        }

        public getAccountType(name)
        {
            return this._accountTypes.get(name);
        }

        /**
         * Try to authenticate a user.
         * @param accountTypeName   Which accountType to use.
         * @param credentials       Object containing the required credentials.
         */
        public login(accountTypeName: any, credentials: {}): ng.IPromise<Session> {

            var accountType:AccountType = this._accountTypes.get(accountTypeName);

            if (!accountType) {
                return this.$q.reject();
            }

            return accountType.login(credentials).then<Session>((session: Session) => {

                this.setSession(session);

                this.events.trigger(TSCore.App.Auth.ManagerEvents.LOGIN_ATTEMPT_SUCCESS, {
                    credentials: credentials,
                    session: this.getSession()
                });

                this.events.trigger(TSCore.App.Auth.ManagerEvents.LOGIN, {
                    credentials: credentials,
                    session: this.getSession()
                });

                return this.getSession();

            }).catch<Session>((e) => {

                this.events.trigger(TSCore.App.Auth.ManagerEvents.LOGIN_ATTEMPT_FAIL, { credentials: credentials, session: null });
                throw e; // rethrow to not mark as handled

                return this.getSession();
            });
        }

        public logout(accountTypeName: any): ng.IPromise<void> {

            var accountType: AccountType = this._accountTypes.get(accountTypeName);

            if (!accountType) {
                return this.$q.reject();
            }

            if (!this.loggedIn()) {
                return this.$q.reject();
            }

            return accountType.logout(this.getSession()).then(() => {
                this.events.trigger(ManagerEvents.LOGOUT, {
                    session: this.getSession()
                });
            }).finally(() => {
                this.clearSession()
            });
        }
    }
}