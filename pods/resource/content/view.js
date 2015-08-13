define(
	[
		'jquery',
		'underscore',
		'backbone',
        'viewmanager',
		'app/config',
        'projekktor',

		'text!pods/resource/content/templates/rich-text.html',
		'text!pods/resource/content/templates/youtube-video.html',
		'text!pods/resource/content/templates/exercise.html',
		'text!pods/resource/content/templates/audio.html',
		'text!pods/resource/content/templates/video.html',
		'text!pods/resource/content/templates/downloadable-file.html',

		'pods/attempts/exercise-attempt/model',
		'pods/attempts/exercise-attempt/view'
	],
	function($, _, Backbone, VM, Config, Projekktor,
		richTextTemplate, youtubeVideoTemplate, exerciseTemplate, audioTemplate, videoTemplate, downloadableFileTemplate,
		ExerciseAttemptModel, ExerciseAttemptView
		) {

		return Backbone.View.extend({

			tagName: 'div',

			initialize: function() {
				this.listenTo(this.model, 'change', this.render);
			},

			templateHTML: function() {
				var content = this.model.get('resource_content');
				var cls = content._cls.split('.').pop();
				switch(cls) {
					case Config.stringsDict.RESOURCE_TYPE.RICH_TEXT:
						return richTextTemplate;
					case Config.stringsDict.RESOURCE_TYPE.EXTERNAL_VIDEO:
						switch(content.source) {
							case 'youtube':
								return youtubeVideoTemplate;
							default:
								return 'Unrecognized resource type.';
						}
					case Config.stringsDict.RESOURCE_TYPE.EXERCISE:
						return exerciseTemplate;
					case Config.stringsDict.RESOURCE_TYPE.AUDIO:
						return audioTemplate;
					case Config.stringsDict.RESOURCE_TYPE.VIDEO:
                        if (content.video_id == null || content.video_id == "")
                        {
                            return videoTemplate;
                        }
                        switch(content.source) {
                            case 'youtube':
                                return youtubeVideoTemplate;
                            default:
                                return videoTemplate;
                        }
					case Config.stringsDict.RESOURCE_TYPE.DOWNLOADABLE_FILE:
						return downloadableFileTemplate;
					default:
						return 'Unrecognized resource type.';
				}
			},

			template: function(args) {
				var templateHTML = this.templateHTML();
				return _.template(templateHTML)(args);
			},

            isVideo: function () {
                var content = this.model.get('resource_content');
                var cls = content._cls.split('.').pop();
                return cls == Config.stringsDict.RESOURCE_TYPE.VIDEO;
            },

			isExercise: function() {
				var content = this.model.get('resource_content');
				var cls = content._cls.split('.').pop();
				return cls == Config.stringsDict.RESOURCE_TYPE.EXERCISE;
			},

            render: function() {
				var html = this.template({
					resource: this.model.forTemplate(),
					config: Config
				});
				this.$el.html(html);

                if (this.isVideo()) {
                    projekktor('video#resource-video-player', {
                        /* path to the MP4 Flash-player fallback component */
                        playerFlashMP4:		'../../../lib/StrobeMediaPlayback.swf',

                        /* path to the MP3 Flash-player fallback component */
                        playerFlashMP3:		'../../../lib/StrobeMediaPlayback.swf'
                    });
                }
				else if (this.isExercise()) {
					if (this.model.isValidated()) {
						this.$('.btn-start-exercise').removeClass('btn-success').addClass('btn-info golden-effect');
					}
				}

                return this;
			},

			events: {
				'click .btn-start-exercise': 'startExercise'
			},

			startExercise: function(e) {
				e.preventDefault();

				var self = this;

				var attempt = new ExerciseAttemptModel();
				attempt.set('exercise', this.model.id);
				attempt.save().done(function(result) {
					var $modal = $('#modal');
                    var exerciseAttemptView = VM.createView(Config.constants.VIEWS_ID.EXERCISE_ATTEMPT, function() {
                        return new ExerciseAttemptView({model: attempt});
                    });
					exerciseAttemptView.resource = self.model;
					$modal.html(exerciseAttemptView.render().$el);

					// FIXME Do this when the modal is shown
					// (The event is not fired for some reason)
					//$modal.on('shown.bs.modal', function () {
						exerciseAttemptView.continueExercise();
					//});

					$modal.modal('show');
					exerciseAttemptView.continueExercise();

                    $modal.on('hidden.bs.modal', function () {
                        if (!self.model.isValidated() && exerciseAttemptView.isExerciseCompleted)
                        {
                            self.model._isValidated = true;
							self.model.trigger('change');
							// FIXME Do this in a cleaner way (the validation ought to come from the server)
                        }
                        $modal.html(self.render().$el);
                        if (exerciseAttemptView.trackValidationId != null) {
                            Backbone.history.loadUrl("/prompt_track_validation/" + exerciseAttemptView.trackValidationId);
                        }
                        $modal.unbind('hidden.bs.modal');
                    });
				}).fail(function(error) {

				});
			}

		});
		
	}
);
