module TSCore.App.Auth {

    export class Session {

        constructor(
            protected _accountTypeName:string,
            protected _identity:number,
            protected _startTime:number,
            protected _expirationTime:number,
            protected _token:string
        ) {

        }

        public setIdentity(identity)
        {
            this._identity = identity;
        }
        public getIdentity()
        {
            return this._identity;
        }
        public setToken(token)
        {
            this._token = token;
        }
        public getToken()
        {
            return this._token;
        }
        public setExpirationTime(time)
        {
            this._expirationTime = time;
        }
        public getExpirationTime()
        {
            return this._expirationTime;
        }
        public setStartTime(time)
        {
            this._startTime = time;
        }
        public getStartTime()
        {
            return this._startTime;
        }
        public setAccountTypeName(accountTypeName)
        {
            this._accountTypeName = accountTypeName;
        }
        public getAccountTypeName()
        {
            return this._accountTypeName;
        }

        public toJson()
        {
            return {
                accountTypeName: this.getAccountTypeName(),
                identity: this.getIdentity(),
                startTime: this.getStartTime(),
                expirationTime: this.getExpirationTime(),
                token: this.getToken()
            };
        }

        public static fromJson(obj)
        {
            return new TSCore.App.Auth.Session(obj.accountTypeName, obj.identity, obj.startTime, obj.expirationTime, obj.token);
        }
    }
}