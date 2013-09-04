var CONFERENCE = 'conference';
var CORE_A = 'Core A';
var CORE_B = 'Core B';
var CORE_C = 'Core C';

var JOURNAL    = 'journal';
var JCR = "JCR";
var JCR_Q1 = "JCR Q1";
var JCR_Q2 = "JCR Q2";
var JCR_Q3 = "JCR Q3";
var JCR_Q4 = "JCR Q4";

var DISSERTATION = 'dissertation';

var INTERNATIONAL = "International";
var NATIONAL = "National";

var METADATA = [ 
                 DISSERTATION,
                 CONFERENCE, 
                    CORE_A.toLowerCase(), CORE_B.toLowerCase(), CORE_C.toLowerCase(),
                 JOURNAL, JCR,
                    JCR_Q1.toLowerCase(), JCR_Q2.toLowerCase(), JCR_Q3.toLowerCase(), JCR_Q4.toLowerCase(),
                 INTERNATIONAL, NATIONAL
        ];

function wrapWord(word) {
    return word.toLowerCase().split(" ").join("_");
}

function colorPerTag(tag) {
    var COLORS = {
        'year'     : 'btn-danger',
        'metadata' : 'btn-info',
        'tag'      : 'btn-success'
    };

    if ($.isNumeric(tag)) {
        return COLORS['year'];
    } else if (METADATA.indexOf(tag.toLowerCase()) >= 0) {
        return COLORS['metadata'];
    } else {
        return COLORS['tag'];
    }
}

function Paper(data) {
    var self = this;

    self.id = 'paper_title_' + wrapWord(data['title']);
    self.visible = true;
    var first_tags = data['tags'].slice(0);
    first_tags.push(data['year']);
    first_tags.push(data['type']);
    
    self.tags = [];

    // Expand tags
    $(first_tags).each(function (pos, tag) {
        if ( tag.toLowerCase() in TAXONOMY_INVERSE) {
            $(TAXONOMY_INVERSE[tag.toLowerCase()]).each( function(pos, inferred_tag) {
                if (self.tags.indexOf(inferred_tag) < 0) {
                    self.tags.push(inferred_tag);
                }
            });
        } else if ( METADATA.indexOf(tag.toLowerCase()) >= 0) {
            // Do nothing
            self.tags.push(tag);
        } else {
            console.log("Invalid tag " + tag + "; adding it anyway.");
            self.tags.push(tag);
        }
    });

    var authors = data['authors'].join(', ');
    var citation = "";
    if (data['type'] == CONFERENCE) {
        citation = data['conference_title'];
        if(data['conference_shorttitle'])
            citation += " (" + data['conference_shorttitle'] + data['year'] + ")"
        if(data['location'])
            citation += " " + data['location'];
    } else if (data['type'] == JOURNAL) {
        
    } else {
        
    }
    self.$element = $("<p id='" + self.id + "'>" + authors + ". <b><i>" + data['title'] + "</b></i> " + citation + "</p>");

    this.hide = function() {
        if (self.visible) {
            self.visible = false;
            $( "#" + self.id ).animate({
                opacity: 0.25,
                height: "toggle"
            }, 500, function() {});
        }
    }

    this.show = function() {
        if (!self.visible) {
            self.visible = true;

            $( "#" + self.id ).animate({
                opacity: 1.0,
                height: "toggle"
            }, 500, function() {});
        }
    }

    this.toggleVisibility = function() {
        if (self.visible) {
            self.hide();
            return false; 
        } else {
            self.show();
            return true;
        }
    }
}

function TagButton(name, paper_set) {
    var self = this;

    self.tag_id = 'paper_tag_' + wrapWord(name);
    self.paper_set   = paper_set;
    self.papers      = [];
    self.name        = name;
    self.color_class = colorPerTag(name);
    self.current_status = true;

    self.$element = $('<button/>', {
        'text'  : name,
        'class' : 'btn ' + self.color_class,
        'type'  : 'button',
        'id'    : self.tag_id,
        'style' : 'margin-top: 5px; margin-right: 5px; margin-left: 5px; margin-bottom: 5px'
    });

    self.$element.click(function() {
        if(self.current_status)
            self.deactivate();
        else
            self.activate();
    });

    self.addPaper = function(paper) {
        self.papers.push(paper);
    }

    self.getPapers = function() {
        return self.papers;
    }

    self.activated = function() {
        return self.current_status;
    }

    self.activate = function() {
        if (!self.current_status) {
            self.current_status = true;
            self.$element.addClass(self.color_class);
            self.paper_set.updateVisiblePapers();
        }
    }

    self.deactivate = function() {
        if (self.current_status) {
            self.current_status = false;
            self.$element.removeClass(self.color_class);
            self.paper_set.updateVisiblePapers();
        }
    }

}

