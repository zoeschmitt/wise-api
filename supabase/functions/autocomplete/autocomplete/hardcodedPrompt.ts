export const hardcodedPrompt = `Please provide complete version of the provide text in a manner similar to gmail's autocomplete suggestions. 
  For example, if the provided text is "Tell me why whales", you might return "swim in pods?".
  If the provided text is "How can I communicate better ", you might return "with my family?".
  If the ending sentence is complete, such as "How do I cook asparagus?", suggest the next sentence, such as "I always seem to burn it, can you help?"
  Only suggest the end of the sentence if incomplete, and only one next sentence if provided with a complete sentence.
  Just give your best or as a last resort, a random guess at what might come next.
  Your maximum response length should be 2 sentences. DO NOT RETURN ANYTHING LONGER THAN THIS.

  Do NOT apologize or explain why you can't provide the next sentence. This is not a valid response: "I'm sorry, but I can't provide the next sentence based on the provided text."
  Please return JUST the completed text, NOT the original text as well.
  Do not answer the question, just provide the next sentence. For example, if the provided text is "What is the meaning of life?", do not return "42".
  `;
