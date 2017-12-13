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
                this.template = HtmlUtils.template(videoTranscriptsTemplate);
            },

            getTranscriptClientTitle: function() {
                // TODO: Use supported video file types.
                return this.clientVideoID.substring(0, 20).replace('.mp4', '');
            },

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

            render: function() {
                HtmlUtils.setHtml(
                    this.$el,
                    this.template({
                        transcripts: this.transcripts,
                        transcriptAvailableLanguages: this.transcriptAvailableLanguages,
                        edxVideoID: this.edxVideoID,
                        // Slice last 4 letters so that video filetype is not attached
                        // eg. eg. Harry-Potter.mp4 would give us eg. Harry-Potter
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
