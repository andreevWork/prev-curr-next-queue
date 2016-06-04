module.exports = {
    entry: './test/QueueTest.ts',
    output: {
        filename: './test/_build/QueueTest.js'
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    }
}