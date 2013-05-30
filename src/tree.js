"use strict";

$(document).ready(function() {
    var json_str
    json_str = '{"Bacteria":{"Bacteroidetes":{"Flavobacteriia":{"Flavobacteriales":{"Flavobacteriaceae":{"Flavobacterium":{}}}},"Bacteroidia":{"Bacteroidales":{"S24-7":{}}}},"Firmicutes":{"Clostridia":{"Clostridiales":{"Lachnospiraceae":{"Ruminococcus":{},"Coprococcus":{},"Oribacterium":{}},"Ruminococcaceae":{"Ruminococcus":{}},"Veillonellaceae":{"G07":{}},"Syntrophomonadaceae":{"Syntrophomonas":{}}},"Coriobacteriales":{"Coriobacteriaceae":{}}},"Bacilli":{"Lactobacillales":{"Streptococcaceae":{"Streptococcus":{}},"Enterococcaceae":{"Vagococcus":{}}},"Bacillales":{"Staphylococcaceae":{"Staphylococcus":{"aureus":{}}}}}},"LD1":{},"Proteobacteria":{"Alphaproteobacteria":{"Rickettsiales":{"Pelagibacteraceae":{}}},"Gammaproteobacteria":{"Alteromonadales":{"Chromatiaceae":{"Rheinheimera":{}}},"Legionellales":{"Legionellaceae":{}},"Vibrionales":{"Vibrionaceae":{"Vibrio":{}}}},"Zetaproteobacteria":{"Mariprofundales":{"Mariprofundaceae":{"Mariprofundus":{}}}},"Betaproteobacteria":{"Methylophilales":{"Methylophilaceae":{"Methylotenera":{}}},"SBla14":{},"Burkholderiales":{"Oxalobacteraceae":{"Polynucleobacter":{}}}}},"Fusobacteria":{"Fusobacteria":{"Fusobacteriales":{"Fusobacteriaceae":{"Fusobacterium":{}}}}},"OP8":{"OP8_1":{}},"Acidobacteria":{"Chloracidobacteria":{},"MVS-40":{}},"Planctomycetes":{"Planctomycetia":{"Gemmatales":{"Isosphaeraceae":{}}},"Phycisphaerae":{}},"Actinobacteria":{"Actinobacteria":{"Actinomycetales":{"Nocardiaceae":{"Rhodococcus":{}},"Propionibacteriaceae":{"Propionibacterium":{"acnes":{}}},"Dermabacteraceae":{"Brachybacterium":{"conglomeratum":{}}}}}},"Chloroflexi":{"Chloroflexi":{"Chloroflexales":{"Chlorothrixaceae":{}}}}},"Archaea":{"Crenarchaeota":{"MCG":{"B10":{}}}}}';

    $('body').append(function() {
        var menu;

        menu = $('<select/>').attr('id', 'taxMenu');

        $('<option/>').text('Domain').appendTo($(menu));
        $('<option/>').text('Kingdom').appendTo($(menu));
        $('<option/>').text('Phylum').appendTo($(menu));
        $('<option/>').text('Class').appendTo($(menu));
        $('<option/>').text('Order').appendTo($(menu));
        $('<option/>').text('Family').appendTo($(menu));
        $('<option/>').text('Genus').appendTo($(menu));
        $('<option/>').text('Species').appendTo($(menu));

        return menu;
    }());

    $('body').append(function() {
        var search;
        var form;
        var button;

        search = $('<div/>').addClass('taxSearch');
        form   = $('<form/>').attr('method', 'post');

        $('<input/>').attr({id:'searchValue', name:'q', value:'Search'}).appendTo(form);

        button = $('<button/>').attr({type:'submit',id:'taxButton'});

        $("<img src='search_icon.png' alt='Search' />").appendTo(button);

        button.appendTo(form);
        form.appendTo(search);

        return search;
    }());

//    var url = 'test.json';
    var url = 'gg_12_10_taxonomy.json';

//    $.getJSON(url, function(json) {
//        tax2dom(json, $('body'), 'Domain', 0);
//    });

    tax2dom(jQuery.parseJSON(json_str), $('body'), 'Domain', 0);

    $(document).on('mouseenter', '.taxString', function() {
        if($(this).parent().children('.taxNode').length > 0) {
            $(this).css('font-weight', 'bold');
        }
    });
        
    $(document).on('mouseleave', '.taxString', function() {
        $(this).css('font-weight', 'normal');
    });
        
    $(document).on('click', '.taxNode', function() {
        if ($(this).children('.taxNode').length > 0) {
            if ($(this).children(':hidden').length > 0) {
                $(this).children('.taxNode').unfold(500);
            } else {
                $(this).children('.taxNode').fold(500);
            }
        }

        return false;
    });

    $(document).on('focus', '#searchValue', function() {
        $('#searchValue').attr('value', '');

        return false;
    });

    $(document).on('click', '#taxButton', function() {
        var searchStr;
        var nodes_close;
        var nodes_open;

        $('.taxString').unhighlight();
            
        searchStr = $('#searchValue').val();

        nodes_open = $('.taxString').filter(function() {
            return $(this).text().match(new RegExp(searchStr, 'i'));
        }).parent();

        if ((nodes_open).length > 0) {
            nodes_close = $('.taxNode').not($(nodes_open));

            $(nodes_close).fold(500);
            $(nodes_open).parents('.taxNode').unfold(500);
            $(nodes_open).parents('.taxNode').siblings('.taxNode').unfold(500);
            $(nodes_open).unfold(500);

            $('.taxString').highlight(searchStr);
        } else {
            alert("'" + searchStr + "' not found");
        }

        return false;
    });
        
    $(document).on('change', '#taxMenu', function() {
        var selected;
        var level;
        var nodes_open;
        var nodes_close;

        selected = $(this).find(":selected").val().toLowerCase();

        switch (selected) {
        case "domain":
            level = 0;
            break;
        case "kingdom":
            level = 1;
            break;
        case "phylum":
            level = 2;
            break;
        case "class":
            level = 3;
            break;
        case "order":
            level = 4;
            break;
        case "family":
            level = 5;
            break;
        case "genus":
            level = 6;
            break;
        case "species":
            level = 7;
            break;
        }

        nodes_open = $('span').filter(function() {
            return $(this).data('level') < level;
        }).parent();
            
        nodes_close = $('span').filter(function() {
            return $(this).data('level') == level;
        }).parent();

        $(nodes_close).children('.taxNode').fold(500);
        $(nodes_open).children('.taxNode').unfold(500);

        return false;
    });
});

function tax2dom(taxNode, domParent, taxName, taxLevel) {
    var domEl;
    var taxString;
    var key;

    taxString = $('<span/>').addClass('taxString').attr('data-level', taxLevel).text(taxName);
    domEl     = $('<div/>').addClass('taxNode');

    $(taxString).appendTo(domEl);
    $(domEl).appendTo(domParent);

    for (key in taxNode) {
        tax2dom(taxNode[key], domEl, key, taxLevel + 1).fold(0);
    }

    return domEl;
}

(function($) {
    $.fn.fold = function(duration) {
        $(this).siblings('.taxString').children('.taxFold').remove();
        $(this).parent().children('.taxString').prepend($("<span class='taxFold'>+</span>"));
        $(this).slideUp(duration);

        return this;
    };
})(jQuery);

(function($) {
    $.fn.unfold = function(duration) {
        $(this).slideDown(duration);
        $(this).siblings('.taxString').children('.taxFold').remove();

        return this;
    };
})(jQuery);
