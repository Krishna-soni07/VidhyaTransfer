/**
 * Sanitize user data before storing in localStorage
 * Removes sensitive and unnecessary fields
 */
export const sanitizeUserData = (userData) => {
    if (!userData) return null;

    const {
        password,
        resetPasswordToken,
        resetPasswordExpires,
        phone,
        personalInfo,
        __v,
        createdAt,
        updatedAt,
        ...safeData
    } = userData;

    return safeData;
};

/**
 * Get sanitized user data from localStorage
 */
export const getSanitizedUserData = () => {
    try {
        const userInfoString = localStorage.getItem("userInfo");
        if (!userInfoString) return null;

        const userData = JSON.parse(userInfoString);
        return sanitizeUserData(userData);
    } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
    }
};

/**
 * Store sanitized user data in localStorage
 */
export const storeSanitizedUserData = (userData) => {
    const sanitized = sanitizeUserData(userData);
    if (sanitized) {
        localStorage.setItem("userInfo", JSON.stringify(sanitized));
    }
};
