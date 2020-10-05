app := workspace-service
image := fnhsproduction.azurecr.io/$(app)
tag := latest
localdb := postgres://postgres:postgres@localhost:5432
db := $$(kubectl get secret -n workspace-service workspace-service -o jsonpath='{.data.url}' | base64 -D)

.PHONY: default
default: ## Run locally
	cargo run

.PHONY: run
run: ## Fetch DB URL and run locally
	DATABASE_URL=$$(kubectl get secret -n workspace-service workspace-service -o jsonpath='{.data.url}' | base64 -D) \
	UPLOAD_CONTAINER_URL=$$(kubectl get configmap -n workspace-service files-storage-account -o jsonpath='{.data.upload_container_id}') \
	FILES_CONTAINER_URL=$$(kubectl get configmap -n workspace-service files-storage-account -o jsonpath='{.data.files_container_id}') \
	FILE_STORAGE_ACCESS_KEY=$$(kubectl get secret -n workspace-service files-storage-account -o jsonpath='{.data.primary_access_key}' | base64 -D) \
		$(MAKE)

.PHONY: run-local
run-local: migrate-local ## Run locally against Postgres and Azure running in Docker
	DATABASE_URL=$(localdb) \
	UPLOAD_CONTAINER_URL=http://localhost:10000/devstoreaccount1 \
	FILES_CONTAINER_URL=http://localhost:10000/devstoreaccount1 \
	FILE_STORAGE_ACCESS_KEY='Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==' \
		$(MAKE)

.PHONY: test
test: ## Run tests [TEST=test_name (optional)]
	cargo test $$TEST

.PHONY: docker-build
docker-build: ## Build and tag Docker image
	DOCKER_BUILDKIT=1 docker build . \
		--progress plain \
		--tag $(app) \
		--tag $(image) \
		--tag $(image):$(tag)

.PHONY: docker-run
docker-run: ## Run Docker image
	docker run -it -p 3030:3030 $(image)

.PHONY: docker-push
docker-push: ## Push Docker image
	docker push $(image)
	docker push $(image):$(tag)

.PHONY: watch-local
watch-local: migrate-local ## Create a local, migrated DB for dev using a local DB rather than cluster, then cargo watch
	DATABASE_URL=$(localdb) cargo watch -x help -x check

.PHONY: watch
watch: ## Run cargo watch in the way that David likes it.
	DATABASE_URL=$(db) cargo watch -x help -x check

.PHONY: reset-local
reset-local: ## Resets local database
	docker-compose down --volumes

.PHONY: migrate-local
migrate-local: ## Bring up local dependencies and migrate run DB migrations
	docker-compose up -d \
	&& until DATABASE_URL=$(localdb) cargo sqlx migrate run; do sleep 1; done

# You must have a version of sqlx that includes this patch
# cargo install --git https://github.com/launchbadge/sqlx --rev 106a6a83952bfc0e3316d54f99d865e469dcc15a sqlx-cli
.PHONY: migrate
migrate: ## Run migrations on current cluster
	DATABASE_URL=$(db) cargo sqlx migrate run

.PHONY: prepare
prepare: migrate-local ## Prepares new version of sqlx-data.json
	cargo clean --package workspace_service && DATABASE_URL=$(localdb) cargo sqlx prepare -- --bin workspace_service

.PHONY: default-folders-local
default-folders-local: ## make folders locally (requires you to be running `make run-local` in another tab).
	./scripts/create-workspace-if-needed.sh local

.PHONY: graphql-schema.json
graphql-schema.json:
	cargo run -- --generate-schema-only >$@

.PHONY: help
help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
