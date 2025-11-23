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
    { symbol: 'AAPL', name: 'Apple', basePrice: 178.50 },
    { symbol: 'MSFT', name: 'Microsoft', basePrice: 425.30 },
    { symbol: 'GOOGL', name: 'Google', basePrice: 142.80 },
    { symbol: 'TSLA', name: 'Tesla', basePrice: 248.90 },
    { symbol: 'NVDA', name: 'NVIDIA', basePrice: 875.20 },
    { symbol: 'BTC-USD', name: 'Bitcoin', basePrice: 62500.00 },
    { symbol: 'ETH-USD', name: 'Ethereum', basePrice: 3200.00 },
];

// Generate realistic price movements
const generatePriceData = (basePrice: number, volatility: number = 0.02) => {
    const points = 20;
    const data: number[] = [];
    let currentPrice = basePrice;

    for (let i = 0; i < points; i++) {
        // Random walk with slight upward/downward bias
        const change = (Math.random() - 0.5) * basePrice * volatility;
        currentPrice += change;
        data.push(currentPrice);
    }

    return data;
};

export const StockMarketWidget: React.FC = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [, setTick] = useState(0);
    const [widgetSize, setWidgetSize] = useState<WidgetSize>('normal');

    const fetchStockData = async () => {
        try {
            setIsRefreshing(true);
            const stockData: Stock[] = [];

            for (const stock of POPULAR_STOCKS) {
                // Generate realistic simulated data
                const volatility = stock.symbol.includes('-USD') ? 0.03 : 0.015; // Crypto more volatile
                const sparkline = generatePriceData(stock.basePrice, volatility);
                const currentPrice = sparkline[sparkline.length - 1];
                const previousClose = stock.basePrice;
                const change = currentPrice - previousClose;
                const changePercent = (change / previousClose) * 100;

                stockData.push({
                    symbol: stock.symbol,
                    name: stock.name,
                    price: currentPrice,
                    change: change,
                    changePercent: changePercent,
                    sparkline: sparkline
                });
            }

            setStocks(stockData);
            setError(null);
            setLastUpdate(new Date());
        } catch (err) {
            setError('Failed to generate stock data');
            console.error('Stock data error:', err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStockData();

        // Auto-refresh every 10 seconds for demo (simulates live updates)
        const refreshInterval = setInterval(() => {
            fetchStockData();
        }, 10000);

        // Update timer every second
        const tickInterval = setInterval(() => {
            setTick(prev => prev + 1);
        }, 1000);

        return () => {
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

