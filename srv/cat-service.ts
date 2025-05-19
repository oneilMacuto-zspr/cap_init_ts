const cds = require("@sap/cds");
import { Book } from "#cds-models/CatalogService"
const LOG = cds.log("cat-service")

module.exports = class CatalogService extends cds.ApplicationService { 
    
    init() {

        this.on('selectProductCategory', async (req: Request) => {
            await this.fnSelect(req)
        })

    }

    async fnSelect(req: Request) {
        const response = await cds.run(SELECT.from(cds.entities.Books))
        LOG.info(JSON.stringify(response))
        return response
    }

}