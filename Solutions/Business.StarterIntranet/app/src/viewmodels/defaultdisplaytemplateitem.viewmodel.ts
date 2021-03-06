// ========================================
// Base Display Template Item View Model
// ========================================
import "../shared/bindinghandlers";
import * as moment from "moment";
import "trunk8"; // Trunk8 typings are exposed through an interface, so we have just to import it globally

declare var Srch; // Allow using SharePoint display template functions direclty in the viewmodel
declare var HP;

export class DefaultDisplayTemplateItemViewModel {

    public item: KnockoutObservable<any>;

    constructor(currentItem?: any) {

        this.item = ko.observable(currentItem);

        ko.bindingHandlers.summarize = {

            init: (element, valueAccessor, allBindings) => {

                // Get the current value of the current property we're bound to
                let value = ko.unwrap(valueAccessor());
                var linesCount = allBindings.get('linesCount') || 1;
                var tooltip = allBindings.get('tooltip') || false;

                let trunk8Options: Trunk8Options = {
                    lines: linesCount,
                    tooltip: tooltip,
                };

                // 1) Output the HTML string without modifications
                if (value.html) {

                    $(element).html(value.html);
                }

                // 2) Output the text only from an HTML string (For example to trim complex HTML elements likes tables or images)
                if (value.text) {

                    let decodedHtmlString = $("<textarea/>").html(value.text).text();
                    $(element).text($(decodedHtmlString).text());
                }

                // 3) Output the hit Highlighted summary with matched terms in bold
                if (value.hitHighlightedSummary) {

                    // Call the specific SharePoint function for this case
                    $(element).html(Srch.U.processHHXML(value.hitHighlightedSummary));
                }

                // Truncate the news summary
                $(element).trunk8(trunk8Options);

                // Adjust automatically news summary on resize
                $(window).resize((event) => {
                    $(element).trunk8(trunk8Options);
                });
            },
        };

        ko.bindingHandlers.formatDateField = {

            init: (element, valueAccessor, allBindings) => {
    
                var value = ko.unwrap(valueAccessor());
                var dateFormat = allBindings.get('dateFormat') || 'LL';

                let date = moment(value).format(dateFormat);

                $(element).text(date);
            }
        };

        // This binding handlers is used to avoid applying bindings twice (from the main script for components)
        // More info here http://www.knockmeout.net/2012/05/quick-tip-skip-binding.html
        ko.bindingHandlers.stopBinding = {
            init: () => {
                return { controlsDescendantBindings: true };
            },
        };
    }
}
