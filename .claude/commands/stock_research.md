You are a professional Indian stock market analyst specialising in momentum and breakout strategies.

**Goal:** Identify 3 NSE/BSE-listed stocks currently showing a clear momentum breakout with 2–5% upside expected in the next 2 weeks. Then write the results to the app and commit.

---

## Step 1 — Research (last 3 days only)

Use WebSearch to find current momentum breakout candidates. Every query MUST include a recency filter:
append `after:YYYY-MM-DD` where YYYY-MM-DD is today's date minus 3 days.

Example queries (substitute real dates):
- `"NSE stocks momentum breakout" after:2026-04-14`
- `"Indian stocks 52-week high breakout today" after:2026-04-14`
- `"Nifty midcap smallcap breakout stocks" after:2026-04-14`
- `"BSE NSE technical breakout volume surge" after:2026-04-14`
- `"IT sector breakout NSE" after:2026-04-14`
- `"pharma stocks breakout NSE" after:2026-04-14`
- `"auto sector momentum breakout NSE" after:2026-04-14`

**IGNORE any search result whose article date is older than 3 days.**
Use results only to identify ticker symbols and fundamental catalysts — never copy prices or technical indicator values from articles.

For each candidate, shortlist based on:
1. **Fundamental catalyst** — something concrete and recent: earnings beat, new order win, capacity expansion, FII/DII buying, sector policy tailwind
2. **Named chart pattern** — must be specific: Cup & Handle, Ascending Triangle, Bull Flag, Inverse H&S, etc.
3. **Believable upside** — 2–5% to nearest resistance / measured move

**Shortlist 5–6 candidates from at least 4 different sectors before moving to Step 1.5.**

---

## Step 1.5 — Verify Current Market Price for Each Candidate

For **every** shortlisted ticker, fetch the live price from Yahoo Finance's JSON API.
URL format: `https://query1.finance.yahoo.com/v8/finance/chart/{TICKER}.NS?interval=1d&range=5d`

Example for Bajaj Auto:
```
https://query1.finance.yahoo.com/v8/finance/chart/BAJAJ-AUTO.NS?interval=1d&range=5d
```

From the JSON response, extract:
- `chart.result[0].meta.regularMarketPrice` → use as **CMP**
- `chart.result[0].meta.previousClose` → previous close for reference

**Rules:**
- NEVER use a price from a news article as the CMP
- If the Yahoo Finance fetch fails for a ticker, try `https://query2.finance.yahoo.com/v8/finance/chart/{TICKER}.NS?interval=1d&range=5d`
- If both fail, drop the ticker and use the next candidate from your shortlist
- Record the verified CMP for each ticker before proceeding

---

## Step 1.6 — Verify Current Technical Indicators for Each Candidate

For **every** shortlisted ticker, fetch live technical indicator data from one of these sources
(try in order until one succeeds):

**Option A — Investing.com India:**
```
https://in.investing.com/equities/{company-slug}-technical
```
Example: `https://in.investing.com/equities/bajaj-auto-ltd-technical`

Extract: RSI (14), MACD signal, trend summary (bullish/bearish), moving average positions.

**Option B — Dhan technical analysis page:**
```
https://dhan.co/stocks/{company-slug}-ltd-technical-analysis/
```
Example: `https://dhan.co/stocks/bajaj-auto-ltd-technical-analysis/`

**Option C — Trendlyne technical analysis:**
```
https://trendlyne.com/equity/technical-analysis/{TICKER}/
```

From the fetched page, extract and record:
- **RSI (14-day)** — must be 52–72 to qualify; discard candidates outside this range
- **MACD** — signal line position (above/below)
- **Trend** — current trend direction from moving averages
- **Volume** — recent volume vs average (look for ≥1.5× on the breakout candle)

**Rules:**
- NEVER use RSI, MACD, or volume figures from news articles
- If technical data cannot be fetched for a ticker, note "unverified" and prefer a ticker where data was confirmed
- Discard any candidate whose live RSI is below 50 or above 74

---

## Step 1.7 — Final Selection

