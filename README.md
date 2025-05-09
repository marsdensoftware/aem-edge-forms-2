# AEM edge delivery services
Oscar's AEM edge delivery services test project

## Environments
- Preview: https://main--aem-edge-forms-2--marsdensoftware.aem.page/
- Live: https://main--aem-edge-forms-2--marsdensoftware.aem.live/

## Prerequisites

- nodejs 18.3.x or newer
- AEM Cloud Service release 2024.8 or newer (>= `17465`)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)

## Notes

### Custom blocks

 * When adding custom blocks to the blocks directory, the folder name appears to match the name of the block template or the title of the block definition with spaces replaced by hyphens, _not_ the id of the block
 * You can generate the changes to `component-*.json` files with `npm run build:json`, but it may overwrite manual changes.

## Other docs

* https://www.aem.live/developer/ue-tutorial
* https://www.aem.live/developer/universal-editor-blocks
