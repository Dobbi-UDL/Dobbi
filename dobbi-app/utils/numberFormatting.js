export const formatNumberWithCommas = (number) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const truncateNumber = (number, maxLength = 9) => {
    const formattedNumber = formatNumberWithCommas(number.toFixed(2));
    return formattedNumber.length > maxLength ? `${formattedNumber.slice(0, maxLength)}...` : formattedNumber;
};

