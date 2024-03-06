import React, {useRef, useState, useEffect} from "react";
import HeaderLayout from '../components/headerLayout.js';
import { Link } from "gatsby";

import { graphql } from 'gatsby';

const IndexPage = ({ data }) => {
    return (
	<>
	    <HeaderLayout />
	    <ul>
		{
		    data.allMarkdownRemark.nodes.map((node, i) => (
			<Link key={i} to={node.path}>
			    {"-> " + node.frontmatter.title}
			</Link>
		    ))
		}
	    </ul>
	</>
    );
}

export default IndexPage

export const Head = () => <title>Home Page</title>

export const query = graphql`
    query {
      allMarkdownRemark {
        nodes {
          frontmatter {
            title
            slug
          }
          path: gatsbyPath(filePath: "/{MarkdownRemark.frontmatter__slug}")
        }
      }
    }
`
