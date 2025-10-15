import requests
from core.config import Config

BASE = "https://newsapi.org/v2/everything"

def headlines_for_symbol(symbol: str, page_size: int = 10):
    params = {
        "q": symbol,
        "sortBy": "publishedAt",
        "pageSize": page_size,
        "apiKey": Config.NEWSAPI_KEY,
        "language": "en",
    }
    r = requests.get(BASE, params=params)
    r.raise_for_status()
    data = r.json()
    return [
        {"title": a.get("title"), "source": (a.get("source") or {}).get("name"), "url": a.get("url")}
        for a in data.get("articles", [])
    ]