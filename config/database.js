if (process.env.NODE_ENV === 'production') {
    module.exports = { mongoURI: 'mongodb://alaa:alaa@ds123084.mlab.com:23084/vidjot' };
} else {
    module.exports = { mongoURI: 'mongodb://localhost/vidjot-dev' };
}