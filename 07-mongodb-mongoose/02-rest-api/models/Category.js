const mongoose = require( 'mongoose' );
const connection = require( '../libs/connection' );

const schemaOptions = require('../schemaOptions');

const subCategorySchema = new mongoose.Schema( {
		title: {
			type: String,
			required: true,
		},
	},
	{ ...schemaOptions }
);

const categorySchema = new mongoose.Schema( {
		title: {
			type: String,
			required: true,
		},
		subcategories: [ subCategorySchema ],
	},
	{ ...schemaOptions }
);

module.exports = connection.model( 'Category', categorySchema );
