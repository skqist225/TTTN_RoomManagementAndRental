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
import { useForm } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Divider, IconButton, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import Toast from "../components/notify/Toast";
import { addUser, fetchRoles, userState } from "../features/user/userSlice";
import { callToast } from "../helpers";
import $ from "jquery";

const schema = yup
    .object({
        password: yup.string().min(8, "Password at least 8 characters"),
        birthday: yup.string().required("Birthday is required"),
        phoneNumber: yup
            .string()
            .required("Phone number is required")
            .min(10, "Phone number must be 10 characters")
            .max(10, "Phone number must be 10 characters")
            .matches(
                /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                "Invalid phone number"
            ),
        email: yup.string().email("Invalid email").required("Email is required"),
    })
    .required();

const AddUserPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [birthday, setBirthday] = useState(new Date());
    const [sex, setSex] = useState("MALE");
    const [role, setRole] = useState(2);
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const {
        addUserAction: { successMessage, errorMessage },
        fetchRolesAction: { roles },
    } = useSelector(userState);

    let birthdayErrorFromServer = null,
        emailErrorFromServer = null,
        phoneNumberErrorFromServer = null;
    if (errorMessage && errorMessage.length > 0) {
        errorMessage.forEach(error => {
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

    const onSubmit = (data, e) => {
        let monthOfBirthDay = "0",
            dateOfBirthday = "0";
        if (birthday.getMonth() + 1 < 10) {
            monthOfBirthDay += birthday.getMonth() + 1;
        } else {
            monthOfBirthDay = birthday.getMonth() + 1;
        }

        if (birthday.getDate() < 10) {
            dateOfBirthday += birthday.getDate();
        } else {
            dateOfBirthday = birthday.getDate();
        }

        let userBirthday = `${birthday.getFullYear()}-${monthOfBirthDay}-${dateOfBirthday}`;

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
            setBirthday(new Date());
            setSex("MALE");
            setRole(2);
        }
    }, [successMessage]);

    useEffect(() => {
        dispatch(fetchRoles());
    }, []);

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
                                                    phoneNumberErrorFromServer
                                                        ? true
                                                        : !!errors?.phoneNumber
                                                }
                                                helperText={
                                                    phoneNumberErrorFromServer
                                                        ? phoneNumberErrorFromServer
                                                        : errors?.phoneNumber
                                                        ? errors?.phoneNumber.message
                                                        : ""
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
                                                error={emailErrorFromServer ? true : !!errors.email}
                                                helperText={
                                                    emailErrorFromServer
                                                        ? emailErrorFromServer
                                                        : errors?.email
                                                        ? errors?.email.message
                                                        : ""
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
                                                error={!!errors?.password}
                                            />
                                        </FormControl>
                                        <p>{errors?.password ? errors?.password.message : ""}</p>
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
                                                                birthdayErrorFromServer
                                                                    ? true
                                                                    : false
                                                            }
                                                            helperText={
                                                                birthdayErrorFromServer
                                                                    ? birthdayErrorFromServer
                                                                    : null
                                                            }
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                    </div>

                                    <div className='mb-5'>
                                        {roles && roles.length && (
                                            <FormControl fullWidth>
                                                <InputLabel>Role</InputLabel>
                                                <Select
                                                    value={role}
                                                    label='Sex'
                                                    onChange={e => {
                                                        setRole(e.target.value);
                                                    }}
                                                >
                                                    {roles.map(role => (
                                                        <MenuItem value={role.id} key={role.id}>
                                                            {role.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
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
