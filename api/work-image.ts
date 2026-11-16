import sharp from "sharp";

type ApiRequest = {
  query: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  send: (body: string | Buffer) => void;
};

type WorkPost = {
  image?: string;
  images?: string[];
};

// 작업일지 사진을 고정 주소로 내보낸다: /api/work-image?slug=<작업일지 주소>&i=<몇 번째 사진>
// 노션 사진 주소는 1시간짜리 서명이 붙어 금방 만료되므로, 검색엔진·카톡 공유용 og:image와
// 작업일지 화면은 이 주소를 쓴다. 매번 노션에서 새 주소를 받아 사진을 가져온 뒤 1600px 이하 JPEG로 줄여 보내고,
// 응답은 Vercel 캐시에 하루 동안 남겨 노션을 자주 부르지 않는다.
const SITE_URL = "https://2000stair.kr";
const MAX_WIDTH = 1600;
const JPEG_QUALITY = 80;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const slug = (firstParam(req.query.slug) ?? "").trim();
  const index = Math.max(0, Math.floor(Number(firstParam(req.query.i)) || 0));

  if (!slug) {
    res.status(400).send("slug required");
    return;
  }

  try {
    const postResponse = await fetch(`${SITE_URL}/api/area-posts?slug=${encodeURIComponent(slug)}`);
    if (postResponse.status === 404) {
      res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300");
      res.status(404).send("not found");
      return;
    }
    if (!postResponse.ok) {
      res.status(503).send("unavailable");
      return;
    }

    const post = (await postResponse.json()) as WorkPost;
    const images = post.images?.length ? post.images : post.image ? [post.image] : [];
    const source = images[index];
    if (!source) {
      res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300");
      res.status(404).send("not found");
      return;
    }

    const imageResponse = await fetch(source);
    if (!imageResponse.ok) {
      res.status(502).send("image fetch failed");
      return;
    }

    const input = Buffer.from(await imageResponse.arrayBuffer());
    // rotate(): 휴대폰 사진의 회전 정보(EXIF)를 실제 픽셀에 반영해 가로·세로가 뒤집히지 않게 한다
    const output = await sharp(input)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).send(output);
  } catch (error) {
    console.error("work-image failed", slug, index, error);
    res.status(500).send("image failed");
  }
}
