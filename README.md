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
- [Limitations](#limitations)
- [Key Features](#key-features)
- [Installation](#installation)
- [To Do](#to-do)

### Technologies

[![Bun](https://img.shields.io/badge/Bun-000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

### How it Works

Generation is split into 2 stages, **parsing** and **building**.

**Parsing** is done first, the TypeScript AST of your project is read and endpoint-related types such as request bodies, responses, and paths are stored.

**Building** converts the stored objects into JSON form for the schema file, and also makes validator functions for request bodies and parameters.

### Limitations

- Only string-like object keys are supported:

```ts
interface MyInterface {
    myStringKey: SomeValue; // good

    123: SomeOtherValue; // bad
}
```

- Non-URL JSDoc links are not converted to references, instead they're just shown in bold:

```ts
type SomeType = // ...

/** Some description, {@link SomeType} */
type SomeOtherType = // ...
// outputs **SomeType**, not #/components/schemas/SomeType
```

### Key Features

- Types referenced more than once are used by reference instead of by value (`"$ref": "#/components/schemas/..."`).
- Referenced types with identical names are given discriminators (e.g. `MyInterface#1`, `MyInterface#2`).
- All generated paths show a link to their source via `externalDocs` (configurable).
- Deterministic, so you can add your `openapi.json` to VCS without worry (e.g. object keys match the order they're written in the source code).
- Highly configurable, you instruct the generator how to find and read the types to generate from.
- Include extra validation and generation logic via JSDoc tags, `@integer`, `@minLength`, `@example`, etc.

### Installation

This assumes you have [git](https://git-scm.com/) and [Bun](https://bun.com/get) installed already.

```sh
git clone https://github.com/NachoToast/GenAPI.git
cd GenAPI
bun install
bun run start
```

### To Do

- [ ] Interface extension.
- [ ] Better handling for homogenous unions?
- [ ] String `format` comp, regexp validation.
- [ ] Mapped Types
  - [ ] Namely `Record<K, V>`
  - [ ] Other types I dislike, e.g. `{ [key: string]: ... }`,
- [ ] Utility types? Like `Pick`, `Omit`, `Exclude`, etc. Depends how easily the "final" type can be retrieved though.
- [ ] Type literals, e.g. `{ foo: "bar" }`
- [ ] Arrays
- [ ] Config hooks for adding security schemes, common responses, etc...
- [ ] Better config for custom content types.
- [ ] Enforce `@returns` tag on all endpoints so response description is always spec conformant.
- [ ] Schema tests.
- [ ] Better README.
