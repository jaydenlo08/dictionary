const dir = "Lewis1890"
const upload = document.getElementById('upload'); // File upload
const bookname = document.getElementById('bookname'); // Dictionary title
const inputContainer = document.getElementById('inputContainer'); // Search container
const search = document.getElementById('search'); // Search box
const searchBox = document.getElementById('searchBox'); // Search box
const searchButton = document.getElementById('searchButton'); // Search box
const definition = document.getElementById('definition'); // Definition
const suggestions = document.getElementById('suggestions'); // Suggestions drop-down list
const backgroundOverlay = document.getElementById('backgroundOverlay') // Used to hide suggestion box
const dict = new StarDict(); // Create new StarDict object
var synonyms = [], index = []; wordList = []; // Create for dictionary index
var $_GET = {}; // $_GET variable for GET data
var optionSelected = false;

// Search when enter key pressed
searchBox.addEventListener("keydown", (e) => {
    // If the user presses the "Enter" key on the keyboard
    if (e.key === "Enter") {
        // Cancel the default action, if needed
        e.preventDefault();
        // Trigger the button element with a click
        searchButton.click();
    };
    if (e.key === "Escape") {
        // Cancel the default action, if needed
        e.preventDefault();
        // Hide the suggestion list
        suggestions.style.display = "none";
    };
});
searchBox.addEventListener("input", (e) => {
    if (e.target.value != "") {
        // Show suggestions
        var suggestionList = wordList.filter((word) => word.toLowerCase().startsWith(e.target.value.toLowerCase())).slice(0, 40); // Filter words to 40 max, case insensitive
        suggestions.innerHTML = ''; // Clear suggestions
        if (suggestionList != "") {
            suggestionList.forEach((suggestion) => {
                var suggestionElement = document.createElement("div"); // Create div
                suggestionElement.innerHTML = suggestion; // Put word in
                suggestionElement.setAttribute("value", suggestion); // Onclick --> search
                suggestionElement.setAttribute("class", "suggestion"); // Onclick --> search
                suggestionElement.setAttribute("onclick", "searchDict('" + suggestion + "')"); // Onclick --> load
                suggestions.appendChild(suggestionElement); // Append word to container
            });
            backgroundOverlay.style.display = "block";
            suggestions.style.display = "block";
        } else {
            suggestions.style.display = "none";
        };
    } else {
        suggestions.style.display = "none";
    };
});
// Load dictionary when file uploaded
upload.addEventListener("change", function(e) {
    loadDict(e.target.files);
});

