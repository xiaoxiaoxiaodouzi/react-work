const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const path = require('path');

module.exports = function override(config, env) {
    config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }], config);
    config = rewireLess.withLoaderOptions({
        modifyVars: {
            "@primary-color": "#15469A",
            "@icon-url": '"/assets/fonts/iconfont"'
        },
    })(config, env);

    return config;
};
