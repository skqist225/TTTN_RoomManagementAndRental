import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Divider, IconButton, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import Toast from "../components/notify/Toast";
import { addUser, fetchUser, userState } from "../features/user/userSlice";
import { callToast } from "../helpers";
import $ from "jquery";

const schema = yup
    .object({
        password: yup.string().min(8, "Password at least 8 characters"),
        birthday: yup.string().required("Birthday is required"),
        phoneNumber: yup
            .string()
            .matches(
                /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/,
                "Phone number must be 10 numbers."
            ),
        email: yup.string().email("Invalid email"),
    })
    .required();

const AddUserPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [birthday, setBirthday] = useState(new Date());
    const [sex, setSex] = useState("MALE");
    const [showPassword, setShowPassword] = useState(false);
    const [myErrors, setMyErrors] = useState({
        phoneNumber: "",
        birthday: "",
        email: "",
    });

    const dispatch = useDispatch();
    const {
        addUserAction: { successMessage, errorMessage },
        get: { user },
    } = useSelector(userState);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    console.log(errors);

    const onSubmit = (data, e) => {
        setMyErrors({
            phoneNumber: "",
            birthday: "",
            email: "",
        });

        let userBirthday = data.birthday.split("/");
        userBirthday = `${userBirthday[2]}-${userBirthday[0]}-${userBirthday[1]}`;

        dispatch(addUser({ ...data, birthday: userBirthday, sex }));
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    const clearFields = () => {
        $("#addUserForm")[0].reset();
    };

    useEffect(() => {
        if (successMessage) {
            callToast("success", successMessage);
            clearFields();
        }
    }, [successMessage]);

    useEffect(() => {
        if (errorMessage) {
            if (errorMessage.includes("Email")) {
                setMyErrors({
                    ...myErrors,
                    email: errorMessage,
                });
            } else if (errorMessage.includes("Phone number")) {
                setMyErrors({
                    ...myErrors,
                    phoneNumber: errorMessage,
                });
            } else {
                setMyErrors({
                    ...myErrors,
                    birthday: errorMessage,
                });
            }
        }
    }, [errorMessage]);

    return (
        <>
            <div className='flex h-screen overflow-hidden'>
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    <Typography
                        variant='h3'
                        component='div'
                        gutterBottom
                        className='text-center pt-3'
                    >
                        {"Add User"}
                    </Typography>
                    <Divider />
                    <div className='mx-40 my-10'>
                        <div className='flex items-center justify-center'>
                            <div className='flex-col w-50'>
                                <form
                                    onSubmit={e => {
                                        e.preventDefault();
                                        handleSubmit(onSubmit)(e);
                                    }}
                                    id='addUserForm'
                                >
                                    <div className='mb-5'>
                                        <FormControl fullWidth>
                                            <TextField
                                                label={"First Name"}
                                                {...register("firstName")}
                                                defaultValue=''
                                                required
                                            />
                                        </FormControl>
                                    </div>
                                    <div className='mb-5'>
                                        <FormControl fullWidth>
                                            <TextField
                                                label={"Last Name"}
                                                {...register("lastName")}
                                                defaultValue=''
                                                required
                                            />
                                        </FormControl>
                                    </div>
                                    <div className='mb-5'>
                                        <FormControl fullWidth>
                                            <TextField
                                                label={"Phone Number"}
                                                {...register("phoneNumber")}
                                                error={
                                                    errors?.phoneNumber
                                                        ? true
                                                        : !!myErrors.phoneNumber
                                                }
                                                helperText={
                                                    errors?.phoneNumber
                                                        ? errors?.phoneNumber.message
                                                        : myErrors.phoneNumber
                                                }
                                                defaultValue=''
                                                required
                                            />
                                        </FormControl>
                                    </div>

                                    <div className='mb-5'>
                                        <FormControl fullWidth>
                                            <TextField
                                                label={"Email"}
                                                {...register("email")}
                                                error={errors?.email ? true : !!myErrors.email}
                                                helperText={
                                                    errors?.email
                                                        ? errors?.email.message
                                                        : myErrors.email
                                                }
                                                autoComplete='nope'
                                                defaultValue=''
                                                required
                                            />
                                        </FormControl>
                                    </div>

                                    <div className='mb-5'>
                                        <FormControl fullWidth variant='outlined'>
                                            <InputLabel htmlFor='outlined-adornment-password'>
                                                Password
                                            </InputLabel>
                                            <OutlinedInput
                                                type={showPassword ? "text" : "password"}
                                                endAdornment={
                                                    <InputAdornment position='end'>
                                                        <IconButton
                                                            aria-label='toggle password visibility'
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge='end'
                                                        >
                                                            {showPassword ? (
                                                                <VisibilityOff />
                                                            ) : (
                                                                <Visibility />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label='Password'
                                                autoComplete='new-password'
                                                {...register("password")}
                                            />
                                        </FormControl>
                                    </div>

                                    <div className='mb-5'>
                                        <FormControl fullWidth>
                                            <InputLabel>Sex</InputLabel>
                                            <Select
                                                value={sex}
                                                label='Sex'
                                                onChange={e => {
                                                    setSex(e.target.value);
                                                }}
                                            >
                                                <MenuItem value='MALE'>MALE</MenuItem>
                                                <MenuItem value='FEMALE'>FEMALE</MenuItem>
                                                <MenuItem value='OTHER'>OTHER</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className='mb-5'>
                                        <FormControl fullWidth>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label='Birth Day'
                                                    value={birthday}
                                                    onChange={newValue => {
                                                        setBirthday(newValue);
                                                    }}
                                                    renderInput={params => (
                                                        <TextField
                                                            {...params}
                                                            {...register("birthday")}
                                                            error={
                                                                errors?.birthday
                                                                    ? true
                                                                    : !!myErrors.birthday
                                                            }
                                                            helperText={
                                                                errors?.birthday
                                                                    ? errors?.birthday.message
                                                                    : myErrors.birthday
                                                            }
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormControl fullWidth>
                                            <Button
                                                variant='contained'
                                                endIcon={<SendIcon />}
                                                type='submit'
                                            >
                                                Add
                                            </Button>
                                        </FormControl>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toast />
        </>
    );
};

export default AddUserPage;
