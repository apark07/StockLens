import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuote, getCandles, getProfile, getMetrics } from "../api/stocks";
import { communitySentiment } from "../api/community";
import BigChart from "../components/BigChart";
import { getNews, Article as NewsArticle } from "../api/news";

export default function Stock(){
  const nav = useNavigate();
  const { symbol: param } = useParams();
  const symbol = (param || "AAPL").toUpperCase();

  const [quote, setQuote] = useState<any>(null);
  const [candles, setCandles] = useState<number[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>({});
  const [comm, setComm] = useState<any>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);

  // Load core stock data
  useEffect(()=>{ (async()=>{
    const [q, cndl, prof, metr, c] = await Promise.all([
      getQuote(symbol),
      getCandles(symbol, "D", 180),
      getProfile(symbol),
      getMetrics(symbol),
      communitySentiment(symbol).catch(()=>null),
    ]);
    if (q && q.ok !== false) setQuote(q);
    if (cndl && Array.isArray(cndl.c)) setCandles(cndl.c);
    if (prof && prof.ok !== false) setProfile(prof);
    if (metr && metr.metric) setMetrics(metr.metric);
    if (c) setComm(c);
  })(); }, [symbol]);

  // Load news for this symbol
  useEffect(() => {
    (async () => {
      const resp = await getNews(symbol, 8);
      setNews(resp?.articles ?? []);
    })();
  }, [symbol]);

  const q = quote || {};
  const c = comm  || {};
  const pretty = (n:any, d=2)=> typeof n === "number" ? n.toFixed(d) : "—";
  const capB = (n:any)=> typeof n === "number" ? (n/1_000_000_000).toFixed(2) : "—";

  return (
    <div>
      <h1>{symbol} — Stats</h1>

      <div style={{display:"grid", gridTemplateColumns:"1.35fr .65fr", gap:16, alignItems:"start"}}>
        {/* Left column: Price + Chart + News */}
        <div style={{border:"1px solid #ddd", borderRadius:12, padding:12, background:"#fff"}}>
          <h3>Price</h3>
          <div style={{marginBottom:12}}>
            <div>Last: <b>{q.c ?? "—"}</b></div>
            <div>Change: <b>{typeof q.dp==='number' ? `${q.dp.toFixed(2)}%` : "—"}</b></div>
            <div>Open / High / Low: {q.o ?? "—"} / {q.h ?? "—"} / {q.l ?? "—"}</div>
            <div>Prev Close: {q.pc ?? "—"}</div>
          </div>
          <BigChart values={candles} width={980} height={340} />

          {/* Latest News */}
          <div style={{ marginTop: 18, borderTop: "1px solid #eee", paddingTop: 12 }}>
            <h3 style={{ margin: "0 0 10px 0" }}>Latest news</h3>
            {news.length === 0 ? (
              <div style={{ color: "#666" }}>No recent articles.</div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 12,
                }}
              >
                {news.map((a) => (
                  <a
                    key={a.url}
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: 10,
                        overflow: "hidden",
                        background: "#fff",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {a.image && (
                        <img
                          src={a.image}
                          alt=""
                          loading="lazy"
                          style={{ width: "100%", height: 140, objectFit: "cover" }}
                        />
                      )}
                      <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ fontSize: 12, color: "#666" }}>
                          {a.source || "News"}{" "}
                          {a.publishedAt
                            ? `· ${new Date(a.publishedAt * 1000).toLocaleDateString()}`
                            : ""}
                        </div>
                        <div style={{ fontWeight: 600, lineHeight: 1.2 }}>{a.title}</div>
                        {a.description && (
                          <div style={{ fontSize: 13, color: "#444" }}>{a.description}</div>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Company / Metrics / Community */}
        <div style={{display:"grid", gap:16}}>
          <div style={{border:"1px solid #ddd", borderRadius:12, padding:12, background:"#fff"}}>
            <h3>Company</h3>
            <div><b>{profile?.name || profile?.ticker || symbol}</b></div>
            <div>{profile?.exchange} · {profile?.currency}</div>
            <div>{profile?.finnhubIndustry}</div>
            {profile?.country && <div>Country: {profile.country}</div>}
            {profile?.weburl && <div style={{marginTop:6}}><a href={profile.weburl} target="_blank">Website ↗</a></div>}
          </div>

          <div style={{border:"1px solid #ddd", borderRadius:12, padding:12, background:"#fff"}}>
            <h3>Key Metrics</h3>
            <div>Market Cap: <b>{capB(metrics?.marketCapitalization)}</b> B</div>
            <div>52W High / Low: <b>{pretty(metrics?.["52WeekHigh"])}</b> / <b>{pretty(metrics?.["52WeekLow"])}</b></div>
            <div>PE (TTM): <b>{pretty(metrics?.peBasicExclExtraTTM)}</b></div>
            <div>EPS (TTM): <b>{pretty(metrics?.epsBasicExclExtraItemsTTM)}</b></div>
            <div>Revenue (TTM): <b>{capB(metrics?.revenueTTM)}</b> B</div>
            <div>Net Margin (TTM): <b>{pretty(metrics?.netProfitMarginTTM)}</b></div>
          </div>

          <div style={{border:"1px solid #ddd", borderRadius:12, padding:12, background:"#fff"}}>
            <h3>Community</h3>
            <div>Score: <b>{typeof c.score==='number' ? (c.score*100).toFixed(0) : "—"}</b></div>
            <div style={{height:8, background:"#eee", borderRadius:4, overflow:"hidden", marginTop:4}}>
              <div style={{width:`${((c.score??0)+1)*50}%`, height:"100%", background:"#7cbf84"}} />
            </div>
            <button style={{marginTop:12}} onClick={()=>nav(`/community?symbol=${symbol}`)}>Open Community</button>
          </div>
        </div>
      </div>
    </div>
  );
}
