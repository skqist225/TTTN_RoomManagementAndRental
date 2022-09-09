import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import { UserInfo } from "../components/personal_info/UserInfo";
import { getImage, formatDate, getUserSex, callToast } from "../helpers";

import { jqueryCode } from "../components/personal_info/script/personal_info";
import Toast from "../components/notify/Toast";

import "./css/personal_info.css";
import { Image } from "../globalStyle";
import { clearUpdateState, refreshUserData, userState } from "../features/user/userSlice";

type IPersonalInfoPageProps = {};

const PersonalInfoPage: FC<IPersonalInfoPageProps> = () => {
    const dispatch = useDispatch();
    const {
        user,
        update: { loading, successMessage, errorMessage },
    } = useSelector(userState);

    useEffect(() => {
        jqueryCode();
        if (user?.id) {
            dispatch(refreshUserData(user.id));
        }
    }, []);

    useEffect(() => {
        if (successMessage) {
            callToast("success", "Cập nhật thành công");
        }
    }, [successMessage]);

    useEffect(() => {
        return () => {
            dispatch(clearUpdateState());
        };
    }, []);

    return (
        <>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={false} />

            {user !== null && (
                <div id='personal-info__page'>
                    <div id='personal-info__container'>
                        <div className='normal-flex'>
                            <span className='personal__info--title'>Tài khoản</span>
                            <div className='personal__info__next-icon'>
                                <Image src={getImage("/svg/next.svg")} size={"10px"} />
                            </div>{" "}
                            <span className='personal__info--title'>Thông tin cá nhân</span>
                        </div>
                        <h2>Thông tin cá nhân</h2>
                        <div id='personal__content-wrapper'>
                            <div className='personal-info__left'>
                                <UserInfo
                                    title='Họ và tên'
                                    dataEdit='firstNameAndLastName'
                                    value={user.firstName + " " + user.lastName}
                                />
                                <UserInfo
                                    title='Giới tính'
                                    dataEdit='sex'
                                    value={getUserSex(user.sex)}
                                />
                                <UserInfo
                                    title='Ngày sinh'
                                    dataEdit='birthdayWeb'
                                    value={formatDate(user.birthday)}
                                />
                                <UserInfo
                                    title='Mật khẩu'
                                    dataEdit='password'
                                    value={"**********"}
                                />
                                <UserInfo
                                    title='Số điện thoại'
                                    dataEdit='phoneNumber'
                                    value={user.phoneNumber}
                                />
                                <UserInfo
                                    title='Địa chỉ'
                                    dataEdit='address'
                                    value={user.fullPathAddress}
                                />
                                <UserInfo
                                    title='Ảnh đại diện'
                                    dataEdit='avatar'
                                    value={user.avatarPath}
                                />
                            </div>
                            <div id='personal-info__middle--divider'></div>
                            <div id='personal-info__right'>
                                <div>
                                    <div>
                                        <Image src={getImage("/svg/block.svg")} size='40px' />
                                    </div>
                                    <h4>Bạn có thể chỉnh sửa những thông tin nào?</h4>
                                    <p>
                                        Không thể thay đổi thông tin mà Airtn sử dụng để xác minh
                                        danh tính của bạn như địa chỉ <b>email</b>. Bạn có thể chỉnh
                                        sửa thông tin liên hệ và một số thông tin cá nhân, nhưng
                                        chúng tôi có thể yêu cầu bạn xác minh danh tính vào lần tới
                                        khi bạn đặt phòng hoặc tạo mục cho thuê.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Toast />
        </>
    );
};

export default PersonalInfoPage;
