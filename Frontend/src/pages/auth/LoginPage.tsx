import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormGroup } from "../../components/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import $ from "jquery";

import * as yup from "yup";
import { Divider, MainButton } from "../../globalStyle";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries } from "../../features/country/countrySlice";
import FormError from "../../components/register/FormError";
import { Link, useNavigate } from "react-router-dom";
import { callToast, getImage } from "../../helpers";
import Toast from "../../components/notify/Toast";
import {
    authState,
    clearRASuccessMessage,
    forgotPassword,
    login,
} from "../../features/auth/authSlice";
import { userState } from "../../features/user/userSlice";

import "../css/register.css";

const loginSchema = yup
    .object({
        email: yup
            .string()
            .email("Địa chỉ email không hợp lệ.")
            .required("Vui lòng nhập địa chỉ email."),
        password: yup.string().min(8, "Mật khẩu ít nhất 8 kí tự!"),
    })
    .required();

const forgotPasswordSchema = yup
    .object({
        email: yup.string().email().required("Địa chỉ email không hợp lệ."),
    })
    .required();

type HomeProps = {};

const LoginPage: FC<HomeProps> = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [state, setState] = useState("login");
    const { errorMessage } = useSelector(userState);
    const {
        successMessage: forgotPasswordSuccessMessage,
        errorMessage: eMessage,
        loginAction: { successMessage: laSuccessMessage, errorMessage: laErrorMessage },
    } = useSelector(authState);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(state === "login" ? loginSchema : forgotPasswordSchema),
    });

    useEffect(() => {
        dispatch(clearRASuccessMessage());
    }, []);

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
        if (forgotPasswordSuccessMessage) {
            callToast("success", forgotPasswordSuccessMessage);
        }
    }, [forgotPasswordSuccessMessage]);

    useEffect(() => {
        if (eMessage === "User does not exist.") {
            callToast("error", "Người dùng không tồn tại");
        }
        if (eMessage === "Incorrect password") {
            callToast("error", "Người dùng hoặc mật khẩu không đúng");
        }
    }, [eMessage]);

    const onSubmit = (data: any) => {
        if (state === "login") {
            dispatch(login({ ...data }));
        } else {
            dispatch(forgotPassword({ ...data }));
        }
    };

    useEffect(() => {
        if (laSuccessMessage) {
            navigate("/");
        }
    }, [laSuccessMessage]);

    function handleForgotPassword() {
        $("#register__header--title").text("Quên mật khẩu");
        $("#register__back--button").css("display", "block");
        $("#login__main__button").text("Gửi email");
        $("#login__password--container").css("display", "none");
        setState("forgot-password");
    }

    function resetState() {
        $("#register__header--title").text("Đăng nhập");
        $("#register__back--button").css("display", "none");
        $("#login__main__button").text("Đăng nhập");
        $("#login__password--container").css("display", "block");
        setState("login");
    }

    return (
        <div id='register'>
            <div id='register__container' className='flex-center'>
                <div className='register__content col-flex'>
                    <header className='flex-center'>
                        {state === "forgot-password" && (
                            <div>
                                <button className='transparent-button' onClick={resetState}>
                                    <img
                                        src={getImage("/svg/back.svg")}
                                        alt=''
                                        width={"20px"}
                                        height={"20px"}
                                    />
                                </button>
                            </div>
                        )}
                        <div id='register__header--title'>Đăng nhập</div>
                    </header>
                    <Divider />
                    <article id='register__body'>
                        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                            <FormGroup
                                label='Địa chỉ Email'
                                fieldName='email'
                                type='email'
                                register={register}
                                fromPage='login'
                            />
                            {errorMessage === "Duplicate entry email" && (
                                <FormError message='Địa chỉ email đã tồn tại' />
                            )}
                            <div id='login__password--container'>
                                <FormGroup
                                    label='Mật khẩu'
                                    fieldName='password'
                                    type='password'
                                    register={register}
                                    fromPage='login'
                                />
                                {errors?.password && (
                                    <FormError message={errors.password.message} />
                                )}
                            </div>
                            <div className='flex-space' id='authOptions'>
                                <button
                                    className='transparent-button'
                                    type='button'
                                    onClick={handleForgotPassword}
                                >
                                    Quên mật khẩu
                                </button>
                            </div>
                            {laErrorMessage && (
                                <FormError
                                    message='Tài khoản hoặc mật khẩu không đúng'
                                    removeTriangle
                                />
                            )}
                            <MainButton
                                type='submit'
                                className='customBtn'
                                width='100%'
                                height='auto'
                                id='login__main__button'
                            >
                                <span>Đăng nhập</span>
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
            <Toast />
        </div>
    );
};

export default LoginPage;
