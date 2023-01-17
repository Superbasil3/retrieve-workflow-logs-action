##
## Lint
##

.PHONY: build
build:
	ncc build index.js --license licenses.txt

.PHONY: release
release:
	npm version patch -m "[RELEASE] Version %s"
	npm install
