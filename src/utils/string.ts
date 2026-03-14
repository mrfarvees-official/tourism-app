export const capitalizeWord = (value: string) => {
    return value.replace(/(^|[-_])([a-z])/g, (_, sep, char) => {
        return sep + char.toUpperCase();
    });
};

export const isJoinedWord = (value: string) => {
    return /^[A-Za-z0-9_-]*$/.test(value);
}