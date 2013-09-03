var CONFERENCE = 'conference';
var JOURNAL    = 'journal';
var CORE_A = 'core A';
var CORE_B = 'core B';
var CORE_C = 'core C';

var METADATA = [ CONFERENCE, JOURNAL, CORE_A, CORE_B, CORE_C ];

function wrapWord(word) {
    return word.toLowerCase().split(" ").join("_");
}

function Paper(data) {
    var self = this;

    self.id = 'paper_title_' + wrapWord(data['title']);
    self.visible = true;
    self.tags = data['tags'].slice(0);
    self.tags.push(data['year']);
    

    // Expand tags
    $(this.tags).each(function (pos, tag) {
        if ( tag in TAXONOMY_INVERSE) {
            $(TAXONOMY_INVERSE[tag]).each( function(pos, inferred_tag) {
                if (self.tags.indexOf(inferred_tag) < 0) {
                    self.tags.push(inferred_tag);
                }
            });
        } else if ( METADATA.indexOf(tag) >= 0) {
            // Do nothing
        } else {
            console.log("Invalid tag, ignoring " + tag);
        }
    });

    self.$element = $("<p id='" + self.id + "'>Paper..." + data['title'] + " " + data['location'] + "</p>");

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

function colorPerTag(tag) {
    var COLORS = {
        'year'     : 'btn-danger',
        'metadata' : 'btn-info',
        'tag'      : 'btn-success'
    };

    if ($.isNumeric(tag)) {
        return COLORS['year'];
    } else if (METADATA.indexOf(tag) >= 0) {
        return COLORS['metadata'];
    } else {
        return COLORS['tag'];
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
        'style' : 'margin-right: 5px; margin-left: 5px; margin-bottom: 5px'
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
        'style' : 'margin-right: 5px; margin-left: 5px; margin-bottom: 5px'
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
