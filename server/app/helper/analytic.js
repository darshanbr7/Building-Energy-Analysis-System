import Building from "../model/buildingModel.js";
import _ from "lodash";
import solarRadiation from "../data/solarRadiation.json" assert { type: "json"};
import electricityRates from "../data/electricityRates.json" assert { type: "json" };

/**
 * Calculates the heat gain, cooling load, energy consumption, and cost for a given building in a specific city.
 
 * @function analytic
 * @param {string} buildingId - The ID of the building to analyze.
 * @param {string} city - The city in which the building's analysis is to be performed.
 * @returns {Promise<Object>} - An object containing:
 *      - totalHeatGainBTU: Total heat gain in BTU.
 *      - totalCoolingLoadKWh: Total cooling load in kWh.
 *      - totalEnergyConsumedKWh: Total energy consumed in kWh.
 *      - totalCost: Total cost of energy consumption.
 *      - facadeResults: Breakdown of calculations for each facade (north, south, east, west, and roof if applicable).
 *
 * @throws {Error} - Throws an error if building data retrieval or calculations fail.
 */
const analytic = async (buildingId, city) => {
    try {
        const building = await Building.findById(buildingId);
        const { height, dimensions, wwr, shgc, skylight } = building;
        const deltaT = 1;
        let totalHeatGainBTU = 0;
        let totalCoolingLoadKWh = 0;
        let totalEnergyConsumedKWh = 0;
        let totalCost = 0;
        let facadeResults = {};
        ["north", "south", "east", "west"].forEach((direction) => {
            const width = dimensions[direction]?.width || 0;
            const G = solarRadiation[city][direction];
            const windowArea = height * width * wwr;

            const heatGainBTU = windowArea * shgc * G * deltaT;
            totalHeatGainBTU += heatGainBTU;

            const coolingLoadKWh = heatGainBTU / 3412;
            totalCoolingLoadKWh += coolingLoadKWh;

            const energyConsumedKWh = coolingLoadKWh / 4;
            totalEnergyConsumedKWh += energyConsumedKWh;

            const cost = energyConsumedKWh * electricityRates[city];
            totalCost += cost;

            facadeResults[direction] = {
                windowArea,
                heatGainBTU,
                coolingLoadKWh,
                energyConsumedKWh,
                cost,
            };
        });
        if (skylight && skylight.height && skylight.width) {
            const skylightArea = skylight.height * skylight.width;
            const G = solarRadiation[city]["roof"];

            const skylightHeatGainBTU = skylightArea * shgc * G * deltaT;
            totalHeatGainBTU += skylightHeatGainBTU;

            const skylightCoolingLoadKWh = skylightHeatGainBTU / 3412;
            totalCoolingLoadKWh += skylightCoolingLoadKWh;

            const skylightEnergyConsumedKWh = skylightCoolingLoadKWh / 4;
            totalEnergyConsumedKWh += skylightEnergyConsumedKWh;

            const skylightCost = skylightEnergyConsumedKWh * electricityRates[city];
            totalCost += skylightCost;

            facadeResults["roof"] = {
                skylightArea,
                heatGainBTU: skylightHeatGainBTU,
                coolingLoadKWh: skylightCoolingLoadKWh,
                energyConsumedKWh: skylightEnergyConsumedKWh,
                cost: skylightCost,
            };
        }
        return {
            totalHeatGainBTU,
            totalCoolingLoadKWh,
            totalEnergyConsumedKWh,
            totalCost,
            facadeResults
        }
    } catch (error) {
        throw new Error(error.message)
    }
}
export default analytic