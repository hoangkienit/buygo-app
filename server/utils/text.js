function splitString(str) {
    return str.split(' ');
}

function slugify(str) {
    return str
        .normalize("NFD") // Convert to decomposed form
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-"); // Replace spaces with hyphens
}

module.exports = {splitString, slugify}