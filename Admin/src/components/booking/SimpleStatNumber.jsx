import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LineChart from "../../charts/LineChart01";
import Icon from "../../images/icon-01.svg";

// Import utilities
import { tailwindConfig, hexToRGB } from "../../utils/Utils";
import { bookingState } from "../../features/booking/bookingSlice";
import { useSelector } from "react-redux";

function SimpleStatNumber({ label, type, number, backgroundColor }) {
    // const [number, setNumber] = useState(0);
    // let backgroundColor = "";

    // useEffect(() => {
    //     switch (type) {
    //         case "All": {
    //             setNumber(totalElements);
    //             break;
    //         }
    //         case "Approved": {
    //             setNumber(numberOfApproved);
    //             break;
    //         }
    //         case "Pending": {
    //             setNumber(numberOfPending);
    //             backgroundColor = "bg-stone-300";
    //             break;
    //         }
    //         case "Cancelled": {
    //             setNumber(numberOfCancelled);
    //             break;
    //         }
    //     }
    // }, []);

    const chartData = {
        labels: [
            "12-01-2020",
            "01-01-2021",
            "02-01-2021",
            "03-01-2021",
            "04-01-2021",
            "05-01-2021",
            "06-01-2021",
            "07-01-2021",
            "08-01-2021",
            "09-01-2021",
            "10-01-2021",
            "11-01-2021",
            "12-01-2021",
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
            "01-01-2023",
        ],
        datasets: [
            // Indigo line
            {
                data: [
                    732, 610, 610, 504, 504, 504, 349, 349, 504, 342, 504, 610, 391, 192, 154, 273,
                    191, 191, 126, 263, 349, 252, 423, 622, 470, 532,
                ],
                fill: true,
                backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.blue[500])}, 0.08)`,
                borderColor: tailwindConfig().theme.colors.indigo[500],
                borderWidth: 2,
                tension: 0,
                pointRadius: 0,
                pointHoverRadius: 3,
                pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
                clip: 20,
            },
            // Gray line
            {
                data: [
                    532, 532, 532, 404, 404, 314, 314, 314, 314, 314, 234, 314, 234, 234, 314, 314,
                    314, 388, 314, 202, 202, 202, 202, 314, 720, 642,
                ],
                borderColor: tailwindConfig().theme.colors.slate[300],
                borderWidth: 2,
                tension: 0,
                pointRadius: 0,
                pointHoverRadius: 3,
                pointBackgroundColor: tailwindConfig().theme.colors.slate[300],
                clip: 20,
            },
        ],
    };

    return (
        <div
            className={`flex flex-col col-span-full sm:col-span-6 xl:col-span-4 ${backgroundColor} shadow-lg rounded-sm border border-slate-200`}
            style={{
                width: "300px",
                height: "150px",
                borderRadius: "8px",
            }}
        >
            <div className='px-5 pt-5'>
                {/* <header className='flex justify-between items-start mb-2'>
                    <img src={Icon} width='32' height='32' alt='Icon 01' />
                </header> */}
                <h2 className='text-lg font-semibold text-gray-200 mb-2'>{label}</h2>
                <div className='flex items-start'>
                    <div className={`text-3xl font-bold text-gray-200 mr-2`}>{number}</div>
                    {/* <div className='text-sm font-semibold text-white px-1.5 bg-green-500 rounded-full'>
                        +49%
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default SimpleStatNumber;
