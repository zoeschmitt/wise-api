export const hardcodedPrompt = `Please provide complete version of the provide text. 
  For example, if the provided text is "Tell me about why whales", you might return " swim in pods?".
  If the provided text is "How can I communicate better ", you might return "with my family?".
  Note that I am including a space between the provided text and the response.
  If the ending sentence is complete, such as "How do I cook asparagus?", suggest the next sentence, such as "I always seem to burn it, can you help?"
  Only suggest the end of the sentence (if incomplete), and only one next sentence if provided with a complete sentence.
  If you don't have enough information from the provided text, or the provided text doesn't make any sense, return an empty string.

  Most importantly:
  Your maximum response length should be 2 sentences. DO NOT RETURN ANYTHING LONGER THAN THIS.
  Please return JUST the completed text, NOT the original text as well.
  `;
