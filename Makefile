
build: cdk/build

deploy: cdk/deploy

api-service/built:
	npm run --prefix api-service build

website/dist:
	npm run --prefix website build

cdk/build: api-service/built website/dist
	npm run --prefix cdk build

cdk/deploy: cdk/build
	npm run --prefix cdk deploy

clean:
	npm run --prefix api-service clean
	npm run --prefix website clean
	npm run --prefix cdk clean

.PHONY: cdk/deploy clean build deploy
