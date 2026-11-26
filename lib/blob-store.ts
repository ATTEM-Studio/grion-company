import { BlobPreconditionFailedError, del, get, list, put } from "@vercel/blob";

// Vercel Blob(Private) 도우미. 연결 값은 Vercel이 프로젝트에 넣어 주고 @vercel/blob이 자동으로 읽습니다.
// 연결 방식은 두 가지: 토큰(BLOB_READ_WRITE_TOKEN) 또는 저장 공간 ID(BLOB_STORE_ID, OIDC 인증).
// 코드에 토큰을 적지 않습니다.
export const blobConnected = () =>
  Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

export async function readJson<T>(pathname: string): Promise<{ data: T; etag: string } | null> {
  const res = await get(pathname, { access: "private", useCache: false });
  if (!res || res.statusCode !== 200) return null;
  const data = (await new Response(res.stream).json()) as T;
  return { data, etag: res.blob.etag };
}

// etag를 주면 그 상태에서만 덮어씁니다. (없던 파일을 만들 때는 이미 있으면 실패)
export async function writeJson(pathname: string, value: unknown, etag?: string): Promise<void> {
  await put(pathname, JSON.stringify(value), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: Boolean(etag),
    ...(etag ? { ifMatch: etag } : {}),
  });
}

export async function listPaths(prefix: string, limit = 1000): Promise<{ pathname: string; url: string }[]> {
  const out: { pathname: string; url: string }[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, limit: Math.min(1000, limit - out.length), cursor });
    out.push(...page.blobs.map((b) => ({ pathname: b.pathname, url: b.url })));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor && out.length < limit);
  return out;
}

export const removeBlobs = (urls: string[]) => (urls.length ? del(urls) : Promise.resolve());
export const isConflict = (e: unknown) =>
  e instanceof BlobPreconditionFailedError || /already exists|precondition/i.test(String((e as Error)?.message ?? ""));
