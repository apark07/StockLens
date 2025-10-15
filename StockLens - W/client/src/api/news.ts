import client from "./client";

export type Article = {
  title: string;
  url: string;
  source?: string;
  publishedAt?: number; // epoch seconds
  image?: string;
  description?: string;
};

export type NewsResponse = {
  ok: boolean;
  articles: Article[];
};

export async function getNews(symbol: string, limit = 8): Promise<NewsResponse | null> {
  try {
    const res = await client.get("/stocks/news", { params: { symbol, limit } });
    return (res.data as NewsResponse) ?? null;
  } catch {
    return null;
  }
}
