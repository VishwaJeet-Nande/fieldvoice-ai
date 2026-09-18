import type { SentimentTrend } from '@fieldvoice/types'

interface SentimentIndicatorProps {
  score: number
  trend?: SentimentTrend
  showTrend?: boolean
}

export function SentimentIndicator({
  score,
  trend,
  showTrend = true,
}: SentimentIndicatorProps) {
  const formattedScore = score > 0 ? `+${score.toFixed(2)}` : score.toFixed(2)

  const sentimentClass =
    score > 0.2
      ? 'positive'
      : score < -0.2
        ? 'negative'
        : 'neutral'

  const trendSymbol =
    trend === 'improving' ? '↑' : trend === 'declining' ? '↓' : '→'

  return (
    <div className={`sentiment-indicator sentiment-${sentimentClass}`}>
      <span className="sentiment-score">{formattedScore}</span>

      {showTrend && trend && (
        <span className="sentiment-trend">
          {trendSymbol} {trend}
        </span>
      )}
    </div>
  )
}