const CryptoJS = require("crypto-js");

function splitString(str) {
    return str.split(' ');
}

function slugify(str) {
    const slug = str
        .normalize("NFD") // Convert to decomposed form
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
        .replace(/^-|-$/g, ""); // Replace spaces with hyphens
    
    const hash = CryptoJS.MD5(str).toString(CryptoJS.enc.Base64).slice(0, 6);

    return `${hash}-${slug}`;
}

module.exports = {splitString, slugify}