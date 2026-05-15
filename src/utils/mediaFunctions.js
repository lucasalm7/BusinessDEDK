import axios from 'axios';

export const fetchVideosFromAPI = async () => {
  try {
    const response = await axios.get(
      'http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/video?acf_format=standard&per_page=100'
    );
    return response.data;
  } catch (err) {
    console.error("Polling error:", err);
    return [];
  }
};

export const fetchVideoBySlug = async (slug) => {
  try {
    const response = await axios.get(
      `http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/video?slug=${slug}&acf_format=standard`
    );
    if (response.data.length > 0) {
      return response.data[0];
    }
    throw new Error("Video not found");
  } catch (err) {
    throw new Error("Failed to load video: " + err.message);
  }
};

export const fetchVideoById = async (id) => {
  try {
    // We change 'posts' to 'video' based on your JSON data
    const response = await axios.get(
      `http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/video/${id}?acf_format=standard`
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching video by ID:", err);
    throw new Error("Video not found");
  }
};

const filterRules = {
  search: (video, query) => {
    if (!query) return true;
    const searchBucket = [
      video.title?.rendered?.toLowerCase(),
      video.acf?.video_short_description?.toLowerCase(),
      video.acf?.video_type?.name?.toLowerCase(),
      video.class_list?.join(' ').toLowerCase()
    ].join(' ');
    return searchBucket.includes(query.toLowerCase());
  },

  language: (video, language) => 
    language === 'All' || 
    video.class_list.includes(`video_language-${language.toLowerCase()}`),

  type: (video, type) => 
    type === 'All' || 
    video.acf?.video_type?.name === type,

  topic: (video, topic) => 
    topic === 'All' || 
    video.class_list.includes(`video_topic-${topic.toLowerCase().replace(/\s+/g, '-')}`)
};

export const filterVideos = (videos, searchQuery, selectedLanguage, selectedType, selectedTopic) => {
  return videos.filter(video =>
    filterRules.search(video, searchQuery) &&
    filterRules.language(video, selectedLanguage) &&
    filterRules.type(video, selectedType) &&
    filterRules.topic(video, selectedTopic)
  );
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const shareOnLinkedIn = (url) => {
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
};

export const shareOnFacebook = (url) => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

export const shareOnInstagram = () => {
  window.open('https://www.instagram.com', '_blank');
};

export const shareViaEmail = (title, url) => {
  const subject = encodeURIComponent(title);
  const body = encodeURIComponent(`Check out this video: ${url}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
};