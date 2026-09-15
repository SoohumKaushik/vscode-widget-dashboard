import React, { useState, useEffect } from 'react';

interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    sparkline: number[];
}

type WidgetSize = 'compact' | 'normal' | 'expanded';

const POPULAR_STOCKS = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'GOOGL', name: 'Google' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'NVDA', name: 'NVIDIA' },
    { symbol: 'BTC-USD', name: 'Bitcoin' },
    { symbol: 'ETH-USD', name: 'Ethereum' },
];

const NAME_BY_SYMBOL: { [symbol: string]: string } = Object.fromEntries(
    POPULAR_STOCKS.map((s) => [s.symbol, s.name])
);

const REFRESH_MS = 60000; // real quotes — refresh once a minute

export const StockMarketWidget: React.FC = () => {
    // Quotes are fetched by the extension host (no CORS limits) and posted back.
    const vscode = (window as any).vscode;
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [, setTick] = useState(0);
    const [widgetSize, setWidgetSize] = useState<WidgetSize>('normal');

    const fetchStockData = () => {
        setIsRefreshing(true);
        vscode.postMessage({
            type: 'fetchStockData',
            symbols: POPULAR_STOCKS.map((s) => s.symbol),
        });
    };

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            const message = event.data;

            if (message.type === 'stockData') {
                const parsed: Stock[] = (message.data || [])
                    .filter((item: any) => !item.error && item.price != null && item.prevClose != null)
                    .map((item: any) => {
                        const price = item.price;
                        const prevClose = item.prevClose;
                        const change = price - prevClose;
                        const changePercent = prevClose ? (change / prevClose) * 100 : 0;
                        return {
                            symbol: item.symbol,
                            name: NAME_BY_SYMBOL[item.symbol] || item.symbol,
                            price,
                            change,
                            changePercent,
                            sparkline: item.sparkline || [],
                        };
                    });

                setStocks(parsed);
                setError(parsed.length === 0 ? 'No market data available' : null);
                setLastUpdate(new Date());
                setLoading(false);
                setIsRefreshing(false);
            } else if (message.type === 'stockDataError') {
                setError(message.error || 'Failed to load market data');
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

    const cycleSizeMode = () => {
        if (widgetSize === 'compact') setWidgetSize('normal');
        else if (widgetSize === 'normal') setWidgetSize('expanded');
        else setWidgetSize('compact');
    };

    const renderSparkline = (data: number[]) => {
        if (!data || data.length < 2) return null;

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const width = 60;
        const height = 20;

        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * height;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg width={width} height={height} className="sparkline">
                <polyline
                    points={points}
                    fill="none"
                    strokeWidth="1.5"
                />
            </svg>
        );
    };

    return (
        <div className={`stock-market-widget size-${widgetSize}`}>
            <div className="stock-header">
                <div className="stock-title-row">
                    <h3 className="stock-title">📈 Markets</h3>
                    <div className="stock-controls">
                        <button
                            className="size-toggle-btn"
                            onClick={cycleSizeMode}
                            title={`Size: ${widgetSize}`}
                        >
                            {widgetSize === 'compact' && '⊟'}
                            {widgetSize === 'normal' && '⊡'}
                            {widgetSize === 'expanded' && '⊞'}
                        </button>
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
                    <div className="last-update">Updated {getTimeSinceUpdate()}</div>
                )}
            </div>

            <div className="stocks-container">
                {loading && <div className="loading-text">Loading market data...</div>}

                {error && <div className="error-text">{error}</div>}

                {!loading && !error && stocks.map((stock) => {
                    const isPositive = stock.change >= 0;
                    const isCrypto = stock.symbol.includes('-USD');

                    return (
                        <div key={stock.symbol} className="stock-card">
                            <div className="stock-info">
                                <div className="stock-name-row">
                                    <span className="stock-symbol">{isCrypto ? '₿' : ''}{stock.symbol.replace('-USD', '')}</span>
                                    <span className="stock-name">{stock.name}</span>
                                </div>
                                <div className="stock-price-row">
                                    <span className="stock-price">
                                        ${stock.price.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </span>
                                    <span className={`stock-change ${isPositive ? 'positive' : 'negative'}`}>
                                        {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                            <div className={`stock-chart ${isPositive ? 'positive' : 'negative'}`}>
                                {renderSparkline(stock.sparkline)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
