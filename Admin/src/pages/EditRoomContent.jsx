import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { fetchRules, ruleState } from "../features/rule/ruleSlice";
import IncAndDecBtn from "../components/room/components/IncAndDecBtn";
import { amenityState, fetchAmenities } from "../features/amenity/amenitySlice";
import { roomState, updateRoom } from "../features/room/roomSlice";
import { useNavigate } from "react-router-dom";
import Toast from "../components/notify/Toast";

const steps = ["Information", "Location", "Images"];

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const EditRoomContent = ({ room }) => {
    const theme = useTheme();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        categoryId,
        bedroom,
        bathroom,
        accomodates,
        bed,
        privacyId,
        amenities: rAmenities,
        longitude: rLongitude,
        latitude: rLatitude,
        description: rDescription,
        name: rName,
        price: rPrice,
        images,
        rules: rRules,
        thumbnail,
        address,
        state,
        country,
        cityId,
    } = room;

    const amenitiesIds = rAmenities.map(({ id }) => id);
    const rulesIds = rRules.map(({ id }) => id);

    let fullImages = images.map(el => el);
    fullImages.unshift(room.thumbnail);

    useEffect(() => {
        if (fullImages && fullImages.length) {
            const rroom = {
                roomImages: fullImages.map(image => image.split("/").pop()),
                host: user.email,
                roomId: room.id,
            };

            localStorage.removeItem("roomAdmin");
            localStorage.setItem("roomAdmin", JSON.stringify(rroom));
        }
    }, []);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [latitude, setUserLat] = useState(rLatitude);
    const [longitude, setUserLng] = useState(rLongitude);
    const [category, setCategory] = useState(categoryId);
    const [privacyType, setPrivacyType] = useState(privacyId);
    const [amenities, setAmenities] = useState(amenitiesIds);
    const [rules, setRules] = useState(rulesIds);
    const [name, setName] = useState(rName);
    const [description, setDescription] = useState(rDescription);
    const [price, setPrice] = useState(rPrice);

    const [info, setInfo] = useState({
        bedroomCount: bedroom,
        bathroomCount: bathroom,
        accomodatesCount: accomodates,
        bedCount: bed,
    });

    const [values, setValues] = useState({
        country: country || 216,
        state: state || 0,
        city: cityId || 0,
        street: address.street || "",
    });

    const {
        updateRoomAction: { successMessage: uraSuccessMessage },
    } = useSelector(roomState);

    useEffect(() => {
        if (uraSuccessMessage) {
            callToast("success", uraSuccessMessage);
        }
    }, [uraSuccessMessage]);

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
        listing: { privacies },
    } = useSelector(privacyState);

    const {
        listing: { rules: rulesArray },
    } = useSelector(ruleState);

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
            dispatch(fetchRules());
        }
    }, [activeStep]);

    const handleUpdate = () => {
        const formData = new FormData();

        let roomEntity = {};

        if (activeStep === 0) {
            roomEntity = {
                activeStep: 0,
                name,
                amenities,
                bedroomCount: parseInt($("#bedNumber").text()),
                bathroomCount: parseInt($("#bathRoomNumber").text()),
                guestCount: parseInt($("#guestNumber").text()),
                bedCount: parseInt($("#bedRoomNumber").text()),
                category,
                description,
                price: parseInt(price),
                privacy: privacyType,
                rules,
            };
        }
        if (activeStep === 1) {
            const { country, state, city, street } = values;

            if (!street) {
                callToast("error", "Street is required");
            }

            if (values.city === 0) {
                callToast("error", "City is required");
            }

            if (values.state === 0) {
                callToast("error", "State is required");
            }

            if (values.country === 0) {
                callToast("error", "Country is required");
            }

            roomEntity = {
                activeStep: 1,
                country,
                state,
                city,
                street,
                latitude,
                longitude,
            };
        }
        if (activeStep === 2) {
            const { roomImages, thumbnail: lcsThumbnail } = JSON.parse(
                localStorage.getItem("roomAdmin")
            );

            roomEntity = {
                activeStep: 2,
                images: roomImages,
                thumbnail: lcsThumbnail,
            };
        }
        //
        console.log(roomEntity);
        for (let key in roomEntity) {
            formData.append(key, roomEntity[key]);
        }
        dispatch(updateRoom({ formData, roomId: room.id }));
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
                                    <div className='flex items-center'>
                                        <div className='px-20 flex-1'>
                                            <Box
                                                component='div'
                                                sx={{
                                                    p: 2,
                                                    border: "1px dashed grey",
                                                    background: "#fff",
                                                    height: "600px",
                                                    borderRadius: "8px",
                                                }}
                                                className='w-full flex items-start justify-evenly'
                                            >
                                                <div className='flex-1 w-48 p-10'>
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
                                                </div>
                                                <div className='flex-1 w-48 p-10'>
                                                    <div className='col-flex items-center justify-center h-full w-full'>
                                                        <div className='flex-1 w-full mb-10'>
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
                                                        <div className='flex-1 w-full mb-10'>
                                                            <Typography>Description</Typography>
                                                            <FormControl fullWidth>
                                                                <TextareaAutosize
                                                                    minRows={3}
                                                                    value={description}
                                                                    onChange={e => {
                                                                        setDescription(
                                                                            e.target.value
                                                                        );
                                                                    }}
                                                                />
                                                            </FormControl>
                                                        </div>
                                                        <div className='flex-1 w-full mb-10'>
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
                                                            <div className='my-5'>
                                                                <FormControl fullWidth required>
                                                                    <InputLabel>Rules</InputLabel>
                                                                    <Select
                                                                        name='rules'
                                                                        value={rules}
                                                                        multiple
                                                                        onChange={handleChange}
                                                                    >
                                                                        {rulesArray.map(rule => (
                                                                            <MenuItem
                                                                                value={rule.id}
                                                                                key={rule.id}
                                                                                style={getStyles(
                                                                                    rule.title,
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
                                            setLatitude={setUserLat}
                                            setLongitude={setUserLng}
                                            latitude={latitude}
                                            longitude={longitude}
                                        />
                                    </Box>
                                )}

                                {activeStep === 2 && (
                                    <div className='flex justify-center'>
                                        <AddRoomImages />
                                    </div>
                                )}

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        pt: 2,
                                        padding: "0 20px",
                                        marginTop: "20px",
                                    }}
                                    className={"justify-between"}
                                >
                                    <MyButton
                                        class
                                        type='back'
                                        label='Back'
                                        onClick={handleBack}
                                        disabled={activeStep === 0}
                                    />

                                    <div className={"flex items-center"}>
                                        <div className={activeStep !== 2 ? "mr-5" : ""}>
                                            <MyButton
                                                type='update'
                                                onClick={handleUpdate}
                                                id='updateButton'
                                                label='Room'
                                            />
                                        </div>
                                        {activeStep !== 2 && (
                                            <MyButton
                                                type='next'
                                                label={
                                                    activeStep === steps.length - 1
                                                        ? "Done"
                                                        : "Next"
                                                }
                                                onClick={handleNext}
                                                id='nextButton'
                                            />
                                        )}
                                    </div>
                                </Box>
                            </React.Fragment>
                        )}
                    </Box>
                </div>
            </div>
            <Toast />
        </>
    );
};

export default EditRoomContent;
