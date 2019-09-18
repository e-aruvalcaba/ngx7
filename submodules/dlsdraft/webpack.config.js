var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		app: './src/js/app.js'
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: './js/[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/, 
				use: 
				{
					loader: 'file-loader',
  					options: { 
  						name: 'fonts/[name].[ext]',
  						publicPath: '../' 
  					}
    			}
			},
			{
				test: /\.s?css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						'css-loader', 
						'postcss-loader', 
						'sass-loader'
					],
					publicPath: './dist'
				})
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [
					'file-loader?name=[name].[ext]&outputPath=images/&publicPath=../',
					'image-webpack-loader'
				]
			},
			// {
			// 	test: /\.(svg|png|ico|xml|json)$/i,
			// 	use: [
			// 		'file-loader?name=favicons/[name].[ext]&outputPath=images/&publicPath=../',
			// 		'image-webpack-loader'
			// 	]
			// },
			{
				test: /\.(mp4|ogg)$/i,
				use: [
					'file-loader?name=[name].[ext]&outputPath=videos/&publicPath=../',
					'image-webpack-loader'
				]
			},
			// {
			// 	// setting up the favicon folder
			// 	test: /\.(svg|png|ico|xml|json)$/,
			// 	use: 
			// 	{
			// 		loader: 'file-loader',
			// 		options: {
			// 			name: 'favicons/[name].[ext]',
			// 			publicPath: '../'
			// 		}
			// 	}
			// },
			{
		        test: /\.txt$/,
		        use: 'raw-loader'
		    }
		]
	},
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		port: process.env.PORT || 9000,
		open: true,
		stats: "errors-only",
		openPage: '' 
	},
	plugins: [
		new CopyWebpackPlugin([
            {
            	from:'src/favicons',
            	to:'favicons'
            } 
        ]),
        new CopyWebpackPlugin([
            {
            	from:'src/images',
            	to:'images'
            } 
        ]),  
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		new ExtractTextPlugin({
			filename: "./css/[name].css",
			allChunks: true
		}),
		new HtmlWebpackPlugin({
			title:'Start',
			filename: 'index.html',
			template: './src/index.html'
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Grid System',
			filename: 'grid.html',
			template: './src/grid.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Typography',
			filename: 'typography.html',
			template: './src/typography.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Colors',
			filename: 'colors.html',
			template: './src/colors.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Buttons',
			filename: 'buttons.html',
			template: './src/buttons.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Icons',
			filename: 'icons.html',
			template: './src/icons.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Navigation',
			filename: 'navigation.html',
			template: './src/navigation.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Tables',
			filename: 'tables.html',
			template: './src/tables.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Maps',
			filename: 'maps.html',
			template: './src/maps.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Forms',
			filename: 'forms.html',
			template: './src/forms.html' 
		}),
		/*	
		new HtmlWebpackPlugin({
			title: 'CEMEX Developers',
			filename: 'developers.html',
			template: './src/developers.html' 
		}),*/
		new HtmlWebpackPlugin({
			title: 'CEMEX Dashboard Modules',
			filename: 'dashboard-modules.html',
			template: './src/dashboard-modules.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Mobile UI',
			filename: 'mobile-ui.html',
			template: './src/mobile-ui.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Developers',
			filename: 'developers.html',
			template: './src/developers.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX 404',
			filename: '404.html',
			template: './src/404.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'Partials: Favicon',
			filename: './partials/favicon.html',
			template: './src/partials/favicon.html',
			inject: false	 
		}),
		new HtmlWebpackPlugin({
			title: 'Partials: Side nav',
			filename: './partials/sidenav.html',
			template: './src/partials/sidenav.html',
			inject: false	 
		}),
		new HtmlWebpackPlugin({
			title: 'Partials: Side nav rtl',
			filename: './partials/sidenav-rtl.html',
			template: './src/partials/sidenav-rtl.html',
			inject: false	 
		}),	
		new HtmlWebpackPlugin({
			title: 'Partials: Side nav demo arab rtl',
			filename: './partials/sidenav-demo-arab-rtl.html',
			template: './src/partials/sidenav-demo-arab-rtl.html',
			inject: false	 
		}),
		new HtmlWebpackPlugin({
			title: 'Partials: Side nav demo hebrew rtl',
			filename: './partials/sidenav-demo-hebrew-rtl.html',
			template: './src/partials/sidenav-demo-hebrew-rtl.html',
			inject: false	 
		}),					
		new HtmlWebpackPlugin({
			title: 'Partials: Icons',
			filename: './partials/icons.html',
			template: './src/partials/icons.html',
			inject: false 
		}),		
		new HtmlWebpackPlugin({
			title: 'Partials: Top nav',
			filename: './partials/topnav.html',
			template: './src/partials/topnav.html',
			inject: false 
		}),
		new HtmlWebpackPlugin({
			title: 'Partials: Top nav rtl',
			filename: './partials/topnav-rtl.html',
			template: './src/partials/topnav-rtl.html',
			inject: false 
		}),
		new HtmlWebpackPlugin({
			title: 'Partials: Top nav demo rtl',
			filename: './partials/topnav-demo-arab-rtl.html',
			template: './src/partials/topnav-demo-arab-rtl.html',
			inject: false 
		}),
		new HtmlWebpackPlugin({
			title: 'Partials: Top nav demo hebrew rtl',
			filename: './partials/topnav-demo-hebrew-rtl.html',
			template: './src/partials/topnav-demo-hebrew-rtl.html',
			inject: false 
		}),
		new HtmlWebpackPlugin({
			title: 'Partials: Footer',
			filename: './partials/footer.html',
			template: './src/partials/footer.html',
			inject: false 
		}),
		new HtmlWebpackPlugin({
			title: 'Partials: Footer',
			filename: './partials/overlays.html',
			template: './src/partials/overlays.html',
			inject: false 
		}),


		// new pages to match latest sent out structure
		new HtmlWebpackPlugin({
			title: 'CEMEX Design Principles',
			filename: 'design-principles.html',
			template: './src/design-principles.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Brand',
			filename: 'brand.html',
			template: './src/brand.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Content',
			filename: 'content.html',
			template: './src/content.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Content',
			filename: 'content-heading.html',
			template: './src/content-heading.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Layout',
			filename: 'layout.html',
			template: './src/layout.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Motion',
			filename: 'motion.html',
			template: './src/motion.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Navigation',
			filename: 'navigation.html',
			template: './src/navigation.html' // already in - check to align
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Colors',
			filename: 'colors.html',
			template: './src/colors.html' // already in - check to align
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Grid System',
			filename: 'grid-system.html',
			template: './src/grid-system.html' // this was in AS grid.html - changing to grid-system.html
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Units and Measurements ',
			filename: 'units.html',
			template: './src/units.html' // this was in AS grid.html - changing to grid-system.html
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Iconography',
			filename: 'iconography.html',
			template: './src/iconography.html' // this was in AS icons.html - changing to iconography.html
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Typography',
			filename: 'typography.html',
			template: './src/typography.html' // already in - check to align
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Alert',
			filename: 'alert.html',
			template: './src/alert.html' // this was in AS alerts.html - changing to alert.html
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Avatar',
			filename: 'avatar.html',
			template: './src/avatar.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Breadcrumb',
			filename: 'breadcrumb.html',
			template: './src/breadcrumb.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Buttons',
			filename: 'buttons.html',
			template: './src/buttons.html' // already in - check to align
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Calendar',
			filename: 'calendar.html',
			template: './src/calendar.html' // this was date-time.html - becomes calendar.html
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Checkbox',
			filename: 'checkbox.html',
			template: './src/checkbox.html'
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Checkbox',
			filename: 'switch.html',
			template: './src/switch.html'
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Console Navigation',
			filename: 'console-navigation.html',
			template: './src/console-navigation.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Dashboard',
			filename: 'dashboard.html',
			template: './src/dashboard.html' // this was dashboard-modules.html - becomes dashboard.html
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Detail Page',
			filename: 'detail-page.html',
			template: './src/detail-page.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Dropdown',
			filename: 'dropdown.html',
			template: './src/dropdown.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Emails',
			filename: 'emails.html',
			template: './src/emails.html' // this was 404.html - becomes errors.html
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Errors',
			filename: 'errors.html',
			template: './src/errors.html' // this was 404.html - becomes errors.html
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Footer',
			filename: 'footer.html',
			template: './src/footer.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Forms',
			filename: 'forms.html',
			template: './src/forms.html' // this already exists - just adjust
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Header Global',
			filename: 'header-global.html',
			template: './src/header-global.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Header Local',
			filename: 'header-local.html',
			template: './src/header-local.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Inline Dialogue',
			filename: 'inline-dialogue.html',
			template: './src/inline-dialogue.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Language Selector',
			filename: 'language-selector.html',
			template: './src/language-selector.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Lightbox',
			filename: 'lightbox.html',
			template: './src/lightbox.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Loader',
			filename: 'loader.html',
			template: './src/loader.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX  Maps',
			filename: 'maps.html',
			template: './src/maps.html' // already there - might need adjustments
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Modal',
			filename: 'modal.html',
			template: './src/modal.html' // former modals.html - becomes modal.html
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Notification',
			filename: 'notification.html',
			template: './src/notification.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Numeric Filter',
			filename: 'numeric-filter.html',
			template: './src/numeric-filter.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Pagination',
			filename: 'pagination.html',
			template: './src/pagination.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Password Strenght',
			filename: 'password-strenght.html',
			template: './src/password-strenght.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Progress Bar',
			filename: 'progress-bar.html',
			template: './src/progress-bar.html' // formerly know as progress-bars.html
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Progress Bar',
			filename: 'charts.html',
			template: './src/charts.html' // formerly within progress-bar.html
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Radio Button',
			filename: 'radio-button.html',
			template: './src/radio-button.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Search Local',
			filename: 'search-local.html',
			template: './src/search-local.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Skeleton Screens',
			filename: 'skeleton-screens.html',
			template: './src/skeleton-screens.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Status Indicator',
			filename: 'status-indicator.html',
			template: './src/status-indicator.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Stepper',
			filename: 'stepper.html',
			template: './src/stepper.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Tables',
			filename: 'tables.html',
			template: './src/tables.html' // already exists - check to see if you can update
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Tabs',
			filename: 'tabs.html',
			template: './src/tabs.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Tags',
			filename: 'tags.html',
			template: './src/tags.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Tooltips',
			filename: 'tooltips.html',
			template: './src/tooltips.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Recommendations',
			filename: 'recommendations.html',
			template: './src/recommendations.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Top Navigation - Standalone',
			filename: 'top-navigation-standalone.html',
			template: './src/top-navigation-standalone.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Side Navigation - Standalone',
			filename: 'side-navigation-standalone.html',
			template: './src/side-navigation-standalone.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Side Legal Entity Navigation - Standalone',
			filename: 'side-navigation-legal-entity-standalone.html',
			template: './src/side-navigation-legal-entity-standalone.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Footer - Standalone',
			filename: 'footer-standalone.html',
			template: './src/footer-standalone.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Footer - Bottom Bar',
			filename: 'bottom-bar.html',
			template: './src/bottom-bar.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Footer - Dropzone',
			filename: 'dropzone.html',
			template: './src/dropzone.html' 
		}),
		
		// RTL

		new HtmlWebpackPlugin({
			title:'CEMEX Index - RTL',
			filename: 'index-rtl.html',
			template: './src/index-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Iconography - RTL',
			filename: 'iconography-rtl.html',
			template: './src/iconography-rtl.html' // this was in AS icons.html - changing to iconography.html
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Buttons - RTL',
			filename: 'buttons-rtl.html',
			template: './src/buttons-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Checkbox - RTL',
			filename: 'checkbox-rtl.html',
			template: './src/checkbox-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Radio Button - RTL',
			filename: 'radio-button-rtl.html',
			template: './src/radio-button-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Alert - RTL',
			filename: 'alert-rtl.html',
			template: './src/alert-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Breadcrumb - RTL',
			filename: 'breadcrumb-rtl.html',
			template: './src/breadcrumb-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Calendar - RTL',
			filename: 'calendar-rtl.html',
			template: './src/calendar-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Dropdown - RTL',
			filename: 'dropdown-rtl.html',
			template: './src/dropdown-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Emails RTL',
			filename: 'emails-rtl.html',
			template: './src/emails-rtl.html' // this was 404.html - becomes errors.html
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Inline Dialogue - RTL',
			filename: 'inline-dialogue-rtl.html',
			template: './src/inline-dialogue-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Header Local - RTL',
			filename: 'header-local-rtl.html',
			template: './src/header-local-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Lightbox - RTL',
			filename: 'lightbox-rtl.html',
			template: './src/lightbox-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Modal - RTL',
			filename: 'modal-rtl.html',
			template: './src/modal-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Maps - RTL',
			filename: 'maps-rtl.html',
			template: './src/maps-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Notification - RTL',
			filename: 'notification-rtl.html',
			template: './src/notification-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Footer - RTL',
			filename: 'footer-rtl.html',
			template: './src/footer-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Stepper - RTL',
			filename: 'stepper-rtl.html',
			template: './src/stepper-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Status Indicator - RTL',
			filename: 'status-indicator-rtl.html',
			template: './src/status-indicator-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Tabs - RTL',
			filename: 'tabs-rtl.html',
			template: './src/tabs-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Numeric Filter - RTL',
			filename: 'numeric-filter-rtl.html',
			template: './src/numeric-filter-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Pagination - RTL',
			filename: 'pagination-rtl.html',
			template: './src/pagination-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Password Strength - RTL',
			filename: 'password-strenght-rtl.html',
			template: './src/password-strenght-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Progress Bar - RTL',
			filename: 'progress-bar-rtl.html',
			template: './src/progress-bar-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Tags - RTL',
			filename: 'tags-rtl.html',
			template: './src/tags-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Tables - RTL',
			filename: 'tables-rtl.html',
			template: './src/tables-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Tooltips - RTL',
			filename: 'tooltips-rtl.html',
			template: './src/tooltips-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Forms - RTL',
			filename: 'forms-rtl.html',
			template: './src/forms-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Navigation - RTL',
			filename: 'navigation-rtl.html',
			template: './src/navigation-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Console Navigation - RTL',
			filename: 'console-navigation-rtl.html',
			template: './src/console-navigation-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Dropzone - RTL',
			filename: 'dropzone-rtl.html',
			template: './src/dropzone-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Typography - RTL',
			filename: 'typography-rtl.html',
			template: './src/typography-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Errors - RTL',
			filename: 'errors-rtl.html',
			template: './src/errors-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Avatar - RTL',
			filename: 'avatar-rtl.html',
			template: './src/avatar-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Search Local - RTL',
			filename: 'search-local-rtl.html',
			template: './src/search-local-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Demo Page Arab - RTL',
			filename: 'demo-page-arab-rtl.html',
			template: './src/demo-page-arab-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Demo Page Hebrew - RTL',
			filename: 'demo-page-hebrew-rtl.html',
			template: './src/demo-page-hebrew-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Global Structure - RTL',
			filename: 'global-structure-rtl.html',
			template: './src/global-structure-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Button Placement - RTL',
			filename: 'button-placement-rtl.html',
			template: './src/button-placement-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX One Column Layout - RTL',
			filename: 'one-column-rtl.html',
			template: './src/one-column-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title:'CEMEX Switch - RTL',
			filename: 'switch-rtl.html',
			template: './src/switch-rtl.html'
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Chart - RTL',
			filename: 'charts-rtl.html',
			template: './src/charts-rtl.html' // formerly within progress-bar.html
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Content Heading - RTL',
			filename: 'content-heading-rtl.html',
			template: './src/content-heading-rtl.html' // formerly within progress-bar.html
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Detail Page - RTL',
			filename: 'detail-page-rtl.html',
			template: './src/detail-page-rtl.html' // formerly within progress-bar.html
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Mobile UI - RTL',
			filename: 'mobile-ui-rtl.html',
			template: './src/mobile-ui-rtl.html' 
		}),
		new HtmlWebpackPlugin({
			title: 'CEMEX Units Formatting - RTL',
			filename: 'units-formatting-rtl.html',
			template: './src/units-formatting-rtl.html' 
		}),
	]
}