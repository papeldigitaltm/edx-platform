define(
    ['jquery', 'underscore', 'backbone', 'js/views/baseview', 'js/views/previous_video_upload'],
    function($, _, Backbone, BaseView, PreviousVideoUploadView) {
        'use strict';
        var PreviousVideoUploadListView = BaseView.extend({
            tagName: 'section',
            className: 'wrapper-assets',

            initialize: function(options) {
                this.template = this.loadTemplate('previous-video-upload-list');
                this.encodingsDownloadUrl = options.encodingsDownloadUrl;
                this.videoImageUploadEnabled = options.videoImageSettings.video_image_upload_enabled;
                this.isVideoTranscriptEnabled = options.isVideoTranscriptEnabled;
                this.itemViews = this.collection.map(function(model) {
                    return new PreviousVideoUploadView({
                        videoImageUploadURL: options.videoImageUploadURL,
                        defaultVideoImageURL: options.defaultVideoImageURL,
                        videoHandlerUrl: options.videoHandlerUrl,
                        videoImageSettings: options.videoImageSettings,
                        videoTranscriptSettings: options.videoTranscriptSettings,
                        model: model,
                        transcriptAvailableLanguages: options.transcriptAvailableLanguages,
                        videoSupportedFileFormats: options.videoSupportedFileFormats,
                        isVideoTranscriptEnabled: options.isVideoTranscriptEnabled
                    });
                });
            },

            render: function() {
                var $el = this.$el,
                    $tabBody;
                $el.html(this.template({
                    encodingsDownloadUrl: this.encodingsDownloadUrl,
                    videoImageUploadEnabled: this.videoImageUploadEnabled,
                    isVideoTranscriptEnabled: this.isVideoTranscriptEnabled
                }));
                $tabBody = $el.find('.js-table-body');
                _.each(this.itemViews, function(view) {
                    $tabBody.append(view.render().$el);
                });
                return this;
            }
        });

        return PreviousVideoUploadListView;
    }
);
