import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CheckIcon from "@mui/icons-material/Check";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function MyButton(props) {
    let { type, label } = props;
    let buttonClassName = "",
        buttonDisableClassName = "";
    switch (type) {
        case "add": {
            label = `Add ${label}`;
            buttonClassName = "bg-indigo-500 hover:bg-indigo-600";
            break;
        }
        case "delete": {
            // label = `Delete ${label}`;
            buttonClassName = "bg-rose-500 hover:bg-rose-500";
            buttonDisableClassName = "bg-rose-200 hover:bg-rose-200";
            console.log(props.disabled);
            break;
        }
        case "deny": {
            // label = `Delete ${label}`;
            buttonClassName = "bg-rose-500 hover:bg-rose-500";
            break;
        }
        case "edit": {
            // label = `Add ${label}`;
            buttonClassName = "bg-blue-500 hover:bg-blue-500";
            break;
        }
        case "view": {
            if (label === "Booking") {
                buttonClassName = "bg-blue-600 hover:bg-blue-600";
            } else {
                buttonClassName = "bg-green-500 hover:bg-green-500";
            }
            break;
        }
        case "approve": {
            // label = `Add ${label}`;
            buttonClassName = "bg-green-600 hover:bg-green-600";
            break;
        }
        case "next": {
            // label = `Add ${label}`;
            buttonClassName = "bg-blue-500 hover:bg-blue-500";
            break;
        }
        case "back": {
            buttonClassName = "bg-blue-500 hover:bg-blue-500";
            buttonDisableClassName = "bg-blue-200 hover:bg-blue-200";
        }
    }

    return (
        <button
            className={`btn ${buttonClassName} text-white ${
                props.disabled && buttonDisableClassName
            }`}
            {...props}
        >
            {type === "add" && (
                <svg className='w-4 h-4 fill-current opacity-50 shrink-0' viewBox='0 0 16 16'>
                    <path d='M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z' />
                </svg>
            )}
            {type === "delete" && <DeleteIcon />}
            {type === "edit" && <EditIcon />}
            {type === "view" && <VisibilityIcon />}
            {type === "add" && <span className='hidden xs:block ml-2'>{label}</span>}
            {type === "next" && (
                <>
                    {label}
                    <NavigateNextIcon />
                </>
            )}
            {type === "back" && (
                <>
                    <ArrowBackIcon />
                    {label}
                </>
            )}
            {type === "approve" && <CheckIcon />}
            {type === "deny" && <DoDisturbIcon />}
        </button>
    );
}

export default MyButton;
