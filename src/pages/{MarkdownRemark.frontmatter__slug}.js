import React, {useRef, useState, useEffect} from "react";
import HeaderLayout from '../components/headerLayout.js';

import { graphql } from 'gatsby';

const IndexPage = ({ data }) => {
    return (<>
		<HeaderLayout />
		<div style={{"margin": "0 20%"}}
		     dangerouslySetInnerHTML={{__html: data.markdownRemark.html}} />
	    </>
	   );
}

export default IndexPage

export const Head = () => <title>Home Page</title>

export const query = graphql`
    query ($frontmatter__slug : String){
      markdownRemark (frontmatter: {slug: {eq: $frontmatter__slug}}){
        frontmatter {
          title
          slug
        }
        html
      }
    }
`
