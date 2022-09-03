import NumberFormat from "react-number-format";

export interface IMoneyForMat {
    price: number;
    priceFontSize?: string;
    priceFontWeight?: string;
    color?: string;
}

const MyNumberForMat = ({ price, priceFontSize, priceFontWeight, color }: IMoneyForMat) => {
    return (
        <>
            <NumberFormat
                value={Math.floor(price)}
                suffix={"₫"}
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
        </>
    );
};

export default MyNumberForMat;
