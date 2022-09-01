import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormGroup } from "../../components/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import $ from "jquery";

import * as yup from "yup";
import { Divider, MainButton } from "../../globalStyle";
import { FacebookLogo, GoogleLogo } from "../../icon/icon";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries } from "../../features/country/countrySlice";
import FormError from "../../components/register/FormError";
import { Link, useNavigate } from "react-router-dom";
import "../css/register.css";
import { callToast, getImage } from "../../helpers";
import Toast from "../../components/notify/Toast";
import { authState, resetPassword } from "../../features/auth/authSlice";

const resetPasswordSchema = yup
    .object({
        newPassword: yup
            .string()
            .required("Vui lòng nhập mật khẩu mới")
            .min(8, "Mật khẩu mới ít nhất 8 kí tự"),
        confirmNewPassword: yup
            .string()
            .required("Vui lòng nhập lại mật khẩu mới")
            .min(8, "Mật khẩu ít nhất 8 kí tự!"),
    })
    .required();

type HomeProps = {};

const ResetPasswordPage: FC<HomeProps> = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        resetPasswordAction: { successMessage, errorMessage },
    } = useSelector(authState);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(resetPasswordSchema),
    });

    useEffect(() => {
        const bg = getImage("/images/register_background.jpg");

        $("#register").css({
            "background-image": `url(${bg})`,
            "background-repeat": "no-repeat",
            "background-position": "center center",
            "background-size": "cover",
        });
    }, []);

    useEffect(() => {
        if (successMessage) {
            navigate("/auth/login");
        }
    }, [successMessage]);

    useEffect(() => {
        if (errorMessage?.includes("Reset password session is out of time")) {
            navigate("/auth/login");
        }
    }, [errorMessage]);

    const onSubmit = (data: any) => {
        dispatch(
            resetPassword({
                email: localStorage.getItem("email"),
                resetPasswordCode: localStorage.getItem("resetPasswordCode"),
                ...data,
            })
        );
    };

    return (
        <div id='register'>
            <div id='register__container' className='flex-center'>
                <div className='register__content col-flex'>
                    <header className='flex-center'>
                        <div id='register__header--title'>Đổi mật khẩu</div>
                    </header>
                    <Divider />
                    <article id='register__body'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormGroup
                                label='Mật khẩu mới'
                                fieldName='newPassword'
                                type='password'
                                register={register}
                            />
                            {errors?.newPassword && (
                                <FormError message={errors.newPassword.message} />
                            )}
                            <div id='login__password--container'>
                                <FormGroup
                                    label='Nhập lại mật khẩu mới'
                                    fieldName='confirmNewPassword'
                                    type='password'
                                    register={register}
                                />
                                {errors?.confirmNewPassword && (
                                    <FormError message={errors.confirmNewPassword.message} />
                                )}
                            </div>
                            {errorMessage ===
                                "New password does not match confirm new password" && (
                                <FormError message='Mật khẩu không khớp' removeTriangle />
                            )}
                            <MainButton
                                type='submit'
                                className='customBtn'
                                width='100%'
                                height='auto'
                                id='login__main__button'
                            >
                                <span>Đổi mật khẩu</span>
                            </MainButton>
                        </form>

                        <div id='register__login--section'>
                            <div className='normal-flex'>
                                <Divider className='flex-1'></Divider>
                                <span className='register__or--option'>hoặc</span>
                                <Divider className='flex-1'></Divider>
                            </div>
                            <div className='flex-center'>
                                Bạn mới biết đến AirTn?&nbsp;
                                <Link
                                    to={"/auth/register"}
                                    style={{
                                        color: "rgb(93, 93, 207)",
                                        textDecoration: "underline",
                                    }}
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
