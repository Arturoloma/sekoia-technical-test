import { readFileSync, writeFileSync } from 'fs';

const scssContent = readFileSync('src/styles/_tokens.scss', 'utf8');

// Parse SCSS variables
const variablePattern = /\$([\w-]+):\s*([^;]+);/g;
const matches = [...scssContent.matchAll(variablePattern)];

const tokens = {};
matches.forEach(([, name, value]) => {
  const camelCase = name.replace(/-([a-z0-9])/gi, (g) => g[1].toUpperCase());
  tokens[camelCase] = value.trim();
});

const tsContent = `/* eslint-disable */
// @ts-nocheck
// Auto-generated from _tokens.scss - DO NOT EDIT
export const Tokens = ${JSON.stringify(tokens, null, 2)} as const;

export type TokenKey = keyof typeof Tokens;
`;

writeFileSync('src/styles/tokens.ts', tsContent);
console.log('✅ Design tokens generated successfully');
