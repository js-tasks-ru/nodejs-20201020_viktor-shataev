const ProductModel = require( '../models/Product' );
const mongoose = require( 'mongoose' );

module.exports.productsBySubcategory = async function productsBySubcategory ( ctx, next ) {
	const subcategory = ctx.query.subcategory;
	let products = [];

	if ( !subcategory ) {
		products = await ProductModel.find();
	} else {
		products = await ProductModel.find( { subcategory: subcategory } );
	}

	products = products.map( product => product.toObject() );

	ctx.state.products = products;

	next();
};

module.exports.productList = async function productList ( ctx, next ) {
	ctx.body = { products: ctx.state.products };
};

module.exports.validateObjectId = function ( ctx, next ) {
	const id = ctx.params.id;

	if ( !mongoose.Types.ObjectId.isValid( id ) ) {
		ctx.throw( 400, 'Invalid id' );
	}

	return next();
};

module.exports.productById = async function productById ( ctx, next ) {
	const id = ctx.params.id;
	let product = await ProductModel.findById( id );

	if ( !product ) {
		ctx.throw( 404, 'Product not found' );
	}

	product = product.toObject();

	ctx.body = { product: product };
};

