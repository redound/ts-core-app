module TSCore.App.System {

    export class Bootstrap {

        protected _module: ng.IModule;

        protected createModule(): ng.IModule {
            return angular.module('app', []);
        }

        protected getValues(): {}|any[] {
            return [];
        }

        protected getConfigs(): any[] {
            return [];
        }

        protected getServices(): {}|any[] {
            return [];
        }

        protected getFactories(): {}|any[] {
            return [];
        }

        protected getControllers(): {}|any[] {
            return [];
        }

        protected getDirectives(): {}|any[] {
            return [];
        }

        protected getRuns(): any[] {
            return [];
        }


        protected $runInject: string[];
        protected run(...args: any[]) {}


        public start(moduleName: string): ng.IModule {

            // Create module
            this._module = this.createModule();

            // Values
            var values = this.getValues();

            _.each(<_.Dictionary<{}>>values, (value: any, name) => {
                this._module.value(name, value);
            });

            // Configs
            var configs = this.getConfigs();

            _.each(<_.List<{}>>configs, (value: any) => {
                this._module.config(value);
            });

            // Services
            var services = this.getServices();

            _.each(<_.Dictionary<{}>>services, (value: any, name) => {
                this._module.service(name, value);
            });

            // Factories
            var factories = this.getFactories();

            _.each(<_.Dictionary<{}>>factories, (value: any, name) => {
                this._module.factory(name, value);
            });

            // Controllers
            var controllers = this.getControllers();

            _.each(<_.Dictionary<{}>>controllers, (value: any, name) => {
                this._module.controller(name, value);
            });

            // Directives
            var directives = this.getDirectives();

            _.each(<_.Dictionary<{}>>directives, (value: any, name) => {

                var dependencies = value.$inject || [];

                var self = this;
                var block = function() {
                    return new (Function.prototype.bind.apply(value, self._parseArgs(arguments)));
                };

                var directive = dependencies.concat([block]);

                this._module.directive(name, directive);
            });

            // Runs
            var runs = this.getRuns();

            _.each(<_.List<{}>>runs, (value: any) => {
                this._module.run(value);
            });

            if(this.run){

                var runConfig: any[] = this.$runInject || [];
                runConfig.push(_.bind(this.run, this));

                this._module.run(runConfig);
            }


            // Custom methods
            for (var method in this) {

                if (TSCore.Utils.Text.startsWith(method, "_init") && _.isFunction(method)) {
                    this[method]();
                }
            }

            angular.element(document).ready(() => {
                angular.bootstrap(document, [moduleName]);
            });

            return this._module;
        }

        protected _parseArgs(args) {

            var parsed = [null];
            for (var key in args) {
                parsed.push(args[key]);
            }
            return parsed;
        }

        public getModule(): ng.IModule {
            return this._module;
        }
    }
}