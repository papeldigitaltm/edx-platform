define(
    ['jquery', 'underscore', 'backbone', 'js/views/video_transcripts', 'js/views/previous_video_upload_list',
        'common/js/spec_helpers/template_helpers'],
    function($, _, Backbone, VideoTranscriptsView, PreviousVideoUploadListView, TemplateHelpers) {
        'use strict';
        describe('VideoTranscriptsView', function() {
            var videoTranscriptsView,
                renderView,
                transcripts = {
                    en: 'English',
                    es: 'Spanish',
                    ur: 'Urdu'
                },
                edxVideoID = 'test-edx-video-id',
                clientVideoID = 'Video client title name.mp4',
                transcriptAvailableLanguages = {
                    en: 'English',
                    es: 'Spanish',
                    cn: 'Chinese',
                    ar: 'Arabic',
                    ur: 'Urdu'
                },
                videoSupportedFileFormats = ['.mov', '.mp4'],
                videoTranscriptSettings = {
                    transcript_download_handler_url: 'abc.com/transcript_download/course_id'
                },
                TRANSCRIPT_DOWNLOAD_FILE_FORMAT = 'srt',
                videoListView;

            renderView = function(availableTranscripts, isVideoTranscriptEnabled) {
                var videoViewIndex = 0,
                    isVideoTranscriptEnabled = isVideoTranscriptEnabled || _.isUndefined(isVideoTranscriptEnabled), // eslint-disable-line max-len, no-redeclare
                    videoData = {
                        client_video_id: clientVideoID,
                        edx_video_id: edxVideoID,
                        created: '2014-11-25T23:13:05',
                        transcripts: availableTranscripts
                    },
                    videoCollection = new Backbone.Collection([new Backbone.Model(videoData)]);

                videoListView = new PreviousVideoUploadListView({
                    collection: videoCollection,
                    videoImageSettings: {},
                    transcriptAvailableLanguages: transcriptAvailableLanguages,
                    videoSupportedFileFormats: videoSupportedFileFormats,
                    isVideoTranscriptEnabled: isVideoTranscriptEnabled,
                    videoTranscriptSettings: videoTranscriptSettings
                });
                videoListView.setElement($('.wrapper-assets'));
                videoListView.render();

                videoTranscriptsView = videoListView.itemViews[videoViewIndex].videoTranscriptsView;
            };

            beforeEach(function() {
                setFixtures('<section class="wrapper-assets"></section>');
                TemplateHelpers.installTemplate('previous-video-upload-list');
                renderView(transcripts);
            });

            it('renders as expected', function() {
                expect(videoListView.$el.find('.show-video-transcripts-container')).toExist();
                // Verify transcript container is present.
                expect(videoListView.$el.find('.show-video-transcripts-container')).toExist();
                // Veirfy transcript column header is present.
                expect(videoListView.$el.find('.js-table-head .video-head-col.transcripts-col')).toExist();
                // Verify transcript data column is present.
                expect(videoListView.$el.find('.js-table-body .transcripts-col')).toExist();
                // Verify view has initiallized.
                expect(_.isUndefined(videoTranscriptsView)).toEqual(false);
            });

            it('does not render transcripts view if feature is disabled', function() {
                renderView({}, false);
                // Verify transcript container is not present.
                expect(videoListView.$el.find('.show-video-transcripts-container')).not.toExist();
                // Veirfy transcript column header is not present.
                expect(videoListView.$el.find('.js-table-head .video-head-col.transcripts-col')).not.toExist();
                // Verify transcript data column is not present.
                expect(videoListView.$el.find('.js-table-body .transcripts-col')).not.toExist();
                // Verify view has not initiallized.
                expect(_.isUndefined(videoTranscriptsView)).toEqual(true);
            });

            it('does not shows transcripts', function() {
                expect(
                    videoTranscriptsView.$el.find('.show-video-transcripts-wrapper').hasClass('hidden')
                ).toEqual(true);
                expect(videoTranscriptsView.$el.find('.toggle-show-transcripts-button-text').html().trim()).toEqual(
                    'Show transcripts (' + _.size(transcripts) + ')'
                );
            });

            it('shows transcripts container on show transcript button click', function() {
                // Verify transcript container is hidden
                expect(
                    videoTranscriptsView.$el.find('.show-video-transcripts-wrapper').hasClass('hidden')
                ).toEqual(true);

                // Verify initial button text
                expect(videoTranscriptsView.$el.find('.toggle-show-transcripts-button-text').html().trim()).toEqual(
                    'Show transcripts (' + _.size(transcripts) + ')'
                );
                videoTranscriptsView.$el.find('.toggle-show-transcripts-button').click();

                // Verify transcript container is not hidden
                expect(
                    videoTranscriptsView.$el.find('.show-video-transcripts-wrapper').hasClass('hidden')
                ).toEqual(false);

                // Verify button text is changed.
                expect(videoTranscriptsView.$el.find('.toggle-show-transcripts-button-text').html().trim()).toEqual(
                    'Hide transcripts (' + _.size(transcripts) + ')'
                );
            });

            it('hides transcripts when clicked on hide transcripts button', function() {
                // Click to show transcripts first.
                videoTranscriptsView.$el.find('.toggle-show-transcripts-button').click();

                // Verify button text.
                expect(videoTranscriptsView.$el.find('.toggle-show-transcripts-button-text').html().trim()).toEqual(
                    'Hide transcripts (' + _.size(transcripts) + ')'
                );

                // Verify transcript container is not hidden
                expect(
                    videoTranscriptsView.$el.find('.show-video-transcripts-wrapper').hasClass('hidden')
                ).toEqual(false);

                videoTranscriptsView.$el.find('.toggle-show-transcripts-button').click();

                // Verify button text is changed.
                expect(videoTranscriptsView.$el.find('.toggle-show-transcripts-button-text').html().trim()).toEqual(
                    'Show transcripts (' + _.size(transcripts) + ')'
                );

                // Verify transcript container is hidden
                expect(
                    videoTranscriptsView.$el.find('.show-video-transcripts-wrapper').hasClass('hidden')
                ).toEqual(true);
            });

            it('renders appropriate text when no transcript is available', function() {
                // Render view with no transcripts
                renderView({});

                // Verify appropriate text is shown
                expect(
                    videoTranscriptsView.$el.find('.transcripts-empty-text').html()
                ).toEqual('No transcript available yet.');
            });

            it('renders correct transcript attributes', function() {
                var $transcriptEl;
                // Show transcripts
                videoTranscriptsView.$el.find('.toggle-show-transcripts-button').click();
                expect(videoTranscriptsView.$el.find('.show-video-transcript-content').length).toEqual(
                    _.size(transcripts)
                );

                _.each(transcripts, function(langaugeText, languageCode) {
                    $transcriptEl = $(videoTranscriptsView.$el.find('#show-video-transcript-content-' + languageCode));
                    // Verify correct transcript title is set.
                    expect($transcriptEl.find('.transcript-title').html()).toEqual(
                        'Video client title n_' + languageCode + '.' + TRANSCRIPT_DOWNLOAD_FILE_FORMAT
                    );
                    // Verify transcript language dropdown has correct value set.
                    expect($transcriptEl.find('.transcript-language-menu').val(), languageCode);
                });
            });
        });
    }
);
