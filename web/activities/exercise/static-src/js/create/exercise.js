export default class Exercise {
  constructor($form) {
    this.$element = $form;
    this.validator2 = null;
    this._setValidateRule();
    this._init();
    this._initEvent();

  }

  _init() {
    this._inItStep2form();
    this.fix();
  }

  _initEvent() {
    window.ltc.on('getActivity', (msg) => {
      if (this.validator2.form()) {
        window.ltc.emit('returnActivity', {valid:true,data:window.ltc.getFormSerializeObject($('#step2-form'))});
      }
    });

    window.ltc.on('getValidate', (msg) => {
      if (this.validator2.form()) {
        window.ltc.emit('returnValidate', { valid:true });
      }
    });
  }

  _inItStep2form() {
    let $step2_form = $('#step2-form');

    this.validator2 = $step2_form.validate({
      rules: {
        title: {
          required: true,
          maxlength: 50,
          trim: true,
          course_title: true,
        },
        itemCount: {
          required: true,
          positiveInteger: true,
          min: 1,
          max: 9999
        },
        range: {
          required: true,
        },
        difficulty: {
          required: true
        },
        'questionTypes[]': {
          required: true,
          remote: {
            url: $('[name="checkQuestion"]').data('checkUrl'),
            type: 'post',
            dataType: 'json',
            async: false,
            data: {
              itemCount: function () {
                return $('[name="itemCount"]').val();
              },
              range: function () {
                let range = {};
                let courseId = $('[name="range[courseId]"]').val();
                range.courseId = courseId;
                if ($('[name="range[lessonId]"]').length > 0) {
                  let lessonId = $('[name="range[lessonId]"]').val();
                  range.lessonId = lessonId;
                }

                return JSON.stringify(range);
              },
              difficulty: function () {
                return $('[name="difficulty"]').val();
              },
              types: function () {
                let types = [];
                $('[name="questionTypes\[\]"]:checked').each(function () {
                  types.push($(this).val());
                });
                return types;
              }
            }
          }
        }
      },
      messages: {
        required: Translator.trans('activity.exercise_manage.title_required_error_hint'),
        range: Translator.trans('activity.exercise_manage.title_range_error_hint'),
        itemCount: {
          required: Translator.trans('activity.exercise_manage.item_count_required_error_hint'),
          positiveInteger: Translator.trans('activity.exercise_manage.item_count_positive_integer_error_hint'),
          min: Translator.trans('activity.exercise_manage.item_count_min_error_hint'),
          max: Translator.trans('activity.exercise_manage.item_count_max_error_hint')
        },
        difficulty: Translator.trans('activity.exercise_manage.difficulty_required_error_hint'),
        'questionTypes[]': {
          required: Translator.trans('activity.exercise_manage.question_required_error_hint'),
          remote: Translator.trans('activity.exercise_manage.question_remote_error_hint')
        },
      }
    });

  }

  _setValidateRule() {
    $.validator.addMethod('positiveInteger', function (value, element) {
      return this.optional(element) || /^[1-9]\d*$/.test(value);
    }, $.validator.format(Translator.trans('activity.exercise_manage.item_count_positive_integer_error_hint')));

  }

  fix() {
    $('.js-question-type').click(() => {
      this.validator2.form();
    });
  }
}