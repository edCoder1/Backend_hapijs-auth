module.exports = {
	ENV: process.env.NODE_ENV || 'development',
	PORT: 3000, //process.env.PORT || 3000,
	URL: process.env.BASE_URL || 'http://localhost:3000',
	MONGODB_URI:
		process.env.MONGODB_URI ||
		'mongodb+srv://MlabUser:SycoMlab145!@mdbcluster-mmthf.mongodb.net/test?retryWrites=true',
	JWT_SECRET: process.env.JWT_SECRET || 'secret0'
};
