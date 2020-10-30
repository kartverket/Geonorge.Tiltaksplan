const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function override(config, env) {
    const configPath = process.env.NODE_ENV === 'development' ? 'src/config/config.local.json' : 'src/config/config.json';
    config.plugins.push(new CopyWebpackPlugin(
        {
            patterns: [
                { from: configPath, to: 'config.json', toType: 'file' }
            ]
        },
        {}
    ));
    return config;
};
