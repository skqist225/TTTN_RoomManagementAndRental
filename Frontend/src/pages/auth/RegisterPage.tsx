import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormGroup, DropDown } from "../../components/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Divider, MainButton } from "../../globalStyle";
import { useDispatch, useSelector } from "react-redux";
import FormError from "../../components/register/FormError";
import { getImage } from "../../helpers";
import { authState, registerUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { FloatingLabel, Form } from "react-bootstrap";

import $ from "jquery";
import "../css/register.css";

const schema = yup
    .object({
        firstName: yup.string().required("Vui lòng nhập tên."),
        lastName: yup.string().required("Vui lòng nhập họ."),
        password: yup.string().length(8, "Mật khẩu ít nhất 8 kí tự."),
        birthday: yup.string().required("Vui lòng chọn ngày sinh."),
        email: yup
            .string()
            .email("Địa chỉ email không hợp lệ.")
            .required("Vui lòng nhập địa chỉ email."),
        phoneNumber: yup
            .string()
            .required("Vui lòng nhập số điện thoại")
            .min(10, "Số điện thoại ít nhất 10 chữ số")
            .max(10, "Số điện thoại nhiều nhất 10 chữ số")
            .matches(
                /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                "Số điện thoại không hợp lệ!"
            ),
    })
    .required();

type HomeProps = {};

const RegisterPage: FC<HomeProps> = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        registerAction: { errors: raErrors, successMessage },
    } = useSelector(authState);

    let birthdayErrorFromServer = null,
        emailErrorFromServer = null,
        phoneNumberErrorFromServer = null;
    if (raErrors && raErrors.length > 0) {
        raErrors.forEach((error: any) => {
            if (error.birthday) {
                birthdayErrorFromServer = error.birthday;
            }
            if (error.email) {
                emailErrorFromServer = error.email;
            }
            if (error.phoneNumber) {
                phoneNumberErrorFromServer = error.phoneNumber;
            }
            if (error.phoneNumberCharacter) {
                phoneNumberErrorFromServer = error.phoneNumberCharacter;
            }
        });
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
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

    const backToPreviousPage = () => {
        navigate("/auth/login");
    };

    const onSubmitFinalStep = (data: any) => {
        console.log("[registered data] : ", data);
        dispatch(
            registerUser({
                ...data,
            })
        );
    };

    useEffect(() => {
        if (successMessage) navigate("/auth/login");
    }, [successMessage]);

    return (
        <div id='register'>
            <div id='register__container' className='flex-center'>
                <div className='register__content col-flex'>
                    <header className='flex-center'>
                        <div id='register__header--back' onClick={backToPreviousPage}>
                            <img src={getImage("/svg/back.svg")} width={"18px"} height={"18px"} />
                        </div>
                        <div id='register__header--title'>Đăng ký</div>
                    </header>
                    <Divider />
                    <article id='register__body'>
                        <form
                            onSubmit={handleSubmit(onSubmitFinalStep)}
                            id='register__second--form'
                        >
                            <FormGroup
                                label='Họ'
                                placeholder='Họ'
                                fieldName='lastName'
                                type='text'
                                register={register}
                            />
                            {errors?.lastName && <FormError message={errors.lastName.message} />}
                            <FormGroup
                                label='Tên'
                                placeholder='Tên'
                                fieldName='firstName'
                                type='text'
                                register={register}
                            />
                            {errors?.firstName && <FormError message={errors.firstName.message} />}

                            <FormGroup
                                label='Ngày sinh'
                                fieldName='birthday'
                                type='date'
                                register={register}
                            />
                            {errors?.birthday && <FormError message={errors.birthday.message} />}
                            {birthdayErrorFromServer && (
                                <FormError
                                    message={"Ứng dụng chỉ dành cho người dùng lớn hơn 18 tuổi"}
                                />
                            )}
                            <DropDown
                                label='Giới tính'
                                fieldName='sex'
                                register={register}
                                options={[
                                    {
                                        value: "MALE",
                                        displayText: "Nam",
                                    },
                                    {
                                        value: "FEMALE",
                                        displayText: "Nữ",
                                    },
                                    {
                                        value: "OTHER",
                                        displayText: "Khác",
                                    },
                                ]}
                            />
                            {errors?.sex && <FormError message={errors.sex.message} />}
                            <FormGroup
                                label='Địa chỉ Email'
                                fieldName='email'
                                type='email'
                                register={register}
                            />
                            {errors?.email && <FormError message={errors.email.message} />}
                            {emailErrorFromServer && (
                                <FormError message='Địa chỉ email đã được sử dụng' />
                            )}
                            <FormGroup
                                label='Mật khẩu'
                                fieldName='password'
                                type='password'
                                register={register}
                            />
                            {errors?.password && <FormError message={errors.password.message} />}
                            <FloatingLabel label='Số điện thoại' className='mb-3'>
                                <Form.Control type='text' {...register("phoneNumber")} />
                            </FloatingLabel>
                            {errors?.phoneNumber && (
                                <FormError message={errors.phoneNumber.message} />
                            )}
                            {phoneNumberErrorFromServer && (
                                <FormError message='Số điện thoại đã được sử dụng' />
                            )}

                            <MainButton type='submit' className='customBtn'>
                                <span>Đăng ký</span>
                            </MainButton>
                        </form>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
