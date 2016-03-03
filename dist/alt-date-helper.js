;(function(ng) {
  "use strict";

  ng.module('alt.date-helper', [])

    .directive('altDateHelper', function () {

        var _restrict = 'A';
        var _require = 'ngModel';


        var _link = function (scope, element, attrs, ngModel) {
            var _startCursorPos = 0, _endCursorPos = 0, _initialElementValue = '';

            element.on("keydown", function (event) {
                _startCursorPos = this.selectionStart;
                _endCursorPos = this.selectionEnd;
                _initialElementValue = this.value;
            });

            function _onChange(){
                var localDate = ngModel.$viewValue;
                localDate = _getCleanValue(localDate);
                localDate = _setValueBars(localDate);
                ngModel.$setViewValue(localDate);
                ngModel.$render();
                _setElementCursorPosition(element[0]);
            }

            function _setElementCursorPosition(el){
                var splittedStartString = [];
                splittedStartString.push(_initialElementValue.substr(0, _startCursorPos));
                splittedStartString.push(_initialElementValue.substr(_startCursorPos, _initialElementValue.length));

                var splittedEndString = [];
                splittedEndString.push(el.value.substr(0, _startCursorPos));
                splittedEndString.push(el.value.substr(_startCursorPos, el.value.length));


                //caracteres selecionados
              if (_startCursorPos != _endCursorPos)
              {
                var range = _endCursorPos - _startCursorPos;
                var barsSelected = _initialElementValue.substr(_startCursorPos, range).split("/").length - 1;
                var reInsertedBars = el.value.substr(_startCursorPos, el.value.length > _endCursorPos ? _endCursorPos : el.value.length).split("/").length - 1;
                reInsertedBars = barsSelected > 0 ? reInsertedBars : 0;
                var removedBars = 2 - (el.value.split("/").length - 1);

                if ((splittedEndString[1].length) <= (splittedStartString[1].length - range + reInsertedBars - removedBars))
                {
                  el.setSelectionRange(_startCursorPos, _startCursorPos);
                }
                else
                {
                  //@todo avaliar esta condicao. Ela ocorre, mas no momento de testar, nao foi possivel simular.
                  /*if (splittedEndString[1].length == splittedStartString[1].length - range)//algo foi digitado, ao inves de apenas excluido
                  {//foi inserido um caracter
                    el.setSelectionRange(_startCursorPos + 1, _startCursorPos + 1);
                  }
                  else
                  {*///foi pressionado o delete ou backspace
                    el.setSelectionRange(_startCursorPos + 1 + reInsertedBars, _startCursorPos + 1 + reInsertedBars);
                  //}
                }
                return;
              }

                //controle da barra
                if(
                    (
                        ((_startCursorPos == 3 || _startCursorPos == 2) && el.value.length >= 3) ||
                        ((_startCursorPos == 6 || _startCursorPos == 5) && el.value.length >= 6)
                    ) && _initialElementValue.length == el.value.length
                )
                {
                    el.setSelectionRange(_startCursorPos, _startCursorPos);
                    return;
                }

                //exclusao de caracteres
                if (_initialElementValue.length > el.value.length)
                {
                    //backspace
                    if ((splittedStartString[0] != splittedEndString[0])&& _startCursorPos > 0)
                    {
                        el.setSelectionRange(_startCursorPos - 1, _startCursorPos - 1);
                        return;
                    }
                    //delete
                    el.setSelectionRange(_startCursorPos, _startCursorPos);
                    return;
                }

                //quando nada acima funcionar (correcao do cursor na adicao da barra)...
                var barsInserted = (el.value.split("/").length - 1) - (_initialElementValue.split("/").length - 1);
                barsInserted = barsInserted > 0 ? barsInserted : 0;

                if (splittedStartString[1].length + barsInserted < splittedEndString[1].length)
                {
                    el.setSelectionRange(_startCursorPos + 1 + barsInserted, _startCursorPos + 1 + barsInserted);
                    return;
                }
            }

            //apenas numeros
            function _getCleanValue(value){
                return value.replace(/[^0-9]/g, '');
            }

            //adicao das barras
            function _setValueBars(val){
                if (val.length > 8)
                {
                    val = val.substr(0, 8);
                }
                if (val.length > 4)
                {
                    val = val.substr(0, 2) + "/" + val.substr(2, 2) + "/" + val.substr(4, val.length - 4);
                }
                else if (val.length > 2)
                {
                    val = val.substr(0, 2) + "/" + val.substr(2, val.length - 2);
                }

                return val;
            }

            element.on('input', _onChange);

        }

        return {
            restrict: _restrict,
            require: _require,
            link: _link
        };
    });
}(angular));
