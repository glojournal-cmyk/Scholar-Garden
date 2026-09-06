
export const ITEMS=[
['shared','Ink Pot','Complete a genuine study milestone.'],['shared','Desk Lamp','Build a consistent daily habit.'],['shared','Study Books','Complete meaningful learning sessions.'],['shared','Ivy Pot','Succeed in spaced review.'],
['latin','Bronze Stylus','Earn through Latin spelling or writing.'],['latin','Wax Tablet','Earn through Latin practice.'],['latin','Laurel Wreath','Earn through Latin mastery.'],['latin','Mosaic Plaque','Earn through a Latin game milestone.'],
['french','Fountain Pen','Earn through French writing or spelling.'],['french','Lavender Vase','Earn through French revision.'],['french','Vocabulary Notebook','Earn through French vocabulary mastery.'],['french','Phrase Cards','Earn through French sentence work.'],
['prestige','Golden Lexicon','Master vocabulary across subjects.'],['prestige','Scholar’s Globe','Cross-subject achievement.'],['prestige','Scholar’s Laurel','Long-term achievement.']
].map((x,i)=>({id:`item-${i+1}`,category:x[0],name:x[1],condition:x[2]}));
