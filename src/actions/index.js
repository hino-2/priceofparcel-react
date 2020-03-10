export const layoutMobile = () => {
    return {
        type: "MOBILE"
    }
}

export const layoutDesktop = () => {
    return {
        type: "DESKTOP"
    }
}

export const showECOM = () => {
    return {
        type: "SHOW_ECOM"
    }
}

export const hideECOM = () => {
    return {
        type: "HIDE_ECOM"
    }
}

export const getEcomPvzFromFile = () => {
    return {
        type: "GET_ECOM_FROM_FILE"
    }
}

export const addPlacemark = (placemark) => {
    return {
        type: "ADD",
        data: placemark
    }
}

export const removePlacemark = (placemark) => {
    return {
        type: "REM",
        data: placemark
    }
}