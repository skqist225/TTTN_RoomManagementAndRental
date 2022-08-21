import { FC } from "react";
import { Div } from "../../globalStyle";

interface ICancelPolicyProps {
    date?: number;
    month?: number;
}

const CancelPolicy: FC<ICancelPolicyProps> = ({ date, month }) => {
    return (
        <section className='progress--booking__infoSection'>
            <div className='fs-22 fw-600'>Chính sách hủy</div>

            <Div padding='0 0 24px 0' className='fs-16'>
                <span className='fw-500 '>Miễn phí hủy trong 48 giờ.</span>
                <div className='fw-500 '>
                    Sau 48 giờ, cho đến khi chủ nhà duyệt thì bạn vẫn sẽ được miễn phí hủy. Nếu chủ
                    nhà đã duyệt nhưng chưa đến ngày nhận phòng nếu bạn hủy bạn sẽ mất 29% phí đặt
                    phòng.
                </div>
                {/* Sau đó, hủy trước 13:00 */}
                {/* ngày {date} tháng {month} để được hoàn lại 50%, trừ phí dịch vụ. */}
            </Div>
        </section>
    );
};

export default CancelPolicy;