// Save GET data to $_GET when loaded
document.addEventListener("DOMContentLoaded", () => {
    // Check for question marks
    if (document.location.toString().indexOf('?') !== -1) {
        // Extracts the query string from the URL and remove any existing hash string
        var query = document.location
                    .toString()
                    // Get the query string
                    .replace(/^.*?\?/, '')
                    // Remove any existing hash string
                    .replace(/#.*$/, '')
                    // Split into separate key-value pairs
                    .split('&');
        // Loop through all keys
        for(var i=0, l=query.length; i<l; i++) {
            // Convert any special characters in the URL back to their original form
            var aux = decodeURIComponent(query[i]).split('=');
            // Add to $_GET object
            $_GET[aux[0]] = aux[1];
        };
    };
    // Mode switcher
    // languages is a constant specified in data.js as an object
    for (let language in languages) {
        // Check if current language exists as a key in the object
        if ($_GET['lang'] == language) {
            document.getElementById("loadIcon").style.display = "block"; // Show loading icon
            upload.style.display = "none" // Show upload button
            
            // IndexedDB
            let request = indexedDB.open(languages[language].name, 1);
            let db;
            let savePromise;
            request.onerror = function(event) {
                console.log("Database error: " + event.target.errorCode);
            };
            request.onupgradeneeded = function(event) {
                console.log("Upgrade needed...");
                db = event.target.result;
                // Create an object store to store files
                let objectStore = db.createObjectStore("files", { autoIncrement: true });
                // Define the file's structure
                objectStore.createIndex("name", "name", { unique: false });
                objectStore.createIndex("data", "data", { unique: false });
                
                // Check if that language contains synonyms
                if (languages[language].synonyms) {
                    fetchFilesRequest = fetchFiles(languages[language].name, true)
                } else {
                    fetchFilesRequest = fetchFiles(languages[language].name)
                }
                savePromise = new Promise((resolve, reject) => {
                    fetchFilesRequest.then(fileList => {
                        saveDB(fileList, db).then(() => {
                            resolve();
                        });
                    });
                });
            };
            request.onsuccess = function(event) {
                if (!savePromise) {
                    db = event.target.result;
                    loadDB(db).then(fileList => {
                        loadDict(fileList);
                        document.getElementById("loadIcon").style.display = "none"; // Hide loading icon
                    });
                } else {
                    savePromise.then(() => {
                        db = event.target.result;
                        loadDB(db).then(fileList => {
                            loadDict(fileList);
                            document.getElementById("loadIcon").style.display = "none"; // Hide loading icon
                        });
                    });
                }
            };
        }
    };
    // If no language specified show upload
    if (!($_GET['lang'] in languages)) {
        upload.style.display = "block";
    }
});

// Detect click outside input box and suggestions
backgroundOverlay.addEventListener("click", (e) => {
    // Close suggestion box when clicked outside
    suggestions.style.display = 'none';
    backgroundOverlay.style.display = 'none';
});

/**
 * Save binary files to IndexedDB
 * @param {array} fileList - an array of file object
 * @param {db} db - indexedDB.open().result
 */
function saveDB(fileList, db) {
    console.log("Saving files...")
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(["files"], "readwrite");
        let objectStore = transaction.objectStore("files");
        let promises = [];
        fileList.forEach(file => {
            let blob = new Blob([file]);
            let fileName = file.name;

            // Create a file object to store in the database
            let fileObject = {
                name: fileName,
                data: blob
            };

            // Add the file object to the object store
            let request = objectStore.add(fileObject);

            let promise = new Promise((fileResolve, fileReject) => {
                request.onsuccess = function(event) {
                    console.log(fileName + " saved successfully");
                    fileResolve();
                };

                request.onerror = function(event) {
                    console.log("Error saving file: " + event.target.errorCode);
                    fileReject();
                };
            });
            promises.push(promise);
        });
        Promise.all(promises).then(() => {
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
};

function loadDB(db) {
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(["files"]);
        let objectStore = transaction.objectStore("files");
        let request = objectStore.getAll();
        let fileList = [];
        request.onsuccess = function () {
            request.result.forEach(obj => {
                let file = new File([obj.data], obj.name);
                fileList.push(file);
            });
            resolve(fileList); // Resolve the promise with fileList
        };
        request.onerror = function (event) {
            console.error("Error loading DB:", event.target.error);
            reject(event.target.error); // Reject the promise if an error occurs
        };
    });
};

/**
 * Loads files from a directory of StarDict files. Returns an array of files
 * 
 * @param {string} dir - an array of StarDict files
 * @param {bool} syn - whether synonym file exists
 */
async function fetchFiles(dir, syn = false) {
    var ext = [".dict.dz", ".idx", ".ifo"]; // File extensions
    if (syn == true) { // If param syn is true
        ext.push(".syn"); // Add ".syn" to extension list
    }
    var fileList = []; // Create empty file list
    for (var i = 0; i < ext.length; i++) { // Loop through all the files
        await fetch("dictionary/" + dir + "/" + dir + ext[i]) // Fetch file and wait until loaded
        .then(response => {
            return response.blob(); // Turns it to blob
        }).then(blob => {
            fileList.push(new File([blob], dir + ext[i])); // Add file to array
        });
    };
    
    return(fileList); // Returns file list
};

/** 
 * Load dictionary from files and saves the index into 'index' variable
 * Also returns the index as an array
 * 
 * @param {file} files - the StarDict files
 */
function loadDict(files) {
    var file_list = files, file_array = []; // Create new variables
    for(var i = 0; i < file_list.length; i++) {
        file_array.push(file_list[i]); // Puts files into an array
    };
    console.log("Loading files...");
    dict.load(file_array).then(() => { // Load dictionary from files
        bookname.innerHTML = dict.keyword("bookname"); // Show dictionary name
        document.title = dict.keyword("bookname"); // Change title to dictionary name
        searchBox.placeholder = 'Search ' + dict.keyword("bookname");
    }).then(() => {
        console.log("Loading index...");
        return dict.index({ // Returns dictionary index
            "include_dictpos": true, // Include dictionary position
            "include_term": true, // Include term name
        });
    }).then(async (rawIndex) => {
        index = rawIndex;
        if (await dict.synonyms() != false) {
            console.log("Loading synonyms...");
            await dict.synonyms({"include_term": true, "include_wid": true}).then(synonyms => {
                if (synonyms.length != 0) { // If there is a synonym file
                    synonyms.forEach((synonym) => {
                        synonym.dictpos = index[synonym.wid].dictpos; // Copy dictionary position from real entry to synonym
                        index.push(synonym); // Push synonym to index array
                    });
                };
            });
        }
        // Save all terms to an array
        index.forEach((index) => {
            wordList.push(index["term"]); // Push term name to list
        });
        console.log(await dict.keyword("bookname") + " successfully loaded.");
    });
    upload.style.display = 'none'; // Hide file upload button
    search.style.display = 'block'; // Show search box
}

/**
 * Search from dictionary index, and shows the meaning into definition div
 * 
 * @param {array} index - index generated by loadDict, should be in 'index' variable
 * @param {string} term - term to search
 */
function searchDict(term) {
    suggestions.style.display = 'none'; // Hide suggestions menu
    backgroundOverlay.style.display = 'none'; // Hide overlay used to detect outside click of suggestion box
    // Relies on the index variable
    if (typeof index.find(index => index["term"].toLowerCase() == term.toLowerCase()) !== "undefined") { // Simple way of saying if meaning exists
        var dictpos = index.filter(index => index["term"].toLowerCase() == term.toLowerCase()); // Get position of term
        console.log('Loading ' + term + '...'); // Log loading
        definition.innerHTML = ""; // Clear the definition
        dictpos.forEach((entry) => {
            dict.entry(entry["dictpos"]).then((entry) => { // Fetch entry
                // Parse XDXF format
                if (dict.keyword("sametypesequence") == "x") { // If dictionary is in XDXF format
                    var definitionXDXF = document.createElement("div"); // Create temporary container
                    definitionXDXF.innerHTML = entry[0].content.replace(/\n/g, "<br />"); // Shows the meaning and replace new lines
                    for (var i = 0; i < definitionXDXF.getElementsByTagName('*').length; i++) { // Get all child elements recurringly
                        element = definitionXDXF.getElementsByTagName('*')[i]; // Put into element
                        switch(element.tagName) {
                            case "C": // Colour tag
                                element.style.color = element.getAttribute("c"); // Set colour to CSS
                                element.removeAttribute("c"); // Remove original "C" attribute
                                break;
                            case "KREF": // Link tag
                                element.style.cursor = "pointer"; // Show hand cursor
                                element.style["text-decoration"] = "underline"; // Underline so it looks like a hyperlink
                                // Search and scroll back to top when clicked
                                element.setAttribute("onclick","searchDict('" + element.innerHTML + "'); window.scrollTo({top: 0, behavior: 'smooth'})");
                                break;
                        };
                        // Add xdxf_* class to elements to work with original CSS
                        element.className += ("xdxf_" + element.tagName.toLowerCase());
                    };
                    definition.appendChild(definitionXDXF);
                } else if (dict.keyword("sametypesequence") == "h"){
                    definition.innerHTML += entry[0].content; // Add
                }
            });
        })
        // Put search term to search box - when manually calling searchDict like links
        searchBox.value = term;
        console.log("Definition for " + term + " found"); // Show success in console
    } else {
        // No meaning
        var definitionHTML = "No definition for " + term + " was found";
        definition.innerHTML = definitionHTML; // Shows the meaning
        console.log(definitionHTML); // Show error in console
    };
};
