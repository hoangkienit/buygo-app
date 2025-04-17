const CryptoJS = require("crypto-js");
const vietnamese_offensive_words = require("../data/vietnamese_offensive_words");

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
    
    const hash = CryptoJS.MD5(str).toString(CryptoJS.enc.Hex).slice(0, 6);

    return `${hash}-${slug}`;
}

function containsBadWord(text) {
  const lowerText = text.toLowerCase();
  return vietnamese_offensive_words.some(word => {
    const pattern = new RegExp(`\\b${escapeRegex(word)}\\b`, 'i');
    return pattern.test(lowerText);
  });
}

function escapeRegex(word) {
  return word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getUserTextAfterCommand(ctx) {
  if (!ctx.message || !ctx.message.text) return '';
  
  const parts = ctx.message.text.trim().split(' ');
  return parts.slice(1).join(' ') || '';
}

module.exports = {splitString, slugify, containsBadWord, getUserTextAfterCommand}