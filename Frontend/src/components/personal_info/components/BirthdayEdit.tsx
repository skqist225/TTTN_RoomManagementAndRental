import { FC } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import FormError from "../../register/FormError";
import { DropDown, FormGroup } from "../../utils";

interface IBirthdayEditProps {
    birthday: string;
    register: UseFormRegister<FieldValues>;
    errorMessage?: any;
}

const BirthdayEdit: FC<IBirthdayEditProps> = ({ birthday, register, errorMessage }) => {
    return (
        <div style={{ width: "100%" }}>
            <FormGroup
                label='Ngày sinh'
                fieldName='birthday'
                type='date'
                register={register}
                value={birthday}
            />
            {errorMessage === "Your age must be greater than 18" && (
                <FormError message={"Tuổi của bạn không lớn hơn 18"} />
            )}
        </div>
    );
};

export default BirthdayEdit;
