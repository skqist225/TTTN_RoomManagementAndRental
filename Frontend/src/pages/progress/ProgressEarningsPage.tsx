import { FC, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
    countApprovedBookingsInMonth,
    earningState,
    fetchEarnings,
} from "../../features/progress/earningSlice";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import { Div } from "../../globalStyle";
import { MyNumberForMat } from "../../components/utils";
import Header from "../../components/Header";
import $ from "jquery";
import "../css/progress_earnings_page.css";

interface IProgressEarningsPageProps {}

const CustomTooltip = ({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: any;
    label?: string;
}) => {
    if (active && payload && payload.length) {
        return (
            <div className='custom-tooltip'>
                <div className='label normal-flex'>
                    {`${label} : `}
                    <MyNumberForMat price={payload[0].value} />
                </div>
            </div>
        );
    }

    return null;
};

const ProgressEarningsPage: FC<IProgressEarningsPageProps> = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const dispatch = useDispatch();

    let dataSetTotalEarningsInMonth: number[] = [];
    let dataSetAvgEarningsInMonth: number[] = [];

    const { totalFee, feesInMonth, numberOfBookingsInMonth, loading, numberOfBookingsInMonth2 } =
        useSelector(earningState);

    useEffect(() => {
        dispatch(fetchEarnings({ year }));
    }, [year]);

    useEffect(() => {
        dispatch(countApprovedBookingsInMonth({ year, month }));
    }, [year, month]);

    for (let i = 0; i <= 12; i++) {
        dataSetTotalEarningsInMonth.push(feesInMonth[i] ? feesInMonth[i] : 0);
        dataSetAvgEarningsInMonth.push(
            numberOfBookingsInMonth[i] ? feesInMonth[i] / numberOfBookingsInMonth[i] : 0
        );
    }

    const data = [];
    for (let i = 1; i <= 12; i++) {
        data.push({
            label: `Tháng ${i}`,
            "Tổng thu nhập": dataSetTotalEarningsInMonth[i],
        });
    }

    const handleXAxisClicked = (event: any) => {
        setMonth(parseInt(event.value.split(" ").pop()));
    };

    return (
        <>
            <Header includeMiddle={true} excludeBecomeHostAndNavigationHeader={true} />

            {!loading && (
                <div id='main' style={{ top: "50px !important" }}>
                    <div id='earnings__header' className='normal-flex jc-center'>
                        <div className='mr-10'>
                            <div
                                className='card text-white mb-3 bg-danger'
                                style={{ minWidth: "20rem" }}
                            >
                                <div
                                    className='card-header text-center'
                                    style={{ fontWeight: "bold", fontSize: "16px" }}
                                >
                                    Tổng thu nhập trong năm <span id='yearHeaderTitle'>{year}</span>
                                </div>
                                <div className='card-body'>
                                    <h5
                                        className='card-title text-center'
                                        style={{ color: "white" }}
                                    >
                                        {feesInMonth && <MyNumberForMat price={totalFee || 0} />}
                                    </h5>
                                </div>
                            </div>
                        </div>
                        <div className='mr-10'>
                            <div
                                className='card text-white mb-3 bg-primary'
                                style={{ minWidth: "20rem" }}
                            >
                                <div
                                    className='card-header text-center'
                                    style={{ fontWeight: "bold", fontSize: "16px" }}
                                >
                                    Doanh thu tháng {month}
                                </div>
                                <div className='card-body'>
                                    <h5
                                        className='card-title text-center'
                                        id='earningsInCurrentMonth'
                                        style={{ color: "white" }}
                                    >
                                        {feesInMonth && (
                                            <MyNumberForMat price={feesInMonth[month] || 0} />
                                        )}
                                    </h5>
                                </div>
                            </div>
                        </div>
                        <div className='mr-5'>
                            <div
                                className='card text-white bg-success mb-3'
                                style={{ minWidth: "20rem" }}
                            >
                                <div
                                    className='card-header text-center'
                                    style={{ fontWeight: "bold", fontSize: "16px" }}
                                >
                                    Tổng đơn đặt phòng thành công tháng {month}
                                </div>
                                <div className='card-body'>
                                    <h5
                                        className='card-title text-center'
                                        id='numberOfBookingsInCurrentMonth'
                                        style={{ color: "white" }}
                                    >
                                        {numberOfBookingsInMonth2}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='normal-flex' style={{ maxWidth: "40%" }}>
                        <div className='f1' style={{ maxWidth: "25%", marginRight: "10px" }}>
                            <select
                                id='manage-ys__type-input'
                                className='manage-ys__input'
                                style={{ height: "48px !important", width: "100px !imporant" }}
                                value={year}
                                onChange={(event: any) => {
                                    setYear(event.target.value);
                                }}
                            >
                                {Array.from({ length: 26 }, (_, i) => i + 2000)
                                    .reverse()
                                    .map(year => (
                                        <option value={year} key={year}>
                                            {year}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <Div id='earnings__body' height='500px'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <LineChart
                                width={500}
                                height={300}
                                data={data}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='label' onClick={handleXAxisClicked} />
                                <YAxis type='number' />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type='monotone' dataKey='Tổng thu nhập' stroke='#82ca9d' />
                            </LineChart>
                        </ResponsiveContainer>
                    </Div>
                </div>
            )}
        </>
    );
};

export default ProgressEarningsPage;
