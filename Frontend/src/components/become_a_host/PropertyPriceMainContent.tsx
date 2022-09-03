import { FC, useEffect } from "react";
import $ from "jquery";
import "./css/price_main_content.css";

interface IPropertyPriceMainContentProps {}

const PropertyPriceMainContent: FC<IPropertyPriceMainContentProps> = () => {
    useEffect(() => {
        const lsRoom = localStorage.getItem("room");
        if (lsRoom) {
            const { price } = JSON.parse(lsRoom);
            if (price) {
                $("#room-price").val(price);
            }
        }
    }, []);

    return (
        <div className='col-flex'>
            <div style={{ width: "100%" }}>
                <div id='priceInputContainer' style={{ width: "100%" }}>
                    <input
                        type='number'
                        id='room-price'
                        pattern='[0-9]*'
                        placeholder='00'
                        maxLength={11}
                        minLength={7}
                    />
                </div>
                <div style={{ textAlign: "center" }} className='per-night'>
                    mỗi đêm
                </div>
            </div>
        </div>
    );
};

export default PropertyPriceMainContent;
