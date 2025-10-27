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
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // ✅ اجازه استفاده از any بدون خطا
      "@typescript-eslint/no-explicit-any": "off",
      // (اختیاری) خطاهای استفاده نکردن از متغیر رو هم خاموش کن
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];

export default eslintConfig;
