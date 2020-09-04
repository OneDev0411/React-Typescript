import path from 'path'

import merge from 'webpack-merge'

import ForkTsCheckerNotifierWebpackPlugin from 'fork-ts-checker-notifier-webpack-plugin'
import Webpackbar from 'webpackbar'

import { ESBuildPlugin } from 'esbuild-loader'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import UnusedFilesWebpackPlugin from 'unused-files-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

import common from './base'

const ESBUILD_COMMON_OPTIONS = {
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  sourceMap: false
}

const postcss = function postcss() {
  return [
    require('postcss-cssnext')({
      features: {
        rem: false
      }
    }),
    require('postcss-browser-reporter')({}),
    require('postcss-reporter')({})
  ]
}

webpackConfig.entry = [appConfig.compile.entry]

webpackConfig.plugins.push(
  new ESBuildPlugin(),
  new UnusedFilesWebpackPlugin({
    patterns: ['app/**/*.+(css|js|jsx|ts|tsx)'],
    globOptions: {
      ignore: [
        // Tests
        // Somehow, it seems the ts test files look unused here
        'app/**/*.test.+(js|jsx|ts|tsx)',

        // Our TS interface ONLY name convention
        // It somehow thinks they are unused when they only export interfaces :/
        'app/**/types.ts',

        // Static directory
        // This plugin thinks some CSS files there are unused but they aren't
        'app/static/**',

        // All icons
        // We got a lot of unused ones
        // TODO: Do something about icons and remove unused ones
        'app/views/components/SvgIcons/**',

        // Used in server directory which is out of webpack
        'app/models/user/get-self/index.js',

        // Mostly bootstrap and other 3rd party stuff
        // TODO: Get rid of these too if it's possible
        'app/styles/vendor/**',

        'app/models/contacts/get-contacts-job/index.js',
        'app/models/contacts/get-duplicates-contacts/index.js',
        'app/models/contacts/merge-multiple-contatcs/index.js',
        'app/models/contacts/get-conact-cluster-duplicates/index.js',
        'app/components/Pages/Dashboard/Contacts/DuplicateContacts/**',
        'app/components/Pages/Dashboard/Contacts/components/DuplicateContacts/index.js',

        // Flows stuff
        // TODO: remove them from here when we enabled flows
        'app/models/flows/**',
        'app/views/components/AddToFlow/**',
        'app/components/Pages/Dashboard/Contacts/Profile/Flows/**',
        'app/components/Pages/Dashboard/Contacts/List/Filters/helpers/get-flows.js'
      ]
    }
  }),
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false
  }),
  new Webpackbar()
)

webpackConfig.plugins.push(
  new ForkTsCheckerNotifierWebpackPlugin({ alwaysNotify: false })
)

webpackConfig.plugins.push(
  new ForkTsCheckerWebpackPlugin({
    /**
     * This is crucial in development, as it doesn't block webpack compilation
     * while typechecking is in progress.
     */
    async: true,
    /**
     * Syntactic errors are checked by babel too, so we turn it off for a small
     * performance gain.
     */
    checkSyntacticErrors: false,
    useTypescriptIncrementalApi: true
  })
)

webpackConfig.module.rules.push(
  {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'esbuild-loader',
      options: {
        ...ESBUILD_COMMON_OPTIONS,
        loader: 'jsx'
      }
    }
  },
  {
    test: /\.(jsx|tsx?)$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'esbuild-loader',
      options: ESBUILD_COMMON_OPTIONS
    }
  },
  {
    test: /\.css/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          plugins: postcss
        }
      }
    ]
  },
  plugins: [
    new UnusedFilesWebpackPlugin({
      patterns: ['app/**/*.+(css|js|jsx|ts|tsx)'],
      globOptions: {
        ignore: [
          // Tests
          // Somehow, it seems the ts test files look unused here
          'app/**/*.test.+(js|jsx|ts|tsx)',

          // Our TS interface ONLY name convention
          // It somehow thinks they are unused when they only export interfaces :/
          'app/**/types.ts',

          // Static directory
          // This plugin thinks some CSS files there are unused but they aren't
          'app/static/**',

          // All icons
          // We got a lot of unused ones
          // TODO: Do something about icons and remove unused ones
          'app/views/components/SvgIcons/**',

          // Used in server directory which is out of webpack
          'app/models/user/get-self/index.js',

          // Mostly bootstrap and other 3rd party stuff
          // TODO: Get rid of these too if it's possible
          'app/styles/vendor/**',

          'app/models/contacts/get-contacts-job/index.js',
          'app/models/contacts/get-duplicates-contacts/index.js',
          'app/models/contacts/merge-multiple-contatcs/index.js',
          'app/models/contacts/get-conact-cluster-duplicates/index.js',
          'app/components/Pages/Dashboard/Contacts/DuplicateContacts/**',
          'app/components/Pages/Dashboard/Contacts/components/DuplicateContacts/index.js',

          // Flows stuff
          // TODO: remove them from here when we enabled flows
          'app/models/flows/**',
          'app/views/components/AddToFlow/**',
          'app/components/Pages/Dashboard/Contacts/Profile/Flows/**',
          'app/components/Pages/Dashboard/Contacts/List/Filters/helpers/get-flows.js'
        ]
      }
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    }),
    new Webpackbar(),
    new ForkTsCheckerNotifierWebpackPlugin({ alwaysNotify: false }),
    new ForkTsCheckerWebpackPlugin({
      /**
       * This is crucial in development, as it doesn't block webpack compilation
       * while typechecking is in progress.
       */
      async: true,
      /**
       * Syntactic errors are checked by babel too, so we turn it off for a small
       * performance gain.
       */
      checkSyntacticErrors: false,
      useTypescriptIncrementalApi: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: postcss
            }
          }
        ]
      },
      {
        test: /\.scss/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: postcss
            }
          },
          'sass-loader'
        ]
      }
    ]
  }
}

export default merge(common, config)
