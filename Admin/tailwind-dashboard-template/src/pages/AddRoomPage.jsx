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
import { categoryState } from "../features/category/categorySlice";
import PropertyCategoryMainContent from "../components/room/components/PropertyCategoryMainContent";
import PropertyPrivacyMainContent from "../components/room/components/PropertyPrivacyMainContent";
import PropertyLocationMainContent from "../components/room/components/PropertyLocationMainContent";
import PropertyRoomInfoMainContent from "../components/room/components/PropertyRoomInfoMainContent";
import PropertyAmenitiesMainContent from "../components/room/components/PropertyAmenitiesMainContent";
import PropertyTitleMainContent from "../components/room/components/PropertyTitleMainContent";
import PropertyDescriptionMainContent from "../components/room/components/PropertyDescriptionMainContent";
import PropertyPriceMainContent from "../components/room/components/PropertyPriceMainContent";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MyButton from "../components/common/MyButton";
const steps = [
    "Category + Privacy",
    "Location",
    "Basic info",
    "Amenities",
    "Images",
    "Name + Description + Price",
    "Preview",
];

const AddRoomPage = () => {
    //     private int[] amentities;
    //     private int host;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [category, setCategory] = useState(0);
    const [values, setValues] = useState({
        privacyType: 0,
        latitude: 0,
        longitude: 0,
        country: 0,
        state: "",
        city: "",
        street: "",
        amenities: {
            prominentAmentity: null,
            favoriteAmentity: null,
            safeAmentity: null,
        },
        currency: 0,
        name: "",
        description: "",
        price: 0,
        bedroomCount: 0,
        bathroomCount: 0,
        accomodatesCount: 0,
        bedCount: 0,
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

        setActiveStep(prevActiveStep => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep(prevActiveStep => prevActiveStep + 1);
        setSkipped(prevSkipped => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleChange = event => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

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
                                    <div className='flex items-center justify-between   '>
                                        <div className='flex-1 w-45 px-20'>
                                            <div className='mb-3'>
                                                <Typography variant='h5' component='h2'>
                                                    Category
                                                </Typography>
                                            </div>
                                            <Box
                                                component='div'
                                                sx={{
                                                    p: 2,
                                                    border: "1px dashed grey",
                                                    background: "#fff",
                                                    height: "600px",
                                                    borderRadius: "8px",
                                                }}
                                                className='w-full flex items-center justify-center'
                                            >
                                                <PropertyCategoryMainContent
                                                    category={category}
                                                    setCategory={setCategory}
                                                    activeStep={activeStep}
                                                />
                                            </Box>
                                        </div>
                                        <div className='flex-1 w-45'>
                                            <div className='mb-3'>
                                                <Typography variant='h5' component='h2'>
                                                    Privacy
                                                </Typography>
                                            </div>

                                            <Box
                                                component='div'
                                                sx={{
                                                    p: 2,
                                                    border: "1px dashed grey",
                                                    background: "#fff",
                                                    height: "600px",
                                                    borderRadius: "8px",
                                                    maxWidth: "90%",
                                                }}
                                                className='w-full'
                                            >
                                                {" "}
                                                <PropertyPrivacyMainContent
                                                    values={values}
                                                    setValues={setValues}
                                                    activeStep={activeStep}
                                                />
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
                                    <Box
                                        component='div'
                                        sx={{
                                            p: 2,
                                            border: "1px dashed grey",
                                            background: "#fff",
                                            height: "600px",
                                            borderRadius: "8px",
                                        }}
                                        className='w-full flex items-center justify-center'
                                    >
                                        <PropertyRoomInfoMainContent
                                            values={values}
                                            setValues={setValues}
                                        />
                                    </Box>
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
                                        <PropertyAmenitiesMainContent
                                            values={values}
                                            setValues={setValues}
                                        />
                                    </Box>
                                )}
                                {activeStep === 4 && (
                                    <div className='flex justify-center'>
                                        <AddRoomImages values={values} setValues={setValues} />
                                    </div>
                                )}
                                {activeStep === 5 && (
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
                                    <Button
                                        color='inherit'
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        sx={{ mr: 1 }}
                                        variant='contained'
                                    >
                                        <ArrowBackIcon />
                                        Back
                                    </Button>
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
