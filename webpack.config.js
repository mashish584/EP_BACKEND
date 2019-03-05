const path = require("path");
const mini_css_extract = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");

const JS_LOADER = {
	test: /\.(js)$/,
	exclude: [/node_modules/],
	use: [
		{
			loader: "babel-loader",
			options: { presets: ["@babel/preset-env"] }
		}
	]
};

const CSS_LOADER = {
	test: /\.(sa|sc|c)ss$/,
	exclude: [/node_modules/],
	use: [
		mini_css_extract.loader,
		{ loader: "css-loader", options: {} },
		{
			loader: "postcss-loader",
			options: {
				plugins: [autoprefixer({ browsers: "last 10 versions" })]
			}
		},
		{ loader: "sass-loader", options: {} }
	]
};

module.exports = {
	entry: {
		main: "./assets/js/main.js"
	},
	output: {
		path: path.resolve(__dirname, "assets", "dist"),
		filename: "[name].bundle.js"
	},
	devtool: "source-map",
	watch: true,
	plugins: [
		new mini_css_extract({
			filename: "[name].css"
		})
	],
	module: {
		rules: [JS_LOADER, CSS_LOADER]
	}
};
