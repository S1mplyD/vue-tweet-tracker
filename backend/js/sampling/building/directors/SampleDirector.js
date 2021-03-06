const path = require("path");

class SampleDirector {
    constructor( workingLocation ) {
        /**
         * @type {AbstractSampleBuilder}
         */
        this.builder = null;
        this.location = workingLocation;
    }

    setBuilder( /*AbstractSampleBuilder*/ builder) {
        this.builder = builder;
    }

    setLocation( location ) {
        this.location = location;
    }

    constructSample( /*String*/tag, filter ) {
        let sampleLocation = path.join( this.location, tag )
        this.builder.createNewSample( tag, sampleLocation );
        this.builder.buildDescriptor( filter, path.join( sampleLocation, "descriptor.json") );
        this.builder.buildCollection( null, path.join( sampleLocation, "collection.json") );
    }

    deconstructSample( /*Sample*/sample ) {
        // used to deconstruct parts if necessary
    }

    /**
     *
     * @return {Sample}
     */
    getSample() {
        return this.builder.getSample();
    }
}

module.exports = SampleDirector;