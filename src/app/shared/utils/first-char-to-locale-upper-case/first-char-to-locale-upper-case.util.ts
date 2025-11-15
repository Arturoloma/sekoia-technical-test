export function firstCharToLocaleUpperCase(text: string): string {
  return `${text.slice(0, 1).toLocaleUpperCase()}${text.slice(1)}`;
}
