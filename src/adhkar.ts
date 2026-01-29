export interface WisdomQuote {
    text: string;
    author?: string;
    tags?: string[];
};

export type Category = 'wise' | 'fun' | 'stupid';

export const wisdomCategories: Record<Category, WisdomQuote[]> = {
    wise: [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
        { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
        { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
        { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
        { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
        { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
        { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" }
    ],
    
    fun: [
        { text: "Why do programmers prefer dark mode? Because light attracts bugs!", author: "Anonymous" },
        { text: "There are only 10 types of people in the world: those who understand binary and those who don't.", author: "Anonymous" },
        { text: "I would love to change the world, but they won't give me the source code.", author: "Anonymous" },
        { text: "Debugging: Being the detective in a crime movie where you are also the murderer.", author: "Filipe Fortes" },
        { text: "A programmer puts two glasses on his bedside table before going to sleep. A full one, in case he gets thirsty, and an empty one, in case he doesn't.", author: "Anonymous" },
        { text: "Programming is 10% science, 20% ingenuity, and 70% getting the ingenuity to work with the science.", author: "Anonymous" },
        { text: "My code doesn't work, I have no idea why. My code works, I have no idea why.", author: "Anonymous" }
    ],
    
    stupid: [
        { text: "I'm not lazy, I'm in energy-saving mode.", author: "Anonymous" },
        { text: "Error 404: Motivation not found.", author: "Anonymous" },
        { text: "My bed is a magical place where I suddenly remember everything I was supposed to do.", author: "Anonymous" },
        { text: "I don't need a hairstylist, my pillow gives me a new hairstyle every morning.", author: "Anonymous" },
        { text: "I'm on a seafood diet. I see food and I eat it.", author: "Anonymous" },
        { text: "I told my computer I needed a break, and now it won't stop sending me Kit-Kat ads.", author: "Anonymous" },
        { text: "The early bird might get the worm, but the second mouse gets the cheese.", author: "Anonymous" },
        { text: "I'm not procrastinating, I'm just prioritizing my instant gratification.", author: "Anonymous" }
    ]
};

export function getRandomDhikr(category: Category): WisdomQuote {
    const quotes = wisdomCategories[category];
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
};

export function getDhikrCount(category: Category): number {
    return wisdomCategories[category].length;
};