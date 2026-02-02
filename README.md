# GenAPI <!-- omit in toc -->

Not to be confused with "GenAI", Gen**API** generates an Open API schema file and input validators from TypeScript code.

[![CI](https://github.com/NachoToast/GenAPI/actions/workflows/ci.yml/badge.svg)](https://github.com/NachoToast/GenAPI/actions/workflows/ci.yml)
[![CodeQL](https://github.com/NachoToast/GenAPI/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/NachoToast/GenAPI/actions/workflows/codeql-analysis.yml)
[![codecov](https://codecov.io/gh/NachoToast/GenAPI/graph/badge.svg?token=MISGHLEMYW)](https://codecov.io/gh/NachoToast/GenAPI)

> [!WARNING]
> This project is still under construction!

### Table of Contents <!-- omit in toc -->

- [Technologies](#technologies)
- [How it Works](#how-it-works)
- [Installation](#installation)
- [To Do](#to-do)

### Technologies

[![Bun](https://img.shields.io/badge/Bun-000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

### How it Works

Generation is split into 2 stages, **parsing** and **building**.

**Parsing** is done first, the TypeScript AST of your project is read and endpoint-related types such as request bodies, responses, and paths are stored.

**Building** converts the stored objects into JSON form for the schema file, and also makes validator functions for request bodies.

### Installation

This assumes you have [git](https://git-scm.com/) and [Bun](https://bun.com/get) installed already.

```sh
git clone https://github.com/NachoToast/GenAPI.git
cd GenAPI
bun install
bun run start
```

### To Do

- [ ] Union Types
  - [ ] Special case for union with null, should set `SchemaObject.nullable`
- [ ] More Interface Stuff
  - [ ] Optional keys, pretty sure it's a flag on the propery signature node.
  - [ ] Interface extension.
- [ ] Mapped Types
  - [ ] Namely `Record<K, V>`
  - [ ] Other types I dislike, e.g. `{ [key: string]: ... }`,
- [ ] Utility types? Like `Pick`, `Omit`, `Exclude`, etc. Depends how easily the "final" type can be retrieved though.
- [ ] Type literals, e.g. `{ foo: "bar" }`
- [ ] Arrays
- [ ] Enums
- [ ] Booleans
- [ ] Config hooks for adding security schemes, common responses, etc...
- [ ] Better config for custom content types.
- [ ] Enforce `@returns` tag on all endpoints so response description is always spec conformant.
- [ ] Schema tests.
- [ ] Better README.
