import express from "express";
import { checkSchema } from "express-validator";
import buildingController from "../app/controller/buildingController.js";
import buildingValidatorSchema from "../app/validators/buildingValidatorSchema.js";
import inputValidator from "../app/middlewares/inputValidator.js";
import { buildingId, city } from "../app/validators/BuildingId.js";
import analyticController from "../app/controller/analyticController.js";
const routes = express.Router();

routes.post( "/buildings", checkSchema( buildingValidatorSchema), inputValidator, buildingController.create );
routes.get("/buildings", buildingController.list );
routes.get("/buildings/:id", checkSchema({ id: buildingId }), inputValidator, buildingController.getBuildingById )
routes.put ("/buildings/:id", checkSchema({ id: buildingId }), checkSchema( buildingValidatorSchema), inputValidator,  buildingController.updateBuildingById )
routes.delete ("/buildings/:id", checkSchema({ id: buildingId }), inputValidator, buildingController.deleteBuildingById )

routes.post( "/analysis/calculate/:id", checkSchema ({ id : buildingId, city }), inputValidator, analyticController.calculate );

routes.get( "/analysis/compare/:id1/:id2/:city", checkSchema ({ id1 : buildingId, id2 : buildingId }), inputValidator, analyticController.compare )


routes.get( "/analysis/cities/:id", checkSchema ({ id : buildingId }), inputValidator, analyticController.ranking )

export default routes;