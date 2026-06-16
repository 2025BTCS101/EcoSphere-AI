import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Returns a rule-based simulated response if Gemini API key is missing.
 * Analyzes the emissions profile to give highly custom recommendations.
 */
function getSimulatedResponse(message, emissions) {
  const msg = message.toLowerCase();
  const { transport, electricity, food, shopping, total } = emissions;

  let advice;

  if (msg.includes("transport") || msg.includes("car") || msg.includes("drive") || msg.includes("flight") || msg.includes("travel")) {
    advice = `Your transport emissions are currently **${transport} kg CO2e/month**. 
    
Here are my specific tips for you:
1. **Optimize Commuting**: Since you have ${transport > 200 ? 'high' : 'moderate'} transport emissions, switching to public transit or carpooling twice a week can save up to 25% of your travel impact.
2. **Eco-Driving**: Accelerate smoothly, maintain proper tire pressure, and remove extra weight to improve fuel economy by 10%.
3. **Electrification**: Consider an electric vehicle (EV) or electric bike for short trips; they emit up to 80% less than fossil fuel cars.
4. **Flight Offsets**: For unavoidable flights, choose direct routes and purchase verified carbon offsets (CERs).`;
  } else if (msg.includes("food") || msg.includes("diet") || msg.includes("meat") || msg.includes("vegan") || msg.includes("eat")) {
    advice = `Your dietary emissions are **${food} kg CO2e/month**. 
    
Suggestions to lower this:
1. **Reduce Red Meat**: Beef and lamb have 10x the carbon footprint of chicken or fish, and 30x that of lentils/beans. Replacing beef just twice a week saves around 200kg of CO2 per year.
2. **Prevent Food Waste**: 30% of global food is wasted. Planning meals, storing food properly, and freezing leftovers directly cuts landfill methane emissions.
3. **Eat Seasonal**: Out-of-season produce imported via air has a massive freight impact. Prioritize local and regional grains and greens.`;
  } else if (msg.includes("electricity") || msg.includes("power") || msg.includes("energy") || msg.includes("heat") || msg.includes("ac")) {
    advice = `Your electricity impact is **${electricity} kg CO2e/month**. 
    
Here is how you can optimize your home:
1. **LED Transition**: Replace incandescent bulbs with LEDs. They use 75% less energy and last 25 times longer.
2. **Smart Thermostats**: Adjusting your temperature settings by just 1-2 degrees can save up to 10% on your yearly heating/cooling bills.
3. **Vampire Draw**: Turn off power strips for electronics when idle. Idle devices account for up to 10% of residential energy use.
4. **Renewable Energy**: Check if your grid provider offers a green power option, or explore local solar panel installation.`;
  } else if (msg.includes("shopping") || msg.includes("buy") || msg.includes("clothes") || msg.includes("spend")) {
    advice = `Your shopping emissions total **${shopping} kg CO2e/month**. 
    
Ways to shop sustainably:
1. **Buy Quality & Repair**: Extend the life of clothes and electronics. Double the life of a garment reduces its emissions by 44%.
2. **Second-hand First**: Platforms for thrift and refurbished tech drastically reduce manufacturing demand.
3. **Minimalist Habits**: Before purchasing, apply the 48-hour rule: wait 2 days to see if you genuinely need the item.`;
  } else if (msg.includes("predict") || msg.includes("future") || msg.includes("next month") || msg.includes("forecast")) {
    advice = `Based on your current baseline of **${total} kg CO2e/month**, next month is predicted to hover around **${Math.round(total * 0.95)} kg CO2e/month** if you implement green habits. 
    
My key insight: Your biggest impact area is **${
      transport >= Math.max(electricity, food, shopping) ? 'Transport' : 
      electricity >= Math.max(transport, food, shopping) ? 'Electricity usage' : 
      food >= Math.max(transport, electricity, shopping) ? 'Diet habits' : 'Shopping'
    }**. Focus on optimizing this category first to achieve the fastest footprint reductions!`;
  } else {
    advice = `Your total carbon footprint is **${total} kg CO2e/month**, placing you in the **${
      total < 400 ? 'top-tier eco leaders' : total < 700 ? 'average sustainability champions' : 'high-impact zone'
    }**.
    
Here is a personalized reduction strategy:
- **Primary Goal**: Target **${
      transport >= Math.max(electricity, food, shopping) ? 'Transport' : 
      electricity >= Math.max(transport, food, shopping) ? 'Electricity' : 
      food >= Math.max(transport, electricity, shopping) ? 'Diet' : 'Shopping'
    }** (your largest sector at **${Math.max(transport, electricity, food, shopping)} kg CO2e**).
- **Secondary Goal**: Complete your checklist of 5 daily green habits in the dashboard to boost your Eco Score.
- **Off-setting**: You currently require **${(total / 1.83).toFixed(0)} trees** to be planted monthly to fully offset your output.
    
What specific category (Transport, Energy, Food, or Shopping) would you like me to help you optimize first?`;
  }

  return advice;
}

/**
 * Communicates with Gemini API or falls back to rules engine.
 */
export async function getSustainabilityAdvice(apiKey, messages, currentEmissions) {
  if (!apiKey) {
    // Return simulated response with artificial typing delay (1.2 seconds)
    return new Promise((resolve) => {
      setTimeout(() => {
        const userMessage = messages[messages.length - 1]?.text || "";
        resolve(getSimulatedResponse(userMessage, currentEmissions));
      }, 1200);
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

 

    // Insert system instructions in front or use chat sessions
   const chat = model.startChat();

    const lastMessage = messages[messages.length - 1]?.text || "";
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `I encountered an issue communicating with the Gemini API (Error: ${error.message}). Let me fall back to local coaching:\n\n` + getSimulatedResponse(messages[messages.length - 1]?.text || "", currentEmissions);
  }
}

/**
 * Generates an initial carbon prediction and AI insights text
 */
export async function getCarbonPredictionInsights(apiKey, emissionsHistory, currentEmissions) {
  const prompt = `Review this user's monthly emissions history: ${JSON.stringify(emissionsHistory)}.
  Their current footprint is ${currentEmissions.total} kg CO2e/month.
  Provide a short paragraph (2-3 sentences) predicting their carbon trend and highlighting 1 key action that will yield the biggest reduction next month.`;

  if (!apiKey) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lastMonth = emissionsHistory[emissionsHistory.length - 1]?.total || currentEmissions.total;
        const trend = currentEmissions.total < lastMonth ? "decreasing" : "stable/increasing";
        resolve(`Your carbon trend is currently **${trend}**. Based on your high performance, we forecast next month's emissions to drop to **${Math.round(currentEmissions.total * 0.94)} kg CO2e** if you activate your public transit habit. Focus on replacing short drive trips first.`);
      }, 1000);
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini prediction insight error:", error);
    return `Based on your current baseline of ${currentEmissions.total} kg CO2e/month, we predict next month's emissions to drop by ~6% to ${Math.round(currentEmissions.total * 0.94)} kg CO2e. The highest leverage activity is reducing single-occupant car travel.`;
  }
}
