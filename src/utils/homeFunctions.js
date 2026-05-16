// src/utils/mediaFunctions.js (add this)
import axios from 'axios';

export const fetchPageData = async (pageId) => {
  try {
    const response = await axios.get(
      `http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/pages/227?acf_format=standard`
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching page:", err);
    return null;
  }
};

export const fetchNetworkLogos = async () => {
  try {
    const res = await axios.get('http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/databasecard?per_page=100&acf_format=standard');
    const items = Array.isArray(res.data) ? res.data : [];
    
    return items
      .map(item => {
        const acf = item.acf || {};
        const logoField = acf.logo_ || acf.logo || null;
        // Match your teammate's parsing logic precisely
        const logoUrl = logoField && (logoField.url || logoField.sourceUrl || (logoField.sizes && (logoField.sizes.medium || logoField.sizes.large))) || '';
        return {
          id: item.id,
          title: item.title?.rendered || '',
          logoUrl: logoUrl
        };
      })
      .filter(company => company.logoUrl !== ''); // Drop companies with no logo uploaded
  } catch (err) {
    console.error("Error pulling network logos:", err);
    return [];
  }
};

const GRAPHQL_URL = 'http://businessdedk.lucasalmeida.dk/graphql';

const RECENT_POSTS_QUERY = `
{
  blogposts {
    nodes {
      title
      slug
      blogPostFields {
        category
        subtittle
        image {
          node {
            sourceUrl
          }
        }
      }
    }
  }
}
`;

export const fetchRecentBlogPosts = async () => {
  try {
    const response = await axios.post(GRAPHQL_URL, { query: RECENT_POSTS_QUERY });
    const allPosts = response.data?.data?.blogposts?.nodes || [];
    return allPosts.slice(0, 3);  // Add this line
  } catch (err) {
    console.error('Failed to grab homepage blog posts:', err);
    return [];
  }
};