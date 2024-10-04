import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import MainBox from "./components/MainBox";
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import CurrencyFormat from "react-currency-format";
import Skeleton from "../../Skeleton";

const Dashboard = () => {
  const [isLoading, setLoading] = useState();
  const [count, setCount] = useState({});
  const [chartTrans, setChartTrans] = useState({});
  const [chartViewers, setChartViewers] = useState({});
  useEffect(() => {
    const fetchCountData = async () => {
      await apiClient
        .get("/api/v1/organization/count/event")
        .then((response) => {
          setCount(response.data.data);
          setChartTrans(response.data.data.chartTransaction);
          setChartViewers(response.data.data.chartViewers);
          setLoading(false);
        })
        .catch((error) => {
          //
        });
    };
    setLoading(true);
    fetchCountData();
  }, []);

  Chart.register(...registerables);

  const datas = {
    labels: Object.keys(chartTrans).map((item) => item),
    datasets: [
      {
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(25, 20, 106)",
          "rgb(55, 25, 186)",
        ],
        data: Object.values(chartTrans).map((item) => item),
      },
    ],
  };

  const datasetViewers = {
    labels: Object.keys(chartViewers).map((item) => item),
    datasets: [
      {
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(25, 20, 106)",
          "rgb(55, 25, 186)",
        ],
        data: Object.values(chartViewers).map((item) => item),
      },
    ],
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <MainBox className="bg-yellow-400 hover:bg-yellow-300">
          <div className="font-semibold text-3xl pb-2">{count.events ?? 0}</div>
          <div className="font-light text-lg text-right pt-2">Events</div>
        </MainBox>
        {/*<MainBox className="bg-yellow-400 hover:bg-yellow-300">
          <div className="font-semibold text-3xl pb-2">
            {" "}
            {
              <CurrencyFormat
                value={count.revenue ?? 0}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp"}
              />
            }
          </div>
          <div className="font-light text-lg text-right pt-2">Pemasukan</div>
        </MainBox>*/}
        {/*<MainBox className="bg-yellow-400 hover:bg-yellow-300">
          <div className="font-semibold text-3xl pb-2">{count.sells ?? 0}</div>
          <div className="font-light text-lg text-right pt-2">Transaksi</div>
        </MainBox>*/}
        <MainBox className="bg-yellow-400 hover:bg-yellow-300">
          <div className="font-semibold text-3xl pb-2">
            {count.viewers ?? 0}
          </div>
          <div className="font-light text-lg text-right pt-2">Pengunjung</div>
        </MainBox>
      </div>
      <div className="mt-20">
        <h2 className="text-center font-semibold text-2xl">Statistik</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-4">
        {isLoading ? (
          <div>
            <Skeleton className="h-64 w-full rounded" count="1" />
          </div>
        ) : (
          <div className="pemasukan">
            <Bar
              data={datas}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: "Data Transaksi Harian",
                  },
                  legend: {
                    display: false,
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        )}
        {isLoading ? (
          <div>
            <Skeleton className="h-64 w-full rounded" count="1" />
          </div>
        ) : (
          <div className="pengunjung">
            <Line
              data={datasetViewers}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: "Data Pengunjung Harian",
                  },
                  legend: {
                    display: false,
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};
export default Dashboard;
