import { model, Schema } from "mongoose";

/**
 * Schema definition for the Building model.
 * This schema represents the structure of a building, including details about its name, city, dimensions, 
 * window-to-wall ratio (wwr), solar gain heat coefficient (sghc), and skylight dimensions.
*/

const buildingSchema = new Schema({
    name: String,
    height: Number,
    dimensions: {
        north: { width: Number },
        south: { width: Number },
        east: { width: Number },
        west: { width: Number }
    },
    wwr: Number,
    shgc: Number,
    skylight: {
        height: Number,
        width: Number
    },
    analysis: {
        totalWindowArea: Number,
        heatGainBTU: Number,
        coolingLoadKWh: Number,
        energyConsumedKWh: Number,
        cost: Number
    }
}, { timestamps: true });

const Building = model("Building", buildingSchema);

export default Building;
