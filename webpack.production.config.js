module.exports = {
    entry: './src/Queue.ts',
    output: {
        filename: './dist/queue.js',
        libraryTarget: "commonjs2"
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