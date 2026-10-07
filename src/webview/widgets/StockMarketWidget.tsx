import React, { useState, useEffect, useRef } from 'react';

// Shape of each quote posted back by the extension host (see fetchQuote in extension.ts).
interface Quote {
    symbol: string;
    price: number;
    changePercent: number;
    baseline: number;
    sparkline: number[];
    marketOpen: boolean;
}

const WATCHLIST = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'GOOGL', name: 'Alphabet' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'NVDA', name: 'NVIDIA' },
    { symbol: 'BTC-USD', name: 'Bitcoin' },
    { symbol: 'ETH-USD', name: 'Ethereum' },
];

const NAME_BY_SYMBOL: { [symbol: string]: string } = Object.fromEntries(
    WATCHLIST.map((s) => [s.symbol, s.name])
);

const REFRESH_MS = 60000; // real quotes — refresh once a minute

const isCrypto = (symbol: string) => symbol.endsWith('-USD');

export const StockMarketWidget: React.FC = () => {
    // Quotes are fetched by the extension host (no CORS limits) and posted back.
    const vscode = (window as any).vscode;
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [, setTick] = useState(0);
    const hasQuotes = useRef(false);

    const fetchStockData = () => {
        setIsRefreshing(true);
        vscode.postMessage({
            type: 'fetchStockData',
            symbols: WATCHLIST.map((s) => s.symbol),
        });
    };

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            const message = event.data;

            if (message.type === 'stockData') {
                const parsed: Quote[] = (message.data || []).filter(
                    (item: any) => !item.error && typeof item.price === 'number'
                );
                hasQuotes.current = parsed.length > 0;
                setQuotes(parsed);
                setError(parsed.length === 0 ? 'No market data available' : null);
                setLastUpdate(new Date());
                setLoading(false);
                setIsRefreshing(false);
            } else if (message.type === 'stockDataError') {
                // Keep showing the last good quotes if a refresh fails; the
                // "Updated … ago" label already tells the user they're stale.
                if (!hasQuotes.current) {
                    setError(message.error || 'Failed to load market data');
                }
                setLoading(false);
                setIsRefreshing(false);
            }
        };

        window.addEventListener('message', messageHandler);
        fetchStockData();

        const refreshInterval = setInterval(fetchStockData, REFRESH_MS);
        // Update the "updated Ns ago" label periodically (no need for every second).
        const tickInterval = setInterval(() => setTick((prev) => prev + 1), 15000);

        return () => {
            window.removeEventListener('message', messageHandler);
            clearInterval(refreshInterval);
            clearInterval(tickInterval);
        };
    }, []);

    const handleManualRefresh = () => {
        if (!isRefreshing) {
            fetchStockData();
        }
    };

    const getTimeSinceUpdate = () => {
        const seconds = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ago`;
    };

    const equities = quotes.filter((q) => !isCrypto(q.symbol));
    const usMarketClosed = equities.length > 0 && equities.every((q) => !q.marketOpen);

    const renderSparkline = (data: number[], baseline: number) => {
        if (!data || data.length < 2) return null;

        const min = Math.min(...data, baseline);
        const max = Math.max(...data, baseline);
        const range = max - min || 1;
        const width = 64;
        const height = 22;
        const pad = 1.5; // keep the stroke from being clipped at the edges
        const y = (value: number) => pad + (1 - (value - min) / range) * (height - pad * 2);

        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * width;
            return `${x.toFixed(1)},${y(value).toFixed(1)}`;
        }).join(' ');

        return (
            <svg width={width} height={height} className="sparkline">
                <line className="sparkline-baseline" x1={0} x2={width} y1={y(baseline)} y2={y(baseline)} />
                <polyline
                    points={points}
                    fill="none"
                    strokeWidth="1.5"
                />
            </svg>
        );
    };

    return (
        <div className="widget stock-market-widget">
            <div className="stock-header">
                <div className="stock-title-row">
                    <h3 className="stock-title">📈 Markets</h3>
                    <div className="stock-controls">
                        <button
                            className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`}
                            onClick={handleManualRefresh}
                            disabled={isRefreshing}
                            title="Refresh prices"
                        >
                            🔄
                        </button>
                    </div>
                </div>
                {!loading && !error && (
                    <div className="last-update">
                        Updated {getTimeSinceUpdate()}
                        {usMarketClosed && ' · US market closed'}
                    </div>
                )}
            </div>

            <div className="stocks-container">
                {loading && <div className="loading-text">Loading market data...</div>}

                {error && <div className="error-text">{error}</div>}

                {!loading && !error && quotes.map((quote) => {
                    const isPositive = quote.changePercent >= 0;
                    const crypto = isCrypto(quote.symbol);

                    return (
                        <div key={quote.symbol} className="stock-card">
                            <div className="stock-info">
                                <div className="stock-name-row">
                                    <span className="stock-symbol">{quote.symbol.replace(/-USD$/, '')}</span>
                                    <span className="stock-name">{NAME_BY_SYMBOL[quote.symbol] || quote.symbol}</span>
                                </div>
                                <div className="stock-price-row">
                                    <span className="stock-price">
                                        ${quote.price.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </span>
                                    <span
                                        className={`stock-change ${isPositive ? 'positive' : 'negative'}`}
                                        title={crypto ? 'Change over the last 24 hours' : 'Change since previous close'}
                                    >
                                        {isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                            <div className={`stock-chart ${isPositive ? 'positive' : 'negative'}`}>
                                {renderSparkline(quote.sparkline, quote.baseline)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {!loading && !error && (
                <div className="stock-source">Data from Yahoo Finance · may be delayed</div>
            )}
        </div>
    );
};
