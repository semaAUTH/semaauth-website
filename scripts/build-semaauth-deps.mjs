import { execSync } from "node:child_process";
import { existsSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Build order — each package depends on earlier entries. */
const PACKAGES = [
  { name: "@semaauth/shared-types", jsx: false },
  { name: "@semaauth/jwt-verify", jsx: false },
  { name: "@semaauth/adapter-core", jsx: false },
  { name: "@semaauth/sdk-web", jsx: true },
];

const nodeModules = join(dirname(fileURLToPath(import.meta.url)), "..", "node_modules");

function resolvePackageDir(name) {
  const direct = join(nodeModules, name);
  if (existsSync(direct)) return direct;

  const pnpmRoot = join(nodeModules, ".pnpm");
  if (!existsSync(pnpmRoot)) return direct;

  const encoded = name.replace("/", "+");
  const match = readdirSync(pnpmRoot).find(
    (entry) => entry.startsWith(`${encoded}@`) || entry.includes(`+${encoded}@`)
  );
  if (!match) return direct;
  return join(pnpmRoot, match, "node_modules", name);
}

function buildPackage(name, dir, jsx) {
  const distEntry = join(dir, "dist", "index.js");
  if (existsSync(distEntry)) {
    console.log(`[build-semaauth-deps] ${name} already built`);
    return;
  }

  const tsconfigPath = join(dir, "tsconfig.build.json");
  writeFileSync(
    tsconfigPath,
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          module: "NodeNext",
          moduleResolution: "NodeNext",
          declaration: true,
          declarationMap: true,
          outDir: "dist",
          rootDir: "src",
          strict: true,
          skipLibCheck: true,
          ...(jsx ? { jsx: "react-jsx" } : {}),
        },
        include: ["src/**/*"],
      },
      null,
      2
    )
  );

  try {
    console.log(`[build-semaauth-deps] building ${name}…`);
    execSync("npx tsc -p tsconfig.build.json", { cwd: dir, stdio: "inherit" });
  } finally {
    if (existsSync(tsconfigPath)) unlinkSync(tsconfigPath);
  }
}

for (const { name, jsx } of PACKAGES) {
  const dir = resolvePackageDir(name);
  if (!existsSync(join(dir, "src"))) {
    console.warn(`[build-semaauth-deps] skip ${name} — not installed`);
    continue;
  }
  buildPackage(name, dir, jsx);
}

console.log("[build-semaauth-deps] done");
