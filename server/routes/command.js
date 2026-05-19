const express = require('express');
const router = express.Router();
const GroqService = require('../services/groqService');
const SearchService = require('../services/searchService');
const WeatherService = require('../services/weatherService');
const commandController = require('../controllers/commandController');

function normalizeUrl(target, browser) {
  let url = target.toLowerCase().trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    if (!url.includes('.')) {
      url = `https://www.${url}.com`;
    } else {
      url = `https://${url}`;
    }
  }
  return { url, target, browser: browser || 'current' };
}

router.post('/process', async (req, res) => {
  try {
    const { command } = req.body;
    if (!command) return res.status(400).json({ error: 'Command is required' });

    const classification = await GroqService.classifyAndProcessCommand(command);
    const { type, query, subtype, target, browser } = classification;

    let result = null;
    let sources = [];
    let sourceType = 'execute_only';
    let spokenResponse = '';

    switch (type) {
      case 'search': {
        // console.log('google');
        const engine =
          subtype === 'general' || subtype === 'General' ? 'google' : subtype;

        // console.log(
        //   `Type: ${type}\n Query: ${query}\nSubtype: ${subtype}\nEngine: ${engine}\n Target: ${target}\n Browser: ${browser}`,
        // );
        const results = await SearchService.searchGeneral(query, engine);

        if (engine === 'google' || engine === 'Google') {
          if (results.length > 0) {
            sources = results.map((r) => ({ title: r.title, link: r.link }));

            spokenResponse = await GroqService.summarizeSearchResults(
              query,
              results,
            );
            result = { results, engine };
          }
        }
        if (engine === 'youtube' || engine === 'Youtube') {
          spokenResponse = `Searching for ${query} on Youtube ...`;
          sourceType = 'execute_only';
          result = {
            url: results,
            target: 'Youtube',
            browser: browser || 'current',
          };
        }
        if (engine === 'wikipedia' || engine === 'Wikipedia') {
          spokenResponse = `Searching for ${query} on Wikipedia ...`;
          sourceType = 'execute_only';
          result = {
            url: results,
            target: 'Wikipedia',
            browser: browser || 'current',
          };
        }
        if (engine === 'facebook' || engine === 'Facebook') {
          spokenResponse = `Searching for ${query} on Facebook ...`;
          sourceType = 'execute_only';
          result = {
            url: results,
            target: 'Facebook',
            browser: browser || 'current',
          };
        }
        if (engine === 'twitter' || engine === 'x') {
          spokenResponse = `Searching for ${query} on ${engine} ...`;
          sourceType = 'execute_only';
          result = {
            url: results,
            target: 'X',
            browser: browser || 'current',
          };
        }

        if (engine === 'github' || engine === 'Github') {
          spokenResponse = `Searching for ${query} on Github ...`;
          sourceType = 'execute_only';
          result = {
            url: results,
            target: 'Github',
            browser: browser || 'current',
          };
        }
        break;
      }

      case 'question': {
        // if it's a question, we can ask groq llm directly
        const { answer } = await GroqService.askQuestion(command);
        spokenResponse = answer;
        result = { answer };
        sourceType = 'groq_llm';
        sources = [{ title: 'Groq LLM (llama-3.3-70b-versatile)', url: '' }];
        break;
      }

      case 'weather': {
        const weatherData = await WeatherService.getWeatherMyCity();
        spokenResponse = await GroqService.getWeatherSummary(
          weatherData,
          'Dinajpur',
        );
        result = weatherData;
        sourceType = 'weather';
        sources = [{ title: 'Open-Meteo', url: 'https://api.open-meteo.com/' }];
        break;
      }

      case 'open_website': {
        const urlData = normalizeUrl(target, browser);
        result = urlData;
        spokenResponse = `Opening ${target}${browser && browser !== 'current' ? ` in ${browser}` : ''}.`;
        sourceType = 'execute_only';

        break;
      }

      case 'close_tab': {
        result = { target };
        spokenResponse = `Closing the ${target} tab.`;
        sourceType = 'execute_only';
        break;
      }

      case 'delete_history': {
        await commandController.deleteAllCommands();
        spokenResponse = 'All command history has been deleted.';
        result = { deleted: true };
        sourceType = 'execute_only';
        break;
      }

      default: {
        const { answer } = await GroqService.askQuestion(command);
        spokenResponse = answer;
        result = { answer };
        sourceType = 'groq_llm';
        sources = [{ title: 'Groq LLM (llama-3.3-70b-versatile)', url: '' }];
        break;
      }
    }

    const savedCommand = await commandController.saveCommand({
      type,
      command,
      query: query || command,
      result,
      sources,
      sourceType,
      spokenResponse,
    });
    res.json({
      success: true,
      classification,
      result,
      sources,
      sourceType,
      spokenResponse,
      commandId: savedCommand?._id,
    });
  } catch (error) {
    console.error('Command processing error:', error.message);
    res
      .status(500)
      .json({ error: 'Failed to process command', details: error.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const commands = await commandController.getAllCommands(page);
    res.json({ success: true, commands });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.delete('/history', async (req, res) => {
  try {
    await commandController.deleteAllCommands();
    res.json({ success: true, message: 'All history deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete history' });
  }
});

module.exports = router;
