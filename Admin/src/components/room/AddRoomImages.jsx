import { useEffect, useState } from "react";
import { Image } from "../../globalStyle";
import { callToast, getImage } from "../../helpers";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { addEmptyImage } from "./script/manage_photos";
import { userState } from "../../features/user/userSlice";
import "./css/room_images_main_content.css";
import $ from "jquery";
import { useParams } from "react-router-dom";

let photos = [];

const AddRoomImages = () => {
    const { user } = useSelector(userState);
    const [loading, setLoading] = useState(true);

    const { roomid } = useParams();

    useEffect(() => {
        const uploadPhotos = $("#uploadPhotos");
        $("#triggerUploadPhotosInput").on("click", function (e) {
            e.preventDefault();
            uploadPhotos.trigger("click");
        });

        uploadPhotos.on("change", function () {
            readURL(this.files, uploadPhotos);
        });

        restoreRoomImages(uploadPhotos);
    }, []);

    async function restoreRoomImages(uploadPhotos) {
        if (localStorage.getItem("roomAdmin")) {
            const { roomImages, host, roomId } = JSON.parse(localStorage.getItem("roomAdmin"));

            if (roomImages) {
                const formData = new FormData();
                formData.set("host", host);
                if (roomId) {
                    formData.set("roomId", roomId);
                }
                roomImages.forEach(image => formData.append("roomImages", image));

                const data = await axios.post(`/become-a-host/get-upload-photos`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                const filesArr = data.roomImages.map(e => {
                    var array = new Uint8Array(e.bytes);
                    const blob = new Blob([array], { type: "image/jpeg" });
                    return new File([blob], e.name, {
                        type: `image/jpeg`,
                    });
                });

                readURL(filesArr, uploadPhotos, true);
            }
        }
    }

    function previewImage(file, parent, thumbnail = false, modifier) {
        const defer = $.Deferred();
        const fileReader = new FileReader();
        const photoAction = $(`
        <div class="photoAction">
            <button class="photo-action__btn" data-index="${modifier}">
                <span>
                    <img src="${getImage(
                        "/amentity_images/threedot.svg"
                    )}" width="16px" height="16px"/>
                </span>
            </button>
            <div class="photo-action__div-hidden">
                <ul data-index="${modifier}" data-name="${file.name}">
                    <li class="makeMainImage">Make thumbnail</li>
                    <li class="deleteImage">Delete</li>
                </ul>
            </div>
        </div>
    `);

        fileReader.onload = function (e) {
            if (!thumbnail) {
                const div = $(`
                <div class="photo-cover">
                    <img class="photo" src="${e.target.result}" data-index="${modifier}" data-name="${file.name}"/>
                </div>
                `);

                div.append(photoAction);
                parent.append(div);
            } else {
                const image = $(
                    `<img class="photo" src="${e.target.result}" data-index="${modifier}" data-name="${file.name}"/>`
                );
                parent.append(image);
                parent.append(photoAction);
            }
        };

        fileReader.onloadend = function () {
            $(".photo-action__btn").each(function () {
                $(this)
                    .off("click")
                    .on("click", function () {
                        displayAction($(this));
                    });
            });

            $(".makeMainImage").each(function () {
                $(this)
                    .off("click")
                    .on("click", function () {
                        makeMainImage(parseInt($(this).parent("ul").data("index")));
                    });
            });

            $(".deleteImage").each(function () {
                $(this)
                    .off("click")
                    .on("click", function () {
                        deleteImage(
                            parseInt($(this).parent("ul").data("index")),
                            $(this).parent("ul").data("name")
                        );
                    });
            });

            defer.resolve();
        };

        fileReader.readAsDataURL(file);
        return defer.promise();
    }

    function doPreviewImage(files, subImagesContainer) {
        //first image for thumbnail
        setLoading(true);
        const defer = $.Deferred();

        var promise = previewImage(files[0], $("#thumbnailPhotos"), true, 0);
        promise.done(function () {
            photos.push(files[0]);

            if (photos.length === files.length) {
                defer.resolve();
                setLoading(false);
            }

            for (let i = 1; i < files.length; i++) {
                const promise = previewImage(files[i], subImagesContainer, false, i);
                promise.done(function () {
                    photos.push(files[i]);
                    if (photos.length === files.length) {
                        defer.resolve();
                        setLoading(false);
                    }
                });
            }
        });

        //the rest of images
        return defer.promise();
    }

    function doPreviewImageSecondTime(files, subImagesContainer, callFromRestoreImage) {
        const defer = $.Deferred();
        let count = 0;
        setLoading(true);

        var promise = previewImage(files[0], subImagesContainer, false, photos.length);

        promise.done(function () {
            photos.push(files[0]);
            count++;

            if (count === files.length) {
                defer.resolve();
                setLoading(false);
            } else {
                let lastIndex = photos.length;

                for (let i = 1; i < files.length; i++) {
                    const promise = previewImage(files[i], subImagesContainer, false, lastIndex++);

                    promise.done(function () {
                        photos.push(files[i]);
                        count++;
                        if (count === files.length) {
                            defer.resolve();
                            setLoading(false);
                        }
                    });
                }
            }
        });

        return defer.promise();
    }

    function readURL(files, uploadPhotos, callFromRestoreImage = false) {
        const subImagesContainer = $("#subImages");

        if (photos.length === 0) {
            if (files.length > 0) {
                $(".photosContainer").addClass("active");
                $(".drag_n_drop_zone").addClass("disabled");

                if (files.length === 5) $("#addAtLeast5Images").text("Done! How do you feel?");

                var promise = doPreviewImage(files, subImagesContainer, callFromRestoreImage);
                promise.done(function () {
                    addEmptyImage(files, uploadPhotos, subImagesContainer);
                });
            }
        } else {
            const singleImageContainer = $(".singleImageContainer");
            singleImageContainer.remove();

            if (photos.length === 5) $("#addAtLeast5Images").text("Done! How do you feel?");

            var promise = doPreviewImageSecondTime(files, subImagesContainer, callFromRestoreImage);
            promise.done(function () {
                addEmptyImage(photos, uploadPhotos, subImagesContainer);
            });
        }
    }

    function displayAction(self) {
        const sibling = self.siblings(".photo-action__div-hidden");

        if (sibling.hasClass("active")) sibling.removeClass("active");
        else sibling.addClass("active");
    }

    function changePreviewImage(swapIndex) {
        let firstSrc = "",
            firstImageName = "";
        let secondSrc = "",
            secondImageName = "";

        $("img.photo").each(function (index) {
            if (index === 0) {
                firstSrc = $(this).attr("src");
                firstImageName = $(this).data("name");
            }

            if (index === swapIndex) {
                secondSrc = $(this).attr("src");
                secondImageName = $(this).data("name");
            }
        });

        $("img.photo").each(function (index) {
            if (index === 0) {
                $(this).attr("src", secondSrc);
                $(this).data("name", secondImageName);
            }

            if (index === swapIndex) {
                $(this).attr("src", firstSrc);
                $(this).data("name", firstImageName);
            }
        });
    }

    function changePreviewImage2(firstImageIndex, secondImageIndex) {
        let firstSrc = "",
            firstImageName = "";
        let secondSrc = "",
            secondImageName = "";

        $("img.photo").each(function (index) {
            if (index === firstImageIndex) {
                firstSrc = $(this).attr("src");
                firstImageName = $(this).data("name");
            }

            if (index === secondImageIndex) {
                secondSrc = $(this).attr("src");
                secondImageName = $(this).data("name");
            }
        });

        $("img.photo").each(function (index) {
            if (index === firstImageIndex) {
                $(this).attr("src", secondSrc);
                $(this).data("name", secondImageName);
            }

            if (index === secondImageIndex) {
                $(this).attr("src", firstSrc);
                $(this).data("name", firstImageName);
            }
        });
    }

    function closeAction(index) {
        const _self = $(`button[data-index="${index}"]`);

        const sibling = _self.siblings(".photo-action__div-hidden");
        if (sibling.hasClass("active")) sibling.removeClass("active");
    }

    function swapPosition(firstEl, secondEl) {
        const temp = photos[firstEl];
        console.log(temp);

        photos[firstEl] = photos[secondEl];

        console.log(photos[firstEl]);

        photos[secondEl] = temp;
    }

    function makeMainImage(index) {
        swapPosition(0, index);
        changePreviewImage(index);
        closeAction(index);
    }

    function deleteImage(index, imageName) {
        if (photos.length === 1) {
            // if just one image left
            photos = [];
            $("#thumbnailPhotos").children(".photo").remove();
            $(".photosContainer").removeClass("active");
            $(".drag_n_drop_zone").removeClass("disabled");
            $("#subImages").empty();
        }

        if (localStorage.getItem("room")) {
            const room = JSON.parse(localStorage.getItem("room"));
            if (room.roomImages && room.roomImages.length) {
                room.roomImages = room.roomImages.filter(image => image !== imageName);
            }

            localStorage.setItem("room", JSON.stringify(room));
        }

        for (let i = index; i < photos.length; i++) {
            changePreviewImage2(i, i + 1);
        }

        photos = photos.filter(image => image.name !== imageName);

        // // Remove preview image
        const lastElement = $("#subImages").children(".photo-cover").last();
        lastElement.remove();

        const subImagesContainer = $("#subImages");
        const uploadPhotos = $("#uploadPhotos");
        let b = 0;
        if (photos.length < 4) {
            $(".singleImageContainer.containerOfImageIcon").length > 2
                ? (b = 1)
                : addEmptyImage(photos, uploadPhotos, subImagesContainer);
        }

        closeAction(index);
    }

    async function uploadImagesToFolder() {
        if ($("img.photo").length === 0) {
            callToast("warning", "Please choose at least 1 image");
            return;
        }

        const formData = new FormData();
        formData.set("host", user.email);
        if (roomid) {
            formData.set("roomId", roomid);
        }
        photos.forEach(photo => formData.append("photos", photo));

        const data = await axios.post(`/become-a-host/upload-room-photos`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if (data.status === "success") {
            callToast("success", "Upload successfully");
            const username2 = data.username;
            let room = {};
            if (!localStorage.getItem("roomAdmin")) {
                room = {
                    roomImages: photos.map(({ name }) => name),
                    thumbnail: photos[0].name,
                    host: username2,
                };
            } else {
                room = JSON.parse(localStorage.getItem("roomAdmin"));
                room = {
                    ...room,
                    roomImages: photos.map(({ name }) => name),
                    thumbnail: photos[0].name,
                    host: username2,
                };
            }
            localStorage.setItem("roomAdmin", JSON.stringify(room));
        }
    }

    function dropHandler(e) {
        e.stopPropagation();
        e.preventDefault();

        // FileList object.
        var files = e.dataTransfer.files;
        const uploadPhotos = $("#uploadPhotos");
        readURL(files, uploadPhotos);
    }

    function dragoverHandler(e) {
        e.stopPropagation();
        e.preventDefault();
        // Explicitly show this is a copy.
        e.dataTransfer.dropEffect = "copy";
    }

    useEffect(() => {
        if (!loading && photos.length) {
            $("img.photo").each(function (index) {
                $(this).attr("data-index", index);
                $(this)
                    .siblings("div.photoAction")
                    .children("button.photo-action__btn")
                    .attr("data-index", index);
                $(this)
                    .siblings("div.photoAction")
                    .children("div.photo-action__div-hidden")
                    .children("ul")
                    .attr("data-index", index);
            });

            $("img.photo").each(function (index) {
                if (photos[index].name !== $(this).data("name")) {
                    const swapedIndex = photos.findIndex(
                        photo => photo.name === $(this).data("name")
                    );
                    let temp = photos[index];
                    photos[index] = photos[swapedIndex];
                    photos[swapedIndex] = temp;
                }
            });
        }
    }, [loading]);

    return (
        <>
            <div
                className='drag_n_drop_zone'
                onDragOverCapture={e => dragoverHandler(e)}
                onDrop={e => dropHandler(e)}
            >
                <div>
                    <Image src={getImage("/amentity_images/photos.svg")} size='64px' />
                </div>
                <div className='photos__drag-title'>Drag your images</div>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button className='photos__btn__load-images' id='triggerUploadPhotosInput'>
                        Upload from your device
                    </button>
                    <input
                        type='file'
                        name='room_photos'
                        id='uploadPhotos'
                        accept='images/*'
                        hidden
                        multiple
                    />
                </div>
            </div>
            <div id='editor' className='photosContainer'>
                <div className='flex-space'>
                    <div>
                        <div
                            style={{
                                fontSize: "22px",
                                color: "#222",
                                fontWeight: "500",
                                lineHeight: "16px",
                            }}
                            id='addAtLeast5Images'
                        >
                            Choose at least 5 pictures
                        </div>
                        <div
                            style={{
                                color: "rgb(113, 113, 113)",
                                paddingTop: "4px",
                                fontWeight: "400",
                            }}
                        >
                            {/* Drag to arrange */}
                        </div>
                    </div>
                    <div>
                        <button className='upload__btn' onClick={uploadImagesToFolder}>
                            <Image src={getImage("/amentity_images/upload.svg")} size='22px' />
                            <span>Upload</span>
                        </button>
                    </div>
                </div>
                <div id='photosContainer__body'>
                    <div id='thumbnailPhotos'>
                        <div className='thumbnail-title'>Thumbnail</div>
                    </div>
                    <div id='subImages'></div>
                </div>
            </div>
            <ToastContainer
                position='top-right'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
};

export default AddRoomImages;
