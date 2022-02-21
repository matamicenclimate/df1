DOCKER_REPO=climatecoin.dekaside.com
PROJECT_NAME=climatecoin
APP_NAME=${PROJECT_NAME}-fontend
VERSION=`node -p "require('./package.json').version"`
IMAGE_ID=${DOCKER_REPO}/${PROJECT_NAME}/${APP_NAME}

help:
	@echo "Makefile commands:"
	@echo ""
	@echo "build-prod"
	@echo "push-prod"

build-prod:
	@echo "Build Production"
	@echo "Tag ${IMAGE_ID}:${VERSION}"
	@echo "Tag ${IMAGE_ID}:latest"
	@docker build -f ./compose/production/Dockerfile -t ${IMAGE_ID}:latest -t ${IMAGE_ID}:${VERSION} .

push-prod: build-prod
	@echo "Build Production"
	@echo "Tag ${IMAGE_ID}:${VERSION}"
	@echo "Tag ${IMAGE_ID}:latest"
	@docker push ${IMAGE_ID}:${VERSION}
	@docker push ${IMAGE_ID}:latest