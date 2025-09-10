// firestore-seeder/seedBooks.js - Expanded to 100 Books (Full Code)

require('dotenv').config();
const admin = require('firebase-admin');

const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const booksCollectionRef = db.collection('books');

const booksData = 
    // --- Sci-Fi & Fantasy (20 books) ---
[
  {
    "title": "The Mysterious Affair at Styles",
    "author": "Agatha Christie",
    "genre": "Detective/Mystery",
    "description": "The debut of Hercule Poirot, this novel sees the famous Belgian detective investigate a poisoning at a country estate.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/9262845-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/863/863-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1920
  },
  {
    "title": "The Hound of the Baskervilles",
    "author": "Arthur Conan Doyle",
    "genre": "Detective/Mystery",
    "description": "Sherlock Holmes and Dr. Watson investigate the legend of a terrifying, supernatural hound that haunts a family on the desolate moors of Devonshire.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10493988-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/2852/2852-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1902
  },
  {
    "title": "The Innocence of Father Brown",
    "author": "G.K. Chesterton",
    "genre": "Detective/Mystery",
    "description": "A collection of short stories featuring the humble Catholic priest Father Brown, who solves crimes through his keen understanding of human nature.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8301149-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/204/204-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1911
  },
  {
    "title": "The Murder of Roger Ackroyd",
    "author": "Agatha Christie",
    "genre": "Detective/Mystery",
    "description": "A revolutionary crime novel with a shocking twist, where Hercule Poirot comes out of retirement to solve a murder in a quiet village.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8287739-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/65203/65203-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1926
  },
  {
    "title": "The Thirty-Nine Steps",
    "author": "John Buchan",
    "genre": "Detective/Mystery",
    "description": "An early espionage thriller featuring Richard Hannay, an ordinary man caught up in preventing a conspiracy that threatens to plunge Europe into war.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8235732-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/558/558-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1915
  },
  {
    "title": "Whose Body?",
    "author": "Dorothy L. Sayers",
    "genre": "Detective/Mystery",
    "description": "The first appearance of the aristocratic amateur sleuth Lord Peter Wimsey, who investigates the discovery of a naked body in a bathtub.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8295982-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/59613/59613-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1923
  },
  {
    "title": "Gone Girl",
    "author": "Gillian Flynn",
    "genre": "Detective/Mystery",
    "description": "On the day of their fifth wedding anniversary, a woman goes missing, leaving her husband as the primary suspect in a media frenzy.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10578584-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2012
  },
  {
    "title": "The Girl on the Train",
    "author": "Paula Hawkins",
    "genre": "Detective/Mystery",
    "description": "A psychological thriller that centers on a commuter who witnesses something disturbing on her daily train ride, embroiling her in a missing person investigation.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10493821-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2015
  },
  {
    "title": "The Silent Patient",
    "author": "Alex Michaelides",
    "genre": "Detective/Mystery",
    "description": "A psychotherapist becomes obsessed with unraveling the mystery of his famous patient who has gone silent after murdering her husband.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10472486-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2019
  },
  {
    "title": "That Night",
    "author": "Nidhi Upadhyay",
    "genre": "Detective/Mystery",
    "description": "What happened that night? Everyone has a different story to tell. A thriller about friendship, love, and betrayal.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/13106368-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2021
  },
  {
    "title": "The Da Vinci Code",
    "author": "Dan Brown",
    "genre": "Detective/Mystery",
    "description": "A mystery thriller that follows symbologist Robert Langdon as he investigates a murder in Paris's Louvre Museum, uncovering a battle between secret societies.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10493988-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2003
  },
  {
    "title": "Daughter of Mine",
    "author": "Fiona Lowe",
    "genre": "Detective/Mystery",
    "description": "A novel about family secrets, motherhood, and the dark pasts that can haunt a small town.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10493821-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2020
  },
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Literary Fiction",
    "description": "A novel about the American dream, decadence, idealism, and excess in the Roaring Twenties, narrated by Nick Carraway.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8263158-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/64317/64317-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1925
  },
  {
    "title": "Mrs Dalloway",
    "author": "Virginia Woolf",
    "genre": "Literary Fiction",
    "description": "The novel details a day in the life of Clarissa Dalloway, a fictional high-society woman in post–First World War England.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8244795-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/65137/65137-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1925
  },
  {
    "title": "A Room with a View",
    "author": "E.M. Forster",
    "genre": "Literary Fiction",
    "description": "A young Englishwoman's life is changed forever after a trip to Italy, where she experiences a world of passion outside of her restrictive culture.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10572986-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/2641/2641-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1908
  },
  {
    "title": "The Sun Also Rises",
    "author": "Ernest Hemingway",
    "genre": "Literary Fiction",
    "description": "A novel following a group of American and British expatriates who travel from Paris to Pamplona to watch the bullfights.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8309192-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/67138/67138-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1926
  },
  {
    "title": "The Age of Innocence",
    "author": "Edith Wharton",
    "genre": "Literary Fiction",
    "description": "A story of desire and betrayal in upper-class New York in the 1870s, it won the 1921 Pulitzer Prize for Fiction.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8485741-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/541/541-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1920
  },
  {
    "title": "Dubliners",
    "author": "James Joyce",
    "genre": "Literary Fiction",
    "description": "A collection of fifteen short stories that form a naturalistic depiction of Irish middle-class life in and around Dublin in the early years of the 20th century.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10578643-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/2814/2814-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1914
  },
  {
    "title": "The Kite Runner",
    "author": "Khaled Hosseini",
    "genre": "Literary Fiction",
    "description": "The story of a young boy from Kabul, his close friendship with the son of his father's servant, and a tragic event that shatters their lives.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10482813-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2003
  },
  {
    "title": "Where the Crawdads Sing",
    "author": "Delia Owens",
    "genre": "Literary Fiction",
    "description": "A story of a young woman who grows up isolated in the marshes of North Carolina and becomes a suspect in a local murder investigation.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10493821-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2018
  },
  {
    "title": "Life of Pi",
    "author": "Yann Martel",
    "genre": "Literary Fiction",
    "description": "The story of a young Indian boy who survives 227 days after a shipwreck while stranded on a lifeboat in the Pacific Ocean with a Bengal tiger.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10493988-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2001
  },
 
  {
    "title": "The Book Thief",
    "author": "Markus Zusak",
    "genre": "Literary Fiction",
    "description": "Set in Nazi Germany, this novel tells the story of Liesel Meminger, a young girl living with her foster parents, as narrated by Death.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8304938-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2005
  },
  {
    "title": "The White Tiger",
    "author": "Aravind Adiga",
    "genre": "Literary Fiction",
    "description": "A darkly humorous story of a village boy's journey to success in modern India's corrupt, globalized society. Winner of the Man Booker Prize.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/9251996-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2008
  },
  {
    "title": "The Wonderful Wizard of Oz",
    "author": "L. Frank Baum",
    "genre": "Fantasy",
    "description": "The story of Dorothy, a young girl from Kansas, who is swept away by a tornado to the magical Land of Oz.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8315184-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/55/55-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1900
  },
  {
    "title": "Peter Pan",
    "author": "J.M. Barrie",
    "genre": "Fantasy",
    "description": "The tale of a mischievous boy who can fly and never grows up, and his adventures in Neverland with Wendy Darling and her brothers.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8233816-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/16/16-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1911
  },
  {
    "title": "The Wind in the Willows",
    "author": "Kenneth Grahame",
    "genre": "Fantasy",
    "description": "A classic of children's literature, focusing on four anthropomorphised animals in a pastoral version of England.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/9253241-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/289/289-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1908
  },
  {
    "title": "Winnie-the-Pooh",
    "author": "A.A. Milne",
    "genre": "Fantasy",
    "description": "A collection of short stories about the adventures of a teddy bear called Winnie-the-Pooh and his friends in the Hundred Acre Wood.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8404284-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/67098/67098-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1926
  },
  {
    "title": "The Velveteen Rabbit",
    "author": "Margery Williams",
    "genre": "Fantasy",
    "description": "The story of a stuffed rabbit's desire to become real through the love of his owner.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8282307-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/11757/11757-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1922
  },
  {
    "title": "A Connecticut Yankee in King Arthur's Court",
    "author": "Mark Twain",
    "genre": "Fantasy",
    "description": "A satirical novel in which a 19th-century engineer is accidentally transported back in time to the court of King Arthur.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8282361-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/86/86-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1889
  },
  {
    "title": "Fourth Wing",
    "author": "Rebecca Yarros",
    "genre": "Fantasy",
    "description": "A young woman, destined for a quiet life as a scribe, is forced by her mother to join a deadly war college for dragon riders.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/13840621-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2023
  },
  {
    "title": "Iron Flame",
    "author": "Rebecca Yarros",
    "genre": "Fantasy",
    "description": "The sequel to Fourth Wing, continuing the story of Violet Sorrengail as she navigates the treachery and trials of Basgiath War College.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/14412099-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2023
  },
  {
    "title": "Lightlark",
    "author": "Alex Aster",
    "genre": "Fantasy",
    "description": "Every 100 years, the island of Lightlark appears to host the Centennial, a deadly game that only the rulers of six realms are invited to play.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/13106368-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2022
  },
  {
    "title": "Powerless",
    "author": "Lauren Roberts",
    "genre": "Fantasy",
    "description": "In a kingdom where some are born with extraordinary powers and others are not, a powerless young woman must survive a series of deadly trials.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/14352528-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2023
  },
  {
    "title": "A Game of Thrones",
    "author": "George R.R. Martin",
    "genre": "Fantasy",
    "description": "The first book in A Song of Ice and Fire, a series of epic fantasy novels about the dynastic struggles among the noble families of Westeros.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10572839-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1996
  },
  {
    "title": "The Name of the Wind",
    "author": "Patrick Rothfuss",
    "genre": "Fantasy",
    "description": "The tale of Kvothe, a magically gifted young man who grows to be the most notorious wizard his world has ever seen.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8291322-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2007
  },
  {
    "title": "Treasure Island",
    "author": "Robert Louis Stevenson",
    "genre": "Adventure",
    "description": "A classic adventure novel featuring buccaneers and buried gold, it tells a tale of 'Jim Hawkins' and his quest for treasure.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10572986-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/120/120-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1883
  },
  {
    "title": "The Call of the Wild",
    "author": "Jack London",
    "genre": "Adventure",
    "description": "The story of Buck, a domestic dog whose primordial instincts return after a series of events leads to his life as a sled dog in the Yukon.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8254716-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/215/215-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1903
  },
  {
    "title": "King Solomon's Mines",
    "author": "H. Rider Haggard",
    "genre": "Adventure",
    "description": "The story of a quest into an unexplored region of Africa by a group of adventurers led by Allan Quatermain.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8301149-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/2166/2166-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1885
  },
  {
    "title": "Tarzan of the Apes",
    "author": "Edgar Rice Burroughs",
    "genre": "Adventure",
    "description": "The story of an orphaned boy raised in the African jungles by apes, who later experiences civilization only to reject it.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10472486-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/78/78-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1912
  },
  {
    "title": "The Scarlet Pimpernel",
    "author": "Baroness Emmuska Orczy",
    "genre": "Adventure",
    "description": "Set during the French Revolution, the story of a chivalrous Englishman who rescues aristocrats before they are sent to the guillotine.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/9144358-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/618/618-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1905
  },
  {
    "title": "White Fang",
    "author": "Jack London",
    "genre": "Adventure",
    "description": "The story of a wild wolfdog's journey to domestication in the Yukon Territory during the 1890s Klondike Gold Rush.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10495333-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/910/910-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1906
  },
  {
    "title": "The Alchemist",
    "author": "Paulo Coelho",
    "genre": "Adventure",
    "description": "An allegorical novel about a young Andalusian shepherd in his journey to the pyramids of Egypt, after having a recurring dream of finding a treasure there.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8314119-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1988
  },
  {
    "title": "Into the Wild",
    "author": "Jon Krakauer",
    "genre": "Adventure",
    "description": "The true story of Christopher McCandless, a young man who hiked across North America into the Alaskan wilderness in the early 1990s.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10189033-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1996
  },
  {
    "title": "The Martian",
    "author": "Andy Weir",
    "genre": "Adventure",
    "description": "A novel about an American astronaut, Mark Watney, as he becomes stranded alone on Mars and must use his ingenuity to survive.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10472486-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2011
  },
  {
    "title": "Jurassic Park",
    "author": "Michael Crichton",
    "genre": "Adventure",
    "description": "A cautionary tale about genetic engineering, it centers on the collapse of an amusement park showcasing genetically recreated dinosaurs.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10482813-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1990
  },
  {
    "title": "The Lost City of Z",
    "author": "David Grann",
    "genre": "Adventure",
    "description": "The true story of British explorer Percy Fawcett, who disappeared in 1925 while searching for a mysterious city in the Amazon.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8304938-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2009
  },
  {
    "title": "Kon-Tiki: Across the Pacific by Raft",
    "author": "Thor Heyerdahl",
    "genre": "Adventure",
    "description": "The record of an astonishing journey of 4,300 nautical miles across the Pacific Ocean on a balsa-wood raft.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8246328-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1948
  },

  {
    "title": "The Waste Land",
    "author": "T.S. Eliot",
    "genre": "Poetry",
    "description": "A landmark 434-line modernist poem that loosely follows the legend of the Holy Grail and the Fisher King, combined with vignettes of contemporary British society.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8282379-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/1321/1321-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1922
  },
  {
    "title": "Leaves of Grass",
    "author": "Walt Whitman",
    "genre": "Poetry",
    "description": "A poetry collection that was a lifelong work, it is a celebration of its author's philosophy of life and humanity.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8282302-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/1322/1322-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1855
  },
  {
    "title": "The Love Song of J. Alfred Prufrock",
    "author": "T.S. Eliot",
    "genre": "Poetry",
    "description": "A poem that presents the musings of a modern man, Prufrock, who is plagued by feelings of isolation and an inability to take action.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10574828-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/1459/1459-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1915
  },
  {
    "title": "A Shropshire Lad",
    "author": "A.E. Housman",
    "genre": "Poetry",
    "description": "A collection of sixty-three poems that explore themes of pastoral beauty, unrequited love, fleeting youth, and death.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10578643-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/5720/5720-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1896
  },
  {
    "title": "The Raven",
    "author": "Edgar Allan Poe",
    "genre": "Poetry",
    "description": "A narrative poem centered on a talking raven's mysterious visit to a distraught lover, tracing his slow fall into madness.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8315184-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/1065/1065-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1845
  },
  {
    "title": "Milk and Honey",
    "author": "Rupi Kaur",
    "genre": "Poetry",
    "description": "A collection of poetry and prose about survival, abuse, love, loss, and femininity. It is divided into four chapters: the hurting, the loving, the breaking, and the healing.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8237736-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2014
  },
  {
    "title": "The Princess Saves Herself in This One",
    "author": "Amanda Lovelace",
    "genre": "Poetry",
    "description": "A collection of poems that tells a story of resilience, divided into four parts: the princess, the damsel, the queen, and you.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8233816-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2016
  },
  {
    "title": "I Don't Love You Anymore",
    "author": "Rithvik Singh",
    "genre": "Poetry",
    "description": "A collection of poems that navigate the complex emotions of a breakup and the journey of moving on.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/13106368-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2021
  },
  {
    "title": "Pillow Thoughts",
    "author": "Courtney Peppernell",
    "genre": "Poetry",
    "description": "A collection of poetry and prose about heartbreak, love, and raw emotions, meant to be read when you need comfort.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10041269-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2017
  },
  {
    "title": "Where the Sidewalk Ends",
    "author": "Shel Silverstein",
    "genre": "Poetry",
    "description": "A classic collection of whimsical, funny, and profound poems and drawings for children.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/9253241-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1974
  },
  {
    "title": "Ariel",
    "author": "Sylvia Plath",
    "genre": "Poetry",
    "description": "A posthumously published collection of poems written in the months leading up to her death, known for its raw intensity and dark themes.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8300898-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1965
  },
  {
    "title": "The Age of Innocence",
    "author": "Edith Wharton",
    "genre": "Romance",
    "description": "A story of desire and betrayal in upper-class New York in the 1870s, it won the 1921 Pulitzer Prize for Fiction.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8485741-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/541/541-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1920
  },
  {
    "title": "The Enchanted April",
    "author": "Elizabeth von Arnim",
    "genre": "Romance",
    "description": "Four dissimilar women in 1920s England leave their rainy, grey lives behind to go on holiday in a beautiful Italian castle.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8254716-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/16389/16389-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1922
  },
  {
    "title": "The Sheik",
    "author": "E.M. Hull",
    "genre": "Romance",
    "description": "A groundbreaking romance novel in which an English lady is abducted by a desert sheik, setting the stage for a dramatic and passionate love story.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8309192-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/1336/1336-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1919
  },
  {
    "title": "Anne of Green Gables",
    "author": "L.M. Montgomery",
    "genre": "Romance",
    "description": "The story of a young orphan girl, Anne Shirley, who is mistakenly sent to two middle-aged siblings who had intended to adopt a boy.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10572839-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/45/45-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1908
  },
  {
    "title": "The Blue Castle",
    "author": "L.M. Montgomery",
    "genre": "Romance",
    "description": "A story about Valancy Stirling, a timid woman who decides to break free from her oppressive family and live life on her own terms after receiving a terminal diagnosis.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/9267028-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/67979/67979-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1926
  },
  {
    "title": "O Pioneers!",
    "author": "Willa Cather",
    "genre": "Romance",
    "description": "The story of the Bergsons, a family of Swedish-American immigrants in the farm country near the fictional town of Hanover, Nebraska.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8244795-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/235/235-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1913
  },
  {
    "title": "A Shadow in the Ember",
    "author": "Jennifer L. Armentrout",
    "genre": "Romance",
    "description": "The first book in the Flesh and Fire series, a prequel to From Blood and Ash, set in a world of gods and primals.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/13106368-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2021
  },
  {
    "title": "Punk 57",
    "author": "Penelope Douglas",
    "genre": "Romance",
    "description": "Misha and Ryen have been pen pals for years but have never met. When they finally cross paths by accident, they realize they hate each other.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10493821-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2016
  },
  {
    "title": "It Ends with Us",
    "author": "Colleen Hoover",
    "genre": "Romance",
    "description": "A brave and heartbreaking novel that digs its claws into you and doesn't let go, long after you’ve finished it.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10493988-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2016
  },
  {
    "title": "The Love Hypothesis",
    "author": "Ali Hazelwood",
    "genre": "Romance",
    "description": "A fake relationship between a Ph.D. candidate and a hotshot professor leads to unexpected feelings in this STEM-focused contemporary romance.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/13106368-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2021
  },
  {
    "title": "God of Malice",
    "author": "Rina Kent",
    "genre": "Romance",
    "description": "A dark romance about a woman who finds herself entangled with a dangerous and obsessive man who is part of a powerful, shadowy group.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/13840621-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2022
  },
  {
    "title": "Outlander",
    "author": "Diana Gabaldon",
    "genre": "Romance",
    "description": "The story of Claire Randall, a married combat nurse from 1945 who is mysteriously swept back in time to 1743 Scotland.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10572839-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1991
  },
  {
    "title": "The War of the Worlds",
    "author": "H.G. Wells",
    "genre": "Science Fiction",
    "description": "One of the earliest stories to detail a conflict between mankind and an extraterrestrial race.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8263158-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/36/36-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1898
  },
  {
    "title": "A Princess of Mars",
    "author": "Edgar Rice Burroughs",
    "genre": "Science Fiction",
    "description": "A classic planetary romance, this novel follows a Confederate veteran who is mysteriously transported to Mars.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8295982-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/62/62-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1917
  },
  {
    "title": "The Time Machine",
    "author": "H.G. Wells",
    "genre": "Science Fiction",
    "description": "A novella about a Victorian scientist who travels to the distant future to find that humanity has split into two species: the Eloi and the Morlocks.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8305335-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/35/35-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1895
  },
  {
    "title": "The Lost World",
    "author": "Arthur Conan Doyle",
    "genre": "Science Fiction",
    "description": "Professor Challenger leads an expedition to a plateau in South America where prehistoric animals still survive.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10189033-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/139/139-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1912
  },
  {
    "title": "The Invisible Man",
    "author": "H.G. Wells",
    "genre": "Science Fiction",
    "description": "The story of a scientist named Griffin who discovers a method for invisibility, but fails in his attempt to reverse it.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8233816-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/5230/5230-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1897
  },
  {
    "title": "We",
    "author": "Yevgeny Zamyatin",
    "genre": "Science Fiction",
    "description": "A seminal dystopian novel set in a future police state, which heavily influenced George Orwell's '1984'.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/61963-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/61963/61963-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1924
  },
  {
    "title": "Dune",
    "author": "Frank Herbert",
    "genre": "Science Fiction",
    "description": "A landmark science fiction novel set in the distant future amidst a feudal interstellar society in which various noble houses control planetary fiefs.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/9177983-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1965
  },
  {
    "title": "1984",
    "author": "George Orwell",
    "genre": "Science Fiction",
    "description": "A dystopian novel set in a totalitarian society under constant surveillance by 'Big Brother,' where independent thought is a crime.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10493988-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1949
  },
  {
    "title": "Fahrenheit 451",
    "author": "Ray Bradbury",
    "genre": "Science Fiction",
    "description": "A dystopian novel about a future American society where books are outlawed and 'firemen' burn any that are found.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8246328-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1953
  },
  {
    "title": "The Hunger Games",
    "author": "Suzanne Collins",
    "genre": "Science Fiction",
    "description": "In a dystopian future, Katniss Everdeen volunteers to take her younger sister's place in a televised fight to the death.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8205408-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2008
  },
  {
    "title": "The Hitchhiker's Guide to the Galaxy",
    "author": "Douglas Adams",
    "genre": "Science Fiction",
    "description": "The misadventures of the last surviving man, Arthur Dent, following the demolition of the Earth by a Vogon constructor fleet.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/9144358-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1979
  },
  {
    "title": "Project Hail Mary",
    "author": "Andy Weir",
    "genre": "Science Fiction",
    "description": "A lone astronaut awakens on a spaceship with no memory of his mission, and must piece together the clues to save Earth from an extinction-level event.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10472486-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2021
  },
  {
    "title": "Dracula",
    "author": "Bram Stoker",
    "genre": "Horror/Supernatural",
    "description": "The story of Count Dracula's attempt to move from Transylvania to England to find new blood and spread the undead curse.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8378496-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/345/345-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1897
  },
  {
    "title": "The Strange Case of Dr. Jekyll and Mr. Hyde",
    "author": "Robert Louis Stevenson",
    "genre": "Horror/Supernatural",
    "description": "A London lawyer investigates strange occurrences between his old friend, Dr. Henry Jekyll, and the evil Edward Hyde.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8315184-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/43/43-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1886
  },
  {
    "title": "The Phantom of the Opera",
    "author": "Gaston Leroux",
    "genre": "Horror/Supernatural",
    "description": "The story of a mysterious, disfigured musical genius who haunts the Paris Opéra House and his obsessive love for a young soprano.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8287739-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/175/175-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1910
  },
  {
    "title": "The Call of Cthulhu",
    "author": "H.P. Lovecraft",
    "genre": "Horror/Supernatural",
    "description": "A foundational story of cosmic horror, pieced together from several accounts, about the terrifying ancient entity Cthulhu.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8282379-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/65140/65140-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1928
  },
  {
    "title": "The Turn of the Screw",
    "author": "Henry James",
    "genre": "Horror/Supernatural",
    "description": "A governess caring for two children at a remote estate becomes convinced that the grounds are haunted.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/9253241-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/209/209-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1898
  },
  {
    "title": "The Willows",
    "author": "Algernon Blackwood",
    "genre": "Horror/Supernatural",
    "description": "Two friends on a canoe trip down the Danube find themselves in a desolate, eerie region of willows where they sense a powerful, otherworldly presence.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8282307-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/11431/11431-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1907
  },
  {
    "title": "The Shining",
    "author": "Stephen King",
    "genre": "Horror/Supernatural",
    "description": "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10572839-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1977
  },
  {
    "title": "The Exorcist",
    "author": "William Peter Blatty",
    "genre": "Horror/Supernatural",
    "description": "The story of the demonic possession of a 12-year-old girl and her mother's attempt to win her back through an exorcism conducted by two priests.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8291322-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1971
  },
  {
    "title": "It",
    "author": "Stephen King",
    "genre": "Horror/Supernatural",
    "description": "Seven adults return to their hometown to confront a shapeshifting evil they first encountered as teenagers, which preys on the town's children.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8294245-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1986
  },
  {
    "title": "The Haunting of Hill House",
    "author": "Shirley Jackson",
    "genre": "Horror/Supernatural",
    "description": "Four seekers arrive at a notoriously unfriendly house and soon find themselves entangled in its dark and terrifying history.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10574828-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1959
  },
  {
    "title": "World War Z: An Oral History of the Zombie War",
    "author": "Max Brooks",
    "genre": "Horror/Supernatural",
    "description": "An oral history that chronicles the devastating global conflict against a zombie plague through a series of firsthand accounts.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10578643-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2006
  },
  {
    "title": "Lucifer was Innocent",
    "author": "P.S. Anvesh",
    "genre": "Horror/Supernatural",
    "description": "A thriller that delves into mythology and history, questioning the traditional narratives of good and evil.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/13106368-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2021
  },
  {
    "title": "Think and Grow Rich",
    "author": "Napoleon Hill",
    "genre": "Non-Fiction/Business",
    "description": "A personal development and self-help book based on the author's research into the lives of hundreds of wealthy and successful people.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8315184-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/64317/64317-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1937
  },
  {
    "title": "The Master Key System",
    "author": "Charles F. Haanel",
    "genre": "Non-Fiction/Business",
    "description": "A personal development book that teaches the principles of creative visualization and the law of attraction, originally released as a correspondence course.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8237736-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/16656/16656-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1916
  },
  {
    "title": "The Art of War",
    "author": "Sun Tzu",
    "genre": "Non-Fiction/Business",
    "description": "An ancient Chinese military treatise that is a classic of strategy and tactics, widely applied to business and management.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8233816-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/132/132-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": -500
  },
  {
    "title": "The Science of Getting Rich",
    "author": "Wallace D. Wattles",
    "genre": "Non-Fiction/Business",
    "description": "A book that explains how to overcome mental barriers and how creation, not competition, is the hidden key to wealth attraction.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10041269-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/59661/59661-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1910
  },
  {
    "title": "The Law of Success",
    "author": "Napoleon Hill",
    "genre": "Non-Fiction/Business",
    "description": "The original 1928 multi-volume course on the 16 principles of success, a precursor to the more famous 'Think and Grow Rich'.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/9253241-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/64317/64317-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1928
  },
  {
    "title": "Acres of Diamonds",
    "author": "Russell H. Conwell",
    "genre": "Non-Fiction/Business",
    "description": "A famous speech and later book that emphasizes that one need not look elsewhere for opportunity, achievement, or fortune—the resources to achieve all good things are present in one's own community.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8300898-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/369/369-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1915
  },
  {
    "title": "Rich Dad Poor Dad",
    "author": "Robert T. Kiyosaki",
    "genre": "Non-Fiction/Business",
    "description": "Advocates the importance of financial literacy, financial independence, and building wealth through investing in assets and starting businesses.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10493821-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1997
  },
  {
    "title": "Cashflow Quadrant: Rich Dad's Guide to Financial Freedom",
    "author": "Robert T. Kiyosaki",
    "genre": "Non-Fiction/Business",
    "description": "A guide to financial freedom that reveals how some people work less, earn more, pay less in taxes, and learn to become financially free.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10493988-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1998
  },
  {
    "title": "Deep Work: Rules for Focused Success in a Distracted World",
    "author": "Cal Newport",
    "genre": "Non-Fiction/Business",
    "description": "A book that argues that the ability to focus without distraction on a cognitively demanding task is a skill that allows you to quickly master complicated information and produce better results in less time.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8298754-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2016
  },
  {
    "title": "The 7 Habits of Highly Effective People",
    "author": "Stephen R. Covey",
    "genre": "Non-Fiction/Business",
    "description": "A business and self-help book that presents an approach to being effective in attaining goals by aligning oneself to what he calls 'true north' principles.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10472486-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1989
  },
  {
    "title": "Smarter Faster Better",
    "author": "Charles Duhigg",
    "genre": "Non-Fiction/Business",
    "description": "A fascinating book that explores the science of productivity, and why managing how you think is more important than what you think.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10482813-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2016
  },
  {
    "title": "Atomic Habits",
    "author": "James Clear",
    "genre": "Non-Fiction/Business",
    "description": "An easy and proven way to build good habits and break bad ones by making tiny, easy changes that deliver powerful results.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10493821-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2018
  },
  {
    "title": "The Souls of Black Folk",
    "author": "W.E.B. Du Bois",
    "genre": "Spirituality/Mythology",
    "description": "A seminal work in African-American literature and sociology, introducing concepts like 'double consciousness' and 'the veil'.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8404176-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/408/408-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1903
  },
  {
    "title": "Siddhartha",
    "author": "Hermann Hesse",
    "genre": "Spirituality/Mythology",
    "description": "The story of a young man's spiritual journey of self-discovery during the time of the Buddha.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10578643-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/2500/2500-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1922
  },
  {
    "title": "The Prophet",
    "author": "Kahlil Gibran",
    "genre": "Spirituality/Mythology",
    "description": "A book of 26 prose poetry fables written in English. The prophet Almustafa is about to board a ship home when he is stopped by a group of people, with whom he discusses topics such as love, marriage, and work.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8294245-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/58585/58585-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1923
  },
  {
    "title": "The Golden Bough: A Study in Magic and Religion",
    "author": "James George Frazer",
    "genre": "Spirituality/Mythology",
    "description": "A wide-ranging, comparative study of mythology and religion, discussing fertility rites, human sacrifice, the dying god, the scapegoat, and many other symbols and practices.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8282379-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/3623/3623-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1890
  },
  {
    "title": "Bulfinch's Mythology",
    "author": "Thomas Bulfinch",
    "genre": "Spirituality/Mythology",
    "description": "A classic collection of myths and legends from Greece, Rome, and the age of chivalry, retold for a general audience.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8282302-L.jpg",
    "pdfUrl": "https://www.gutenberg.org/files/4921/4921-pdf.pdf",
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1855
  },
  {
    "title": "The Power of Your Subconscious Mind",
    "author": "Joseph Murphy",
    "genre": "Spirituality/Mythology",
    "description": "A self-help book that teaches how to use the power of the subconscious mind to achieve goals and overcome challenges.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10574828-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 1963
  },
  {
    "title": "The Immortals of Meluha",
    "author": "Amish Tripathi",
    "genre": "Spirituality/Mythology",
    "description": "The first book of the Shiva Trilogy, this novel re-imagines the Hindu deity Shiva as a mortal man whose destiny leads him to become a god.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10578643-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2010
  },
  {
    "title": "The Secret of the Nagas",
    "author": "Amish Tripathi",
    "genre": "Spirituality/Mythology",
    "description": "The second book of the Shiva Trilogy, where Shiva travels to the land of the Nagas to uncover the truth behind a great evil.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8315184-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2011
  },
  {
    "title": "The Oath of the Vayuputras",
    "author": "Amish Tripathi",
    "genre": "Spirituality/Mythology",
    "description": "The concluding book of the Shiva Trilogy, where Shiva must confront the ultimate evil to save his people and his land.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8237736-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2013
  },
  {
    "title": "Sapiens: A Brief History of Humankind",
    "author": "Yuval Noah Harari",
    "genre": "Spirituality/Mythology",
    "description": "A sweeping look at the history of humanity, from the Stone Age to the present, exploring how Homo sapiens came to dominate the planet.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/8233816-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2011
  },
  {
    "title": "American Gods",
    "author": "Neil Gaiman",
    "genre": "Spirituality/Mythology",
    "description": "A novel about a war brewing between old gods from mythology and new gods of technology and media in modern America.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/10041269-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2001
  },
  {
    "title": "Circe",
    "author": "Madeline Miller",
    "genre": "Spirituality/Mythology",
    "description": "A retelling of the story of the minor goddess Circe from Greek mythology, who discovers her power of witchcraft and transforms from a nymph into a formidable sorceress.",
    "coverImageUrl": "https://covers.openlibrary.org/b/id/9253241-L.jpg",
    "pdfUrl": null,
    "availability": "Yes",
    "price": 0,
    "publishedYear": 2018
  }
];


// firestore-seeder/seedBooks.js

// ... (rest of the file) ...

async function seedBooks() {
    console.log("Starting Firestore book seeding script...");
    let booksAdded = 0;
    try {
        // --- CRITICAL FIX: Uncomment this block to clear existing books ---
        console.log("Clearing existing books collection...");
        const existingBooksSnapshot = await booksCollectionRef.get();
        const batch = db.batch();
        existingBooksSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        console.log("Existing books cleared.");
        // --- END CRITICAL FIX ---

        for (const book of booksData) {
            const bookWithLowercase = {
                ...book,
                title_lower: book.title.toLowerCase(),
                author_lower: book.author.toLowerCase(),
                genre_lower: book.genre.toLowerCase(),
            };
            await booksCollectionRef.add({
                ...bookWithLowercase,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            booksAdded++;
            console.log(`Added: ${book.title}`);
        }
        console.log(`Successfully added ${booksAdded} books to Firestore.`);
    } catch (error) {
        console.error("Error seeding books:", error);
    } finally {
        process.exit(0);
    }
}

seedBooks();