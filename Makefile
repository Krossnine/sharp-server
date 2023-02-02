SHELL := /bin/bash
MAKEFLAGS += --no-print-directory
export VERSION=$(shell jq -r '.version' lerna.json)

clean:
	@npm run clean

install:clean
	@npm install

test:install
	@npm run test

docker-login:
	@echo $(KROSSNINE_DOCKER_TOKEN) | docker login --username krossnine --password-stdin

build:
	@VERSION=$(VERSION) docker-compose build api

publish:docker-login
	@VERSION=$(VERSION) docker-compose push api

run:
	@VERSION=$(VERSION) docker-compose up
