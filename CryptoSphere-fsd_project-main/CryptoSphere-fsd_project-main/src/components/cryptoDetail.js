import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
} from "chart.js";
import "../components/cryptoDetail";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
);

const CryptoDetail = () => {
  const { id } = useParams();
  const [cryptoData, setCryptoData] = useState([]);
  const [cryptoInfo, setCryptoInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const [marketChartResponse, coinInfoResponse] = await Promise.all([
          axios.get(`/api/coins/${id}/market_chart`, {
            params: {
              vs_currency: "usd",
              days: "7",
            },
          }),
          axios.get(`/api/coins/${id}`),
        ]);

        setCryptoData(marketChartResponse.data.prices);
        setCryptoInfo(coinInfoResponse.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching crypto data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, [id]);

  useEffect(() => {
    if (cryptoData.length && cryptoInfo) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = document.getElementById("cryptoChart").getContext("2d");
      chartRef.current = new ChartJS(ctx, {
        type: "line",
        data: {
          labels: cryptoData.map((data) => new Date(data[0]).toLocaleDateString()),
          datasets: [
            {
              label: `${cryptoInfo.name} Price (USD)`,
              data: cryptoData.map((data) => data[1]),
              fill: false,
              backgroundColor: "rgba(75,192,192,0.6)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 2,
              pointRadius: 3,
              tension: 0.2, // Smooth line
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: `${cryptoInfo.name} Price Chart`,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Date",
              },
            },
            y: {
              title: {
                display: true,
                text: "Price (USD)",
              },
              beginAtZero: false,
            },
          },
        },
      });

      return () => {
        if (chartRef.current) {
          chartRef.current.destroy();
        }
      };
    }
  }, [cryptoData, cryptoInfo]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="crypto-detail">
      <h1>{cryptoInfo.name}</h1>
      <p>Symbol: {cryptoInfo.symbol.toUpperCase()}</p>
      <p>Current Price: ${cryptoInfo.market_data.current_price.usd}</p>
      <p>Market Cap: ${cryptoInfo.market_data.market_cap.usd.toLocaleString()}</p>
      <canvas id="cryptoChart" style={{ maxHeight: "500px", width: "100%" }}></canvas>
    </div>
  );
};

export default CryptoDetail;
