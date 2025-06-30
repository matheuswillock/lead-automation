import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "react/jsx-key": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-this-alias": "off",
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "warn",
    }
  }
];

export default eslintConfig;
