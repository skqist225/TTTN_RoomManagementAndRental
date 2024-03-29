import { FC } from "react";
import { getImage } from "../../helpers";
import { FormEdit } from "./FormEdit";
import turnOffEditMode from "./script/turn_off_edit_mode";
import { useDispatch } from "react-redux";
import { clearUSAErrorMessage } from "../../features/user/userSlice";
import $ from "jquery";

interface IUserInfoProps {
    title: string;
    dataEdit: string;
    value: string;
}

export const UserInfo: FC<IUserInfoProps> = ({ title, dataEdit, value }) => {
    const dispatch = useDispatch();

    return (
        <>
            <div className='personal__info_part'>
                <div style={{ width: "100%" }}>
                    <div className='personal__info_title'>
                        <div style={{ width: "100%" }} className='flex-space'>
                            <div>{title}</div>
                            <input type='hidden' value={dataEdit} id='turnOffEditModeArgs1' />
                            <button
                                className='closeBtn'
                                onClick={e => {
                                    dispatch(clearUSAErrorMessage());
                                    turnOffEditMode($(e.currentTarget));
                                }}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className='displayWhenNormalMode'>
                            {dataEdit !== "avatar" && dataEdit !== "address" && (
                                <span>{value}</span>
                            )}
                            {dataEdit === "avatar" && (
                                <img
                                    src={getImage(value)}
                                    alt=''
                                    width='200px'
                                    height='200px'
                                    style={{ objectFit: "cover" }}
                                />
                            )}
                            {dataEdit === "address" && <span>{value}</span>}
                        </div>
                        <FormEdit dataEdit={dataEdit} />
                    </div>
                </div>
                <button className='editBtn' data-edit={dataEdit}>
                    Chỉnh sửa
                </button>
            </div>
        </>
    );
};
