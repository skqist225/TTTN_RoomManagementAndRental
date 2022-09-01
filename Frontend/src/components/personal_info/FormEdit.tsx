import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
    FirstNameAndLastNameEdit,
    SexEdit,
    BirthdayEdit,
    PhoneNumberEdit,
    AvatarEdit,
    AddressEdit,
    PasswordEdit,
} from "./components";
import {
    checkBirthdayIsGreaterThenPresent,
    checkEmailDuplicated,
    checkFirstNameAndLastNameConstraint,
    checkPasswordConstraint,
    checkPhoneNumberConstraint,
} from "./script/check_constraints";

import { updateUserAvatar, updateUserInfo, userState } from "../../features/user/userSlice";
import { IUserUpdate } from "../../types/user/type_User";
import { callToast } from "../../helpers";

interface IFormEditProps {
    dataEdit: string;
}

export const FormEdit: FC<IFormEditProps> = ({ dataEdit }) => {
    const dispatch = useDispatch();

    const { handleSubmit, register } = useForm();
    const {
        user,
        update: { loading, successMessage, errorMessage },
    } = useSelector(userState);

    useEffect(() => {
        if (errorMessage === "UPDATE_USER_FAILURE") callToast("error", "Cập nhật thất bại");
    }, [errorMessage]);

    function updateInfo(updateInfo: IUserUpdate, field: string) {
        dispatch(updateUserInfo(updateInfo));
    }

    let newAvatar: File;
    function saveNewAvatar(newAvatarArgs: File) {
        newAvatar = newAvatarArgs;

        console.log(newAvatar);
    }

    const onSubmit = async (data: any) => {
        console.log("[dataEdit] : ", data);

        switch (dataEdit) {
            case "firstNameAndLastName": {
                const { firstName, lastName } = data;

                if (!firstName || !lastName) {
                    callToast("error", "Vui lòng nhập cả họ và tên");
                    return;
                }

                updateInfo(
                    {
                        updatedField: "firstNameAndLastName",
                        updateData: {
                            firstName,
                            lastName,
                        },
                    },
                    "họ và tên"
                );

                break;
            }
            case "sex": {
                const { sex } = data;
                updateInfo(
                    {
                        updatedField: "sex",
                        updateData: {
                            sex,
                        },
                    },
                    "giới tính"
                );
                break;
            }
            case "birthdayWeb": {
                if (!data.birthday) {
                    callToast("error", "Vui lòng chọn ngày sinh");
                    return;
                }

                updateInfo(
                    {
                        updatedField: "birthday",
                        updateData: {
                            birthday: data.birthday,
                        },
                    },
                    "ngày sinh"
                );

                break;
            }
            case "email": {
                const { email } = data;
                const status = await checkEmailDuplicated(email, user!.id);
                console.log(status);
                if (status === "OK")
                    updateInfo(
                        {
                            updatedField: "email",
                            updateData: {
                                email,
                            },
                        },
                        "email"
                    );
                break;
            }
            case "password": {
                const { oldPassword, newPassword } = data;

                const status = await checkPasswordConstraint(oldPassword, newPassword, user!.id);
                if (status === "OK")
                    updateInfo(
                        {
                            updatedField: "password",
                            updateData: {
                                newPassword,
                            },
                        },
                        "mật khẩu"
                    );

                break;
            }
            case "phoneNumber": {
                checkPhoneNumberConstraint(data.phoneNumber);
                break;
            }
            case "address": {
                break;
            }
            case "avatar": {
                if (newAvatar) {
                    const formData = new FormData();
                    formData.set("newAvatar", newAvatar);
                    dispatch(updateUserAvatar(formData));
                }
                break;
            }
        }
    };

    return (
        <>
            {user !== null && (
                <form onSubmit={handleSubmit(onSubmit)} className={"formEdit_" + dataEdit}>
                    <input type='hidden' value={user.id} name='id' />
                    <input type='hidden' name='updatedField' value={dataEdit} />
                    <div></div>
                    {dataEdit === "firstNameAndLastName" && (
                        <FirstNameAndLastNameEdit
                            firstName={user.firstName}
                            lastName={user.lastName}
                            register={register}
                        />
                    )}
                    {dataEdit === "sex" && <SexEdit register={register} defaultValue={user.sex} />}
                    {dataEdit === "birthdayWeb" && (
                        <BirthdayEdit
                            birthday={user.birthday}
                            register={register}
                            errorMessage={errorMessage}
                        />
                    )}
                    {dataEdit === "password" && <PasswordEdit register={register} />}
                    {dataEdit === "phoneNumber" && (
                        <PhoneNumberEdit register={register} defaultValue={user.phoneNumber} />
                    )}
                    {dataEdit === "address" && (
                        <AddressEdit
                            register={register}
                            address={user.addressDetails}
                            countryDefaultValue={
                                user.addressDetails.country ? user.addressDetails.country.id : 216
                            }
                            stateDefaultValue={
                                user.addressDetails.state ? user.addressDetails.state.id : 120
                            }
                            cityDefaultValue={
                                user.addressDetails.city ? user.addressDetails.city.id : 8618
                            }
                        />
                    )}
                    {dataEdit === "avatar" && <AvatarEdit saveNewAvatar={saveNewAvatar} />}
                    <button type='submit' className='saveEditBtn' data-edit={dataEdit}>
                        <span>Lưu</span>
                    </button>
                </form>
            )}
        </>
    );
};
