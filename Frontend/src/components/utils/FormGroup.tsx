import { FloatingLabel, Form } from "react-bootstrap";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { useDispatch } from "react-redux";
import { clearLAErrorMessage } from "../../features/auth/authSlice";

export interface IFormGroup {
    label: string;
    type: string;
    fieldName: string;
    placeholder?: string;
    value?: string;
    register: UseFormRegister<FieldValues>;
    fromPage?: string;
}

export default function FormGroup({
    label,
    type,
    fieldName,
    placeholder,
    register,
    value,
    fromPage = "login",
}: IFormGroup) {
    const dispatch = useDispatch();

    const doNothing = () => {};

    const resetErrorMessage = () => {
        dispatch(clearLAErrorMessage());
    };

    return (
        <FloatingLabel label={label} className='mb-3'>
            <Form.Control
                type={type}
                placeholder={placeholder}
                defaultValue={value}
                {...register(fieldName)}
                onKeyDown={fromPage === "login" ? resetErrorMessage : doNothing}
            />
        </FloatingLabel>
    );
}
