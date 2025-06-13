import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';

const external = [
    "@fullstackcraftllc/codevideo-types",
    "path",
    "fs/promises",
    "os",
    "child_process",
];

export default [
    // standard package
    {
        input: "src/index.ts",
        output: {
            file: "dist/index.js",
            format: "es",
        },
        plugins: [typescript()],
        external,
    },
    // type declarations
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/index.d.ts",
                format: "es",
            },
        ],
        plugins: [
            dts(),
        ],
        external,
    },
];