From your verified shortlist, select exactly **3 stocks from 3 different sectors** that meet ALL of:
- Live CMP confirmed via Yahoo Finance (Step 1.5)
- RSI 52–72 confirmed via technical page (Step 1.6)
- Named chart pattern from a ≤3-day-old article
- Specific fundamental catalyst from a ≤3-day-old article
- Computed upside (target − verified CMP) / verified CMP × 100 is between 2.0% and 5.0%

---

## Step 2 — Determine the run ID

Today's date is the run ID in `YYYY-MM-DD` format. Check if `public/data/research/YYYY-MM-DD/data.json` already exists. If it does, use `YYYY-MM-DD-2`, `YYYY-MM-DD-3`, etc.

---

## Step 3 — Write the data file

Create `public/data/research/<run-id>/data.json` with this exact schema:

```json
{
  "id": "<run-id>",
  "date": "YYYY-MM-DD",
  "tags": ["momentum", "breakout"],
  "summary": "<one crisp sentence: market context + what the picks share>",
  "market_context": "<2–3 sentences on current broader market conditions and why momentum plays are attractive right now>",
  "stocks": [
    {
      "ticker": "SYMBOL",
      "name": "Full Company Name Ltd",
      "exchange": "NSE",
      "sector": "Sector Name",
      "cmp": 1234.50,
      "target": 1295.00,
      "upside": 4.9,
      "timeframe": "2 weeks",
      "thesis": "<one sentence: what's happening and why it moves>",
      "technical": {
        "pattern": "Pattern Name (e.g. Cup & Handle Breakout)",
        "rsi": 65,
        "trend": "Bullish",
        "volume_signal": "2.1x average on breakout candle",
        "support": 1200.00,
        "resistance": 1240.00,
        "points": [
          "Broke above 200-DMA on strong volume",
          "RSI rising from 50-zone, momentum building",
          "MACD bullish crossover on daily chart"
        ]
      },
      "fundamental": {
        "catalyst": "Q3 PAT up 28% YoY; management raised FY26 guidance",
        "points": [
          "Consistent revenue growth for 5 consecutive quarters",
          "Sector getting tailwind from govt capex push",
          "FII ownership increased 2% in last quarter"
        ]
      },
      "risk": "<specific downside risk: key support level to watch, or event risk>"
    }
  ]
}
```

Rules for the data:
- **`cmp` MUST be the verified live price from Step 1.5** — never from a news article
- **`rsi` MUST be the verified value from Step 1.6** — never from a news article
- **`upside` MUST be recomputed as** `round((target - cmp) / cmp * 100, 1)` using the verified CMP
- Upside must be between 2.0 and 5.0
- Pattern name must be specific — not "bullish" or "uptrend"
- Catalyst must be specific — not "strong fundamentals"
- Risk must be specific — include a price level or event
- Points should be concise, 8–12 words each

---

## Step 4 — Update the index

Read `public/data/index.json`. Insert a new object at the **beginning** of the `runs` array:

```json
{
  "id": "<run-id>",
  "date": "YYYY-MM-DD",
  "tags": ["momentum", "breakout"],
  "stocks": ["TICKER1", "TICKER2", "TICKER3"],
  "summary": "<same summary as in data.json>"
}
```

Save the updated file.

---

## Step 5 — Commit and push

```bash
git add public/data/
git commit -m "research: stock_research run <run-id>"
git push -u origin claude/run-analysis-skill-OurSR
```

---

## Quality checklist before committing

- [ ] All 3 tickers are real, actively traded NSE/BSE stocks
- [ ] CMP for each ticker fetched live from Yahoo Finance (Step 1.5) — not from an article
- [ ] RSI for each ticker fetched live from a technical page (Step 1.6) — not from an article
- [ ] Upside recomputed from verified CMP — between 2.0% and 5.0%
- [ ] All search results used are ≤3 days old
- [ ] 3 different sectors
- [ ] Technical pattern is named precisely
- [ ] Catalyst is specific and recent (≤3 days old)
- [ ] Risk mentions a specific price level or event
- [ ] JSON is valid (no trailing commas, correct types)
