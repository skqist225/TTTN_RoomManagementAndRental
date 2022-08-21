import NumberFormat from "react-number-format";

export interface IMoneyForMat {
    price: number;
    currency: string;
    stayTypeFontSize?: string;
    priceFontSize?: string;
    priceFontWeight?: string;
    isPrefix?: boolean;
    isSuffix?: boolean;
    color?: string;
    removeStayType?: boolean;
    removeSplash?: boolean;
}

export default function MyNumberForMat({
                                           price,
                                           currency,
                                           priceFontSize,
                                           priceFontWeight,
                                           isPrefix,
                                           isSuffix = false,
                                           color,
                                       }: IMoneyForMat) {
    return (
        <>
            {" "}
            {isPrefix ? (
                <NumberFormat
                    value={Math.floor(price)}
                    prefix={currency}
                    thousandSeparator={true}
                    displayType={"text"}
                    renderText={(formattedValue: any) => (
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

                                </>
                            ) : (
                                <>
                                    <span className='rdt__price'>{formattedValue}</span>
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
                    renderText={formattedValue => (
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

                                </>
                            ) : (
                                <>
                                    <span className='rdt__price'>{formattedValue} </span>
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
                    renderText={formattedValue => (
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

                                </>
                            ) : (
                                <>
                                    <span className='rdt__price'>{formattedValue} </span>
                                </>
                            )}
                        </div>
                    )}
                />
            )}
        </>
    );
}
