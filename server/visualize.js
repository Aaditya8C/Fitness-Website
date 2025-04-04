import fs from "fs";
import csv from "csv-parser";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";

const width = 1200; // px
const height = 600;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

const parseJTL = async (filePath) => {
  const timestamps = [];
  const responseTimes = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // Assuming 'timeStamp' and 'elapsed' are the columns
        timestamps.push(new Date(Number(row.timeStamp)).toLocaleTimeString());
        responseTimes.push(Number(row.elapsed));
      })
      .on("end", () => {
        resolve({ timestamps, responseTimes });
      });
  });
};

const generateChart = async (data1, data2) => {
  const config = {
    type: "line",
    data: {
      labels: data1.timestamps, // assume same length
      datasets: [
        {
          label: "1 Server",
          data: data1.responseTimes,
          borderColor: "rgba(255, 99, 132, 1)",
          fill: false,
        },
        {
          label: "Multiple Servers",
          data: data2.responseTimes,
          borderColor: "rgba(54, 162, 235, 1)",
          fill: false,
        },
      ],
    },
    options: {
      responsive: false,
      scales: {
        x: { title: { display: true, text: "Time" } },
        y: { title: { display: true, text: "Response Time (ms)" } },
      },
    },
  };

  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(config);
  fs.writeFileSync("comparison_chart.png", imageBuffer);
  console.log("✅ Chart saved as comparison_chart.png");
};

const run = async () => {
  const single = await parseJTL("single_results.jtl");
  const multi = await parseJTL("proxy_results.jtl");

  await generateChart(single, multi);
};

run();
