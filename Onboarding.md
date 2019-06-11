# Onboarding


>*Note:* Before completing this guide, make sure you have completed the _general_ onboarding guide in the [base mojaloop repository](https://github.com/mojaloop/mojaloop/blob/master/onboarding.md#mojaloop-onboarding).

## <a name='Contents'></a>Contents 

<!-- vscode-markdown-toc -->
1. [Prerequisites](#Prerequisites)
2. [Installing and Building](#InstallingandBuilding)
3. [Running Locally](#RunningLocally)
4. [Running Inside Docker](#RunningInsideDocker)
5. [Testing](#Testing)
6. [Common Errors/FAQs](#CommonErrorsFAQs)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

##  1. <a name='Prerequisites'></a>Prerequisites

If you have followed the [general onboarding guide](https://github.com/mojaloop/mojaloop/blob/master/onboarding.md#mojaloop-onboarding), you should already have the following cli tools installed:

* `brew` (macOS), [todo: windows package manager]
* `curl`, `wget`
* `docker` + `docker-compose`
* `node`, `npm` and (optionally) `nvm`

In addition to the above cli tools, you will need to install the following to build and run the `ml-api-adapter`:


###  1.1. <a name='macOS'></a>macOS
```bash
#none - you have everything you need!
```

###  1.2. <a name='Linux'></a>Linux

[todo]

###  1.3. <a name='Windows'></a>Windows

[todo]



##  2. <a name='InstallingandBuilding'></a>Installing and Building

Firstly, clone your fork of the `central-end-user-registry` onto your local machine:
```bash
git clone https://github.com/<your_username>/central-end-user-registry.git
```

Then `cd` into the directory and install the node modules:
```bash
cd central-end-user-registry
npm install
```

> If you run into problems running `npm install`, make sure to check out the [Common Errors/FAQs](#CommonErrorsFAQs) below.


##  3. <a name='RunningLocally'></a>Running Locally (with dependencies inside of docker)

In this method, we will run all of the dependencies (`mysql`) inside of docker containers, while running the `central-end-user-registry` server on your local machine.

> Alternatively, you can run the `central-end-user-registry` inside of `docker-compose` with the rest of the dependencies to make the setup a little easier: [Running Inside Docker](#RunningInsideDocker).


**1. Set up the MySQL container, and give it time to initialize**

```bash
docker-compose up mysql
```

**2. Configure the default files and run the server**
```bash
# set the CLEDG_DATABASE_URI environment variable 
export CLEDG_DATABASE_URI=mysql://central_end_user_registry:cVq8iFqaLuHy8jjKuA@127.0.0.1:3306/central_end_user_registry

# start the server
npm run start
```

Upon running `npm run start`, your output should look similar to:

```bash
> @mojaloop/central-end-user-registry@5.2.0 start /Users/ldaly/developer/vessels/mojaloop-github/central-end-user-registry
> node src/server.js

http://localhost:3001
method  path                  description
------  --------------------  -----------
GET     /documentation
GET     /health
POST    /register
GET     /swagger.json
GET     /swaggerui/{path*}
GET     /swaggerui/extend.js
GET     /users
GET     /users/{number}

2019-06-03T04:40:41.814Z - info: Server running at: http://localhost:3001
```
##  4. <a name='RunningInsideDocker'></a>Running Inside Docker

We use `docker-compose` to manage and run the `central-end-user-registry` along with its dependencies with one command.

>*Note:* Before starting all of the containers however, start the `mysql` container alone, to give it some more time to set up the necessary permissions (this only needs to be done once). This is a short-term workaround because the `central-end-user-registry` doesn't retry it's connection to MySQL.


**1.Use `npm run` to run the containers together**
```bash
docker-compose up mysql #first time only - the initial mysql load takes a while, and if it's not up in time, the central-end-user-registry will crash

npm run docker:up
```

This will do the following:
* `docker pull` down any dependencies defined in the `docker-compose.yml` file
* `docker build` the `central-end-user-registry` image based on the `Dockerfile` defined in this repo
* run all of the containers together


### 4.1 Handy Docker Compose Tips

You can run `docker-compose` in 'detached' mode as follows:

```bash
npm run docker:up -- -d
```

And then attach to the logs with:
```bash
docker-compose logs -f
```

When you're done, don't forget to stop your containers however:
```bash
npm run docker:stop
```


##  5. <a name='Testing'></a>Testing

We use `npm` scripts as a common entrypoint for running the tests.

```bash
# unit tests:
npm run test:unit

# integration tests
npm run test:integration

# functional tests
npm run test:functional

# check test coverage
npm run test:coverage
```


##  6. <a name='CommonErrorsFAQs'></a>Common Errors/FAQs

#### 6.1 `sodium v1.2.3` can't compile during npm install

Resolved by installing v2.0.3 `npm install sodium@2.0.3`


#### 6.2 On macOS, `npm install` fails with the following error
```
Undefined symbols for architecture x86_64:
  "_CRYPTO_cleanup_all_ex_data", referenced from:
      _rd_kafka_transport_ssl_term in rdkafka_transport.o
  "_CRYPTO_num_locks", referenced from:
  ........
  ld: symbol(s) not found for architecture x86_64
clang: error: linker command failed with exit code 1 (use -v to see invocation) 
```

Resolved by installing openssl `brew install openssl` and then running: 
  ```bash
  export CFLAGS=-I/usr/local/opt/openssl/include 
  export LDFLAGS=-L/usr/local/opt/openssl/lib 
  npm install
  ```  
