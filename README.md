# Dictionary

### A web dictionary reader
![image](https://github.com/jaydenlo08/dictionary/assets/77671261/036ac30f-1389-41e0-b290-f3310a30c0c4)

## <a name='offline'></a> 🔗 Offline Mode
If you have already downloaded these files, you could use this dictionary offline.
1. Press upload
2. Select your dictionary files. It should consist of more than 3 files. See [here](#stardict) for more information
3. Search words to know!

## <a name='online'></a> 🌐 Online Mode
It is also possible to store dictionaries on your server and download them when loaded. To install custom dictionaries:
1. Install a web server, I recommend [XAMPP](https://www.apachefriends.org/download.html) which includes Apache
2. Clone this project and extract to web root
4. Sort your dictionary files like this
```
dictionary
├── YourDict1
│   ├── YourDict1.dict.dz
│   ├── YourDict1.idx
│   └── YourDict1.ifo
└── YourDict2
    ├── YourDict2.dict.dz
    ├── YourDict2.idx
    └── YourDict2.ifo
    └── YourDict2.syn
```
4. Open [data.js](data.js). It contains a single object called "languages". Change the key to your language, and the dictionary name (i.e. YourDict1) to its value so it looks like this:
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
6. It might take a while to load as dictionaries can get pretty big

## <a name='stardict'></a>🕮 StarDict
We use the StarDict format to parse dictionaries. The StarDict format is an open source format created by [StarDict](http://www.huzheng.org/stardict/), and consists of 3 or 4 files: dictionary.dict.dz, dictionary.idx, dictionary.ifo and optionally dictionary.syn.
I have included some dictionaries but it wouldn't be of much use unless you study classics
* English: Oxford Advanced Learner's Dictionary
* Latin: A Latin Dictionary, Lewis & Short
* Ancient Greek: A Greek–English Lexicon, Liddell & Scott

## <a name='credits'></a>Credits
Many thanks for those who made the following libraries. This project wouldn't be possible without their hard work.

* [stardict.js](https://framagit.org/tuxor1337/stardict.js) - @tuxor1337
* [dictzip.js](https://framagit.org/tuxor1337/dictzip.js) - @tuxor1337
* [pako](https://github.com/nodeca/pako) - @nodeca
* [favicon.png](https://github.com/goldendict/goldendict/blob/master/icons/icon32_sdict.png) - GoldenDict icons
* [Latin & Greek dictionaries](https://latin-dict.github.io/) & [Perseus Digital Library](http://www.perseus.tufts.edu/)
