const buildingId = {
    in: ["params"],
    isMongoId: {
        errorMessage: " Building Id is invalid"
    },
    trim: true,
    exists: {
        errorMessage: "Building Id is Required"
    },
    notEmpty: "Building Id should not be empty"
}

const city = {
    in: ["body"],
    exists: {
        errorMessage: "City name  is required",
    },
    notEmpty: {
        errorMessage: "City Name Should not be empty"
    },
    trim: true,
    isIn: {
        options: [["Bangalore", "Mumbai", "Kolkata", "Delhi"]],
        errorMessage: "City should be one of the fallowing Bangalore, Mumbai, Kolkatta, Delhi "
    }
}
export { buildingId, city };