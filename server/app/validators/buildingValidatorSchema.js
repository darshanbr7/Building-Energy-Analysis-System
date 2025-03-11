

const widthValidation = (side) => ({
    in: ["body"],
    exists: { 
        errorMessage: `${side} Width is required` 
    },
    notEmpty: { 
         errorMessage: `${side} Width should not be empty` 
    },
    isNumeric: { 
        options: { no_symbols: true }, 
        errorMessage: `${side} Width should be a number` 
    },
    isFloat: { 
        options: { min: 1 }, 
        errorMessage: `${side} Width must be greater than 0` 
    },
    trim: true,
});

const buildingValidatorSchema = {
    name: {
        in: ["body"],
        exists: {
            errorMessage: "Building name  is required",
        },
        notEmpty: {
            errorMessage: "Building Name Should not be empty"
        },
        trim: true
    },
    height: {
        in: ["body"],
        exists: {
            errorMessage: " Height  is required",
        },
        notEmpty: {
            errorMessage: " Height Should not be empty"
        },
        isNumeric: {
            options: {
                no_symbols: true, // using this property we can prevent + - to added to Pincode
            },
            errorMessage: " Height should be number"
        },
        isFloat: {
            options: {
                min: 1,
            },
            errorMessage: " Height must be greater than 0",
        },
        trim: true,

    },
    "dimensions.east.width": widthValidation('East'),
    "dimensions.west.width": widthValidation('West'),
    "dimensions.north.width": widthValidation('North'),
    "dimensions.south.width": widthValidation('South'),
    wwr: {
        in: ["body"],
        exists: {
            errorMessage: "Window-Wall-Ratio is required",
        },
        notEmpty: {
            errorMessage: "Window-Wall-Ratio Should not be empty"
        },
        isFloat: {
            options: {
                min: 0,
                max: 1
            },
            errorMessage: "Window-Wall-Ratio range between the 0 to 1",
        },
        trim: true,
    },
    shgc: {
        in: ["body"],
        exists: {
            errorMessage: "Solar Heat Gain Coefficient is required",
        },
        notEmpty: {
            errorMessage: "Solar Heat Gain Coefficient Should not be empty"
        },

        isFloat: {
            options: {
                min: 0,
                max: 1
            },
            errorMessage: "Solar Heat Gain Coefficient range between the 0 to 1",
        },
        trim: true,
    },
    "skylight.height": {
        in: ["body"],
        exists: {
            errorMessage: " Skylight Dimensions Height  is required",
        },
        notEmpty: {
            errorMessage: " Skylight Dimensions Height Should not be empty"
        },
        isNumeric: {
            options: {
                no_symbols: true, // using this property we can prevent + - to added to Pincode
            },
            errorMessage: " Skylight Dimension Height should be number"
        },
        optional: true,
        isFloat: {
            options: {
                min: 1,
            },
            errorMessage: " Skylight Dimension Height must be greater than 0",
        },
        trim: true,

    },
    "skylight.width": {
        in: ["body"],
        exists: {
            errorMessage: " Skylight Dimensions Width  is required",
        },
        notEmpty: {
            errorMessage: " Skylight Dimensions Width Should not be empty"
        },
        isNumeric: {
            options: {
                no_symbols: true, // using this property we can prevent + - to added to Pincode
            },
            errorMessage: " Skylight Dimension Width should be number"
        },
        isFloat: {
            options: {
                min: 1,
            },
            errorMessage: " Skylight Dimension Width must be greater than 0",
        },
        optional: true,
        trim: true,

    },
}

export default buildingValidatorSchema