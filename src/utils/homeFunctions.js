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