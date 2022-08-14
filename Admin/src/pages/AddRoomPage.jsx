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
import PropertyTitleMainContent from "../components/room/components/PropertyTitleMainContent";
import PropertyDescriptionMainContent from "../components/room/components/PropertyDescriptionMainContent";
import PropertyPriceMainContent from "../components/room/components/PropertyPriceMainContent";

import MyButton from "../components/common/MyButton";
import {
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    useTheme,
} from "@material-ui/core";
import { categoryState, fetchCategories } from "../features/category/categorySlice";
import { fetchPrivacies, privacyState } from "../features/privacy/privacySlice";
import IncAndDecBtn from "../components/room/components/IncAndDecBtn";
import { amenityState, fetchAmenities } from "../features/amenity/amenitySlice";
const steps = [
    "Category + Privacy + Basic info + Amenities",
    "Location",
    "Images",
    "Name + Description + Price",
    "Preview",
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

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [category, setCategory] = useState(0);
    const [privacyType, setPrivacyType] = useState(0);
    const [amenities, setAmenities] = useState([]);
    const [info, setInfo] = useState({
        bedroomCount: 0,
        bathroomCount: 0,
        accomodatesCount: 0,
        bedCount: 0,
    });
    const [values, setValues] = useState({
        latitude: 0,
        longitude: 0,
        country: 0,
        state: "",
        city: "",
        street: "",
        currency: 0,
        name: "",
        description: "",
        price: 0,
        images: [],
    });
    const [myErrors, setMyErrors] = useState({
        phoneNumber: "",
        birthday: "",
        email: "",
    });

    const {
        addUserAction: { successMessage, errorMessage },
    } = useSelector(userState);

    const {
        listing: { categories, loading },
    } = useSelector(categoryState);

    const {
        listing: { amenities: amenitiesLst },
    } = useSelector(amenityState);

    const {
        listing: { privacies },
    } = useSelector(privacyState);

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

    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());

    const isStepOptional = step => {
        return step === 1;
    };

    const isStepSkipped = step => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        if (activeStep === 0) {
            console.log($("#guestNumber").text());
            setInfo({
                bedroomCount: parseInt($("#bedNumber").text()),
                bathroomCount: parseInt($("#bathRoomNumber").text()),
                accomodatesCount: parseInt($("#guestNumber").text()),
                bedCount: parseInt($("#bedRoomNumber").text()),
            });
        }

        setActiveStep(prevActiveStep => prevActiveStep + 1);
        setSkipped(newSkipped);
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
        }
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (activeStep === 0) {
            dispatch(fetchPrivacies());
            dispatch(fetchCategories());
            dispatch(fetchAmenities());
        }
    }, [activeStep]);

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
                                if (isStepSkipped(index)) {
                                    stepProps.completed = false;
                                }
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
                                                        <FormControl fullWidth>
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
                                                        <FormControl fullWidth>
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
                                                        <FormControl fullWidth>
                                                            <InputLabel>Amenities</InputLabel>
                                                            <Select
                                                                name='amenities'
                                                                value={amenities}
                                                                multiple
                                                                onChange={handleChange}
                                                                input={
                                                                    <OutlinedInput label='Amenities' />
                                                                }
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
                                        />
                                    </Box>
                                )}

                                {activeStep === 2 && (
                                    <div className='flex justify-center'>
                                        <AddRoomImages values={values} setValues={setValues} />
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
                                            <div className='flex-1 w-50 mb-10'>
                                                <PropertyTitleMainContent
                                                    values={values}
                                                    setValues={setValues}
                                                />
                                            </div>
                                            <div className='flex-1 w-50'>
                                                <PropertyDescriptionMainContent
                                                    values={values}
                                                    setValues={setValues}
                                                />
                                            </div>
                                            <div>
                                                <PropertyPriceMainContent
                                                    values={values}
                                                    setValues={setValues}
                                                />
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
                                        label={activeStep === steps.length - 1 ? "Finish" : "Next"}
                                        onClick={handleNext}
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
