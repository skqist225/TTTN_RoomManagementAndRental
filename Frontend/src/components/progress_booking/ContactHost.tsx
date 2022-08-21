import TextArea from "antd/lib/input/TextArea";
import { FC } from "react";
import { Div } from "../../globalStyle";

interface IContactHostProps {
    id: number;
}

const ContactHost: FC<IContactHostProps> = ({ id }) => {
    return (
        <section style={{ marginBottom: "12px" }}>
            <div>
                <div>
                    <div className='fs-16 fw-600'>Nhắn tin cho chủ nhà</div>
                    <div className='fs-14'>
                        Cho chủ nhà biết lý do bạn đi du lịch và thời điểm nhận phòng.
                    </div>
                </div>

                <Div>
                    <TextArea
                        rows={2}
                        style={{ borderRadius: "16px !important" }}
                        id={`clientMessage${id}`}
                    />
                </Div>
            </div>
        </section>
    );
};

export default ContactHost;
