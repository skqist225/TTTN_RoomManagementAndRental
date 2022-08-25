import React from "react";
import SimpleLineChart from "../../charts/SimpleLineChart";

// Import utilities
import { tailwindConfig } from "../../utils/Utils";

function LineChart({ data }) {
    const [lcdataSet1, lcdataSet2] = data;

    const chartData = {
        labels: [
            "01-01-2022",
            "02-01-2022",
            "03-01-2022",
            "04-01-2022",
            "05-01-2022",
            "06-01-2022",
            "07-01-2022",
            "08-01-2022",
            "09-01-2022",
            "10-01-2022",
            "11-01-2022",
            "12-01-2022",
        ],
        datasets: [
            {
                label: "Refund",
                data: lcdataSet1,
                borderColor: tailwindConfig().theme.colors.rose[400],
                fill: false,
                borderWidth: 2,
                tension: 0,
                pointRadius: 0,
                pointHoverRadius: 3,
                pointBackgroundColor: tailwindConfig().theme.colors.rose[400],
            },
            {
                label: "Total",
                data: lcdataSet2,
                borderColor: tailwindConfig().theme.colors.green[500],
                fill: false,
                borderWidth: 2,
                tension: 0,
                pointRadius: 0,
                pointHoverRadius: 3,
                pointBackgroundColor: tailwindConfig().theme.colors.green[500],
            },
        ],
    };

    return (
        <div className='flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200'>
            <header className='px-5 py-4 border-b border-slate-100 flex items-center'>
                <h2 className='font-semibold text-slate-800'>Sales Over Time (all bookings)</h2>
            </header>
            {/* Chart built with Chart.js 3 */}
            {/* Change the height attribute to adjust the chart height */}
            <SimpleLineChart data={chartData} width={595} height={248} />
        </div>
    );
}

export default LineChart;
