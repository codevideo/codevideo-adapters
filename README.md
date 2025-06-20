# codevideo-adapters

Adapters for third party services (file system, GitHub, etc.) to connect to the CodeVideo ecosystem.

Currently, all adapters are not web compatible and are meant to be used in Node.js environments.

## Usage - File System Adapter

Start your CodeVideo lesson with the exact same starting point as any existing codebase, by providing the path to the folder containing your code:

```ts
import { buildFileStructureFromRootFolder } from "@fullstackcraftllc/codevideo-adapters";

const fileStructure = await buildFileStructureFromRootFolder("/path/to/your/codebase");

// use fileStructure in the initialSnapshot of your lesson

```

Returns a file structure of type [`IFileStructure`](https://github.com/codevideo/codevideo-types/blob/main/src/interfaces/IFileStructure.ts) from the `@fullstackcraftllc/codevideo-types` package.

## Usage - GitHub Adapter

Start your CodeVideo lesson at the exact file structure as a GitHub repository link.

Coming soon.