import { FC } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import FormError from "../../register/FormError";
import { UserEditError } from "./UserEditError";

interface IPasswordEditProps {
    register: UseFormRegister<FieldValues>;
    errorMessage?: any;
}

const PasswordEdit: FC<IPasswordEditProps> = ({ register, errorMessage }) => {
    let oldPasswordError = null,
        newPasswordError = null;

    const errors = JSON.parse(errorMessage);

    if (errors && errors.length > 0) {
        errors.forEach((error: any) => {
            if (error.oldPassword) {
                oldPasswordError = error.oldPassword;
            }
            if (error.newPassword) {
                newPasswordError = error.newPassword;
            }
        });
    }

    return (
        <div>
            <div className='form-group'>
                <label>Mật khẩu cũ</label>
                <input
                    type='password'
                    className='form-control'
                    id='oldPassword'
                    {...register("oldPassword")}
                    autoComplete='true'
                />
                <UserEditError id='oldPasswordError' />
            </div>
            {oldPasswordError && <FormError message={"Mật khẩu cũ không đúng"} />}
            <div className='form-group'>
                <label>Mật khẩu mới</label>
                <input
                    type='password'
                    className='form-control'
                    id='newPassword'
                    autoComplete='true'
                    {...register("newPassword")}
                />
                <UserEditError id='newPasswordError' />
            </div>
            {newPasswordError && <FormError message={"Mật khẩu mới phải ít nhất 8 ký tự"} />}
        </div>
    );
};

export default PasswordEdit;
