/**
 * This module provides utility functions for psychological pricing strategies,
 * tailored for German and Austrian customers using Euro prices.
 *
 * Usage:
 * import { roundToPsychologicalPrice, formatPrice } from './priceUtils';
 *
 * const originalPrice = 99,50;
 * const roundedPrice = roundToPsychologicalPrice(originalPrice, 'charm');
 * const formattedPrice = formatPrice(roundedPrice);
 *
 * Available strategies:
 * - 'charm': Uses charm pricing (e.g., 9,99 instead of 10)
 * - 'prestige': Rounds up to create a perception of quality
 * - 'bundle': Creates prices that appear as part of a bundle or package
 * - 'precise': Uses precise, "odd" numbers to suggest exact calculation
 */

/**
 * Rounds a price to a psychologically useful value.
 * 
 * @param {number} price - The original price to be rounded.
 * @param {string} [strategy='charm'] - The rounding strategy to use.
 *   Possible values: 'charm', 'prestige', 'bundle', 'precise'
 * @returns {number} The rounded price.
 */
export function roundToPsychologicalPrice(price, strategy = 'charm') {
    if (typeof price !== 'number' || isNaN(price)) {
        throw new Error('Invalid price: must be a number');
    }

    const wholePart = Math.floor(price);

    switch (strategy) {
        case 'charm':
            if (price < 10) return Math.floor(price) + 0.99;
            if (price < 100) return Math.floor(price / 10) * 10 + 9.99;
            return Math.floor(price / 100) * 100 + 99;

        case 'prestige':
            if (price < 100) return Math.ceil(price / 10) * 10;
            return Math.ceil(price / 100) * 100;

        case 'bundle':
            return Math.round(price / 5) * 5;

        case 'precise':
            return Number(price.toFixed(2));

        default:
            throw new Error('Invalid strategy: must be "charm", "prestige", "bundle", or "precise"');
    }
}

/**
 * Formats a price as a string with two decimal places and the specified currency symbol.
 * 
 * @param {number} price - The price to format.
 * @param {string} [currencySymbol='€'] - The currency symbol to use.
 * @returns {string} The formatted price string.
 */
export function formatPrice(price, currencySymbol = '€') {
    return `${currencySymbol} ${price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
