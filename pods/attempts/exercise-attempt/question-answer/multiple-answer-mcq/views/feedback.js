define(
	[
		'jquery',
		'underscore',
		'backbone',
		'app/config',

		'pods/attempts/exercise-attempt/question-answer/models/question-answer',
		'pods/attempts/exercise-attempt/question-answer/models/question',

		'text!pods/attempts/exercise-attempt/question-answer/multiple-answer-mcq/templates/feedback.html',
		'text!pods/attempts/exercise-attempt/question-answer/multiple-answer-mcq/templates/feedback-proposition.html',
	],
	function($, _, Backbone, Config,
		QuestionAnswerModel, QuestionModel,
		feedbackTemplate, feedbackPropositionTemplate
		) {

		return Backbone.View.extend({

			model: QuestionAnswerModel,

			tagName: 'div',

			id: 'multiple-answer-mcq',

			template: _.template(feedbackTemplate),
			propositionTemplate: _.template(feedbackPropositionTemplate),
			
			render: function() {
				console.log("multiple-answer-mcq render", this.model.toJSON(true));
				var html = this.template({question: this.model.toJSON(true).question, config: Config});
				this.$el.html(html);
				
				if (this.model.questionModel().get('question_image_url') != null)
				{
					this.$('.question-image-media').html('<a href="' + this.model.questionModel().get('question_image_url') + '" target="_blank"><img src="' + this.model.questionModel().get('question_image_url') + '"></a>');
				}
				else
				{
					this.$('.question-image-media').hide();
				}

				var propositions = this.model.questionModel().get('propositions');
				_.each(propositions, this.renderProposition, this);

				var answerExplanationEl = this.$('.answer-explanation');
				if (this.model.get('is_answered_correctly') === true)
				{
					answerExplanationEl.addClass('right-answer');
				}
				else
				{
					answerExplanationEl.addClass('wrong-answer');
				}
				if (this.model.get('question').answer_feedback != null)
				{
					answerExplanationEl.html(this.model.get('question').answer_feedback);
					answerExplanationEl.show();
				}
				else
				{
					answerExplanationEl.empty();
				}

				return this;
			},

			renderProposition: function(proposition, index) {
				var html = this.propositionTemplate({
					proposition: proposition,
					index: index,
					config:Config
				});
				var $proposition = $(html);
				$proposition.prop('disabled', true);
				if (_.contains(this.model.get('given_answer').given_propositions, proposition._id)) {
					$proposition.addClass('proposition_selected');
				}
				if (proposition.is_correct_answer) {
					$proposition.addClass('proposition_correct');
				}
				this.$('.multiple-answer-mcq-propositions').append($proposition);
			}

		});
		
	}
);
