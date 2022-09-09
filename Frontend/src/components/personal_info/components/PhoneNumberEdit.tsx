import { FC } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import FormError from "../../register/FormError";
import { UserEditError } from "./UserEditError";

interface IPhoneNumberEditProps {
    register: UseFormRegister<FieldValues>;
    defaultValue: string;
    errorMessage?: any;
}

const PhoneNumberEdit: FC<IPhoneNumberEditProps> = ({ register, defaultValue, errorMessage }) => {
    let phoneNumberError = null;

    const errors = JSON.parse(errorMessage);

    if (errors && errors.length > 0) {
        errors.forEach((error: any) => {
            if (error.phoneNumber) {
                phoneNumberError = error.phoneNumber;
            }
        });
    }

    return (
        <>
            <div className='input-group mb-3'>
                <div className='input-group-prepend'>
                    <span className='input-group-text' id='basic-addon1'>
                        +84
                    </span>
                </div>
                <input
                    type='text'
                    className='form-control'
                    placeholder='Số điện thoại'
                    {...register("phoneNumber")}
                    defaultValue={defaultValue}
                />
                <UserEditError id='phoneNumberError' />
            </div>
            {phoneNumberError === "Phone number has already been taken" && (
                <FormError message={"Số điện thoại đã được sử dụng"} />
            )}
            {phoneNumberError === "Phone number is not valid" && (
                <FormError message={"Số điện thoại phải là chữ số"} />
            )}
        </>
    );
};

export default PhoneNumberEdit;
