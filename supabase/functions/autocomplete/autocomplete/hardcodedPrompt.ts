export const hardcodedPrompt = `Please predict a possibly complete version of the text. 
  For example, if the prompt is "Once upon a time", you might return "there was a princess".
  If the ending sentence is complete, such as "Once upon a time there was a princess.", suggest the next sentence.
  Make sure the returned completion is a natural continuation of the prompt.
  Please return JUST the completed text, NOT the original text as well.
  Only suggest the end of the sentence (if incomplete), and the next sentence if given a complete sentence.
  /n`;
