[![Build Status](https://travis-ci.org/ts-core/ts-core-app.svg?branch=development)](https://travis-ci.org/ts-core/ts-core-app) [![npm version](https://badge.fury.io/js/ts-core-app.svg)](http://badge.fury.io/js/ts-core-app) [![Bower version](https://badge.fury.io/bo/ts-core-app.svg)](http://badge.fury.io/bo/ts-core-app) [![Coverage Status](https://coveralls.io/repos/ts-core/ts-core-app/badge.svg?branch=development&service=github)](https://coveralls.io/github/ts-core/ts-core-app?branch=development)

TSCore 
=========

*TypeScript App Library*

This library is in it's early stages of development.

## Installing ##
Install using npm.
````
npm install ts-core ts-core-app
````

Install using Bower.
````
bower install ts-core ts-core-app
````
*Where is the declaration file?* Until we've added our declaration file to the [DefinitelyTyped repo](https://github.com/borisyankov/DefinitelyTyped) you can use `build/ts-core-app.d.ts`.

## Reference ##
Read the full [reference](http://reference.ts-core.org)

## Documentation ##
Read the full [documentation](http://ts-core.readme.io)

## Table of Contents

1. [API Service](#api-service)
1. [Data Service](#data-service)

## API Service

- It is a wrapper for the $http Service

    ````typescript
    angular
    	.module('app')
    	.factory('apiService', ($http) => {
    	
    		var api = new TSCore.App.Http.Api($http);
    		api.setProtocol('http://');
    		api.setHostname('api.angular-boilerplate.ts-core.org');
    	});
    ````

- It enables you to make pre-configured requests
- It parses *urlParams* if you define them

    ````typescript
    function Controller(apiService: TSCore.App.Http.Api) {
    	
    	apiService.request({
    		method: 'GET',
    		url: 'projects/:projectId',
    		urlParams:	{
    			projectId: 1
    		}
    	}).then(() => {
    		// Do something
    	});
    }
    ````

## API Collection


## Data Service

- [Data Service Setup](#data-service-setup)

###### [Data Service Setup]

- The order of dataSources determines where the dataService will look first

    ````typescript
    angular
    	.module('app')
    	.factory('dataService', () => {
    
    		var dataService = new TSCore.App.Data.DataService;
    		dataService.addDataSource(new TSCore.App.Data.DataSource.Memory);
    		dataService.addDataSource(new TSCore.App.Data.DataSource.Api);
    
    		return dataService;
    	});
    ````

###### [Fetch list - using Method]

- Quickly fetch a list of projects

    ````typescript
    class ProjectListController {
    	
    	public projects: any[];
    
    	public constructor(protected dataService: TSCore.App.Data.DataService) {
    
    	}
    
    	public fetchProjects() {
    
    		this.dataService
    			.fetchList('projects')
    			.then((results: TSCore.Data.ModelList) => {
    
    				this.projects = results.toArray();
    			});
    	}
    }
    ````

###### [Fetch list - using Query]

- Use query if you want to add extra conditions

    ````typescript
    class ProjectListController {
    	
    	public projects: any[];
    
    	public constructor(protected dataService: TSCore.App.Data.DataService) {
    
    	}
    
    	public fetchProjects() {
    
    		this.dataService
    			.query()
    			.from('projects')
    			.fetchList()
    			.then((results: TSCore.Data.ModelList) => {
    
    				this.projects = results.toArray();
    			});
    	}
    }
    ````

###### [Fetch single - using Method]

- Quickly fetch a single project

    ````typescript
    class ProjectDetailController {
    	
    	public project: Project;
    
    	public constructor(protected dataService: TSCore.App.Data.DataService) {
    
    	}
    
    	public fetchProject() {
    
    		this.dataService
    			.fetchSingle('projects', 1)
    			.then((result: Project) => {
    
    				this.project = result;
    			});
    	}
    }
    ````

###### [Fetch single - using Query]

- Use query to add extra conditions

    ````typescript
    class ProjectDetailController {
    	
    	public project: Project;
    
    	public constructor(protected dataService: TSCore.App.Data.DataService) {
    
    	}
    
    	public fetchProject() {
    
    		this.dataService
    			.query()
    			.from('projects')
    			.fetchSingle()
    			.then((result: Project) => {
    
    				this.project = result;
    			});
    	}
    }
    ````

###### [Fetch single/list - using Query with extra options]

- offset(value: number): ModelQuery<T>;
- limit(value: number): ModelQuery<T>;

    ````typescript
    dataService
    	.query()
    	.from('projects')
    	.offset(0)
    	.limit(100)
    	.fetchList().then((results: ModelList) => {
    		// Do something
    	});
    ````

- where(conditions: string, bind?: any): ModelQuery<T>;

    ````typescript
    dataService
    	.query()
    	.from('projects')
    	.where('title = :title:', { 
    		title: 'Project 1' 
    	})
    	.fetchList().then((results: ModelList) => {
    		// Do something
    	});
    ````

- having(values: any): ModelQuery<T>;

    ````typescript
    dataService
    	.query()
    	.from('projects')
    	.offset(0)
    	.limit(100)
    	.having({
    		title: 'Project 1'
    		userId: 2
    	})
    	.fetchList().then((results: ModelList) => {
    		// Do something
    	});
    ````

###### [Create - using Method]

- Create by passing a Model instance

	````typescript
	var project = new Project;
	project.title = 'Project 1';
	project.userId = 2;

	dataService
		.create('projects', project).then((result: Project) => {
			// Do something
		});
	````

###### [Update - using Method]

- Update by passing a Model instance

	````typescript
	project.title = 'Project 1';
	project.userId = 2;

	dataService
		.update('projects', project).then((result: Project) => {
			// Do something
		});
	````

###### [Remove - using Method]

- Remove by passing a Model instance

	````typescript
	dataService
		.remove('projects', project).then(() => {
			// Do something
		});
	````

**[Back to top](#table-of-contents)**

## Contributing ##
Please file issues under GitHub, or submit a pull request if you'd like to directly contribute.

