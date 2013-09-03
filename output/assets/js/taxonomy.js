var TAXONOMY = {
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
        TAXONOMY_INVERSE[key] = previous.slice(0);
        var new_previous = previous.slice(0); // Clone
        new_previous.push(key);
        buildTaxonomyIndex(current_dict[key], new_previous);
    };
}
buildTaxonomyIndex(TAXONOMY, []);
