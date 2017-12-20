define(
    ['jquery', 'underscore', 'backbone', 'js/views/video_transcripts', 'common/js/spec_helpers/template_helpers'],
    function($, _, Backbone, VideoTranscriptsView, TemplateHelpers) {
        'use strict';
        describe('VideoTranscriptsView', function() {
            var $videoTranscriptsViewEl,
                videoTranscriptsView,
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
                TRANSCRIPT_DOWNLOAD_FILE_FORMAT = 'srt';

            renderView = function(availableTranscripts) {
                videoTranscriptsView = new VideoTranscriptsView({
                    transcripts: availableTranscripts,
                    edxVideoID: edxVideoID,
                    clientVideoID: clientVideoID,
                    transcriptAvailableLanguages: transcriptAvailableLanguages,
                    videoSupportedFileFormats: videoSupportedFileFormats
                });
                videoTranscriptsView.setElement($('.transcripts-col'));
                $videoTranscriptsViewEl = videoTranscriptsView.render().$el;
            };

            beforeEach(function() {
                setFixtures(
                    '<div class="video-col transcripts-col"></div>'
                );
                TemplateHelpers.installTemplate('video-transcripts');
                renderView(transcripts);
            });

            it('renders as expected', function() {
                expect($videoTranscriptsViewEl.find('.show-video-transcripts-container')).toExist();
            });

            it('does not shows transcripts', function() {
                expect(
                    $videoTranscriptsViewEl.find('.show-video-transcripts-wrapper').hasClass('hidden')
                ).toEqual(true);
                expect($videoTranscriptsViewEl.find('.toggle-show-transcripts-button-text').html().trim()).toEqual(
                    'Show transcripts (' + _.size(transcripts) + ')'
                );
            });

            it('shows transcripts container on show transcript button click', function() {
                // Verify transcript container is hidden
                expect(
                    $videoTranscriptsViewEl.find('.show-video-transcripts-wrapper').hasClass('hidden')
                ).toEqual(true);

                // Verify initial button text
                expect($videoTranscriptsViewEl.find('.toggle-show-transcripts-button-text').html().trim()).toEqual(
                    'Show transcripts (' + _.size(transcripts) + ')'
                );
                $videoTranscriptsViewEl.find('.toggle-show-transcripts-button').click();

                // Verify transcript container is not hidden
                expect(
                    $videoTranscriptsViewEl.find('.show-video-transcripts-wrapper').hasClass('hidden')
                ).toEqual(false);

                // Verify button text is changed.
                expect($videoTranscriptsViewEl.find('.toggle-show-transcripts-button-text').html().trim()).toEqual(
                    'Hide transcripts (' + _.size(transcripts) + ')'
                );
            });

            it('hides transcripts when clicked on hide transcripts button', function() {
                // Click to show transcripts first.
                $videoTranscriptsViewEl.find('.toggle-show-transcripts-button').click();

                // Verify button text.
                expect($videoTranscriptsViewEl.find('.toggle-show-transcripts-button-text').html().trim()).toEqual(
                    'Hide transcripts (' + _.size(transcripts) + ')'
                );

                // Verify transcript container is not hidden
                expect(
                    $videoTranscriptsViewEl.find('.show-video-transcripts-wrapper').hasClass('hidden')
                ).toEqual(false);

                $videoTranscriptsViewEl.find('.toggle-show-transcripts-button').click();

                // Verify button text is changed.
                expect($videoTranscriptsViewEl.find('.toggle-show-transcripts-button-text').html().trim()).toEqual(
                    'Show transcripts (' + _.size(transcripts) + ')'
                );

                // Verify transcript container is hidden
                expect(
                    $videoTranscriptsViewEl.find('.show-video-transcripts-wrapper').hasClass('hidden')
                ).toEqual(true);
            });

            it('renders appropriate text when no transcript is available', function() {
                // Render view with no transcripts
                renderView({});

                // Verify appropriate text is shown
                expect(
                    $videoTranscriptsViewEl.find('.transcripts-empty-text').html()
                ).toEqual('No transcript available yet.');
            });

            it('renders correct transcript attributes', function() {
                var $transcriptEl;
                // Show transcripts
                $videoTranscriptsViewEl.find('.toggle-show-transcripts-button').click();
                expect($videoTranscriptsViewEl.find('.show-video-transcript-content').length).toEqual(
                    _.size(transcripts)
                );

                _.each(transcripts, function(langaugeText, languageCode) {
                    $transcriptEl = $($videoTranscriptsViewEl.find('#show-video-transcript-content-' + languageCode));
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
