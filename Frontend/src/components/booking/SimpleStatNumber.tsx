import React from "react";
import { MyNumberForMat } from "../utils";

function SimpleStatNumber({
    label,
    number,
    backgroundColor,
}: {
    label: string;
    number: number;
    backgroundColor: String;
}) {
    return (
        <div
            className={`flex flex-col col-span-full sm:col-span-6 xl:col-span-4 shadow-lg rounded-sm border border-slate-200`}
            style={{
                width: "300px",
                height: "150px",
                borderRadius: "8px",
                backgroundColor: `${backgroundColor}`,
            }}
        >
            <div className='px-5'>
                <h4 className='text-sm font-semibold mb-2' style={{ color: "#fff" }}>
                    {label}
                </h4>
                <div className='flex items-start'>
                    <div
                        className={`text-3xl font-bold text-gray-200 mr-2`}
                        style={{ color: "#fff", fontSize: "20px" }}
                    >
                        {label === "Total Sales In Month" ? (
                            <MyNumberForMat price={number} />
                        ) : (
                            number
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SimpleStatNumber;
