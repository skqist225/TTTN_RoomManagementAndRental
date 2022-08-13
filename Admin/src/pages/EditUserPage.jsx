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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
    Divider,
    IconButton,
    InputAdornment,
    OutlinedInput,
    TextareaAutosize,
    Typography,
} from "@mui/material";
import Toast from "../components/notify/Toast";
import { fetchUser, updateUser, userState } from "../features/user/userSlice";
import { callToast, getImage } from "../helpers";
import $ from "jquery";
import { useParams } from "react-router-dom";
import { Image } from "../globalStyle";
import { authState, checkPhoneNumber, checkEmail } from "../features/auth/authSlice";
import { AddressEdit } from "../components";

const AddUserPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [endSetting, setEndSetting] = useState(false);
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [myErrors, setMyErrors] = useState({
        phoneNumber: "",
        birthday: "",
        email: "",
    });
    const [fieldValues, setFieldValues] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        about: "",
    });
    const [sex, setSex] = useState("MALE");
    const [birthday, setBirthday] = useState(new Date());
    const [avatar, setAvatar] = useState(null);

    const dispatch = useDispatch();
    const {
        addUserAction: { successMessage, errorMessage },
        get: { user },
        updateUserAction: { successMessage: uuSuccessMessage, errorMessage: uuErrorMessage },
    } = useSelector(userState);

    const {
        checkPhoneNumberAction: {
            successMessage: cpnSuccessMessage,
            errorMessage: cpnErrorMessage,
        },
        checkEmailAction: { successMessage: ceSuccessMessage, errorMessage: ceErrorMessage },
    } = useSelector(authState);

    const { userid } = useParams();

    useEffect(() => {
        if (userid) {
            dispatch(fetchUser(userid));
        }
    }, [userid]);

    useEffect(() => {
        if (user) {
            setFieldValues({
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                email: user.email,
                password: "",
                about: user.about,
            });
            setSex(user.sex);
            setBirthday(new Date(user.birthday));

            const address = user.addressDetails;
            if (address) {
                if (address.country) {
                    setCountry(address.country.id);
                }
                if (address.state) {
                    setState(address.state.id);
                }
                if (address.city) {
                    setCity(address.city.id);
                }
                if (address.street) {
                    setStreet(address.street);
                }
            }

            setEndSetting(true);
        }
    }, [user]);

    useEffect(() => {
        if (uuErrorMessage) {
        }
    }, [uuErrorMessage]);

    useEffect(() => {
        if (uuSuccessMessage) {
            callToast("success", uuSuccessMessage);
        }
    }, [uuSuccessMessage]);

    useEffect(() => {
        if (cpnErrorMessage) {
            setMyErrors({
                ...myErrors,
                phoneNumber: cpnErrorMessage,
            });
        }
    }, [cpnErrorMessage]);

    useEffect(() => {
        if (cpnSuccessMessage) {
            setMyErrors({
                ...myErrors,
                phoneNumber: "",
            });
        }
    }, [cpnSuccessMessage]);

    useEffect(() => {
        if (ceErrorMessage) {
            setMyErrors({
                ...myErrors,
                email: ceErrorMessage,
            });
        }
    }, [ceErrorMessage]);

    useEffect(() => {
        if (ceSuccessMessage) {
            setMyErrors({
                ...myErrors,
                email: "",
            });
        }
    }, [ceSuccessMessage]);

    function processUserBirthday(birthday) {
        const date = new Date(birthday);
        const userBirthday = `${date.getFullYear()}-${
            (date.getMonth() + 1).toString().length === 2
                ? date.getMonth() + 1
                : `0${date.getMonth() + 1}`
        }-${date.getDate().toString().length === 2 ? date.getDate() : `0${date.getDate()}`}`;
        return userBirthday;
    }

    const onSubmit = e => {
        e.preventDefault();

        setMyErrors({
            phoneNumber: "",
            birthday: "",
            email: "",
        });

        const updateObject = {
            ...fieldValues,
            sex,
            birthday: processUserBirthday(birthday),
        };
        delete updateObject["password"];
        if (fieldValues.password) {
            updateObject["password"] = fieldValues.password;
        }
        if (avatar) {
            updateObject["avatar"] = avatar;
        }
        if (country) {
            updateObject["country"] = parseInt(country);
        }
        if (state) {
            updateObject["state"] = parseInt(state);
        }
        if (city) {
            updateObject["city"] = parseInt(city);
        }
        if (street) {
            updateObject["street"] = street;
        }

        console.log(updateObject);
        const formData = new FormData();
        for (const key in updateObject) {
            formData.set(key, updateObject[key]);
        }

        console.log(formData);
        dispatch(
            updateUser({
                id: userid,
                formData,
            })
        );
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
            // clearFields();
        }
    }, [successMessage]);

    const handleChange = e => {
        e.preventDefault();

        const { name, value } = e.currentTarget;

        setFieldValues({
            ...fieldValues,
            [name]: value,
        });

        if (name === "phoneNumber" && value.length === 10 && user.phoneNumber !== value) {
            dispatch(checkPhoneNumber(value));
        } else if (name === "email" && user.email !== value) {
            dispatch(checkEmail(value));
        }
    };

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
                        Edit User
                    </Typography>
                    <Divider />
                    <div className='flex w-full justify-center my-10'>
                        <div className='flex-initial w-30'>
                            <div id='udpleftBlock'>
                                <div>
                                    <span>User Avatar:</span>
                                    <Image
                                        src={getImage(user.avatarPath)}
                                        alt=''
                                        size='128px'
                                        className='mb-4'
                                    />
                                    <Button variant='contained' component='label'>
                                        Upload
                                        <input
                                            hidden
                                            name='newAvatar'
                                            accept='image/*'
                                            type='file'
                                            onChange={e => {
                                                setAvatar(e.target.files[0]);
                                            }}
                                        />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='flex-initial' style={{ width: "500px" }}>
                            <div className='flex justify-center w-full'>
                                <div className='flex-col w-10/12'>
                                    <form onSubmit={onSubmit} id='addUserForm'>
                                        <div className='mb-5'>
                                            <FormControl fullWidth>
                                                <TextField
                                                    label={"First Name"}
                                                    name='firstName'
                                                    value={fieldValues.firstName}
                                                    onChange={handleChange}
                                                    defaultValue=''
                                                    required
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='mb-5'>
                                            <FormControl fullWidth>
                                                <TextField
                                                    label={"Last Name"}
                                                    name='lastName'
                                                    value={fieldValues.lastName}
                                                    onChange={handleChange}
                                                    defaultValue=''
                                                    required
                                                />
                                            </FormControl>
                                        </div>
                                        <div className='mb-5'>
                                            <FormControl fullWidth>
                                                <TextField
                                                    label={"Phone Number"}
                                                    name='phoneNumber'
                                                    error={!!myErrors.phoneNumber}
                                                    helperText={myErrors.phoneNumber}
                                                    value={fieldValues.phoneNumber}
                                                    onChange={handleChange}
                                                    defaultValue=''
                                                    required
                                                />
                                            </FormControl>
                                        </div>

                                        <div className='mb-5'>
                                            <FormControl fullWidth>
                                                <TextField
                                                    label={"Email"}
                                                    name='email'
                                                    error={!!myErrors.email}
                                                    helperText={myErrors.email}
                                                    autoComplete='nope'
                                                    value={fieldValues.email}
                                                    onChange={handleChange}
                                                    type='email'
                                                    defaultValue=''
                                                    required
                                                    disabled
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
                                                                onMouseDown={
                                                                    handleMouseDownPassword
                                                                }
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
                                                    name='password'
                                                    defaultValue=''
                                                    value={fieldValues.password}
                                                    onChange={handleChange}
                                                    autoComplete='new-password'
                                                />
                                            </FormControl>
                                        </div>

                                        <div className='mb-5'>
                                            <FormControl fullWidth>
                                                <InputLabel>Sex</InputLabel>
                                                <Select
                                                    label='Sex'
                                                    defaultValue=''
                                                    value={sex}
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
                                                        name='birthday'
                                                        value={birthday}
                                                        onChange={newValue => {
                                                            setBirthday(newValue);
                                                        }}
                                                        error={!!myErrors.birthday}
                                                        helperText={myErrors.birthday}
                                                        renderInput={params => (
                                                            <TextField {...params} />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </FormControl>
                                        </div>
                                        <>
                                            <div className='mb-5'>
                                                <FormControl fullWidth>
                                                    <TextareaAutosize
                                                        minRows={3}
                                                        placeholder='About'
                                                        name='about'
                                                        style={{ width: "100%" }}
                                                        defaultValue=''
                                                        value={fieldValues.about}
                                                        onChange={handleChange}
                                                    />
                                                </FormControl>
                                            </div>
                                        </>
                                        {endSetting && (
                                            <AddressEdit
                                                country={country}
                                                state={state}
                                                city={city}
                                                street={street}
                                                setCountry={setCountry}
                                                setState={setState}
                                                setCity={setCity}
                                                setStreet={setStreet}
                                            />
                                        )}
                                        <div>
                                            <FormControl fullWidth>
                                                <Button
                                                    variant='contained'
                                                    endIcon={<SendIcon />}
                                                    type='submit'
                                                >
                                                    Update
                                                </Button>
                                            </FormControl>
                                        </div>
                                    </form>
                                </div>
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
