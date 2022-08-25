import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { userState } from "../features/user/userSlice";
import { callToast } from "../helpers";
import AddRoomImages from "../components/room/AddRoomImages";
import $ from "jquery";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import PropertyLocationMainContent from "../components/room/components/PropertyLocationMainContent";

import MyButton from "../components/common/MyButton";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextareaAutosize,
    TextField,
    useTheme,
} from "@material-ui/core";
import { categoryState, fetchCategories } from "../features/category/categorySlice";
import { fetchPrivacies, privacyState } from "../features/privacy/privacySlice";
import IncAndDecBtn from "../components/room/components/IncAndDecBtn";
import { amenityState, fetchAmenities } from "../features/amenity/amenitySlice";
import { currencyState, fetchCurrencies } from "../features/currency/currencySlice";
import { addRoom, roomState } from "../features/room/roomSlice";
import { useNavigate } from "react-router-dom";
import { fetchRules, ruleState } from "../features/rule/ruleSlice";
const steps = [
    "Category + Privacy + Basic info + Amenities",
    "Location",
    "Images",
    "Name + Description + Price",
];

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const AddRoomPage = () => {
    const theme = useTheme();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [nextButtonDisbaled, setNextButtonDisbaled] = useState(true);
    const [isPhotosChanged, setIsPhotosChanged] = useState(false);
    const [latitude, setUserLat] = useState(0);
    const [longitude, setUserLng] = useState(0);
    const [category, setCategory] = useState(0);
    const [privacyType, setPrivacyType] = useState(0);
    const [amenities, setAmenities] = useState([]);
    const [rules, setRules] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [currency, setCurrency] = useState(0);

    const [info, setInfo] = useState({
        bedroomCount: 0,
        bathroomCount: 0,
        accomodatesCount: 0,
        bedCount: 0,
    });
    const [values, setValues] = useState({
        country: "",
        state: "",
        city: "",
        street: "",
    });

    const {
        addUserAction: { successMessage, errorMessage },
        user,
    } = useSelector(userState);

    const {
        listing: { categories, loading },
    } = useSelector(categoryState);

    const {
        listing: { amenities: amenitiesLst },
    } = useSelector(amenityState);

    const {
        listing: { rules: rulesLst },
    } = useSelector(ruleState);

    const {
        listing: { privacies },
    } = useSelector(privacyState);

    const {
        listing: { currencies },
    } = useSelector(currencyState);

    const {
        addRoomAction: { successMessage: araSuccessMessage },
    } = useSelector(roomState);

    const clearFields = () => {
        $("#addUserForm")[0].reset();
    };

    useEffect(() => {
        if (successMessage) {
            callToast("success", successMessage);
            clearFields();
        }
    }, [successMessage]);

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        if (activeStep === 0) {
            setInfo({
                bedroomCount: parseInt($("#bedNumber").text()),
                bathroomCount: parseInt($("#bathRoomNumber").text()),
                accomodatesCount: parseInt($("#guestNumber").text()),
                bedCount: parseInt($("#bedRoomNumber").text()),
            });
        }

        if (activeStep === 3) {
            const formData = new FormData();

            const { roomImages } = JSON.parse(localStorage.getItem("room"));
            const { bedroomCount, bathroomCount, accomodatesCount, bedCount } = info;
            const { country, state, city, street } = values;

            const roomEntity = {
                name,
                amentities: amenities,
                images: roomImages,
                city,
                street,
                state,
                bedroomCount,
                bathroomCount,
                accomodatesCount,
                bedCount,
                currency,
                category,
                description,
                latitude,
                longitude,
                rules,
                price: parseInt(price),
                host: user?.id,
                privacyType,
            };

            console.log(roomEntity);

            for (let key in roomEntity) {
                formData.append(key, roomEntity[key]);
            }
            dispatch(addRoom(formData));

            return;
        }

        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleChange = event => {
        const { name, value } = event.target;

        if (name === "category") {
            setCategory(value);
            return;
        } else if (name === "privacyType") {
            setPrivacyType(value);
            return;
        } else if (name === "amenities") {
            setAmenities(typeof value === "string" ? value.split(",") : value);
            return;
        } else if (name === "rules") {
            setRules(typeof value === "string" ? value.split(",") : value);
            return;
        }

        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (activeStep === 0) {
            dispatch(fetchPrivacies(1));
            dispatch(fetchCategories());
            dispatch(fetchAmenities());
            dispatch(fetchRules(1));
        }
        if (activeStep === 3) {
            dispatch(fetchCurrencies());
        }
    }, [activeStep]);

    function disableNextButton() {
        setNextButtonDisbaled(true);
        $("#nextButton").addClass("bg-blue-200 hover:bg-blue-200");
    }

    useEffect(() => {
        if (activeStep === 0) {
            if (category !== 0 && privacyType !== 0 && amenities.length > 0) {
                setNextButtonDisbaled(false);
                $("#nextButton").removeClass("bg-blue-200 hover:bg-blue-200");
            } else {
                disableNextButton();
            }
        } else if (activeStep === 1) {
            if (values.city && values.street) {
                setNextButtonDisbaled(false);
            } else {
                disableNextButton();
            }
        }
    }, [
        category,
        privacyType,
        amenities,
        values.country,
        values.state,
        values.city,
        values.street,
    ]);

    useEffect(() => {
        if (activeStep === 2 && isPhotosChanged) {
            const room = JSON.parse(localStorage.getItem("room"));
            if (room.roomImages && room.roomImages.length >= 5) {
                setNextButtonDisbaled(false);
            } else {
                disableNextButton();
            }
        }
    }, [isPhotosChanged]);

    useEffect(() => {
        if (araSuccessMessage) {
            navigate("/rooms");
        }
    }, [araSuccessMessage]);

    console.log(rulesLst);

    return (
        <>
            <div className='flex h-screen overflow-hidden'>
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                    <Box sx={{ width: "100%", marginTop: "20px" }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label, index) => {
                                const stepProps = {};
                                const labelProps = {};

                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <React.Fragment>
                                <Typography sx={{ mt: 2, mb: 1 }}>
                                    All steps completed - you&apos;re finished
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                                    <Box sx={{ flex: "1 1 auto" }} />
                                    <Button onClick={handleReset}>Reset</Button>
                                </Box>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <div className='my-10'></div>
                                {activeStep === 0 && (
                                    <div className=''>
                                        <div className='flex-1 w-45 px-20'>
                                            <Box
                                                component='div'
                                                sx={{
                                                    p: 2,
                                                    border: "1px dashed grey",
                                                    background: "#fff",
                                                    height: "600px",
                                                    borderRadius: "8px",
                                                }}
                                                className='w-full col-flex items-center justify-evenly'
                                            >
                                                <div className='w-3/6'>
                                                    <div className='mb-5'>
                                                        <FormControl fullWidth required>
                                                            <InputLabel>Category</InputLabel>
                                                            <Select
                                                                name='category'
                                                                value={category}
                                                                label='Category'
                                                                onChange={handleChange}
                                                            >
                                                                {categories.map(category => (
                                                                    <MenuItem value={category.id}>
                                                                        {category.name}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                    <div className='mb-5'>
                                                        <FormControl fullWidth required>
                                                            <InputLabel>Privacy</InputLabel>
                                                            <Select
                                                                name='privacyType'
                                                                value={privacyType}
                                                                label='Privacy'
                                                                onChange={handleChange}
                                                            >
                                                                {privacies.map(privacy => (
                                                                    <MenuItem value={privacy.id}>
                                                                        {privacy.name}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                    <div className='mb-5'>
                                                        <Box
                                                            component='div'
                                                            sx={{
                                                                p: 2,
                                                                border: "1px solid grey",
                                                                background: "#fff",
                                                                borderRadius: "8px",
                                                            }}
                                                        >
                                                            <div className='col-flex'>
                                                                <div className='flex-space mb-4'>
                                                                    <div className='room-info__info-title'>
                                                                        Guest
                                                                    </div>
                                                                    <IncAndDecBtn
                                                                        dataEdit='guestNumber'
                                                                        dataTrigger='guestNumber'
                                                                        info={info}
                                                                    />
                                                                </div>
                                                                <div className='flex-space mb-4'>
                                                                    <div className='room-info__info-title'>
                                                                        Bed
                                                                    </div>
                                                                    <IncAndDecBtn
                                                                        dataEdit='bedNumber'
                                                                        dataTrigger='bedNumber'
                                                                        info={info}
                                                                    />
                                                                </div>
                                                                <div className='flex-space mb-4'>
                                                                    <div className='room-info__info-title'>
                                                                        Bedroom
                                                                    </div>
                                                                    <IncAndDecBtn
                                                                        dataEdit='bedRoomNumber'
                                                                        dataTrigger='bedRoomNumber'
                                                                        info={info}
                                                                    />
                                                                </div>
                                                                <div className='flex-space mb-4'>
                                                                    <div className='room-info__info-title'>
                                                                        Bathroom
                                                                    </div>
                                                                    <IncAndDecBtn
                                                                        dataEdit='bathRoomNumber'
                                                                        dataTrigger='bathRoomNumber'
                                                                        info={info}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Box>
                                                    </div>
                                                    <div className='mb-5'>
                                                        <FormControl fullWidth required>
                                                            <InputLabel>Amenities</InputLabel>
                                                            <Select
                                                                name='amenities'
                                                                value={amenities}
                                                                multiple
                                                                onChange={handleChange}
                                                            >
                                                                {amenitiesLst.map(amenity => (
                                                                    <MenuItem
                                                                        value={amenity.id}
                                                                        key={amenity.id}
                                                                        style={getStyles(
                                                                            amenity.name,
                                                                            amenities,
                                                                            theme
                                                                        )}
                                                                    >
                                                                        {amenity.name}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                    <div className='mb-5'>
                                                        <FormControl fullWidth required>
                                                            <InputLabel>Rules</InputLabel>
                                                            <Select
                                                                name='rules'
                                                                value={rules}
                                                                multiple
                                                                onChange={handleChange}
                                                            >
                                                                {rulesLst.map(rule => (
                                                                    <MenuItem
                                                                        value={rule.id}
                                                                        key={rule.id}
                                                                        style={getStyles(
                                                                            rule.name,
                                                                            rules,
                                                                            theme
                                                                        )}
                                                                    >
                                                                        {rule.title}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                            </Box>
                                        </div>
                                    </div>
                                )}
                                {activeStep === 1 && (
                                    <Box
                                        component='div'
                                        sx={{
                                            p: 2,
                                            border: "1px dashed grey",
                                            background: "#fff",
                                            height: "600px",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        <PropertyLocationMainContent
                                            values={values}
                                            setValues={setValues}
                                            activeStep={activeStep}
                                            setUserLat={setUserLat}
                                            setUserLng={setUserLng}
                                        />
                                    </Box>
                                )}

                                {activeStep === 2 && (
                                    <div className='flex justify-center'>
                                        <AddRoomImages setIsPhotosChanged={setIsPhotosChanged} />
                                    </div>
                                )}
                                {activeStep === 3 && (
                                    <Box
                                        component='div'
                                        sx={{
                                            p: 2,
                                            border: "1px dashed grey",
                                            background: "#fff",
                                            height: "650px",
                                            borderRadius: "8px",
                                        }}
                                        className='w-full'
                                    >
                                        <div className='col-flex justify-center items-center'>
                                            <div className='w-3/6 col-flex items-center justify-center h-full'>
                                                <div className='flex-1 w-50 mb-10'>
                                                    <FormControl fullWidth>
                                                        <TextField
                                                            label='Name'
                                                            value={name}
                                                            onChange={e => {
                                                                setName(e.target.value);
                                                            }}
                                                            required
                                                        />
                                                    </FormControl>
                                                </div>
                                                <div className='flex-1 w-50'>
                                                    <Typography>Description</Typography>
                                                    <FormControl fullWidth>
                                                        <TextareaAutosize
                                                            minRows={3}
                                                            value={description}
                                                            onChange={e => {
                                                                setDescription(e.target.value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <div className='flex-1 w-50 mt-5'>
                                                    <FormControl fullWidth>
                                                        <TextField
                                                            label='Price'
                                                            value={price}
                                                            onChange={e => {
                                                                setPrice(e.target.value);
                                                            }}
                                                            type='number'
                                                            required
                                                        />
                                                    </FormControl>
                                                    <div className='mt-5'>
                                                        <FormControl fullWidth>
                                                            <InputLabel>Currencies</InputLabel>
                                                            <Select
                                                                value={currency}
                                                                label='Currencies'
                                                                onChange={e => {
                                                                    setCurrency(e.target.value);
                                                                }}
                                                            >
                                                                {currencies.map(currency => (
                                                                    <MenuItem
                                                                        value={currency.id}
                                                                        id={currency.unit}
                                                                    >
                                                                        {currency.symbol} (
                                                                        {currency.unit})
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Box>
                                )}

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        pt: 2,
                                        padding: "0 20px",
                                        marginTop: "20px",
                                    }}
                                >
                                    <MyButton
                                        type='back'
                                        label='Back'
                                        onClick={handleBack}
                                        disabled={activeStep === 0}
                                    />
                                    <Box sx={{ flex: "1 1 auto" }} />

                                    <MyButton
                                        type='next'
                                        label={activeStep === steps.length - 1 ? "Done" : "Next"}
                                        onClick={handleNext}
                                        id='nextButton'
                                        disabled={nextButtonDisbaled}
                                    />
                                </Box>
                            </React.Fragment>
                        )}
                    </Box>
                </div>
            </div>
        </>
    );
};

export default AddRoomPage;
