import NumberFormat from "react-number-format";

const MyNumberForMat = ({ price, priceFontSize, priceFontWeight, color }) => {
    return (
        <>
            <NumberFormat
                value={Math.floor(price)}
                suffix={"₫"}
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
                                <span className='rdt__price'>{formattedValue}</span>
                            </>
                        )}
                    </div>
                )}
            />
        </>
    );
};

export default MyNumberForMat;
