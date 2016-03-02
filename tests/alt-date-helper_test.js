"use strict";

describe('Directive: alt.date-helper', function() {
  var _dateHelperDirective, _scope, _compile, _element, _evtKD, _evtInput;
  var _html = '<input ng-model="mdl" alt-date-helper="{{mdl}}" />';
  beforeEach(module('alt.date-helper'));

  beforeEach(inject(function($injector) {
    _scope = $injector.get('$rootScope').$new();
    _compile = $injector.get('$compile');
    _evtInput = $.Event("input");
    _evtKD = $.Event("keydown");
  }));

  describe('Inicialização', function() {

    it('deve ter elementos criados e acessiveis', function() {
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();

      expect(_element).toBeDefined();
    });

    it('deve formatar a data, inserindo a primeira barra', function() {
      _scope.mdl = "100";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element).trigger(_evtKD);
      $(_element).trigger(_evtInput);

      expect(_scope.mdl).toEqual("10/0");
    });

    it('deve formatar a data, inserindo a SEGUNDA barra', function() {
      _scope.mdl = "10001";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element).trigger(_evtKD);
      $(_element).trigger(_evtInput);

      expect(_scope.mdl).toEqual("10/00/1");
    });

    it('deve formatar a data, com todos caracteres possiveis', function() {
      _scope.mdl = "10011990";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element).trigger(_evtKD);
      $(_element).trigger(_evtInput);

      expect(_scope.mdl).toEqual("10/01/1990");
    });

    it('deve remover caracteres adicionais', function() {
      _scope.mdl = "1001199000";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element).trigger(_evtKD);
      $(_element).trigger(_evtInput);

      expect(_scope.mdl).toEqual("10/01/1990");
    });

    it('deve ter o campo vazio', function() {
      _scope.mdl = "";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element).trigger(_evtKD);
      $(_element).trigger(_evtInput);

      expect(_scope.mdl).toEqual("");
    });

    it('deve ter o cursor na posicao inicial', function() {
      _scope.mdl = "";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element).trigger(_evtKD);
      $(_element).trigger(_evtInput);

      expect($(_element)[0].selectionStart).toEqual(0);
    });

    it('deve ter o cursor na posicao "2"', function() {
      _scope.mdl = "12";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element).trigger(_evtKD);
      $(_element).trigger(_evtInput);

      expect($(_element)[0].selectionStart).toEqual(2);
    });

    it('deve ter o cursor na posicao "4" (salto da primeira barra)', function() {
      _scope.mdl = "123";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element).trigger(_evtKD);
      $(_element).trigger(_evtInput);

      expect($(_element)[0].selectionStart).toEqual(4);
    });

    it('deve ter o cursor na posicao "5"', function() {
      _scope.mdl = "1234";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element).trigger(_evtKD);
      $(_element).trigger(_evtInput);

      expect($(_element)[0].selectionStart).toEqual(5);
    });

    it('deve ter o cursor na posicao "7" (salto da segunda barra)', function() {
      _scope.mdl = "12343";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element).trigger(_evtKD);
      $(_element).trigger(_evtInput);

      expect($(_element)[0].selectionStart).toEqual(7);
    });

    it('deve remover os caracteres selecionados, mantendo o cursor no local', function() {
      _scope.mdl = "123456";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element)[0].setSelectionRange(1,3);
      $(_element).trigger(_evtKD);
      _scope.mdl = "13456";
      _scope.$digest();
      $(_element).trigger(_evtInput);
      $(_element)[0].setSelectionRange(1,1);

      expect(_scope.mdl).toEqual("13/45/6");
      expect($(_element)[0].selectionStart).toEqual(1);
    });

    it('deve manter a barra, no caso de um delete ou backspace', function() {

      _scope.mdl = "12/3";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element)[0].setSelectionRange(2,2);
      $(_element).trigger(_evtKD);
      _scope.mdl = "12/3";
      _scope.$digest();
      $(_element).trigger(_evtInput);

      expect(_scope.mdl).toEqual("12/3");
      expect($(_element)[0].selectionStart).toEqual(2);
    });

    it('deve manter o cursor. nada foi modificado (tentativa de selecionar e excluir uma barra)', function() {

      _scope.mdl = "12/03/199";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element)[0].setSelectionRange(2,3);
      $(_element).trigger(_evtKD);
      $(_element).trigger(_evtInput);

      expect(_scope.mdl).toEqual("12/03/199");
      expect($(_element)[0].selectionStart).toEqual(2);
    });



    it('deve remover uma posição do cursor (backspace)', function() {

      _scope.mdl = "12/30";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element)[0].setSelectionRange(2,2);
      $(_element).trigger(_evtKD);
      _scope.mdl = "13/0";
      _scope.$digest();
      $(_element).trigger(_evtInput);

      expect(_scope.mdl).toEqual("13/0");
      expect($(_element)[0].selectionStart).toEqual(1);
    });

    it('deve manter a posição do cursor (delete)', function() {

      _scope.mdl = "12/30";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element)[0].setSelectionRange(1,1);
      $(_element).trigger(_evtKD);
      _scope.mdl = "13/0";
      _scope.$digest();
      $(_element).trigger(_evtInput);

      expect(_scope.mdl).toEqual("13/0");
      expect($(_element)[0].selectionStart).toEqual(1);
    });

    it('deve avançar o cursor, além da barra que foi inserida', function() {

      _scope.mdl = "12";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element)[0].setSelectionRange(2,2);
      $(_element).trigger(_evtKD);
      _scope.mdl = "12/0";
      _scope.$digest();
      $(_element).trigger(_evtInput);

      expect(_scope.mdl).toEqual("12/0");
      expect($(_element)[0].selectionStart).toEqual(4);
    });

    it('deve manter o cursor a frente do caracter que foi inserido apos a selecao', function() {

      _scope.mdl = "12/01/1990";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element)[0].setSelectionRange(1,4);
      $(_element).trigger(_evtKD);
      _scope.$digest();
      _scope.mdl = "13/11/990";
      _scope.$digest();
      $(_element).trigger(_evtInput);

      expect(_scope.mdl).toEqual("13/11/990");
      expect($(_element)[0].selectionStart).toEqual(3);
    });

    it('deve manter o cursor a frente do caracter que foi inserido apos a selecao (sem barras selecionadas)', function() {

      _scope.mdl = "12/01/1990";
      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();
      $(_element)[0].setSelectionRange(4,8);
      $(_element).trigger(_evtKD);
      _scope.$digest();
      _scope.mdl = "12/08/90";
      _scope.$digest();
      $(_element).trigger(_evtInput);

      expect(_scope.mdl).toEqual("12/08/90");
      expect($(_element)[0].selectionStart).toEqual(6);
    });

  });
});
