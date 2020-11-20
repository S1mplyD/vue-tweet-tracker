const SamplesHandler = require("./SamplesHandler");
class GeoSamplesHandler extends SamplesHandler {

    /**
     *
     * @param sampler {Sampler}
     * @param strategy {AbstractSamplingStrategy}
     */
    constructor(sampler, strategy) {
        super(sampler, strategy);
    }

    canHandleByFilter(filter) {
        return filter.locations && filter.locations.length > 0;
    }
}

module.exports = GeoSamplesHandler;