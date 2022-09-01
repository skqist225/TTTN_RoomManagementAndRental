import { FC, useEffect } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchCitiesByState } from "../../../features/address/citySlice";
import { fetchStatesByCountry } from "../../../features/address/stateSlice";
import { fetchCountries } from "../../../features/country/countrySlice";
import { RootState } from "../../../store";
import { IAddress } from "../../../types/user/type_User";
import { DropDown, FormGroup } from "../../utils";
import { IOption } from "../../utils/DropDown";
import $ from "jquery";

interface IAddressEditProps {
    register: UseFormRegister<FieldValues>;
    address: IAddress;
    countryDefaultValue: number;
    stateDefaultValue: number;
    cityDefaultValue: number;
}

const AddressEdit: FC<IAddressEditProps> = ({
    register,
    address,
    stateDefaultValue,
    cityDefaultValue,
}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchStatesByCountry({ countryId: 216 }));
    }, []);

    useEffect(() => {
        dispatch(fetchCitiesByState({ stateId: 120 }));
    }, [stateDefaultValue]);

    const { states, loading: stateLoading } = useSelector((state: RootState) => state.state);
    const { cities } = useSelector((state: RootState) => state.city);

    const stateOptions: IOption[] = states.map(state => ({
        value: state.id.toString(),
        displayText: state.name,
    }));

    const cityOptions: IOption[] = cities.map(city => ({
        value: city.id.toString(),
        displayText: city.name,
    }));

    useEffect(() => {
        if (!stateLoading) {
            $("#stateSelect")
                .off("change")
                .on("change", function () {
                    const stateId = parseInt($(this).children("option:selected").val() as string);

                    dispatch(fetchCitiesByState({ stateId }));
                });
        }
    }, [stateLoading]);

    return (
        <div>
            {address.country && (
                <input type='hidden' value={address.country.name} id='userCountryName' />
            )}
            {address.state && <input type='hidden' value={address.state.name} id='userStateName' />}

            <div>
                <DropDown
                    register={register}
                    id='stateSelect'
                    fieldName='state'
                    label='Tỉnh/thành phố'
                    options={stateOptions}
                    defaultValue={stateDefaultValue.toString()}
                />
                <div id='stateNameDivCode'></div>
            </div>
            <div>
                <DropDown
                    register={register}
                    id='citySelect'
                    fieldName='city'
                    label='Quận/huyện'
                    options={cityOptions}
                    defaultValue={cityDefaultValue.toString()}
                />
                <div id='cityNameDivCode'></div>
            </div>
            <FormGroup
                fieldName='aprtNoAndStreet'
                register={register}
                label='Địa chỉ đường/phố'
                type='text'
                value={address.aprtNoAndStreet}
            />
        </div>
    );
};

export default AddressEdit;
