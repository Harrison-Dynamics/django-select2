/* global define, jQuery */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory)
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'))
  } else {
    // Browser globals
    factory(jQuery)
  }
}(function ($) {
  'use strict'
  var init = function ($element, options) {
    $element.select2(options)
  }

  var initHeavy = function ($element, options) {
    var settings = $.extend(true, {
      ajax: {
        data: function (params) {
          var result = {
            term: params.term,
            page: params.page,
            field_id: $element.data('field_id')
          }

          var dependentFields = $element.data('select2-dependent-fields')
          if (dependentFields) {
            dependentFields = dependentFields.trim().split(/\s+/)
            $.each(dependentFields, function (i, dependentField) {
              var dependentFieldElement = $('[name=' + dependentField + ']', $element.closest('form'));

              if(dependentFieldElement.is('[type=radio]')){
                result[dependentField] = dependentFieldElement.filter(':checked').val();
              }
              else {
                result[dependentField] = dependentFieldElement.val()
              }
            })
          }

          return result
        },
        processResults: function (data, page) {
          return {
            results: data.results,
            pagination: {
              more: data.more
            }
          }
        }
      }
    }, options)

    $element.select2(settings)
  }

  $.fn.djangoSelect2 = function (options) {
    var settings = $.extend({}, options)
    $.each(this, function (i, element) {
      var $element = $(element)
      if ($element.hasClass('django-select2-heavy')) {
        initHeavy($element, settings)
      } else {
        init($element, settings)
      }
    })
    return this
  }

  $(function () {
    $('.django-select2:not(.django-select2-manual-init)').djangoSelect2()
  })

  return $.fn.djangoSelect2
}))
