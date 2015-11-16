module TSCore.App.Auth {

    export interface AccountType  {

        login(data): ng.IPromise<Session>;
        authenticate(identity): ng.IPromise<void>;
        logout(session): ng.IPromise<void>;
    }
}