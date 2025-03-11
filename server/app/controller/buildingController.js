import Building from "../model/buildingModel.js";
import _ from "lodash";
const buildingController = {}


/**
 * Creates a new building record in the database.
  * @param {Object} req - The request object containing the data for the new building in the body.
 * @param {Object} res - The response object used to send back the result of the creation.
 * 
 * @returns {Object} - A JSON response containing the newly created building object if successful,
 *                     or an error message if an error occurs.
*/
buildingController.create = async (req, res) => {
    try {
        const { name,  dimensions, wwr, shgc, skylight, height } = _.pick(req.body, ["name", "dimensions", "wwr", "shgc", "skylight", "height"]);
        const newBuilding = new Building({ name,  dimensions, wwr, shgc, skylight, height });
        await newBuilding.save();
        res.json(newBuilding);
    } catch (error) {
        return res.status(500).json({ error: [{ msg: error.message }] })
    }
}

/**
 * Retrieves a list of all buildings from the database.
 * @param {Object} res - The response object used to send back the list of buildings or an error message.
 * @returns {Object} - A JSON response containing an array of building records if successful,
 *                     or an error message if an error occurs.
 */
buildingController.list = async (req, res) => {
    try {
        const allBuilding = await Building.find()
        res.json(allBuilding);
    } catch (error) {
        return res.status(500).json({ error: [{ msg: error.message }] })
    }
}

/**
 * Retrieves a single building record from the database based on the provided building ID.
 * @param {Object} req - The request object containing the building ID in the `params` property.
 * @param {Object} res - The response object used to send back the building data or an error message.
 * 
 * @returns {Object} - A JSON response containing the building record if found, or an error message if an error occurs.
*/
buildingController.getBuildingById = async (req, res) => {
    try {
        const { id } = _.pick(req.params, ["id"])
        const singleBuilding = await Building.findById(id);
        res.json(singleBuilding);
    } catch (error) {
        return res.status(500).json({ error: [{ msg: error.message }] })
    }
}

/**
 * Updates an existing building record in the database based on the provided building ID.
 * @param {Object} req - The request object containing the building ID in `params` and the updated building data in `body`.
 * @param {Object} res - The response object used to send back the updated building data or an error message.
 * 
 * @returns {Object} - A JSON response containing the updated building record if successful, 
 *                     or an error message if an error occurs during the update process.
*/
buildingController.updateBuildingById = async (req, res) => {
    try {
        const { id } = _.pick(req.params, ["id"])
        const { name, dimensions, wwr, shgc, skylight, height } = _.pick(req.body, ["name",  "dimensions", "wwr", "shgc", "skylight", "height"]);
        const updatedBuilding = await Building.findByIdAndUpdate(id, { name, dimensions, wwr, shgc, skylight, height }, { new: true, runValidators: true });
        res.json(updatedBuilding);
    } catch (error) {
        return res.status(500).json({ error: [{ msg: error.message }] })
    }
}

/**
 * Deletes a building record from the database based on the provided building ID.
 * @param {Object} req - The request object containing the building ID in `params`.
 * @param {Object} res - The response object used to send back the deleted building data or an error message.
 * 
 * @returns {Object} - A JSON response containing the deleted building record if successful, 
 *                     or an error message if an error occurs during the deletion process.
*/
buildingController.deleteBuildingById = async (req, res) => {
    try {
        const { id } = _.pick(req.params, ["id"])
        const deletedBuilding = await Building.findByIdAndDelete(id);
        res.json(deletedBuilding);
    } catch (error) {
        return res.status(500).json({ error: [{ msg: error.message }] })
    }
}
export default buildingController;