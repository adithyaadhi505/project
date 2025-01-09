import React, { useEffect, useRef } from "react";

const TradingViewWidget = ({ symbol }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const scriptId = "tradingview-widget-script";

    // Check if the TradingView script is already loaded
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;

      script.onload = () => {
        if (containerRef.current && window.TradingView) {
          new window.TradingView.widget({
            symbol: symbol || "NASDAQ:AAPL", // Default symbol if none is provided
            interval: "1",
            container_id: containerRef.current.id,
            timezone: "Etc/UTC",
            theme: "light",
            style: "1",
            locale: "en",
            range: "2H",
            hide_side_toolbar: false,
            allow_symbol_change: true,
            details: true,
            hotlist: true,
            calendar: true,
            autosize: true,
          });
        }
      };

      document.body.appendChild(script);
    } else if (containerRef.current && window.TradingView) {
      // Script already loaded
      new window.TradingView.widget({
        symbol: symbol || "NASDAQ:AAPL",
        interval: "1",
        container_id: containerRef.current.id,
        timezone: "Etc/UTC",
        theme: "light",
        style: "1",
        locale: "en",
        range: "2H",
        hide_side_toolbar: false,
        allow_symbol_change: true,
        details: true,
        hotlist: true,
        calendar: true,
        autosize: true,
      });
    }
  }, [symbol]);

  return <div id={`tradingview_${symbol}`} ref={containerRef} style={{ height: "500px", width: "100%" }} />;
};

export default TradingViewWidget;
