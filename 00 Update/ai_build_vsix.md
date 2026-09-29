I’m checking the extension packaging scripts in this repo so I can give you the exact command sequence to build a VSIX from the correct package.

Read

Read

Read

## Building a VSIX from this repo

This monorepo already includes packaging scripts for the extension packages in:

- `package.json`
- `package.json`

### 1) Install dependencies at the repo root

```bash
cd c:\Users\taclendj\Documents\GitHub\db-schema-visualizer_jak
npm install
```

### 2) Build the extension package you want

#### DBML extension

```bash
cd packages/dbml-vs-code-extension
npx @vscode/vsce package
npx @vscode/vsce package --no-yarn
```

#### Prisma extension

```bash
cd packages/prisma-vs-code-extension
npx @vscode/vsce package
```

This will generate a `.vsix` file in that package folder, for example:

- `packages/dbml-vs-code-extension/*.vsix`
- `packages/prisma-vs-code-extension/*.vsix`

---

## Notes

- The package scripts already define the build flow:
  - DBML: `build` runs `npx vite build && yarn run generate:css`
  - Prisma: `build:prisma` runs `npx vite build && yarn run generate:css`
- `vsce package` triggers the extension prepublish step automatically from the `vscode:prepublish` script.

If you want, I can also give you:

1. the exact command to install `vsce`
2. the command to install the generated VSIX locally for testing
3. a script to package both extensions in one go

code --install-extension "C:\Users\taclendj\Documents\GitHub\db-schema-visualizer_jak\packages\dbml-vs-code-extension\dbml-erd-visualizer-0.8.0.vsix"
