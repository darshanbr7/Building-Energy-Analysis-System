import Building from "../model/buildingModel.js";
import _ from "lodash";
import solarRadiation from "../data/solarRadiation.json" assert { type: "json"};
import electricityRates from "../data/electricityRates.json" assert { type: "json" };
import analytic from "../helper/analytic.js";

const analyticController = {}

/**
 * Calculates and returns the heat gain, cooling load, energy consumption, and cost for a building in a specific city.

 * @function analyticController.calculate
 * @param {Object} req - Express request object containing:
 *      - `req.params.id` {string} - The ID of the building to analyze.
 *      - `req.body.city` {string} - The city in which the analysis is performed.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} - A JSON response containing:
 *      - totalHeatGainBTU: Total heat gain in BTU.
 *      - totalCoolingLoadKWh: Total cooling load in kWh.
 *      - totalEnergyConsumedKWh: Total energy consumed in kWh.
 *      - totalCost: Total cost of energy consumption.
 *      - facadeResults: Breakdown of calculations for each facade (north, south, east, west, and roof if applicable).
 *
 * @throws {Error} - Returns a 500 error response if the calculation fails.
*/
analyticController.calculate = async (req, res) => {
    try {
        const { id } = _.pick(req.params, ["id"])
        const { city } = _.pick(req.body, ["city"]);

        const { totalHeatGainBTU,
            totalCoolingLoadKWh,
            totalEnergyConsumedKWh,
            totalCost,
            facadeResults } = await analytic( id, city );

        res.json({
            totalHeatGainBTU,
            totalCoolingLoadKWh,
            totalEnergyConsumedKWh,
            totalCost,
            facadeResults
        })

    } catch (error) {
        return res.status(500).json({ error: [{ msg: error.message }] })
    }
}

/**
 * Compares two buildings in a specific city based on heat gain, cooling load, energy consumption, and cost.
 *
 * @async
 * @function analyticController.compare
 * @param {Object} req - Express request object containing:
 *      - `req.params.id1` {string} - The ID of the first building.
 *      - `req.params.id2` {string} - The ID of the second building.
 *      - `req.params.city` {string} - The city in which the comparison is performed.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} - A JSON response containing:
 *      - `result1`: Analysis results for the first building.
 *      - `result2`: Analysis results for the second building.
 *
 * @throws {Error} - Returns a 500 error response if the comparison fails.
*/

analyticController.compare =  async ( req, res ) => {
    try {
        const { id1, id2, city } = _.pick(req.params, [ "id1", "id2", "city" ] );
        const result1 = await analytic( id1, city );
        const result2 = await analytic( id2, city );
        res.json( { result1, result2 })
    } catch (error) {
        console.log( error )
        return res.status(500).json({ error: [{ msg: error.message }] })
    }
}

/**
 * Ranks a single building across multiple cities based on heat gain, cooling load, energy consumption, and cost.
 *
 * @async
 * @function analyticController.ranking
 * @param {Object} req - Express request object containing:
 *      - `req.params.id` {string} - The ID of the building to analyze across cities.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object[]>} - A JSON response containing a ranked list of cities, each with:
 *      - `city`: Name of the city.
 *      - `totalHeatGainBTU`: Total heat gain in BTU.
 *      - `totalCoolingLoadKWh`: Total cooling load in kWh.
 *      - `totalEnergyConsumedKWh`: Total energy consumed in kWh.
 *      - `totalCost`: Total cost of energy consumption.
 * 
 * The ranking is sorted in descending order based on `totalCost`.
 *
 * @throws {Error} - Returns a 500 error response if ranking calculation fails.
*/
analyticController.ranking  =  async ( req, res ) => {
    try {
        const { id } = _.pick(req.params, ["id"]);
        const cities = Object.keys( solarRadiation );
        const cityRanking = await Promise.all(
            cities.map(async (city) => {
                const {
                    totalHeatGainBTU,
                    totalCoolingLoadKWh,
                    totalEnergyConsumedKWh,
                    totalCost,
                } = await analytic(id, city);
        
                return {
                    city,
                    totalHeatGainBTU,
                    totalCoolingLoadKWh,
                    totalEnergyConsumedKWh,
                    totalCost,
                };
            })
        );
        cityRanking.sort((a, b) => b.totalCost - a.totalCost);
        res.json(cityRanking)
    } catch (error) {
        return res.status(500).json({ error: [{ msg: error.message }] })
    }
}
export default analyticController;