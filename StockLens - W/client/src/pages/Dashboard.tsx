import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuote, getCandles } from "../api/stocks";
import { communitySentiment } from "../api/community";
import Spark from "../components/Spark";

const DEFAULTS = ["AAPL","MSFT","NVDA","AMZN","GOOGL","META","TSLA","NFLX"];

type Row = {
  symbol: string;
  price?: number;
  changePct?: number;
  candles?: number[];
  communityScore?: number;
};

export default function Dashboard() {
  const nav = useNavigate();
  const [rows, setRows] = useState<Row[]>(DEFAULTS.map(s => ({ symbol: s })));

  useEffect(() => {
    (async () => {
      const updated: Row[] = [];
      for (const symbol of DEFAULTS) {
        const [q, cds, comm] = await Promise.all([
          getQuote(symbol),
          getCandles(symbol, "D", 90),
          communitySentiment(symbol).catch(() => null),
        ]);

        updated.push({
          symbol,
          price: typeof q?.c === "number" ? q.c : undefined,
          changePct: typeof q?.dp === "number" ? q.dp : undefined,
          candles: Array.isArray(cds?.c) ? cds.c : [],
          communityScore: typeof comm?.score === "number" ? comm.score : 0,
        });
      }
      setRows(updated);
    })();
  }, []);

  return (
    <div>
      <h1>StockLens</h1>

      {/* Wider cards & a touch more spacing */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(460px, 1fr))",
          gap: 24,
        }}
      >
        {rows.map((r) => {
          const price = r.price !== undefined ? r.price : "—";
          const chg = r.changePct !== undefined ? `${r.changePct.toFixed(2)}%` : "—";
          const scorePct = ((r.communityScore ?? 0) * 100).toFixed(0);

          return (
            <div
              key={r.symbol}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 20,
                background: "#fff",
                boxShadow: "0 1px 6px rgba(0,0,0,.05)",
                minHeight: 170,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <strong style={{ fontSize: 22 }}>{r.symbol}</strong>
                <button onClick={() => nav(`/stock/${r.symbol}`)}>Open</button>
              </div>

              <div style={{ display: "flex", gap: 18, marginTop: 6, alignItems: "center" }}>
                <div>
                  <div>
                    Price: <b>{price}</b>
                  </div>
                  <div>
                    Change: <b>{chg}</b>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    Community score: <b>{scorePct}</b>
                  </div>
                  {/* wider bar so it looks right on the wider card */}
                  <div
                    style={{
                      height: 6,
                      width: 280,
                      background: "#eee",
                      borderRadius: 4,
                      overflow: "hidden",
                      marginTop: 6,
                    }}
                  >
                    <div
                      style={{
                        width: `${((r.communityScore ?? 0) + 1) * 50}%`,
                        height: "100%",
                        background: "#7cbf84",
                      }}
                    />
                  </div>
                </div>

                {/* bigger sparkline to match the bigger card */}
                <div style={{ marginLeft: "auto" }}>
                  <Spark values={r.candles || []} width={320} height={110} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
