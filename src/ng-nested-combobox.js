'use strict';

angular.module('ui.nested.combobox', [])
    .controller('NestedComboboxController', [
            '$scope', '$element', '$attrs', 
            function ($scope, $element, $attrs) {

        var that = this,
            oldMemberId = null;
        this.isOpen = false;
        this.currentMember = $scope.currentMember;

        $scope.$watch('controlDisabled', function (value) {
            that.controlDisabled = value;
        });

        /* $element.on('blur', function (e) {
         //that.isOpen.status = !that.isOpen.status;
         that.isOpen = false;
         });
         $element.on('focus', function (e) {
         //that.isOpen.status = !that.isOpen.status;
         that.isOpen = true;
         });*/

        this.toggleOpen = function () {

            if (that.controlDisabled === 'true') {
                this.isOpen.status = false;
                return false;
            }
            this.isOpen = !this.isOpen;
        };

        this.selectValue = function (event, member) {

            if (oldMemberId === member.id) {
                return true;
            }

            if (member.id === 'root') {
                member.name = event.currentTarget.innerText;
            }
            //that.currentMember = member;
            $scope.changeEvent(member);
            that.currentMember = member;
            oldMemberId = member.id;

        };
    }])
    .directive('nestedComboBox', function () {
        return {
            restrict: 'E',
            controller: 'NestedComboboxController',
            controllerAs: 'gs',
            replace: true,
            templateUrl: 'template/select-group.html',
            scope: {
                collection: '=',
                currentMember: '=',
                controlClass: '@',
                controlDisabled: '@',
                changeEvent: '='
            }
        };
    })
    .run(['$templateCache', function($templateCache) {
        $templateCache.put('template/select-group.html',
        '<div class="custom-select"   data-ng-disabled="gs.controlDisabled==\'true\'" data-ng-class="controlClass" data-ng-click="gs.toggleOpen()">'+
            '<p>{{gs.currentMember.name}}</p>'+
            '<span><i class="icon-sort-down"></i></span>'+
            '<div class="list" data-ng-show="gs.isOpen">'+
                '<ul>'+
                    '<li data-ng-class="{\'active\':gs.currentMember.id === member.id}" data-ng-include="\'template/sub-level.html\'" data-ng-repeat="member in collection"> </li>'+
                '</ul>'+
            '</div>'+
        '</div>'
        );

        $templateCache.put('template/sub-level.html',
        '<a href="" data-ng-click="gs.selectValue(e,member)"><span>{{member.name}}</span></a>'+
        '<ul>'+
            '<li data-ng-class="{\'active\':gs.currentMember.id === member.id}" ng-repeat="member in member.childrens" ng-include="\'template/sub-level.html\'"></li>'+
        '</ul>'
        );
    }]);