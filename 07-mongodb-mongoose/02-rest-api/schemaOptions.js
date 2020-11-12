const schemaOptions = {
	toObject: {
		getters: true,
		virtuals: true,
		versionKey: false,
		transform ( doc, ret, options ) {
			ret.id = ret._id;
			delete ret._id;

			return ret;
		}
	}

};

module.exports = schemaOptions;