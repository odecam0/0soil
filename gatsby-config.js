/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `odecamsoil`,
    siteUrl: `https://www.yourdomain.tld`,
  },
    plugins: [
	{
	    resolve: 'gatsby-omni-font-loader',
	    options: {
		// I must add the font files, and a css file in the static folder.
		custom: [ {
		    name: ["KdamThmorPro"],
		    file: "Kdam_Thmor_Pro/KdamThmorPro-Regular.css"
		} ]
	    }
	},
	{
	    resolve: 'gatsby-transformer-remark',
	    options: {},
	},
	{
	    resolve: 'gatsby-source-filesystem',
	    options: {
		name: 'posts',
		path: `${__dirname}/static/posts/`
	    },
	}
    ],
}

// https://fonts.googleapis.com/css2?family=Kdam+Thmor+Pro
