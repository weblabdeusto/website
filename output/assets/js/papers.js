/*

List of papers (probably autogenerated).

Data:
    + Mandatory:
        - type: CONFERENCE, JOURNAL, DISSERTATION
        - tags:  list of tags. May include JCR_Q1
        - year: year of the publication
        - title: title of the publication

        - journal_title: full name of the journal
        or
        - conference_title: full name of the conference

        - journal_shorttitle: short name of the journal; excluding year (e.g., ToE)
        or
        - conference_shorttitle: short name of the conference; excluding year (e.g., FIE)

    + Optional:
        - *location: where the conference was held
        - days: days of the conference
        - month: month of the publication
        - impact_factor: impact factor of the journal
        - impact_factor_year: impact factor year of the journal
        - issn: ISSN of the journal
        - volume: volume of the journal
        - number: number in the volume
        - pages: number in the volume
        - doi: DOI of the publication
        - link: link to the document
        - slides_link: link to the slides
*/

var PAPERS = [
    {
       'type'     : CONFERENCE,
       'tags'     : [ CORE_A, 'Federation', 'LMS' ],
       'location' : 'Oklahoma, USA',
       'authors'  : [ 'Pablo Orduña', "Sergio Botero", "Nicolas Hock", "Elio Sancristobal", "Mikel Emaldi", "Alberto Pesquera Martín", "Kirky DeLong", "Philip H Bailey", 'Diego López-de-Ipiña', "Manuel Castro", 'Javier García-Zubia' ],
       'month'    : 'October',
       'year'     : '2013',
       'title'    : 'Generic integration of remote laboratories in learning and content management systems through federation protocols',
       'conference_title' : "43rd Annual Frontiers in Education Conference",
       'conference_shorttitle' : "FIE"
    }, 
    {
       'type'     : JOURNAL,
       'tags'     : [ JCR_Q1, 'LmS', 'federAtion' ],
       'location' : 'Bilbao',
       'authors'  : [ 'zubia', 'iangulo', 'porduna' ],
       'month'    : 'November',
       'year'     : '2007',
       'title'    : 'My second paper'
    },
    {
       'type'     : CONFERENCE,
       'tags'     : [ CORE_A, 'Fpga' ],
       'location' : 'Bilbao',
       'authors'  : [ 'iangulo', 'zubia', 'porduna' ],
       'month'    : 'October',
       'year'     : '2007',
       'title'    : 'My third paper'
    }

];