function ToggleTagsButton(tags) {

    var self = this;
    self.tags = tags;
    var activated = true;

    var $toggleTagsButton = $('<div/>', {
        'class' : 'btn btn-warning',
        'style' : 'margin-top: 5px; margin-right: 5px; margin-left: 5px; margin-bottom: 5px'
    });
    var $toggleTagsText = $('<span/>', {
        'class' : 'glyphicon glyphicon-unchecked'
    });
    $toggleTagsButton.append($toggleTagsText);
    $toggleTagsButton.click(function() {
        var anyActivated = false;
        for(var tag in self.tags)
            if(self.tags[tag].activated()) {
                anyActivated = true;
                break;
            }
        if (anyActivated) {
            // Turn all off
            for(var tag in self.tags)
                self.tags[tag].deactivate();
            self.deactivate();
        } else {
            // Turn all on
            for(var tag in self.tags)
                self.tags[tag].activate();
            self.activate();
        }
    });

    self.activate = function() {
        if (!self.activated) {
            self.activated = true;
            $toggleTagsButton.addClass('btn-warning');
            $toggleTagsText.addClass('glyphicon-unchecked');
            $toggleTagsText.removeClass('glyphicon-check');
        }
    }

    self.deactivate = function() {
        if (self.activated) {
            self.activated = false;
            $toggleTagsButton.removeClass('btn-warning');
            $toggleTagsText.removeClass('glyphicon-unchecked');
            $toggleTagsText.addClass('glyphicon-check');
        }
    }

    self.$element = $toggleTagsButton;
}

function PaperSet(papers) {
    var self = this;
    if (papers == undefined) {
        self.papers = [];
    } else {
        self.papers = papers;
    }
    self.tags = {
        // tag : TagButton
    };

    self.toggleTagsButton = new ToggleTagsButton(self.tags);

    self.addPaper = function(paper) {
        $(paper.tags).each( function (pos, tag) {
            if ( tag in self.tags) {
                self.tags[tag].addPaper(paper);
            } else {
                self.tags[tag] = new TagButton(tag, self);
                self.tags[tag].addPaper(paper);
            }
        });
        self.papers.push(paper);
    };

    $(this.papers).each( function (pos, paper) {
        self.addPaper(paper);
    });

    self.updateVisiblePapers = function() {
        var invisiblePapers = {};
        var visiblePapers = {};
        var anyVisible = false;

        // First: add visible and invisible papers to the lists
        for (var tag in self.tags) {
            if(self.tags[tag].activated()) {
                $(self.tags[tag].getPapers()).each(function (pos, paper) {
                    visiblePapers[paper.id] = paper; // Override is fine
                    anyVisible = true;
                });
            } else {
                $(self.tags[tag].getPapers()).each(function (pos, paper) {
                    invisiblePapers[paper.id] = paper; // Override is fine
                });
            }
        }

        // Second: hide invisible papers (unless they're also in visible)
        for (var paper_id in invisiblePapers) 
            if (!(paper_id in visiblePapers)) 
                invisiblePapers[paper_id].hide();

        // Third: show visible papers
        for (var paper_id in visiblePapers) {
            visiblePapers[paper_id].show();
        }
        
        if (anyVisible) 
            self.toggleTagsButton.activate();
        else
            self.toggleTagsButton.deactivate();
    }

    self.html = function(where) {
        var $where = $(where);

        $where.append(self.toggleTagsButton.$element);

        for(var tag in self.tags) {
            $where.append(self.tags[tag].$element);
        };

        $(self.papers).each(function (pos, paper) {
            $where.append(paper.$element);
        });
    }
}

function showPapers(papers, where) {
        var paper_set = new PaperSet();

        $(papers).each(function (pos, data) {
            paper_set.addPaper(new Paper(data));
        });

        paper_set.html(where);
}
