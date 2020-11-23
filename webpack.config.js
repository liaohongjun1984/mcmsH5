let path = require(‘path’);

module.exports = {
	entry: ‘./src/main.js’,
	mode: ‘development’,
	devServer: {
		port: 8080,
		contentBase: path.join(__dirname, ‘src’),
		open: true
	}
}