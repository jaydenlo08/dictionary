# Dictionary

### An online dictionary reader for StarDict format

## Why?
In my school, learning Latin is compulsory for Year 9, which I am currently in, and I also take Ancient Greek. I couldn't find any good online dictionaries that is helpful for me, and the good ones (and also ancient ones) are only available in StarDict format. My school (stupidly) blocks app installation on their laptops, so I cannot use GoldenDictm, and started making my own web version of it when I was really bored. (bording school can be boring).

## How to use?
If you already have some StarDict files (.dict.dz, .idx, .ifo, .syn), just simply open index.html with a web browser and upload the files.

## What languages are supported?
Download any StarDict dictionaries in any languages that you like from the internet, and just open it.

You can also auto load some dictionaries with a GET request.
Here are the dictionaries that I hardcoded for my school work. I am sorry for only providing these useless dictionary, but that's basically what I only use myself for my work.
* English: Oxford Advanced Learner's Dictionary
* Latin: A Latin Dictionary, Lewis & Short
* (Ancient) Greek: A Greek–English Lexicon, Liddell & Scott

## How to replace / add your useless dictionaries with my own ones?
Please note that this requires a web server. Don't worry, it's not as hard as you think. I recommend XAMPP due to its simple ease of use, and there are plenty of guides on how to install that you can easily find on the internet.

1. Download the project using the green download button and extract it
2. Move the extracted folder to your web server.
3. Move your folder that contains all your StarDict files into the folder called dictionary. Ensure that the files has the same file name as the parent folder like this:
```
Dictionary
├── YourDict1
│   ├── YourDict1.dict.dz
│   ├── YourDict1.idx
│   └── YourDict1.ifo
└── YourDict2
    ├── YourDict2.dict.dz
    ├── YourDict2.idx
    └── YourDict2.ifo
```
4. Open data.js. It contains a single object called "languages". Change the key to your language, and the dictionary name (i.e. YourDict1) to its value so it looks like this:
```
const languages = {
    English: "YourDict1",
    French: "YourDict2",
}
```
5. Add "?lang=English" or whatever language name you put in data.js at the end of the URL. If you are hosting the file locally, the URL should be something like 
```
http://localhost/dictionary/?lang=English
```

## Credits
Many thanks for those who made the following libraries. This project wouldn't be possible without their hard work.

* [stardict.js](https://framagit.org/tuxor1337/stardict.js) - @tuxor1337
* [dictzip.js](https://framagit.org/tuxor1337/dictzip.js) - @tuxor1337
* [pako](https://github.com/nodeca/pako) - @nodeca
* [favicon.png](https://github.com/goldendict/goldendict/blob/master/icons/icon32_sdict.png) - GoldenDict icons
* [Latin & Greek dictionaries](https://latin-dict.github.io/) that I use - [latin-dict.github.io](https://latin-dict.github.io/) & [Perseus Digital Library](http://www.perseus.tufts.edu/)