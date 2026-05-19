const axios = require('axios');
const cheerio = require('cheerio');

class SearchService {
  async searchGoogle(query) {
    let data = JSON.stringify({
      q: query,
    });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://google.serper.dev/search',
      headers: {
        'X-API-KEY': process.env.SERP_API_KEY,
        'Content-Type': 'application/json',
      },
      data: data,
    };

    async function makeRequest() {
      try {
        const response = await axios.request(config);
        const results = response.data.organic || [];
        return results;
      } catch (error) {
        // if error occured simply make a result
        console.log('Exception occured: ', error);
      }
    }
    return makeRequest();
  }

  searchYouTube(query) {
    let url = `https://www.youtube.com/results?search_query=${query}`;
    return url;
  }

  searchWikipedia(query) {
    let url = `https://en.wikipedia.org/w/index.php?search=${query}`;
    return url;
  }
  searchFacebook(query) {
    let url = `https://www.facebook.com/search/top/?q=${query}`;
    return url;
  }

  searchTwitter(query) {
    let url = `https://x.com/search?q=${query}`;
    return url;
  }

  searchGithub(query) {
    let url = `https://github.com/search?q=${query}&type=repositories`;
    return url;
  }

  // there is need to implement some kind other search facility like facebook, twitter, youtube, instagram, wikipedia, github etc. which is
  async searchGeneral(query, engine = 'google') {
    const engineMap = {
      google: this.searchGoogle,
      youtube: this.searchYouTube,
      wikipedia: this.searchWikipedia,
      facebook: this.searchFacebook,
      twitter: this.searchTwitter,
      x: this.searchTwitter,
      instagram: this.searchGeneral,
      github: this.searchGithub,
    };

    const searchFn = engineMap[engine] || engineMap.google;
    return searchFn.call(this, query);
  }

  async duckDuckGoFallback(query) {
    try {
      const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const results = [];

      $('.result').each((i, el) => {
        if (i >= 5) return false;
        const titleEl = $(el).find('.result__title a');
        const title = titleEl.text().trim();
        const link = titleEl.attr('href');
        const snippet = $(el).find('.result__snippet').text().trim();

        if (title && link) {
          results.push({
            title,
            url: link.startsWith('//') ? 'https:' + link : link,
            snippet: snippet || 'No description available',
          });
        }
      });

      return results;
    } catch (error) {
      console.error('DuckDuckGo fallback error:', error.message);
      return [];
    }
  }
}

module.exports = new SearchService();
