export function encodeCursor(obj: any) { return Buffer.from(JSON.stringify(obj)).toString('base64'); }
export function decodeCursor<T = any>(cursor?: string): T | undefined {
  if (!cursor) return undefined;
  try { return JSON.parse(Buffer.from(cursor, 'base64').toString('utf8')) as T; }
  catch { return undefined; }
}
