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

    this.html = function() {
        return "<p id='" + self.id + "'>Paper..." + data['title'] + " " + data['location'] + "</p>";
    }

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

function PaperSet(papers) {
    var self = this;
    if (papers == undefined) {
        self.papers = [];
    } else {
        self.papers = papers;
    }
    self.per_tag = {};
    self.tag_status = {
        // tag : true/false (true: activated)
    };

    self.addPaper = function(paper) {
        $(paper.tags).each( function (pos, tag) {
            if ( tag in self.per_tag) {
                self.per_tag[tag].push(paper);
            } else {
                self.per_tag[tag] = [paper];
                self.tag_status[tag] = true;
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

        // First: add visible and invisible papers to the lists
        for (var tag in self.per_tag) {
            if(self.tag_status[tag]) {
                $(self.per_tag[tag]).each(function (pos, paper) {
                    visiblePapers[paper.id] = paper; // Override is fine
                });
            } else {
                $(self.per_tag[tag]).each(function (pos, paper) {
                    invisiblePapers[paper.id] = paper; // Override is fine
                });
            }
        }

        // Second: hide invisible papers (unless they're also in visible)
        for (var paper_id in invisiblePapers) 
            if (!(paper_id in visiblePapers)) 
                invisiblePapers[paper_id].hide();

        // Third: show visible papers
        for (var paper_id in visiblePapers) 
            visiblePapers[paper_id].show();
    }

    self.html = function(where) {

        var $where = $(where);

        var buttons = {};

        function generate_click(tag, $button) { 
            return function () {
                var newStatus = self.tag_status[tag] = !self.tag_status[tag];
                if (newStatus)
                    $button.addClass(colorPerTag(tag));
                else
                    $button.removeClass(colorPerTag(tag));

                self.updateVisiblePapers();
            }
        }

        var $toggleTagsButton = $('<div/>', {
            'class' : 'btn btn-warning',
            'style' : 'margin-right: 5px'
        });
        var $toggleTagsText = $('<span/>', {
            'class' : 'glyphicon glyphicon-unchecked'
        });
        $toggleTagsButton.append($toggleTagsText);
        $toggleTagsButton.click(function() {
            var anyActivated = false;
            for(var tag in self.tag_status)
                if(self.tag_status[tag]) {
                    anyActivated = true;
                    break;
                }
            if (anyActivated) {
                // Turn all off
                for(var tag in self.tag_status)
                    if (self.tag_status[tag])
                        generate_click(tag, buttons[tag])();
                $toggleTagsButton.removeClass('btn-warning');
                $toggleTagsText.removeClass('glyphicon-unchecked');
                $toggleTagsText.addClass('glyphicon-check');
            } else {
                // Turn all on
                for(var tag in self.tag_status)
                    if (!self.tag_status[tag])
                        generate_click(tag, buttons[tag])();
                $toggleTagsButton.addClass('btn-warning');
                $toggleTagsText.addClass('glyphicon-unchecked');
                $toggleTagsText.removeClass('glyphicon-check');
            }
        });
        $where.append($toggleTagsButton);

        for(var tag in self.per_tag) {
            var tag_id = 'paper_tag_' + wrapWord(tag);

            var $button = $('<button/>', {
                'text'  : tag,
                'class' : 'btn ' + colorPerTag(tag),
                'type'  : 'button',
                'id'    : tag_id,
                'style' : 'margin-right: 5px'
            });
            $button.click(generate_click(tag, $button));
            buttons[tag] = $button;
            $where.append($button);
        };

        $(self.papers).each(function (pos, paper) {
            $where.append($(paper.html()));
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
