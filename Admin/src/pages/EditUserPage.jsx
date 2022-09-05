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
import { Form } from "react-bootstrap";
import {
    Divider,
    IconButton,
    InputAdornment,
    OutlinedInput,
    TextareaAutosize,
    Typography,
} from "@mui/material";
import Toast from "../components/notify/Toast";
import { fetchRoles, fetchUser, updateUser, userState } from "../features/user/userSlice";
import { callToast, getImage } from "../helpers";
import $ from "jquery";
import { useParams } from "react-router-dom";
import { Image } from "../globalStyle";
import { fetchStatesByCountry, stateState } from "../features/address/stateSlice";
import { cityState, fetchCitiesByState } from "../features/address/citySlice";

const AddUserPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [state, setState] = useState(0);
    const [city, setCity] = useState(0);
    const [street, setStreet] = useState("");
    const [role, setRole] = useState(2);

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
        get: { user },
        updateUserAction: { successMessage, errorMessage },
        fetchRolesAction: { roles },
    } = useSelector(userState);

    let birthdayErrorFromServer = null,
        phoneNumberErrorFromServer = null;
    if (errorMessage && errorMessage.length > 0) {
        errorMessage.forEach(error => {
            if (error.birthday) {
                birthdayErrorFromServer = error.birthday;
            }
            if (error.phoneNumber) {
                phoneNumberErrorFromServer = error.phoneNumber;
            }
            if (error.phoneNumberCharacter) {
                phoneNumberErrorFromServer = error.phoneNumberCharacter;
            }
            if (error.phoneNumberString) {
                phoneNumberErrorFromServer = error.phoneNumberString;
            }
        });
    }

    const { userId } = useParams();

    useEffect(() => {
        if (userId) {
            dispatch(fetchUser(userId));
        }
    }, [userId]);

    useEffect(() => {
        dispatch(fetchStatesByCountry({ countryId: 216 }));
        dispatch(fetchCitiesByState({ stateId: 120 }));
        dispatch(fetchRoles());
    }, []);

    useEffect(() => {
        if (state) {
            dispatch(fetchCitiesByState({ stateId: state }));
        }
    }, [state]);

    const { states } = useSelector(stateState);
    const { cities } = useSelector(cityState);

    const stateOptions = states.map(state => ({
        value: state.id.toString(),
        displayText: state.name,
    }));

    const cityOptions = cities.map(city => ({
        value: city.id.toString(),
        displayText: city.name,
    }));

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
            if (user.role && user.role.id) {
                setRole(user.role.id);
            }

            const address = user.addressDetails;
            if (address) {
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
        }
    }, [user]);

    function processUserBirthday() {
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
        return userBirthday;
    }

    const onSubmit = e => {
        e.preventDefault();

        console.log(processUserBirthday(birthday));

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
        if (state && city && street) {
            updateObject["city"] = city;
            updateObject["street"] = street;
        }

        console.log(updateObject);
        const formData = new FormData();
        for (const key in updateObject) {
            formData.set(key, updateObject[key]);
        }

        dispatch(
            updateUser({
                id: userId,
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

    useEffect(() => {
        if (successMessage) {
            callToast("success", successMessage);
            setFieldValues({
                ...fieldValues,
                password: "",
            });
        }
    }, [successMessage]);

    const handleChange = e => {
        e.preventDefault();

        const { name, value } = e.currentTarget;

        setFieldValues({
            ...fieldValues,
            [name]: value,
        });
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
                                                    error={!!phoneNumberErrorFromServer}
                                                    helperText={
                                                        phoneNumberErrorFromServer
                                                            ? phoneNumberErrorFromServer
                                                            : ""
                                                    }
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
                                                    autoComplete='nope'
                                                    type='email'
                                                    value={fieldValues.email}
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
                                                        error={!!birthdayErrorFromServer}
                                                        helperText={
                                                            birthdayErrorFromServer
                                                                ? birthdayErrorFromServer
                                                                : ""
                                                        }
                                                        renderInput={params => (
                                                            <TextField {...params} />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </FormControl>
                                        </div>
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
                                            <div>
                                                <div style={{ marginBottom: "10px" }}>
                                                    Tỉnh/thành phố: &nbsp;
                                                </div>
                                                {stateOptions.length && (
                                                    <Form.Select
                                                        value={state}
                                                        onChange={e => {
                                                            setState(e.target.value);
                                                        }}
                                                        id='stateSelect'
                                                        style={{ width: "100%" }}
                                                    >
                                                        {stateOptions.map(
                                                            ({ value, displayText }) => (
                                                                <option value={value} key={value}>
                                                                    {displayText}
                                                                </option>
                                                            )
                                                        )}
                                                    </Form.Select>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ margin: "10px 0" }}>Quận/huyện:</div>
                                                {cityOptions.length && (
                                                    <Form.Select
                                                        value={city}
                                                        onChange={e => {
                                                            setCity(e.target.value);
                                                        }}
                                                        id='citySelect'
                                                        style={{ width: "100%" }}
                                                    >
                                                        {cityOptions.map(
                                                            ({ value, displayText }) => (
                                                                <option value={value} key={value}>
                                                                    {displayText}
                                                                </option>
                                                            )
                                                        )}
                                                    </Form.Select>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ margin: "10px 0" }}>
                                                    Địa chỉ đường/phố:
                                                </div>
                                                <Form.Control
                                                    style={{ width: "100%" }}
                                                    type='text'
                                                    value={street}
                                                    onChange={e => {
                                                        setStreet(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>
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
