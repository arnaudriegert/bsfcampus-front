define(
    [
        'jquery',
        'underscore',
        'backbone',
        'app/config',

        'pods/attempts/exercise-attempt/question-answer/unique-answer-mcq/views/feedback',
        'pods/attempts/exercise-attempt/question-answer/multiple-answer-mcq/views/feedback',
        'pods/attempts/exercise-attempt/question-answer/right-or-wrong/views/feedback',
        'pods/attempts/exercise-attempt/question-answer/dropdowns/views/feedback',
        'pods/attempts/exercise-attempt/question-answer/ordering/views/feedback',
        'pods/attempts/exercise-attempt/question-answer/categorizer/views/feedback'
    ],
    function ($, _, Backbone, Config,
              UniqueAnswerMCQView, MultipleAnswerMCQView, RightOrWrongView, DropdownView, OrderingView, CategorizerView) {

        return function (options) {
            if (options.hasOwnProperty('model')) {
                switch (options.model.questionModel().get('_cls').split('.').pop()) {
                    case 'UniqueAnswerMCQExerciseQuestion':
                        return new UniqueAnswerMCQView(options);
                    case 'MultipleAnswerMCQExerciseQuestion':
                        return new MultipleAnswerMCQView(options);
                    case 'RightOrWrongExerciseQuestion':
                        return new RightOrWrongView(options);
                    case 'DropdownExerciseQuestion':
                        return new DropdownView(options);
                    case 'OrderingExerciseQuestion':
                        return new OrderingView(options);
                    case 'CategorizeExerciseQuestion':
                        return new CategorizerView(options);
                    default:
                        return null;
                }
            } else {
                return null;
            }
        }

    }
);
