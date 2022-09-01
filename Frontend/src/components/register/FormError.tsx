import { FC } from "react";

interface IFormErrorProps {
    message: string;
    removeTriangle?: boolean;
}

const FormError: FC<IFormErrorProps> = ({ message, removeTriangle = false }) => {
    console.log(message);

    return (
        <div className={removeTriangle ? "c-validation-remove-triangle" : "c-validation"}>
            <span style={{ color: "#fff" }}>{message}</span>
        </div>
    );
};

export default FormError;
