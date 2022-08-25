import React from "react";
import Info from "../../utils/Info";
import BarChart from "../../charts/BarChart02";

// Import utilities
import { tailwindConfig } from "../../utils/Utils";
import SimpleStackedBarChart from "../../charts/SimpleStackedBarChart";

function StackedBarChart({ data }) {
    const [dataSet1, dataSet2, dataSet3] = data;

    console.log([dataSet1, dataSet2, dataSet3]);

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
                label: "APPPROVED",
                data: dataSet1,
                backgroundColor: tailwindConfig().theme.colors.green[500],
                hoverBackgroundColor: tailwindConfig().theme.colors.green[600],
                barPercentage: 0.66,
                categoryPercentage: 0.66,
            },
            {
                label: "PENDING",
                data: dataSet2,
                backgroundColor: tailwindConfig().theme.colors.blue[500],
                hoverBackgroundColor: tailwindConfig().theme.colors.blue[600],
                barPercentage: 0.66,
                categoryPercentage: 0.66,
            },
            {
                label: "CANCELLED",
                data: dataSet3,
                backgroundColor: tailwindConfig().theme.colors.rose[500],
                hoverBackgroundColor: tailwindConfig().theme.colors.rose[600],
                barPercentage: 0.66,
                categoryPercentage: 0.66,
            },
        ],
    };

    return (
        <div className='flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200'>
            <header className='px-5 py-4 border-b border-slate-100 flex items-center'>
                <h2 className='font-semibold text-slate-800'>Bookings Order Status By Month</h2>
                <Info className='ml-2' containerClassName='min-w-80'>
                    <div className='text-sm'>
                        Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                        mollit anim.
                    </div>
                </Info>
            </header>
            {/* <div className='px-5 py-3'>
                <div className='flex items-start'>
                    <div className='text-3xl font-bold text-slate-800 mr-2'>+$6,796</div>
                    <div className='text-sm font-semibold text-white px-1.5 bg-yellow-500 rounded-full'>
                        -34%
                    </div>
                </div>
            </div> */}
            {/* Chart built with Chart.js 3 */}
            <div className='grow'>
                {/* Change the height attribute to adjust the chart height */}
                <SimpleStackedBarChart data={chartData} width={595} height={248} />
            </div>
        </div>
    );
}

export default StackedBarChart;
