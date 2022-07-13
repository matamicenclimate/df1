export declare const target: string[];
export declare const mode: string;
export declare const bail: boolean;
export declare const devtool: string;
export declare const entry: string;
export declare namespace output {
    const path: string;
    const pathinfo: boolean;
    const filename: string;
    const chunkFilename: string;
    const assetModuleFilename: string;
    const publicPath: string;
}
export declare namespace cache {
    const type: string;
    const version: string;
    const cacheDirectory: string;
    const store: string;
    namespace buildDependencies {
        const defaultWebpack: string[];
        const config: string[];
        const tsconfig: string[];
    }
}
export declare namespace infrastructureLogging {
    const level: string;
}
export declare namespace optimization {
    const minimize: boolean;
    const minimizer: ({
        options: {
            test: RegExp;
            extractComments: boolean;
            parallel: boolean;
            minimizer: {
                options: {
                    parse: {
                        ecma: number;
                    };
                    compress: {
                        ecma: number;
                        warnings: boolean;
                        comparisons: boolean;
                        inline: number;
                    };
                    mangle: {
                        safari10: boolean;
                    };
                    keep_classnames: boolean;
                    keep_fnames: boolean;
                    output: {
                        ecma: number;
                        comments: boolean;
                        ascii_only: boolean;
                    };
                };
            };
        };
    } | {
        options: {
            test: RegExp;
            parallel: boolean;
            minimizer: {
                options: {
                    parse?: undefined;
                    compress?: undefined;
                    mangle?: undefined;
                    keep_classnames?: undefined;
                    keep_fnames?: undefined;
                    output?: undefined;
                };
            };
            extractComments?: undefined;
        };
    })[];
}
export declare namespace resolve {
    const modules: string[];
    const extensions: string[];
    const alias: {
        "react-native": string;
        "@common": string;
        "@": string;
    };
    const plugins: {
        appSrcs: string[];
        allowedFiles: {};
        allowedPaths: string[];
    }[];
    namespace fallback {
        const crypto: string;
        const stream: string;
        const buffer: string;
    }
}
export declare namespace module {
    const strictExportPresence: boolean;
    const rules: ({
        enforce: string;
        exclude: RegExp;
        test: RegExp;
        loader: string;
        oneOf?: undefined;
    } | {
        oneOf: ({
            test: RegExp;
            use: {
                loader: string;
            }[];
            type?: undefined;
            mimetype?: undefined;
            parser?: undefined;
            issuer?: undefined;
            include?: undefined;
            loader?: undefined;
            options?: undefined;
            exclude?: undefined;
            sideEffects?: undefined;
        } | {
            test: RegExp[];
            type: string;
            mimetype: string;
            parser: {
                dataUrlCondition: {
                    maxSize: number;
                };
            };
            use?: undefined;
            issuer?: undefined;
            include?: undefined;
            loader?: undefined;
            options?: undefined;
            exclude?: undefined;
            sideEffects?: undefined;
        } | {
            test: RegExp[];
            type: string;
            parser: {
                dataUrlCondition: {
                    maxSize: number;
                };
            };
            use?: undefined;
            mimetype?: undefined;
            issuer?: undefined;
            include?: undefined;
            loader?: undefined;
            options?: undefined;
            exclude?: undefined;
            sideEffects?: undefined;
        } | {
            test: RegExp;
            use: ({
                loader: string;
                options: {
                    prettier: boolean;
                    svgo: boolean;
                    svgoConfig: {
                        plugins: {
                            removeViewBox: boolean;
                        }[];
                    };
                    titleProp: boolean;
                    ref: boolean;
                    name?: undefined;
                };
            } | {
                loader: string;
                options: {
                    name: string;
                    prettier?: undefined;
                    svgo?: undefined;
                    svgoConfig?: undefined;
                    titleProp?: undefined;
                    ref?: undefined;
                };
            })[];
            issuer: {
                and: RegExp[];
            };
            type?: undefined;
            mimetype?: undefined;
            parser?: undefined;
            include?: undefined;
            loader?: undefined;
            options?: undefined;
            exclude?: undefined;
            sideEffects?: undefined;
        } | {
            test: RegExp;
            include: string;
            loader: string;
            options: {
                customize: string;
                presets: (string | {
                    runtime: string;
                })[][];
                babelrc: boolean;
                configFile: boolean;
                cacheIdentifier: string;
                plugins: string[];
                cacheDirectory: boolean;
                cacheCompression: boolean;
                compact: boolean;
                sourceMaps?: undefined;
                inputSourceMap?: undefined;
            };
            use?: undefined;
            type?: undefined;
            mimetype?: undefined;
            parser?: undefined;
            issuer?: undefined;
            exclude?: undefined;
            sideEffects?: undefined;
        } | {
            test: RegExp;
            exclude: RegExp;
            loader: string;
            options: {
                babelrc: boolean;
                configFile: boolean;
                compact: boolean;
                presets: (string | {
                    helpers: boolean;
                })[][];
                cacheDirectory: boolean;
                cacheCompression: boolean;
                cacheIdentifier: string;
                sourceMaps: boolean;
                inputSourceMap: boolean;
                customize?: undefined;
                plugins?: undefined;
            };
            use?: undefined;
            type?: undefined;
            mimetype?: undefined;
            parser?: undefined;
            issuer?: undefined;
            include?: undefined;
            sideEffects?: undefined;
        } | {
            test: RegExp;
            exclude: RegExp;
            use: (string | {
                loader: string;
                options: {
                    importLoaders: number;
                    sourceMap: boolean;
                    modules: {
                        mode: string;
                    };
                    postcssOptions?: undefined;
                    root?: undefined;
                };
            } | {
                loader: string;
                options: {
                    postcssOptions: {
                        ident: string;
                        config: boolean;
                        plugins: (string | (string | {
                            autoprefixer: {
                                flexbox: string;
                            };
                            stage: number;
                        })[])[];
                    };
                    sourceMap: boolean;
                    importLoaders?: undefined;
                    modules?: undefined;
                    root?: undefined;
                };
            } | {
                loader: string;
                options: {
                    sourceMap: boolean;
                    root: string;
                    importLoaders?: undefined;
                    modules?: undefined;
                    postcssOptions?: undefined;
                };
            } | {
                loader: string;
                options: {
                    sourceMap: boolean;
                    importLoaders?: undefined;
                    modules?: undefined;
                    postcssOptions?: undefined;
                    root?: undefined;
                };
            })[];
            sideEffects: boolean;
            type?: undefined;
            mimetype?: undefined;
            parser?: undefined;
            issuer?: undefined;
            include?: undefined;
            loader?: undefined;
            options?: undefined;
        } | {
            test: RegExp;
            use: (string | {
                loader: string;
                options: {
                    importLoaders: number;
                    sourceMap: boolean;
                    modules: {
                        mode: string;
                    };
                    postcssOptions?: undefined;
                    root?: undefined;
                };
            } | {
                loader: string;
                options: {
                    postcssOptions: {
                        ident: string;
                        config: boolean;
                        plugins: (string | (string | {
                            autoprefixer: {
                                flexbox: string;
                            };
                            stage: number;
                        })[])[];
                    };
                    sourceMap: boolean;
                    importLoaders?: undefined;
                    modules?: undefined;
                    root?: undefined;
                };
            } | {
                loader: string;
                options: {
                    sourceMap: boolean;
                    root: string;
                    importLoaders?: undefined;
                    modules?: undefined;
                    postcssOptions?: undefined;
                };
            } | {
                loader: string;
                options: {
                    sourceMap: boolean;
                    importLoaders?: undefined;
                    modules?: undefined;
                    postcssOptions?: undefined;
                    root?: undefined;
                };
            })[];
            type?: undefined;
            mimetype?: undefined;
            parser?: undefined;
            issuer?: undefined;
            include?: undefined;
            loader?: undefined;
            options?: undefined;
            exclude?: undefined;
            sideEffects?: undefined;
        } | {
            exclude: RegExp[];
            type: string;
            test?: undefined;
            use?: undefined;
            mimetype?: undefined;
            parser?: undefined;
            issuer?: undefined;
            include?: undefined;
            loader?: undefined;
            options?: undefined;
            sideEffects?: undefined;
        })[];
        enforce?: undefined;
        exclude?: undefined;
        test?: undefined;
        loader?: undefined;
    })[];
}
declare const plugins_1: ({
    userOptions: {
        inject: boolean;
        template: string;
    };
    version: number;
    replacements?: undefined;
    appPath?: undefined;
    definitions?: undefined;
    options?: undefined;
    logger?: undefined;
    pathCache?: undefined;
    fsOperations?: undefined;
    primed?: undefined;
    key?: undefined;
} | {
    replacements: {
        NODE_ENV: string;
        PUBLIC_URL: string;
        FAST_REFRESH: boolean;
        REACT_APP_MAGICLINK_PUBLIC: string;
        REACT_APP_API_URL: string;
        REACT_APP_API_URL_CAUSES: string;
    };
    userOptions?: undefined;
    version?: undefined;
    appPath?: undefined;
    definitions?: undefined;
    options?: undefined;
    logger?: undefined;
    pathCache?: undefined;
    fsOperations?: undefined;
    primed?: undefined;
    key?: undefined;
} | {
    appPath: string;
    userOptions?: undefined;
    version?: undefined;
    replacements?: undefined;
    definitions?: undefined;
    options?: undefined;
    logger?: undefined;
    pathCache?: undefined;
    fsOperations?: undefined;
    primed?: undefined;
    key?: undefined;
} | {
    definitions: {
        "process.env": {
            NODE_ENV: string;
            PUBLIC_URL: string;
            FAST_REFRESH: string;
            REACT_APP_MAGICLINK_PUBLIC: string;
            REACT_APP_API_URL: string;
            REACT_APP_API_URL_CAUSES: string;
        };
    };
    userOptions?: undefined;
    version?: undefined;
    replacements?: undefined;
    appPath?: undefined;
    options?: undefined;
    logger?: undefined;
    pathCache?: undefined;
    fsOperations?: undefined;
    primed?: undefined;
    key?: undefined;
} | {
    options: {
        overlay: boolean;
        exclude: RegExp;
        include: RegExp;
        assetHookStage?: undefined;
        basePath?: undefined;
        fileName?: undefined;
        filter?: undefined;
        map?: undefined;
        publicPath?: undefined;
        removeKeyHash?: undefined;
        sort?: undefined;
        transformExtensions?: undefined;
        useEntryKeys?: undefined;
        useLegacyEmit?: undefined;
        writeToFileEmit?: undefined;
        resourceRegExp?: undefined;
        contextRegExp?: undefined;
        async?: undefined;
        typescript?: undefined;
        issue?: undefined;
        logger?: undefined;
        extensions?: undefined;
        emitError?: undefined;
        emitWarning?: undefined;
        failOnError?: undefined;
        formatter?: undefined;
        eslintPath?: undefined;
        context?: undefined;
        cache?: undefined;
        cacheLocation?: undefined;
        cwd?: undefined;
        resolvePluginsRelativeTo?: undefined;
        baseConfig?: undefined;
        ignore?: undefined;
    };
    userOptions?: undefined;
    version?: undefined;
    replacements?: undefined;
    appPath?: undefined;
    definitions?: undefined;
    logger?: undefined;
    pathCache?: undefined;
    fsOperations?: undefined;
    primed?: undefined;
    key?: undefined;
} | {
    options: {
        overlay?: undefined;
        exclude?: undefined;
        include?: undefined;
        assetHookStage?: undefined;
        basePath?: undefined;
        fileName?: undefined;
        filter?: undefined;
        map?: undefined;
        publicPath?: undefined;
        removeKeyHash?: undefined;
        sort?: undefined;
        transformExtensions?: undefined;
        useEntryKeys?: undefined;
        useLegacyEmit?: undefined;
        writeToFileEmit?: undefined;
        resourceRegExp?: undefined;
        contextRegExp?: undefined;
        async?: undefined;
        typescript?: undefined;
        issue?: undefined;
        logger?: undefined;
        extensions?: undefined;
        emitError?: undefined;
        emitWarning?: undefined;
        failOnError?: undefined;
        formatter?: undefined;
        eslintPath?: undefined;
        context?: undefined;
        cache?: undefined;
        cacheLocation?: undefined;
        cwd?: undefined;
        resolvePluginsRelativeTo?: undefined;
        baseConfig?: undefined;
        ignore?: undefined;
    };
    logger: {};
    pathCache: {};
    fsOperations: number;
    primed: boolean;
    userOptions?: undefined;
    version?: undefined;
    replacements?: undefined;
    appPath?: undefined;
    definitions?: undefined;
    key?: undefined;
} | {
    options: {
        assetHookStage: any;
        basePath: string;
        fileName: string;
        filter: any;
        map: any;
        publicPath: string;
        removeKeyHash: string;
        sort: any;
        transformExtensions: RegExp;
        useEntryKeys: boolean;
        useLegacyEmit: boolean;
        writeToFileEmit: boolean;
        overlay?: undefined;
        exclude?: undefined;
        include?: undefined;
        resourceRegExp?: undefined;
        contextRegExp?: undefined;
        async?: undefined;
        typescript?: undefined;
        issue?: undefined;
        logger?: undefined;
        extensions?: undefined;
        emitError?: undefined;
        emitWarning?: undefined;
        failOnError?: undefined;
        formatter?: undefined;
        eslintPath?: undefined;
        context?: undefined;
        cache?: undefined;
        cacheLocation?: undefined;
        cwd?: undefined;
        resolvePluginsRelativeTo?: undefined;
        baseConfig?: undefined;
        ignore?: undefined;
    };
    userOptions?: undefined;
    version?: undefined;
    replacements?: undefined;
    appPath?: undefined;
    definitions?: undefined;
    logger?: undefined;
    pathCache?: undefined;
    fsOperations?: undefined;
    primed?: undefined;
    key?: undefined;
} | {
    options: {
        resourceRegExp: RegExp;
        contextRegExp: RegExp;
        overlay?: undefined;
        exclude?: undefined;
        include?: undefined;
        assetHookStage?: undefined;
        basePath?: undefined;
        fileName?: undefined;
        filter?: undefined;
        map?: undefined;
        publicPath?: undefined;
        removeKeyHash?: undefined;
        sort?: undefined;
        transformExtensions?: undefined;
        useEntryKeys?: undefined;
        useLegacyEmit?: undefined;
        writeToFileEmit?: undefined;
        async?: undefined;
        typescript?: undefined;
        issue?: undefined;
        logger?: undefined;
        extensions?: undefined;
        emitError?: undefined;
        emitWarning?: undefined;
        failOnError?: undefined;
        formatter?: undefined;
        eslintPath?: undefined;
        context?: undefined;
        cache?: undefined;
        cacheLocation?: undefined;
        cwd?: undefined;
        resolvePluginsRelativeTo?: undefined;
        baseConfig?: undefined;
        ignore?: undefined;
    };
    userOptions?: undefined;
    version?: undefined;
    replacements?: undefined;
    appPath?: undefined;
    definitions?: undefined;
    logger?: undefined;
    pathCache?: undefined;
    fsOperations?: undefined;
    primed?: undefined;
    key?: undefined;
} | {
    options: {
        async: boolean;
        typescript: {
            typescriptPath: string;
            configOverwrite: {
                compilerOptions: {
                    sourceMap: boolean;
                    skipLibCheck: boolean;
                    inlineSourceMap: boolean;
                    declarationMap: boolean;
                    noEmit: boolean;
                    incremental: boolean;
                    tsBuildInfoFile: string;
                };
            };
            context: string;
            diagnosticOptions: {
                syntactic: boolean;
            };
            mode: string;
        };
        issue: {
            include: {
                file: string;
            }[];
            exclude: {
                file: string;
            }[];
        };
        logger: {
            infrastructure: string;
        };
        overlay?: undefined;
        exclude?: undefined;
        include?: undefined;
        assetHookStage?: undefined;
        basePath?: undefined;
        fileName?: undefined;
        filter?: undefined;
        map?: undefined;
        publicPath?: undefined;
        removeKeyHash?: undefined;
        sort?: undefined;
        transformExtensions?: undefined;
        useEntryKeys?: undefined;
        useLegacyEmit?: undefined;
        writeToFileEmit?: undefined;
        resourceRegExp?: undefined;
        contextRegExp?: undefined;
        extensions?: undefined;
        emitError?: undefined;
        emitWarning?: undefined;
        failOnError?: undefined;
        formatter?: undefined;
        eslintPath?: undefined;
        context?: undefined;
        cache?: undefined;
        cacheLocation?: undefined;
        cwd?: undefined;
        resolvePluginsRelativeTo?: undefined;
        baseConfig?: undefined;
        ignore?: undefined;
    };
    userOptions?: undefined;
    version?: undefined;
    replacements?: undefined;
    appPath?: undefined;
    definitions?: undefined;
    logger?: undefined;
    pathCache?: undefined;
    fsOperations?: undefined;
    primed?: undefined;
    key?: undefined;
} | {
    key: string;
    options: {
        extensions: string[];
        emitError: boolean;
        emitWarning: boolean;
        failOnError: boolean;
        formatter: string;
        eslintPath: string;
        context: string;
        cache: boolean;
        cacheLocation: string;
        cwd: string;
        resolvePluginsRelativeTo: string;
        baseConfig: {
            extends: string[];
            rules: {};
        };
        ignore: boolean;
        overlay?: undefined;
        exclude?: undefined;
        include?: undefined;
        assetHookStage?: undefined;
        basePath?: undefined;
        fileName?: undefined;
        filter?: undefined;
        map?: undefined;
        publicPath?: undefined;
        removeKeyHash?: undefined;
        sort?: undefined;
        transformExtensions?: undefined;
        useEntryKeys?: undefined;
        useLegacyEmit?: undefined;
        writeToFileEmit?: undefined;
        resourceRegExp?: undefined;
        contextRegExp?: undefined;
        async?: undefined;
        typescript?: undefined;
        issue?: undefined;
        logger?: undefined;
    };
    userOptions?: undefined;
    version?: undefined;
    replacements?: undefined;
    appPath?: undefined;
    definitions?: undefined;
    logger?: undefined;
    pathCache?: undefined;
    fsOperations?: undefined;
    primed?: undefined;
})[];
export { plugins_1 as plugins };
export declare const performance: boolean;
