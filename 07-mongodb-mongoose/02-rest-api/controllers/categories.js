const CategoryModel = require( '../models/Category' );

module.exports.categoryList = async function categoryList ( ctx, next ) {
	let categories = await CategoryModel.find();

	categories = categories.map( category => category.toObject() );

	ctx.body = { categories: categories };
	
};
