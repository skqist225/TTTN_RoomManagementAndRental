import NumberFormat from "react-number-format";

export default function MyNumberForMat({
    price,
    currency,
    stayTypeFontSize,
    priceFontSize,
    priceFontWeight,
    isPrefix = true,
    isSuffix = false,
    color,
    removeStayType = false,
}) {
    return (
        <>
            {" "}
            {isPrefix ? (
                <NumberFormat
                    value={Math.floor(price)}
                    prefix={currency}
                    thousandSeparator={true}
                    displayType={"text"}
                    renderText={(formattedValue) => (
                        <div>
                            {priceFontSize !== null ? (
                                <>
                                    <span
                                        style={{
                                            fontSize: priceFontSize,
                                            color,
                                            fontWeight: priceFontWeight,
                                        }}
                                    >
                                        {formattedValue}{" "}
                                    </span>
                                    {!removeStayType && (
                                        <span style={{ fontSize: stayTypeFontSize, color }}>
                                            / đêm
                                        </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    <span className='rdt__price'>{formattedValue}</span>
                                    {!removeStayType && <span className='fs-16'>đêm</span>}
                                </>
                            )}
                        </div>
                    )}
                />
            ) : isSuffix ? (
                <NumberFormat
                    value={price}
                    suffix={currency}
                    thousandSeparator={true}
                    displayType={"text"}
                    renderText={(formattedValue) => (
                        <div>
                            {priceFontSize !== null ? (
                                <>
                                    <span
                                        style={{
                                            fontSize: priceFontSize,
                                            color,
                                            fontWeight: priceFontWeight,
                                        }}
                                    >
                                        {formattedValue}{" "}
                                    </span>
                                    {!removeStayType && (
                                        <span style={{ fontSize: stayTypeFontSize, color }}>
                                            / đêm
                                        </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    <span className='rdt__price'>{formattedValue} </span>
                                    {!removeStayType && <span className='fs-16'>đêm</span>}
                                </>
                            )}
                        </div>
                    )}
                />
            ) : (
                <NumberFormat
                    value={price}
                    thousandSeparator={true}
                    displayType={"text"}
                    renderText={(formattedValue) => (
                        <div>
                            {priceFontSize !== null ? (
                                <>
                                    <span
                                        style={{
                                            fontSize: priceFontSize,
                                            color,
                                            fontWeight: priceFontWeight,
                                        }}
                                    >
                                        {formattedValue}{" "}
                                    </span>
                                    {!removeStayType && (
                                        <span style={{ fontSize: stayTypeFontSize, color }}>
                                            / đêm
                                        </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    <span className='rdt__price'>{formattedValue} </span>
                                    {!removeStayType && <span className='fs-16'>đêm</span>}
                                </>
                            )}
                        </div>
                    )}
                />
            )}
        </>
    );
}
