import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    "credentials/DocumensoApi.credentials":
      "src/credentials/DocumensoApi.credentials.ts",
    "nodes/Documenso/Documenso.node": "src/nodes/Documenso/Documenso.node.ts",
    "nodes/DocumensoTrigger/DocumensoTrigger.node":
      "src/nodes/DocumensoTrigger/DocumensoTrigger.node.ts",
  },
  format: "cjs",
  outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
  outDir: "dist",
  sourcemap: true,
  minify: false,
  dts: true,
  external: [/^n8n-workflow/],
  noExternal: [/@documenso\/sdk-typescript/],
  platform: "node",
  copy: [
    { from: "src/nodes/Documenso/documenso.svg", to: "dist/nodes/Documenso" },
    {
      from: "src/nodes/Documenso/Documenso.node.json",
      to: "dist/nodes/Documenso",
    },
  ],
});
