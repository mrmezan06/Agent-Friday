const Groq = require('groq-sdk');

class GroqService {
  constructor() {
    this.client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    this.model = 'llama-3.3-70b-versatile';
  }

  async classifyAndProcessCommand(command) {
    const classificationPrompt = `You are an AI assistant command classifier. Analyze the following user command and determine:
1. The type of command (search, question, weather, open_website, close_tab, delete_history, other)
2. The extracted query/parameters

User command: "${command}"

Respond with a JSON object only (no markdown, no code blocks):
{
  "type": "search | question | weather | open_website | close_tab | delete_history | other",
  "query": "extracted search query or question",
  "subtype": "google | wikipedia | youtube | facebook | twitter| x | github | instagram | general" (only for search type),
  "target": "website name or tab name" (only for open_website/close_tab),
  "browser": "current | specific browser name" (only for open_website)
}

`;

    const completion = await this.client.chat.completions.create({
      messages: [{ role: 'user', content: classificationPrompt }],
      model: this.model,
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(completion.choices[0]?.message?.content || '{}');
  }

  async askQuestion(question, searchContext = null) {
    let contextPrompt = `You are an AI assistant modeled after **JARVIS**.

### Core Behavior

* Calm, precise, efficient
* Minimal words, maximum clarity
* Slightly formal, never verbose
* Subtle dry wit (rare, controlled)

### Addressing the User

* Always address the user as **“sir”**
* Use it naturally (start or end of sentence), not excessively

### Style Rules

* Default to **short answers (1–4 sentences)**
* Expand only if explicitly asked
* No filler, no repetition
* No emojis, no casual tone

### Interaction Pattern

* Answer directly
* If useful, add one concise recommendation
* If the user is inefficient or incorrect:

  * “That approach is suboptimal, sir. I recommend…”

### Language

* Clean, neutral, technical phrasing
* Preferred expressions:

  * “As you wish.”
  * “It appears ...” 
  * “I recommend…”

### Role
* You are JARVIS an AI Assistant

### Example

User: “How do I fix this?”

Assistant:
“The issue appears to be a null reference.

Add a guard clause before access. I recommend validating inputs at the boundary.”`;

    if (searchContext) {
      contextPrompt += `\n\nUse the following search results to answer the question. Cite the sources at the end.\nSearch Results:\n${searchContext}`;
    }

    const completion = await this.client.chat.completions.create({
      messages: [
        { role: 'system', content: contextPrompt },
        { role: 'user', content: question },
      ],
      model: this.model,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return {
      answer:
        completion.choices[0]?.message?.content ||
        'I could not generate an answer.',
      usage: completion.usage,
    };
  }

  async summarizeSearchResults(query, results) {
    const prompt = `Summarize the following search results for the query "${query}" in a concise paragraph. Include key information and mention the sources.

Search Results:
${results.map((r, i) => `${i + 1}. ${r.title}: ${r.snippet}`).join('\n')}

Provide a natural, spoken-style summary (2-3 sentences).`;

    const completion = await this.client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: this.model,
      temperature: 0.5,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content || '';
  }

  async getWeatherSummary(weatherData, location) {
    const prompt = `Given the following weather data for ${location}, provide a friendly spoken weather summary including temperature, conditions, and any precautions if needed.

Weather Data:
Temperature: ${weatherData.main.temp}°C
Feels Like: ${weatherData.main.feels_like}°C
Conditions: ${weatherData.weather[0].description}
Humidity: ${weatherData.main.humidity}%
Wind Speed: ${weatherData.wind.speed} m/s

Provide a natural 2-3 sentence spoken summary.`;

    const completion = await this.client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: this.model,
      temperature: 0.5,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content || '';
  }
}

module.exports = new GroqService();
