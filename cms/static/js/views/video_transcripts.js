define(
    ['underscore', 'gettext', 'js/views/baseview', 'edx-ui-toolkit/js/utils/html-utils',
        'edx-ui-toolkit/js/utils/string-utils', 'text!templates/video-transcripts.underscore'],
    function(_, gettext, BaseView, HtmlUtils, StringUtils, videoTranscriptsTemplate) {
        'use strict';

        var TRANSCRIPT_DOWNLOAD_FILE_FORMAT = 'srt',
            VideoTranscriptsView;

        VideoTranscriptsView = BaseView.extend({
            tagName: 'div',

            events: {
                'click .toggle-show-transcripts-button': 'toggleShowTranscripts'
            },

            initialize: function(options) {
                this.transcripts = options.transcripts;
                this.edxVideoID = options.edxVideoID;
                this.clientVideoID = options.clientVideoID;
                this.transcriptAvailableLanguages = options.transcriptAvailableLanguages;
                this.videoSupportedFileFormats = options.videoSupportedFileFormats;
                this.template = HtmlUtils.template(videoTranscriptsTemplate);
            },

            /*
            Sorts object by value and returns a sorted array.
            */
            sortByValue: function(itemObject) {
                var sortedArray = [];
                _.each(itemObject, function(value, key) {
                    // Push each JSON Object entry in array by [value, key]
                    sortedArray.push([value, key]);
                });
                return sortedArray.sort();
            },

            /*
            Returns transcript title.
            */
            getTranscriptClientTitle: function() {
                // Use a fixed length tranascript name.
                var clientTitle = this.clientVideoID.substring(0, 20);
                // Remove video file extension for transcript title.
                _.each(this.videoSupportedFileFormats, function(videoFormat) {
                    clientTitle.replace(videoFormat, '');
                });
                return clientTitle;
            },

            /*
            Toggles Show/Hide transcript button and transcripts container.
            */
            toggleShowTranscripts: function() {
                var $transcriptsWrapperEl = this.$el.find('.show-video-transcripts-wrapper');

                // Toggle show transcript wrapper.
                $transcriptsWrapperEl.toggleClass('hidden');

                // Toggle button text.
                HtmlUtils.setHtml(
                    this.$el.find('.toggle-show-transcripts-button-text'),
                    StringUtils.interpolate(
                        gettext('{toggleShowTranscriptText} transcripts ({totalTranscripts})'),
                        {
                            toggleShowTranscriptText: $transcriptsWrapperEl.hasClass('hidden') ? gettext('Show') : gettext('Hide'),
                            totalTranscripts: _.size(this.transcripts)
                        }
                    )
                );

                // Toggle icon class.
                if ($transcriptsWrapperEl.hasClass('hidden')) {
                    this.$el.find('.toggle-show-transcripts-icon').removeClass('fa-caret-down');
                    this.$el.find('.toggle-show-transcripts-icon').addClass('fa-caret-right');
                } else {
                    this.$el.find('.toggle-show-transcripts-icon').removeClass('fa-caret-right');
                    this.$el.find('.toggle-show-transcripts-icon').addClass('fa-caret-down');
                }
            },

            /*
            Renders transcripts view.
            */
            render: function() {
                HtmlUtils.setHtml(
                    this.$el,
                    this.template({
                        transcripts: this.transcripts,
                        transcriptAvailableLanguages: this.sortByValue(this.transcriptAvailableLanguages),
                        edxVideoID: this.edxVideoID,
                        transcriptClientTitle: this.getTranscriptClientTitle(),
                        transcriptDownloadFileFormat: TRANSCRIPT_DOWNLOAD_FILE_FORMAT
                    })
                );
                return this;
            }
        });

        return VideoTranscriptsView;
    }
);
