import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ManageYSContainer } from ".";
import { IRoomDetails } from "../../types/room/type_RoomDetails";
import BoxFooter from "./BoxFooter";
import DisplayEditUI from "./components/DisplayEditUI";
import HideEditBox from "./components/HideEditBox";
import axios from "axios";

import { hideEditBox } from "../../pages/script/manage_your_space";

import $ from "jquery";
import { fetchStatesByCountry } from "../../features/address/stateSlice";
import { fetchCitiesByState } from "../../features/address/citySlice";
import { RootState } from "../../store";

interface IEditLocationProps {
    room: IRoomDetails;
}

const EditLocation: FC<IEditLocationProps> = ({ room }) => {
    const dispatch = useDispatch();
    const { states } = useSelector((state: RootState) => state.state);
    const { cities } = useSelector((state: RootState) => state.city);

    const {
        address: { city, street },
        state,
    } = room;

    const [streetChange, setStreet] = useState(street);
    const [cityChange, setCity] = useState(city.id || 0);
    const [stateChange, setState] = useState(state || 0);

    useEffect(() => {
        dispatch(fetchStatesByCountry({ countryId: 216 }));
    }, []);

    useEffect(() => {
        if (state) {
            dispatch(fetchCitiesByState({ stateId: state }));
        }
    }, []);

    useEffect(() => {
        if (stateChange) {
            dispatch(fetchCitiesByState({ stateId: stateChange }));
        }
    }, [stateChange]);

    return (
        <ManageYSContainer id='roomLocation'>
            <div id='manage-ys__location-control-view'>
                <h3 className='manage--ys__section--title'>Vị trí</h3>
                <div>
                    <div className='flex-space'>
                        <div>
                            <div className='manage-ys__section-content-title'>Địa chỉ</div>
                            <div className='manage-ys__section-content-info'>{room?.location}</div>
                        </div>
                        <div>
                            <DisplayEditUI sectionKey='location' />
                        </div>
                    </div>
                </div>
            </div>
            <div id='manage-ys__location-control-container'>
                <div className='manage-ys__location-control-content'>
                    <div className='flex-space'>
                        <div className='manage-ys__header-edit-main-title'>Địa chỉ</div>
                        <HideEditBox sectionKey='location' hideEditBox={hideEditBox} />
                    </div>
                    <div style={{ maxWidth: "584px" }}>
                        <div>
                            <div>Đường/phố</div>
                            <div>
                                <input
                                    type='text'
                                    value={streetChange}
                                    className='manage-ys__input'
                                    id='manage-ys__location-street'
                                    onChange={(e: any) => {
                                        setStreet(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className='grid-2'>
                                <div className='col-flex'>
                                    <div>Thành phố</div>
                                    <select
                                        id='manage-ys__location-city'
                                        className='manage-ys__input'
                                        value={cityChange}
                                        onChange={(e: any) => {
                                            setCity(e.target.value);
                                        }}
                                    >
                                        {cities.map(city => (
                                            <option key={city.id} value={city.id}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <div>Tỉnh</div>
                                    <select
                                        id='manage-ys__location-state'
                                        className='manage-ys__input'
                                        value={stateChange}
                                        onChange={(e: any) => {
                                            setState(e.target.value);
                                        }}
                                    >
                                        {states.map(state => (
                                            <option key={state.id} value={state.id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <BoxFooter sectionKey='location' idInput='' hideEditBox={hideEditBox} />
            </div>
        </ManageYSContainer>
    );
};

export default EditLocation;
