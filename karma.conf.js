// Karma configuration

module.exports = function(config) {
    config.set({
        frameworks: [
            'jasmine'
        ],

        files: [
            './test/_build/**Test.js'
        ],

        plugins: [
            require("karma-jasmine"),
            require('karma-chrome-launcher')
        ],


        // enable / disable colors in the output (reporters and logs)
        colors: true,
        
        browsers: ['Chrome']
    })
};
