import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  // Never lint generated output, deps, or build artefacts.
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    // eslint-plugin-react's auto-detection calls an API ESLint 10 removed, so
    // pin the version explicitly instead of letting it probe node_modules.
    settings: { react: { version: "19.2" } },
  },
];

export default eslintConfig;
