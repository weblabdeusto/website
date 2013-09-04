var TAXONOMY = {
    "Conference" : {
        "Core A" : {},
        "Core B" : {},
        "Core C" : {},
    },
    "Journal" : {
        "JCR" : {
            "JCR Q1" : {},
            "JCR Q2" : {},
            "JCR Q3" : {},
            "JCR Q4" : {},
        },
    },
    "Usage Analysis" : {
        "Learning Analytics" : {}
    },
    "Mobile development" : {
        "Android" : {}
    },
    "Immersive technologies" : {
        "Virtual Worlds" : {},
        "Augmented Reality" : {}
    },
    "Remote laboratories" : {
        "Equipment" : {
            "Xilinx devices" : {
                "CPLD" : {},
                "FPGA" : {}
            },
            "VISIR" : {},
            "Robot" : {},
            "Low cost" : {}
        },
        "WebLab-Deusto architecture" : {
            "Federation": { 
                "Interoperability" : {}
            },
            "LMS" : {},
            "CMS" : {}
        }
    }
};

var TAXONOMY_INVERSE = {};
function buildTaxonomyIndex(current_dict, previous) {
    for (var key in current_dict ) {
        var key_lower = key.toLowerCase();
        var new_previous = previous.slice(0); // Clone
        new_previous.push(key);
        TAXONOMY_INVERSE[key_lower] = new_previous;
        buildTaxonomyIndex(current_dict[key], new_previous);
    };
}
buildTaxonomyIndex(TAXONOMY, []);
console.log(TAXONOMY_INVERSE);
