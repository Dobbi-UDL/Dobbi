export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '$0.00';
    
    const absAmount = Math.abs(amount);
    let formattedAmount;
    
    if (absAmount >= 1000000000) {
        formattedAmount = `$${(amount / 1000000000).toFixed(2)}B`;
    } else if (absAmount >= 1000000) {
        formattedAmount = `$${(amount / 1000000).toFixed(2)}M`;
    } else if (absAmount >= 100000) {
        formattedAmount = `$${(amount / 1000).toFixed(2)}K`;
    } else {
        formattedAmount = amount.toLocaleString('en-US', { 
            style: 'currency', 
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
        });
    }
    
    return formattedAmount;
};

export const formatPercentage = (value, options = {}) => {
    // Default options
    const defaults = {
        decimals: 1,           // Number of decimal places
        showSign: false,       // Whether to show + for positive numbers
        showSymbol: true,      // Whether to show % symbol
        zeroDecimalsIfWhole: true, // Don't show decimals for whole numbers
        showZero: true        // How to display zero (true: '0%', false: '-')
    };

    // Merge provided options with defaults
    const config = { ...defaults, ...options };

    // Handle special cases
    if (value === undefined || value === null) {
        return config.showZero ? (config.showSymbol ? '0%' : '0') : '-';
    }
    if (isNaN(value)) return '-';
    if (!isFinite(value)) return value > 0 ? '∞' : '-∞';

    // Convert to number and handle zero case
    const num = Number(value);
    if (num === 0) {
        return config.showZero ? (config.showSymbol ? '0%' : '0') : '-';
    }

    // Format the number
    let formatted = num;
    
    // Handle decimals
    if (config.zeroDecimalsIfWhole && Number.isInteger(num)) {
        formatted = num.toFixed(0);
    } else {
        formatted = num.toFixed(config.decimals);
    }

    // Add sign if required
    if (config.showSign && num > 0) {
        formatted = '+' + formatted;
    }

    // Add symbol if required
    if (config.showSymbol) {
        formatted += '%';
    }

    return formatted;
};

export const formatCompactCurrency = (amount) => {
    if (amount === undefined || amount === null) return '$0';
    
    const absAmount = Math.abs(amount);
    
    if (absAmount >= 1000000000) {
        return `$${Math.round(amount / 1000000000)}B`;
    } else if (absAmount >= 1000000) {
        return `$${Math.round(amount / 1000000)}M`;
    } else if (absAmount >= 1000) {
        return `$${Math.round(amount / 1000)}K`;
    } else {
        return `$${Math.round(amount)}`;
    }
};