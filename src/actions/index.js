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

export const getEcomPvzFromFileAction = (pvz) => {
    return {
        type: "GET_ECOM_FROM_FILE",
        data: pvz
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

export const loadCompany = (company) => {
    return {
        type: "LOAD_COMPANY",
        data: company
    }
}

export const loadUsluga = (usluga) => {
    return {
        type: "LOAD_USLUGA",
        data: usluga
    }
}

export const setParams = (params) => {
    return {
        type: "SET_PARAMS",
        data: params
    }
}

export const setServices = (services) => {
    return {
        type: "SET_SERVICES",
        data: services
    }
}

export const setDirectionIndexFrom = (index) => {
    return {
        type: "SET_DIRECTION_INDEX_FROM",
        data: index
    }
}

export const setDirectionIndexTo = (index) => {
    return {
        type: "SET_DIRECTION_INDEX_TO",
        data: index
    }
}