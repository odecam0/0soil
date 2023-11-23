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
		// ( https://www.gatsbyjs.com/plugins/gatsby-omni-font-loader/
		// ( https://www.gatsbyjs.com/docs/how-to/images-and-media/static-folder/
		// I must add the font files, and a css file in the static folder.
		custom: [ {
		    name: ["KdamThmorPro"],
		    file: "Kdam_Thmor_Pro/KdamThmorPro-Regular.css"
		} ]
	    }
	}
    ],
}

// https://fonts.googleapis.com/css2?family=Kdam+Thmor+Pro
