const mongoose = require("mongoose"); 

const convertToObjectId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
    }
    return new mongoose.Types.ObjectId(id);
}

module.exports = { convertToObjectId }