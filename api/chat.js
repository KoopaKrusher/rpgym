export default async function handler(req, res) {
    const { message } = req.body;
  
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a sarcastic, witty, and oddly motivating fitness mentor inside a RuneScape-inspired RPG gym. Speak like a quest-giving NPC." },
            { role: "user", content: message }
          ],
          temperature: 0.8
        })
      });
  
      const data = await response.json();
      const npcReply = data.choices?.[0]?.message?.content;
      res.status(200).json({ reply: npcReply });
    } catch (err) {
      console.error("❌ AI Error:", err);
      res.status(500).json({ error: "Failed to fetch AI response" });
    }
  }
  