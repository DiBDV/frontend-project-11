develop:
	npx webpack serve

run:
	bin/nodejs-package.js 10

install:
	npm ci

build:
	NODE_ENV=production npx webpack

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

publish:
	npm publish
