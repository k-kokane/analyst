export interface ResearchRunMeta {
  id: string
  date: string
  tags: string[]
  stocks: string[]
  summary: string
}

export interface IndexData {
  runs: ResearchRunMeta[]
}

export interface TechnicalAnalysis {
  pattern: string
  rsi: number
  trend: string
  volume_signal: string
  support: number
  resistance: number
  points: string[]
}

export interface FundamentalAnalysis {
  catalyst: string
  points: string[]
}

export interface StockAnalysis {
  ticker: string
  name: string
  exchange: 'NSE' | 'BSE'
  sector: string
  cmp: number
  target: number
  upside: number
  timeframe: string
  thesis: string
  technical: TechnicalAnalysis
  fundamental: FundamentalAnalysis
  risk: string
}

export interface ResearchRun {
  id: string
  date: string
  tags: string[]
  summary: string
  market_context: string
  stocks: StockAnalysis[]
}
