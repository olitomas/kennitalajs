(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Kennitala = function () {
    function Kennitala(kennitala) {
        _classCallCheck(this, Kennitala);

        var kt = void 0;
        if ((kennitala.toString() || '').toLowerCase() === 'fake') {
            kt = this.createFakeKennitala();
        } else {
            kt = kennitala ? kennitala.toString() : '';
        }

        kt = kt.replace(/-/g, '');
        if (kt.length === 9) kt = '0' + kt;
        var validate = this.isValid(kt);

        if (validate.valid) {
            this.type = this.getType(kt);
            var age = this.getAge(kt);

            return {
                valid: validate.valid,
                type: this.type,
                age: age.years,
                msAge: age.msAge,
                birthdayToday: age.birthdayToday,
                kt: kt,
                formattedKt: kt.substr(0, 6) + '-' + kt.substr(6, 10)
            };
        } else {
            return {
                valid: validate.valid,
                reason: validate.reason,
                errorCode: validate.errorCode
            };
        }
    }

    _createClass(Kennitala, [{
        key: 'randomInt',
        value: function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
    }, {
        key: 'createFakeKennitala',
        value: function createFakeKennitala() {
            // Should be gte 1 and lte 72
            // But can not be between 31 and 41
            var person_or_company = Math.round(Math.random()) ? 'person' : 'company';

            var _1_2 = person_or_company === 'person' ? this.randomInt(1, 31).toString() : this.randomInt(41, 71).toString();
            _1_2 = _1_2.length === 1 ? '0' + _1_2 : _1_2;

            var _3_4 = this.randomInt(1, 12).toString();
            _3_4 = _3_4.length === 1 ? '0' + _3_4 : _3_4;

            var _5_6 = this.randomInt(0, 99).toString();
            _5_6 = _5_6.length === 1 ? '0' + _5_6 : _5_6;

            var _7_8 = this.randomInt(0, 99).toString();
            _7_8 = _7_8.length === 1 ? '0' + _7_8 : _7_8;

            var list = _1_2 + _3_4 + _5_6 + _7_8;
            list = list.split('').map(function (value) {
                return parseInt(value, 10);
            });

            this.currentRadtala = parseInt(_7_8, 10);
            var vartala = this.calculateVartala(list);

            if (vartala === 10) {
                var v = 10;
                while (v === 10) {
                    var calcAgain = this.calculateVartala(list, true);
                    if (calcAgain !== 10) vartala = calcAgain;
                    v = calcAgain;
                }
            }

            var _9 = vartala.toString();

            var _10 = ['0', '8', '9'][this.randomInt(0, 2)];

            return _1_2 + _3_4 + _5_6 + _7_8 + _9 + _10;
        }
    }, {
        key: 'existanceInYears',
        value: function existanceInYears(birthday) {
            var today = new Date();
            var age = today.getUTCFullYear() - birthday.getUTCFullYear();
            var m = today.getUTCMonth() - birthday.getUTCMonth();
            if (m < 0 || m === 0 && today.getUTCDate() < birthday.getUTCDate()) {
                age--;
            }
            return age;
        }
    }, {
        key: 'getAge',
        value: function getAge(kt) {
            // This function returns persons age in years and in millisecond along with a boolean
            // stating if the kennitala owner has a birthday today
            var list = kt.split('');

            var century = void 0;

            if (list[9] === '0') {
                century = 20;
            } else if (list[9] === '9') {
                century = 19;
            } else if (list[9] === '8') {
                century = 18;
            }

            var now = new Date();
            var nowMonth = now.getUTCMonth(); //Javascript month (actual month - 1)
            var nowDay = now.getUTCDate();

            var month = parseInt(list[2] + list[3], 10) - 1; //Javascript month (actual month - 1)
            var day = this.type === 'person' ? parseInt(list[0] + list[1], 10) : parseInt(list[0] - 4 + list[1], 10);
            var birthday = new Date(parseInt(century + list[4] + list[5], 10), month, day);

            var birthdayToday = nowMonth === month && nowDay === day ? true : false;

            return {
                years: this.existanceInYears(birthday),
                msAge: now - birthday,
                birthdayToday: birthdayToday
            };
        }
    }, {
        key: 'getType',
        value: function getType(kt) {
            var list = kt.split('');

            // Checking if first two digits are between 41 and 71
            // if so then this kennitala is a compnay kennitala
            var dd = parseInt(list[0] + list[1], 10);
            if (dd > 40 && dd < 72) return 'company';

            return 'person';
        }
    }, {
        key: 'isValid',
        value: function isValid(kt) {
            /* Note that kt is a string */
            if (kt.length !== 10) return { valid: false, reason: 'Kennitala is too short', errorCode: 1 };

            var list = kt.split('');

            // Validating digits 1 and 2
            // Should be gte 1 and lte 72
            // But can not be between 31 and 41
            var dd = parseInt(list[0] + list[1], 10);
            if (!(dd > 0 && dd < 72) || dd > 31 && dd < 41) return {
                valid: false,
                reason: 'Birthdate is out of range (digits 1 and 2)',
                errorCode: 2
            };

            // Validating digits 3 and 4
            // Must be gt 0 lt 13
            var mm = parseInt(list[2] + list[3], 10);
            if (!(mm > 0 && mm < 13)) return {
                valid: false,
                reason: 'Month digits are out of range (digits 3 and 4)',
                errorCode: 3
            };

            //Digits 5,6(years range from 0-99), 7 and 8 can be anything so we cant validate them

            // We are storing this in a variable because we need to increement this
            // if the calculated "vartala" is 10 and then recalculate with the incremented value
            this.currentRadtala = parseInt(list[6] + list[7], 10);

            // Turning list of numbers to int (from string)
            // since we will be working with ints from now on
            list.map(function (value) {
                return parseInt(value, 10);
            });

            //Validating digit 9
            if (this.validateNine(list) === false) return {
                valid: false,
                reason: 'Digit 9 is not valid. Read about "Níundi stafurinn" here: https://is.wikipedia.org/wiki/Kennitala',
                errorCode: 4
            };

            //Validating digit 10
            var lastDigit = parseInt(list[9], 10);
            if (!(lastDigit === 0 || lastDigit === 8 || lastDigit === 9)) return {
                valid: false,
                reason: 'Century digit out of range (digit 10)',
                errorCode: 5
            };

            return { valid: true };
        }
    }, {
        key: 'calculateVartala',
        value: function calculateVartala(list, incrementRadtala) {
            // Vartala is digit number 9
            // This url explains how its calculated: https://is.wikipedia.org/wiki/Kennitala'

            if (incrementRadtala) {
                this.currentRadtala++;
            }

            var radtala = ('0' + this.currentRadtala.toString()).slice(-2).split('');

            var radtalaOne = parseInt(radtala[0], 10);
            var radtalaTwo = parseInt(radtala[1], 10);

            var sum = list[0] * 3 + list[1] * 2 + list[2] * 7 + list[3] * 6 + list[4] * 5 + list[5] * 4 + radtalaOne * 3 + radtalaTwo * 2;

            var mod = sum % 11;

            var vartala = mod === 0 ? 0 : 11 - mod;
            return vartala;
        }
    }, {
        key: 'validateNine',
        value: function validateNine(list) {
            var vartala = this.calculateVartala(list);

            if (vartala === 10) {
                var v = 10;
                while (v === 10) {
                    var calcAgain = this.calculateVartala(list, true);
                    if (calcAgain !== 10) vartala = calcAgain;
                    v = calcAgain;
                }
            }

            if (vartala === parseInt(list[8], 10)) {
                return true;
            }

            return false;
        }
    }]);

    return Kennitala;
}();

global.Kennitala = Kennitala;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfOGMwNTVkODEuanMiXSwibmFtZXMiOlsiS2Vubml0YWxhIiwia2Vubml0YWxhIiwia3QiLCJ0b1N0cmluZyIsInRvTG93ZXJDYXNlIiwiY3JlYXRlRmFrZUtlbm5pdGFsYSIsInJlcGxhY2UiLCJsZW5ndGgiLCJ2YWxpZGF0ZSIsImlzVmFsaWQiLCJ2YWxpZCIsInR5cGUiLCJnZXRUeXBlIiwiYWdlIiwiZ2V0QWdlIiwieWVhcnMiLCJtc0FnZSIsImJpcnRoZGF5VG9kYXkiLCJmb3JtYXR0ZWRLdCIsInN1YnN0ciIsInJlYXNvbiIsImVycm9yQ29kZSIsIm1pbiIsIm1heCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsInBlcnNvbl9vcl9jb21wYW55Iiwicm91bmQiLCJfMV8yIiwicmFuZG9tSW50IiwiXzNfNCIsIl81XzYiLCJfN184IiwibGlzdCIsInNwbGl0IiwibWFwIiwidmFsdWUiLCJwYXJzZUludCIsImN1cnJlbnRSYWR0YWxhIiwidmFydGFsYSIsImNhbGN1bGF0ZVZhcnRhbGEiLCJ2IiwiY2FsY0FnYWluIiwiXzkiLCJfMTAiLCJiaXJ0aGRheSIsInRvZGF5IiwiRGF0ZSIsImdldFVUQ0Z1bGxZZWFyIiwibSIsImdldFVUQ01vbnRoIiwiZ2V0VVRDRGF0ZSIsImNlbnR1cnkiLCJub3ciLCJub3dNb250aCIsIm5vd0RheSIsIm1vbnRoIiwiZGF5IiwiZXhpc3RhbmNlSW5ZZWFycyIsImRkIiwibW0iLCJ2YWxpZGF0ZU5pbmUiLCJsYXN0RGlnaXQiLCJpbmNyZW1lbnRSYWR0YWxhIiwicmFkdGFsYSIsInNsaWNlIiwicmFkdGFsYU9uZSIsInJhZHRhbGFUd28iLCJzdW0iLCJtb2QiLCJnbG9iYWwiXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFNQSxTO0FBQ0YsdUJBQVlDLFNBQVosRUFBdUI7QUFBQTs7QUFDbkIsWUFBSUMsV0FBSjtBQUNBLFlBQUksQ0FBQ0QsVUFBVUUsUUFBVixNQUF3QixFQUF6QixFQUE2QkMsV0FBN0IsT0FBK0MsTUFB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S0FBSyxDQUFMLElBQVUsQ0FGVixHQUdBQSxLQUFLLENBQUwsSUFBVSxDQUhWLEdBSUFBLEtBQUssQ0FBTCxJQUFVLENBSlYsR0FLQUEsS0FBSyxDQUFMLElBQVUsQ0FMVixHQU1BaUMsYUFBYSxDQU5iLEdBT0FDLGFBQWEsQ0FSakI7O0FBVUEsZ0JBQUlFLE1BQU1ELE1BQU0sRUFBaEI7O0FBRUEsZ0JBQU03QixVQUFVOEIsUUFBUSxDQUFSLEdBQVksQ0FBWixHQUFnQixLQUFLQSxHQUFyQztBQUNBLG1CQUFPOUIsT0FBUDtBQUNIOzs7cUNBRVlOLEksRUFBTTtBQUNmLGdCQUFJTSxVQUFVLEtBQUtDLGdCQUFMLENBQXNCUCxJQUF0QixDQUFkOztBQUVBLGdCQUFJTSxZQUFZLEVBQWhCLEVBQW9CO0FBQ2hCLG9CQUFJRSxJQUFJLEVBQVI7QUFDQSx1QkFBT0EsTUFBTSxFQUFiLEVBQWlCO0FBQ2Isd0JBQU1DLFlBQVksS0FBS0YsZ0JBQUwsQ0FBc0JQLElBQXRCLEVBQTRCLElBQTVCLENBQWxCO0FBQ0Esd0JBQUlTLGNBQWMsRUFBbEIsRUFBc0JILFVBQVVHLFNBQVY7QUFDdEJELHdCQUFJQyxTQUFKO0FBQ0g7QUFDSjs7QUFFRCxnQkFBSUgsWUFBWUYsU0FBU0osS0FBSyxDQUFMLENBQVQsRUFBa0IsRUFBbEIsQ0FBaEIsRUFBdUM7QUFDbkMsdUJBQU8sSUFBUDtBQUNIOztBQUVELG1CQUFPLEtBQVA7QUFDSDs7Ozs7O0FBR0xxQyxPQUFPdkUsU0FBUCxHQUFtQkEsU0FBbkIiLCJmaWxlIjoiZmFrZV84YzA1NWQ4MS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEtlbm5pdGFsYSB7XHJcbiAgICBjb25zdHJ1Y3RvcihrZW5uaXRhbGEpIHtcclxuICAgICAgICBsZXQga3Q7XHJcbiAgICAgICAgaWYgKChrZW5uaXRhbGEudG9TdHJpbmcoKSB8fCAnJykudG9Mb3dlckNhc2UoKSA9PT0gJ2Zha2UnKSB7XHJcbiAgICAgICAgICAgIGt0ID0gdGhpcy5jcmVhdGVGYWtlS2Vubml0YWxhKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAga3QgPSBrZW5uaXRhbGEgPyBrZW5uaXRhbGEudG9TdHJpbmcoKSA6ICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAga3QgPSBrdC5yZXBsYWNlKC8tL2csICcnKTtcclxuICAgICAgICBpZiAoa3QubGVuZ3RoID09PSA5KSBrdCA9ICcwJyArIGt0O1xyXG4gICAgICAgIGNvbnN0IHZhbGlkYXRlID0gdGhpcy5pc1ZhbGlkKGt0KTtcclxuXHJcbiAgICAgICAgaWYgKHZhbGlkYXRlLnZhbGlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHRoaXMuZ2V0VHlwZShrdCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFnZSA9IHRoaXMuZ2V0QWdlKGt0KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB2YWxpZDogdmFsaWRhdGUudmFsaWQsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXHJcbiAgICAgICAgICAgICAgICBhZ2U6IGFnZS55ZWFycyxcclxuICAgICAgICAgICAgICAgIG1zQWdlOiBhZ2UubXNBZ2UsXHJcbiAgICAgICAgICAgICAgICBiaXJ0aGRheVRvZGF5OiBhZ2UuYmlydGhkYXlUb2RheSxcclxuICAgICAgICAgICAgICAgIGt0OiBrdCxcclxuICAgICAgICAgICAgICAgIGZvcm1hdHRlZEt0OiBrdC5zdWJzdHIoMCwgNikgKyAnLScgKyBrdC5zdWJzdHIoNiwgMTApLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB2YWxpZDogdmFsaWRhdGUudmFsaWQsXHJcbiAgICAgICAgICAgICAgICByZWFzb246IHZhbGlkYXRlLnJlYXNvbixcclxuICAgICAgICAgICAgICAgIGVycm9yQ29kZTogdmFsaWRhdGUuZXJyb3JDb2RlLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByYW5kb21JbnQobWluLCBtYXgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpICsgbWluKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVGYWtlS2Vubml0YWxhKCkge1xyXG4gICAgICAgIC8vIFNob3VsZCBiZSBndGUgMSBhbmQgbHRlIDcyXHJcbiAgICAgICAgLy8gQnV0IGNhbiBub3QgYmUgYmV0d2VlbiAzMSBhbmQgNDFcclxuICAgICAgICBjb25zdCBwZXJzb25fb3JfY29tcGFueSA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSkgPyAncGVyc29uJyA6ICdjb21wYW55JztcclxuXHJcbiAgICAgICAgbGV0IF8xXzIgPVxyXG4gICAgICAgICAgICBwZXJzb25fb3JfY29tcGFueSA9PT0gJ3BlcnNvbicgPyB0aGlzLnJhbmRvbUludCgxLCAzMSkudG9TdHJpbmcoKSA6IHRoaXMucmFuZG9tSW50KDQxLCA3MSkudG9TdHJpbmcoKTtcclxuICAgICAgICBfMV8yID0gXzFfMi5sZW5ndGggPT09IDEgPyAnMCcgKyBfMV8yIDogXzFfMjtcclxuXHJcbiAgICAgICAgbGV0IF8zXzQgPSB0aGlzLnJhbmRvbUludCgxLCAxMikudG9TdHJpbmcoKTtcclxuICAgICAgICBfM180ID0gXzNfNC5sZW5ndGggPT09IDEgPyAnMCcgKyBfM180IDogXzNfNDtcclxuXHJcbiAgICAgICAgbGV0IF81XzYgPSB0aGlzLnJhbmRvbUludCgwLCA5OSkudG9TdHJpbmcoKTtcclxuICAgICAgICBfNV82ID0gXzVfNi5sZW5ndGggPT09IDEgPyAnMCcgKyBfNV82IDogXzVfNjtcclxuXHJcbiAgICAgICAgbGV0IF83XzggPSB0aGlzLnJhbmRvbUludCgwLCA5OSkudG9TdHJpbmcoKTtcclxuICAgICAgICBfN184ID0gXzdfOC5sZW5ndGggPT09IDEgPyAnMCcgKyBfN184IDogXzdfODtcclxuXHJcbiAgICAgICAgbGV0IGxpc3QgPSBfMV8yICsgXzNfNCArIF81XzYgKyBfN184O1xyXG4gICAgICAgIGxpc3QgPSBsaXN0LnNwbGl0KCcnKS5tYXAoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSwgMTApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRSYWR0YWxhID0gcGFyc2VJbnQoXzdfOCwgMTApO1xyXG4gICAgICAgIGxldCB2YXJ0YWxhID0gdGhpcy5jYWxjdWxhdGVWYXJ0YWxhKGxpc3QpO1xyXG5cclxuICAgICAgICBpZiAodmFydGFsYSA9PT0gMTApIHtcclxuICAgICAgICAgICAgbGV0IHYgPSAxMDtcclxuICAgICAgICAgICAgd2hpbGUgKHYgPT09IDEwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjYWxjQWdhaW4gPSB0aGlzLmNhbGN1bGF0ZVZhcnRhbGEobGlzdCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsY0FnYWluICE9PSAxMCkgdmFydGFsYSA9IGNhbGNBZ2FpbjtcclxuICAgICAgICAgICAgICAgIHYgPSBjYWxjQWdhaW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBfOSA9IHZhcnRhbGEudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgbGV0IF8xMCA9IFsnMCcsICc4JywgJzknXVt0aGlzLnJhbmRvbUludCgwLCAyKV07XHJcblxyXG4gICAgICAgIHJldHVybiBfMV8yICsgXzNfNCArIF81XzYgKyBfN184ICsgXzkgKyBfMTA7XHJcbiAgICB9XHJcblxyXG4gICAgZXhpc3RhbmNlSW5ZZWFycyhiaXJ0aGRheSkge1xyXG4gICAgICAgIHZhciB0b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgdmFyIGFnZSA9IHRvZGF5LmdldFVUQ0Z1bGxZZWFyKCkgLSBiaXJ0aGRheS5nZXRVVENGdWxsWWVhcigpO1xyXG4gICAgICAgIHZhciBtID0gdG9kYXkuZ2V0VVRDTW9udGgoKSAtIGJpcnRoZGF5LmdldFVUQ01vbnRoKCk7XHJcbiAgICAgICAgaWYgKG0gPCAwIHx8IChtID09PSAwICYmIHRvZGF5LmdldFVUQ0RhdGUoKSA8IGJpcnRoZGF5LmdldFVUQ0RhdGUoKSkpIHtcclxuICAgICAgICAgICAgYWdlLS07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QWdlKGt0KSB7XHJcbiAgICAgICAgLy8gVGhpcyBmdW5jdGlvbiByZXR1cm5zIHBlcnNvbnMgYWdlIGluIHllYXJzIGFuZCBpbiBtaWxsaXNlY29uZCBhbG9uZyB3aXRoIGEgYm9vbGVhblxyXG4gICAgICAgIC8vIHN0YXRpbmcgaWYgdGhlIGtlbm5pdGFsYSBvd25lciBoYXMgYSBiaXJ0aGRheSB0b2RheVxyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBrdC5zcGxpdCgnJyk7XHJcblxyXG4gICAgICAgIGxldCBjZW50dXJ5O1xyXG5cclxuICAgICAgICBpZiAobGlzdFs5XSA9PT0gJzAnKSB7XHJcbiAgICAgICAgICAgIGNlbnR1cnkgPSAyMDtcclxuICAgICAgICB9IGVsc2UgaWYgKGxpc3RbOV0gPT09ICc5Jykge1xyXG4gICAgICAgICAgICBjZW50dXJ5ID0gMTk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChsaXN0WzldID09PSAnOCcpIHtcclxuICAgICAgICAgICAgY2VudHVyeSA9IDE4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICBjb25zdCBub3dNb250aCA9IG5vdy5nZXRVVENNb250aCgpOyAvL0phdmFzY3JpcHQgbW9udGggKGFjdHVhbCBtb250aCAtIDEpXHJcbiAgICAgICAgY29uc3Qgbm93RGF5ID0gbm93LmdldFVUQ0RhdGUoKTtcclxuXHJcbiAgICAgICAgY29uc3QgbW9udGggPSBwYXJzZUludChsaXN0WzJdICsgbGlzdFszXSwgMTApIC0gMTsgLy9KYXZhc2NyaXB0IG1vbnRoIChhY3R1YWwgbW9udGggLSAxKVxyXG4gICAgICAgIGNvbnN0IGRheSA9IHRoaXMudHlwZSA9PT0gJ3BlcnNvbicgPyBwYXJzZUludChsaXN0WzBdICsgbGlzdFsxXSwgMTApIDogcGFyc2VJbnQobGlzdFswXSAtIDQgKyBsaXN0WzFdLCAxMCk7XHJcbiAgICAgICAgY29uc3QgYmlydGhkYXkgPSBuZXcgRGF0ZShwYXJzZUludChjZW50dXJ5ICsgbGlzdFs0XSArIGxpc3RbNV0sIDEwKSwgbW9udGgsIGRheSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGJpcnRoZGF5VG9kYXkgPSBub3dNb250aCA9PT0gbW9udGggJiYgbm93RGF5ID09PSBkYXkgPyB0cnVlIDogZmFsc2U7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHllYXJzOiB0aGlzLmV4aXN0YW5jZUluWWVhcnMoYmlydGhkYXkpLFxyXG4gICAgICAgICAgICBtc0FnZTogbm93IC0gYmlydGhkYXksXHJcbiAgICAgICAgICAgIGJpcnRoZGF5VG9kYXksXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUeXBlKGt0KSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IGt0LnNwbGl0KCcnKTtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2tpbmcgaWYgZmlyc3QgdHdvIGRpZ2l0cyBhcmUgYmV0d2VlbiA0MSBhbmQgNzFcclxuICAgICAgICAvLyBpZiBzbyB0aGVuIHRoaXMga2Vubml0YWxhIGlzIGEgY29tcG5heSBrZW5uaXRhbGFcclxuICAgICAgICBjb25zdCBkZCA9IHBhcnNlSW50KGxpc3RbMF0gKyBsaXN0WzFdLCAxMCk7XHJcbiAgICAgICAgaWYgKGRkID4gNDAgJiYgZGQgPCA3MikgcmV0dXJuICdjb21wYW55JztcclxuXHJcbiAgICAgICAgcmV0dXJuICdwZXJzb24nO1xyXG4gICAgfVxyXG5cclxuICAgIGlzVmFsaWQoa3QpIHtcclxuICAgICAgICAvKiBOb3RlIHRoYXQga3QgaXMgYSBzdHJpbmcgKi9cclxuICAgICAgICBpZiAoa3QubGVuZ3RoICE9PSAxMCkgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCByZWFzb246ICdLZW5uaXRhbGEgaXMgdG9vIHNob3J0JywgZXJyb3JDb2RlOiAxIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBrdC5zcGxpdCgnJyk7XHJcblxyXG4gICAgICAgIC8vIFZhbGlkYXRpbmcgZGlnaXRzIDEgYW5kIDJcclxuICAgICAgICAvLyBTaG91bGQgYmUgZ3RlIDEgYW5kIGx0ZSA3MlxyXG4gICAgICAgIC8vIEJ1dCBjYW4gbm90IGJlIGJldHdlZW4gMzEgYW5kIDQxXHJcbiAgICAgICAgY29uc3QgZGQgPSBwYXJzZUludChsaXN0WzBdICsgbGlzdFsxXSwgMTApO1xyXG4gICAgICAgIGlmICghKGRkID4gMCAmJiBkZCA8IDcyKSB8fCAoZGQgPiAzMSAmJiBkZCA8IDQxKSlcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHZhbGlkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogJ0JpcnRoZGF0ZSBpcyBvdXQgb2YgcmFuZ2UgKGRpZ2l0cyAxIGFuZCAyKScsXHJcbiAgICAgICAgICAgICAgICBlcnJvckNvZGU6IDIsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIFZhbGlkYXRpbmcgZGlnaXRzIDMgYW5kIDRcclxuICAgICAgICAvLyBNdXN0IGJlIGd0IDAgbHQgMTNcclxuICAgICAgICBjb25zdCBtbSA9IHBhcnNlSW50KGxpc3RbMl0gKyBsaXN0WzNdLCAxMCk7XHJcbiAgICAgICAgaWYgKCEobW0gPiAwICYmIG1tIDwgMTMpKVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdmFsaWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcmVhc29uOiAnTW9udGggZGlnaXRzIGFyZSBvdXQgb2YgcmFuZ2UgKGRpZ2l0cyAzIGFuZCA0KScsXHJcbiAgICAgICAgICAgICAgICBlcnJvckNvZGU6IDMsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vRGlnaXRzIDUsNih5ZWFycyByYW5nZSBmcm9tIDAtOTkpLCA3IGFuZCA4IGNhbiBiZSBhbnl0aGluZyBzbyB3ZSBjYW50IHZhbGlkYXRlIHRoZW1cclxuXHJcbiAgICAgICAgLy8gV2UgYXJlIHN0b3JpbmcgdGhpcyBpbiBhIHZhcmlhYmxlIGJlY2F1c2Ugd2UgbmVlZCB0byBpbmNyZWVtZW50IHRoaXNcclxuICAgICAgICAvLyBpZiB0aGUgY2FsY3VsYXRlZCBcInZhcnRhbGFcIiBpcyAxMCBhbmQgdGhlbiByZWNhbGN1bGF0ZSB3aXRoIHRoZSBpbmNyZW1lbnRlZCB2YWx1ZVxyXG4gICAgICAgIHRoaXMuY3VycmVudFJhZHRhbGEgPSBwYXJzZUludChsaXN0WzZdICsgbGlzdFs3XSwgMTApO1xyXG5cclxuICAgICAgICAvLyBUdXJuaW5nIGxpc3Qgb2YgbnVtYmVycyB0byBpbnQgKGZyb20gc3RyaW5nKVxyXG4gICAgICAgIC8vIHNpbmNlIHdlIHdpbGwgYmUgd29ya2luZyB3aXRoIGludHMgZnJvbSBub3cgb25cclxuICAgICAgICBsaXN0Lm1hcCgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHZhbHVlLCAxMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vVmFsaWRhdGluZyBkaWdpdCA5XHJcbiAgICAgICAgaWYgKHRoaXMudmFsaWRhdGVOaW5lKGxpc3QpID09PSBmYWxzZSlcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHZhbGlkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHJlYXNvbjpcclxuICAgICAgICAgICAgICAgICAgICAnRGlnaXQgOSBpcyBub3QgdmFsaWQuIFJlYWQgYWJvdXQgXCJOw611bmRpIHN0YWZ1cmlublwiIGhlcmU6IGh0dHBzOi8vaXMud2lraXBlZGlhLm9yZy93aWtpL0tlbm5pdGFsYScsXHJcbiAgICAgICAgICAgICAgICBlcnJvckNvZGU6IDQsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vVmFsaWRhdGluZyBkaWdpdCAxMFxyXG4gICAgICAgIGNvbnN0IGxhc3REaWdpdCA9IHBhcnNlSW50KGxpc3RbOV0sIDEwKTtcclxuICAgICAgICBpZiAoIShsYXN0RGlnaXQgPT09IDAgfHwgbGFzdERpZ2l0ID09PSA4IHx8IGxhc3REaWdpdCA9PT0gOSkpXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB2YWxpZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICByZWFzb246ICdDZW50dXJ5IGRpZ2l0IG91dCBvZiByYW5nZSAoZGlnaXQgMTApJyxcclxuICAgICAgICAgICAgICAgIGVycm9yQ29kZTogNSxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHsgdmFsaWQ6IHRydWUgfTtcclxuICAgIH1cclxuXHJcbiAgICBjYWxjdWxhdGVWYXJ0YWxhKGxpc3QsIGluY3JlbWVudFJhZHRhbGEpIHtcclxuICAgICAgICAvLyBWYXJ0YWxhIGlzIGRpZ2l0IG51bWJlciA5XHJcbiAgICAgICAgLy8gVGhpcyB1cmwgZXhwbGFpbnMgaG93IGl0cyBjYWxjdWxhdGVkOiBodHRwczovL2lzLndpa2lwZWRpYS5vcmcvd2lraS9LZW5uaXRhbGEnXHJcblxyXG4gICAgICAgIGlmIChpbmNyZW1lbnRSYWR0YWxhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFJhZHRhbGErKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJhZHRhbGEgPSAoJzAnICsgdGhpcy5jdXJyZW50UmFkdGFsYS50b1N0cmluZygpKS5zbGljZSgtMikuc3BsaXQoJycpO1xyXG5cclxuICAgICAgICBjb25zdCByYWR0YWxhT25lID0gcGFyc2VJbnQocmFkdGFsYVswXSwgMTApO1xyXG4gICAgICAgIGNvbnN0IHJhZHRhbGFUd28gPSBwYXJzZUludChyYWR0YWxhWzFdLCAxMCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHN1bSA9XHJcbiAgICAgICAgICAgIGxpc3RbMF0gKiAzICtcclxuICAgICAgICAgICAgbGlzdFsxXSAqIDIgK1xyXG4gICAgICAgICAgICBsaXN0WzJdICogNyArXHJcbiAgICAgICAgICAgIGxpc3RbM10gKiA2ICtcclxuICAgICAgICAgICAgbGlzdFs0XSAqIDUgK1xyXG4gICAgICAgICAgICBsaXN0WzVdICogNCArXHJcbiAgICAgICAgICAgIHJhZHRhbGFPbmUgKiAzICtcclxuICAgICAgICAgICAgcmFkdGFsYVR3byAqIDI7XHJcblxyXG4gICAgICAgIGxldCBtb2QgPSBzdW0gJSAxMTtcclxuXHJcbiAgICAgICAgY29uc3QgdmFydGFsYSA9IG1vZCA9PT0gMCA/IDAgOiAxMSAtIG1vZDtcclxuICAgICAgICByZXR1cm4gdmFydGFsYTtcclxuICAgIH1cclxuXHJcbiAgICB2YWxpZGF0ZU5pbmUobGlzdCkge1xyXG4gICAgICAgIGxldCB2YXJ0YWxhID0gdGhpcy5jYWxjdWxhdGVWYXJ0YWxhKGxpc3QpO1xyXG5cclxuICAgICAgICBpZiAodmFydGFsYSA9PT0gMTApIHtcclxuICAgICAgICAgICAgbGV0IHYgPSAxMDtcclxuICAgICAgICAgICAgd2hpbGUgKHYgPT09IDEwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjYWxjQWdhaW4gPSB0aGlzLmNhbGN1bGF0ZVZhcnRhbGEobGlzdCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsY0FnYWluICE9PSAxMCkgdmFydGFsYSA9IGNhbGNBZ2FpbjtcclxuICAgICAgICAgICAgICAgIHYgPSBjYWxjQWdhaW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YXJ0YWxhID09PSBwYXJzZUludChsaXN0WzhdLCAxMCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmdsb2JhbC5LZW5uaXRhbGEgPSBLZW5uaXRhbGE7XHJcbiJdfQ==
}).call(this,require("U9cQDF"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_8c055d81.js","/")
},{"U9cQDF":3,"buffer":4}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

	var PLUS = '+'.charCodeAt(0);
	var SLASH = '/'.charCodeAt(0);
	var NUMBER = '0'.charCodeAt(0);
	var LOWER = 'a'.charCodeAt(0);
	var UPPER = 'A'.charCodeAt(0);
	var PLUS_URL_SAFE = '-'.charCodeAt(0);
	var SLASH_URL_SAFE = '_'.charCodeAt(0);

	function decode(elt) {
		var code = elt.charCodeAt(0);
		if (code === PLUS || code === PLUS_URL_SAFE) return 62; // '+'
		if (code === SLASH || code === SLASH_URL_SAFE) return 63; // '/'
		if (code < NUMBER) return -1; //no match
		if (code < NUMBER + 10) return code - NUMBER + 26 + 26;
		if (code < UPPER + 26) return code - UPPER;
		if (code < LOWER + 26) return code - LOWER + 26;
	}

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4');
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length;
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		var L = 0;

		function push(v) {
			arr[L++] = v;
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = decode(b64.charAt(i)) << 18 | decode(b64.charAt(i + 1)) << 12 | decode(b64.charAt(i + 2)) << 6 | decode(b64.charAt(i + 3));
			push((tmp & 0xFF0000) >> 16);
			push((tmp & 0xFF00) >> 8);
			push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = decode(b64.charAt(i)) << 2 | decode(b64.charAt(i + 1)) >> 4;
			push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = decode(b64.charAt(i)) << 10 | decode(b64.charAt(i + 1)) << 4 | decode(b64.charAt(i + 2)) >> 2;
			push(tmp >> 8 & 0xFF);
			push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
		    extraBytes = uint8.length % 3,
		    // if we have 1 byte left, pad 2 bytes
		output = "",
		    temp,
		    length;

		function encode(num) {
			return lookup.charAt(num);
		}

		function tripletToBase64(num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F);
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += encode(temp >> 2);
				output += encode(temp << 4 & 0x3F);
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + uint8[uint8.length - 1];
				output += encode(temp >> 10);
				output += encode(temp >> 4 & 0x3F);
				output += encode(temp << 2 & 0x3F);
				output += '=';
				break;
		}

		return output;
	}

	exports.toByteArray = b64ToByteArray;
	exports.fromByteArray = uint8ToBase64;
})(typeof exports === 'undefined' ? undefined.base64js = {} : exports);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImI2NC5qcyJdLCJuYW1lcyI6WyJsb29rdXAiLCJleHBvcnRzIiwiQXJyIiwiVWludDhBcnJheSIsIkFycmF5IiwiUExVUyIsImNoYXJDb2RlQXQiLCJTTEFTSCIsIk5VTUJFUiIsIkxPV0VSIiwiVVBQRVIiLCJQTFVTX1VSTF9TQUZFIiwiU0xBU0hfVVJMX1NBRkUiLCJkZWNvZGUiLCJlbHQiLCJjb2RlIiwiYjY0VG9CeXRlQXJyYXkiLCJiNjQiLCJpIiwiaiIsImwiLCJ0bXAiLCJwbGFjZUhvbGRlcnMiLCJhcnIiLCJsZW5ndGgiLCJFcnJvciIsImxlbiIsImNoYXJBdCIsIkwiLCJwdXNoIiwidiIsInVpbnQ4VG9CYXNlNjQiLCJ1aW50OCIsImV4dHJhQnl0ZXMiLCJvdXRwdXQiLCJ0ZW1wIiwiZW5jb2RlIiwibnVtIiwidHJpcGxldFRvQmFzZTY0IiwidG9CeXRlQXJyYXkiLCJmcm9tQnl0ZUFycmF5IiwiYmFzZTY0anMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsU0FBUyxrRUFBYjs7QUFFQSxDQUFFLFdBQVVDLE9BQVYsRUFBbUI7QUFDcEI7O0FBRUMsS0FBSUMsTUFBTyxPQUFPQyxVQUFQLEtBQXNCLFdBQXZCLEdBQ05BLFVBRE0sR0FFTkMsS0FGSjs7QUFJRCxLQUFJQyxPQUFTLElBQUlDLFVBQUosQ0FBZSxDQUFmLENBQWI7QUFDQSxLQUFJQyxRQUFTLElBQUlELFVBQUosQ0FBZSxDQUFmLENBQWI7QUFDQSxLQUFJRSxTQUFTLElBQUlGLFVBQUosQ0FBZSxDQUFmLENBQWI7QUFDQSxLQUFJRyxRQUFTLElBQUlILFVBQUosQ0FBZSxDQUFmLENBQWI7QUFDQSxLQUFJSSxRQUFTLElBQUlKLFVBQUosQ0FBZSxDQUFmLENBQWI7QUFDQSxLQUFJSyxnQkFBZ0IsSUFBSUwsVUFBSixDQUFlLENBQWYsQ0FBcEI7QUFDQSxLQUFJTSxpQkFBaUIsSUFBSU4sVUFBSixDQUFlLENBQWYsQ0FBckI7O0FBRUEsVUFBU08sTUFBVCxDQUFpQkMsR0FBakIsRUFB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QUFQO0FBQ0FVLGNBQVVFLE9BQU9ELFFBQVEsQ0FBZixDQUFWO0FBQ0FELGNBQVVFLE9BQVFELFFBQVEsQ0FBVCxHQUFjLElBQXJCLENBQVY7QUFDQUQsY0FBVSxJQUFWO0FBQ0E7QUFDRCxRQUFLLENBQUw7QUFDQ0MsV0FBTyxDQUFDSCxNQUFNQSxNQUFNUixNQUFOLEdBQWUsQ0FBckIsS0FBMkIsQ0FBNUIsSUFBa0NRLE1BQU1BLE1BQU1SLE1BQU4sR0FBZSxDQUFyQixDQUF6QztBQUNBVSxjQUFVRSxPQUFPRCxRQUFRLEVBQWYsQ0FBVjtBQUNBRCxjQUFVRSxPQUFRRCxRQUFRLENBQVQsR0FBYyxJQUFyQixDQUFWO0FBQ0FELGNBQVVFLE9BQVFELFFBQVEsQ0FBVCxHQUFjLElBQXJCLENBQVY7QUFDQUQsY0FBVSxHQUFWO0FBQ0E7QUFiRjs7QUFnQkEsU0FBT0EsTUFBUDtBQUNBOztBQUVEakMsU0FBUXNDLFdBQVIsR0FBc0J2QixjQUF0QjtBQUNBZixTQUFRdUMsYUFBUixHQUF3QlQsYUFBeEI7QUFDQSxDQXpIQyxFQXlIQSxPQUFPOUIsT0FBUCxLQUFtQixXQUFuQixHQUFrQyxVQUFLd0MsUUFBTCxHQUFnQixFQUFsRCxHQUF3RHhDLE9Bekh4RCxDQUFEIiwiZmlsZSI6ImI2NC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTX1VSTF9TQUZFID0gJy0nLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIX1VSTF9TQUZFID0gJ18nLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUyB8fFxuXHRcdCAgICBjb2RlID09PSBQTFVTX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSCB8fFxuXHRcdCAgICBjb2RlID09PSBTTEFTSF9VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuIl19
}).call(this,require("U9cQDF"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\..\\Óli Tómas\\jobs\\kennitalajs\\node_modules\\base64-js\\lib\\b64.js","/..\\..\\..\\..\\Óli Tómas\\jobs\\kennitalajs\\node_modules\\base64-js\\lib")
},{"U9cQDF":3,"buffer":4}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

// shim for using process in browser

var process = module.exports = {};

process.nextTick = function () {
    var canSetImmediate = typeof window !== 'undefined' && window.setImmediate;
    var canPost = typeof window !== 'undefined' && window.postMessage && window.addEventListener;

    if (canSetImmediate) {
        return function (f) {
            return window.setImmediate(f);
        };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
}();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJyb3dzZXIuanMiXSwibmFtZXMiOlsicHJvY2VzcyIsIm1vZHVsZSIsImV4cG9ydHMiLCJuZXh0VGljayIsImNhblNldEltbWVkaWF0ZSIsIndpbmRvdyIsInNldEltbWVkaWF0ZSIsImNhblBvc3QiLCJwb3N0TWVzc2FnZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJmIiwicXVldWUiLCJldiIsInNvdXJjZSIsImRhdGEiLCJzdG9wUHJvcGFnYXRpb24iLCJsZW5ndGgiLCJmbiIsInNoaWZ0IiwicHVzaCIsInNldFRpbWVvdXQiLCJ0aXRsZSIsImJyb3dzZXIiLCJlbnYiLCJhcmd2Iiwibm9vcCIsIm9uIiwiYWRkTGlzdGVuZXIiLCJvbmNlIiwib2ZmIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJlbWl0IiwiYmluZGluZyIsIm5hbWUiLCJFcnJvciIsImN3ZCIsImNoZGlyIiwiZGlyIl0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUVBLElBQUlBLFVBQVVDLE9BQU9DLE9BQVAsR0FBaUIsRUFBL0I7O0FBRUFGLFFBQVFHLFFBQVIsR0FBb0IsWUFBWTtBQUM1QixRQUFJQyxrQkFBa0IsT0FBT0MsTUFBUCxLQUFrQixXQUFsQixJQUNuQkEsT0FBT0MsWUFEVjtBQUVBLFFBQUlDLFVBQVUsT0FBT0YsTUFBUCxLQUFrQixXQUFsQixJQUNYQSxPQUFPRyxXQURJLElBQ1dILE9BQU9JLGdCQURoQzs7QUFJQSxRQUFJTCxlQUFKLEVBQXFCO0FBQ2pCLGVBQU8sVUFBVU0sQ0FBVixFQUFhO0FBQUUsbUJBQU9MLE9BQU9DLFlBQVAsQ0FBb0JJLENBQXBCLENBQVA7QUFBK0IsU0FBckQ7QUFDSDs7QUFFRCxRQUFJSCxPQUFKLEVBQWE7QUFDVCxZQUFJSSxRQUFRLEVBQVo7QUFDQU4sZUFBT0ksZ0JBQVAsQ0FBd0IsU0FBeEIsRUFBbUMsVUFBVUcsRUFBVixFQUFjO0FBQzdDLGdCQUFJQyxTQUFTRCxHQUFHQyxNQUFoQjtBQUNBLGdCQUFJLENBQUNBLFdBQVdSLE1BQVgsSUFBcUJRLFdBQVcsSUFBakMsS0FBMENELEdBQUdFLElBQUgsS0FBWSxjQUExRCxFQUEwRTtBQUN0RUYsbUJBQUdHLGVBQUg7QUFDQSxvQkFBSUosTUFBTUssTUFBTixHQUFlLENBQW5CLEVBQXNCO0FBQ2xCLHdCQUFJQyxLQUFLTixNQUFNTyxLQUFOLEVBQVQ7QUFDQUQ7QUFDSDtBQUNKO0FBQ0osU0FURCxFQVNHLElBVEg7O0FBV0EsZUFBTyxTQUFTZCxRQUFULENBQWtCYyxFQUFsQixFQUFzQjtBQUN6Qk4sa0JBQU1RLElBQU4sQ0FBV0YsRUFBWDtBQUNBWixtQkFBT0csV0FBUCxDQUFtQixjQUFuQixFQUFtQyxHQUFuQztBQUNILFNBSEQ7QUFJSDs7QUFFRCxXQUFPLFNBQVNMLFFBQVQsQ0FBa0JjLEVBQWxCLEVBQXNCO0FBQ3pCRyxtQkFBV0gsRUFBWCxFQUFlLENBQWY7QUFDSCxLQUZEO0FBR0gsQ0FqQ2tCLEVBQW5COztBQW1DQWpCLFFBQVFxQixLQUFSLEdBQWdCLFNBQWhCO0FBQ0FyQixRQUFRc0IsT0FBUixHQUFrQixJQUFsQjtBQUNBdEIsUUFBUXVCLEdBQVIsR0FBYyxFQUFkO0FBQ0F2QixRQUFRd0IsSUFBUixHQUFlLEVBQWY7O0FBRUEsU0FBU0MsSUFBVCxHQUFnQixDQUFFOztBQUVsQnpCLFFBQVEwQixFQUFSLEdBQWFELElBQWI7QUFDQXpCLFFBQVEyQixXQUFSLEdBQXNCRixJQUF0QjtBQUNBekIsUUFBUTRCLElBQVIsR0FBZUgsSUFBZjtBQUNBekIsUUFBUTZCLEdBQVIsR0FBY0osSUFBZDtBQUNBekIsUUFBUThCLGNBQVIsR0FBeUJMLElBQXpCO0FBQ0F6QixRQUFRK0Isa0JBQVIsR0FBNkJOLElBQTdCO0FBQ0F6QixRQUFRZ0MsSUFBUixHQUFlUCxJQUFmOztBQUVBekIsUUFBUWlDLE9BQVIsR0FBa0IsVUFBVUMsSUFBVixFQUFnQjtBQUM5QixVQUFNLElBQUlDLEtBQUosQ0FBVSxrQ0FBVixDQUFOO0FBQ0gsQ0FGRDs7QUFJQTtBQUNBbkMsUUFBUW9DLEdBQVIsR0FBYyxZQUFZO0FBQUUsV0FBTyxHQUFQO0FBQVksQ0FBeEM7QUFDQXBDLFFBQVFxQyxLQUFSLEdBQWdCLFVBQVVDLEdBQVYsRUFBZTtBQUMzQixVQUFNLElBQUlILEtBQUosQ0FBVSxnQ0FBVixDQUFOO0FBQ0gsQ0FGRCIsImZpbGUiOiJicm93c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iXX0=
}).call(this,require("U9cQDF"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\..\\Óli Tómas\\jobs\\kennitalajs\\node_modules\\browserify\\node_modules\\process\\browser.js","/..\\..\\..\\..\\Óli Tómas\\jobs\\kennitalajs\\node_modules\\browserify\\node_modules\\process")
},{"U9cQDF":3,"buffer":4}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js');
var ieee754 = require('ieee754');

exports.Buffer = Buffer;
exports.SlowBuffer = Buffer;
exports.INSPECT_MAX_BYTES = 50;
Buffer.poolSize = 8192;

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0);
    var arr = new Uint8Array(buf);
    arr.foo = function () {
      return 42;
    };
    return 42 === arr.foo() && typeof arr.subarray === 'function'; // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false;
  }
}();

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer(subject, encoding, noZero) {
  if (!(this instanceof Buffer)) return new Buffer(subject, encoding, noZero);

  var type = typeof subject === 'undefined' ? 'undefined' : _typeof(subject);

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject);
    while (subject.length % 4 !== 0) {
      subject = subject + '=';
    }
  }

  // Find the length
  var length;
  if (type === 'number') length = coerce(subject);else if (type === 'string') length = Buffer.byteLength(subject, encoding);else if (type === 'object') length = coerce(subject.length); // assume that object is array-like
  else throw new Error('First argument needs to be a number, array or string.');

  var buf;
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length));
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this;
    buf.length = length;
    buf._isBuffer = true;
  }

  var i;
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject);
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject)) buf[i] = subject.readUInt8(i);else buf[i] = subject[i];
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding);
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0;
    }
  }

  return buf;
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true;
    default:
      return false;
  }
};

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer);
};

Buffer.byteLength = function (str, encoding) {
  var ret;
  str = str + '';
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2;
      break;
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length;
      break;
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length;
      break;
    case 'base64':
      ret = base64ToBytes(str).length;
      break;
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2;
      break;
    default:
      throw new Error('Unknown encoding');
  }
  return ret;
};

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' + 'list should be an Array.');

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  var i;
  if (typeof totalLength !== 'number') {
    totalLength = 0;
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length;
    }
  }

  var buf = new Buffer(totalLength);
  var pos = 0;
  for (i = 0; i < list.length; i++) {
    var item = list[i];
    item.copy(buf, pos);
    pos += item.length;
  }
  return buf;
};

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  assert(strLen % 2 === 0, 'Invalid hex string');

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16);
    assert(!isNaN(byte), 'Invalid hex string');
    buf[offset + i] = byte;
  }
  Buffer._charsWritten = i * 2;
  return i;
}

function _utf8Write(buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length);
  return charsWritten;
}

function _asciiWrite(buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length);
  return charsWritten;
}

function _binaryWrite(buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length);
}

function _base64Write(buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length);
  return charsWritten;
}

function _utf16leWrite(buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten = blitBuffer(utf16leToBytes(string), buf, offset, length);
  return charsWritten;
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {
    // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = Number(offset) || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  var ret;
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length);
      break;
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length);
      break;
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length);
      break;
    case 'binary':
      ret = _binaryWrite(this, string, offset, length);
      break;
    case 'base64':
      ret = _base64Write(this, string, offset, length);
      break;
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length);
      break;
    default:
      throw new Error('Unknown encoding');
  }
  return ret;
};

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this;

  encoding = String(encoding || 'utf8').toLowerCase();
  start = Number(start) || 0;
  end = end !== undefined ? Number(end) : end = self.length;

  // Fastpath empty strings
  if (end === start) return '';

  var ret;
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end);
      break;
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end);
      break;
    case 'ascii':
      ret = _asciiSlice(self, start, end);
      break;
    case 'binary':
      ret = _binarySlice(self, start, end);
      break;
    case 'base64':
      ret = _base64Slice(self, start, end);
      break;
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end);
      break;
    default:
      throw new Error('Unknown encoding');
  }
  return ret;
};

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this;

  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (!target_start) target_start = 0;

  // Copy 0 bytes; we're done
  if (end === start) return;
  if (target.length === 0 || source.length === 0) return;

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart');
  assert(target_start >= 0 && target_start < target.length, 'targetStart out of bounds');
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds');
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds');

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - target_start < end - start) end = target.length - target_start + start;

  var len = end - start;

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++) {
      target[i + target_start] = this[i + start];
    }
  } else {
    target._set(this.subarray(start, start + len), target_start);
  }
};

function _base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf);
  } else {
    return base64.fromByteArray(buf.slice(start, end));
  }
}

function _utf8Slice(buf, start, end) {
  var res = '';
  var tmp = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i]);
      tmp = '';
    } else {
      tmp += '%' + buf[i].toString(16);
    }
  }

  return res + decodeUtf8Char(tmp);
}

function _asciiSlice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i]);
  }return ret;
}

function _binarySlice(buf, start, end) {
  return _asciiSlice(buf, start, end);
}

function _hexSlice(buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; i++) {
    out += toHex(buf[i]);
  }
  return out;
}

function _utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length;
  start = clamp(start, len, 0);
  end = clamp(end, len, len);

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end));
  } else {
    var sliceLen = end - start;
    var newBuf = new Buffer(sliceLen, undefined, true);
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start];
    }
    return newBuf;
  }
};

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.');
  return this.readUInt8(offset);
};

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.');
  return this.writeUInt8(v, offset);
};

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset < this.length, 'Trying to read beyond buffer length');
  }

  if (offset >= this.length) return;

  return this[offset];
};

function _readUInt16(buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length');
  }

  var len = buf.length;
  if (offset >= len) return;

  var val;
  if (littleEndian) {
    val = buf[offset];
    if (offset + 1 < len) val |= buf[offset + 1] << 8;
  } else {
    val = buf[offset] << 8;
    if (offset + 1 < len) val |= buf[offset + 1];
  }
  return val;
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert);
};

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert);
};

function _readUInt32(buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length');
  }

  var len = buf.length;
  if (offset >= len) return;

  var val;
  if (littleEndian) {
    if (offset + 2 < len) val = buf[offset + 2] << 16;
    if (offset + 1 < len) val |= buf[offset + 1] << 8;
    val |= buf[offset];
    if (offset + 3 < len) val = val + (buf[offset + 3] << 24 >>> 0);
  } else {
    if (offset + 1 < len) val = buf[offset + 1] << 16;
    if (offset + 2 < len) val |= buf[offset + 2] << 8;
    if (offset + 3 < len) val |= buf[offset + 3];
    val = val + (buf[offset] << 24 >>> 0);
  }
  return val;
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert);
};

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert);
};

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset < this.length, 'Trying to read beyond buffer length');
  }

  if (offset >= this.length) return;

  var neg = this[offset] & 0x80;
  if (neg) return (0xff - this[offset] + 1) * -1;else return this[offset];
};

function _readInt16(buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length');
  }

  var len = buf.length;
  if (offset >= len) return;

  var val = _readUInt16(buf, offset, littleEndian, true);
  var neg = val & 0x8000;
  if (neg) return (0xffff - val + 1) * -1;else return val;
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert);
};

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert);
};

function _readInt32(buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length');
  }

  var len = buf.length;
  if (offset >= len) return;

  var val = _readUInt32(buf, offset, littleEndian, true);
  var neg = val & 0x80000000;
  if (neg) return (0xffffffff - val + 1) * -1;else return val;
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert);
};

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert);
};

function _readFloat(buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length');
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4);
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert);
};

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert);
};

function _readDouble(buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length');
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8);
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert);
};

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert);
};

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset < this.length, 'trying to write beyond buffer length');
    verifuint(value, 0xff);
  }

  if (offset >= this.length) return;

  this[offset] = value;
};

function _writeUInt16(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value');
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length');
    verifuint(value, 0xffff);
  }

  var len = buf.length;
  if (offset >= len) return;

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert);
};

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert);
};

function _writeUInt32(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value');
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length');
    verifuint(value, 0xffffffff);
  }

  var len = buf.length;
  if (offset >= len) return;

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert);
};

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset < this.length, 'Trying to write beyond buffer length');
    verifsint(value, 0x7f, -0x80);
  }

  if (offset >= this.length) return;

  if (value >= 0) this.writeUInt8(value, offset, noAssert);else this.writeUInt8(0xff + value + 1, offset, noAssert);
};

function _writeInt16(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value');
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length');
    verifsint(value, 0x7fff, -0x8000);
  }

  var len = buf.length;
  if (offset >= len) return;

  if (value >= 0) _writeUInt16(buf, value, offset, littleEndian, noAssert);else _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert);
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert);
};

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert);
};

function _writeInt32(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value');
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length');
    verifsint(value, 0x7fffffff, -0x80000000);
  }

  var len = buf.length;
  if (offset >= len) return;

  if (value >= 0) _writeUInt32(buf, value, offset, littleEndian, noAssert);else _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert);
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert);
};

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert);
};

function _writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value');
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length');
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  var len = buf.length;
  if (offset >= len) return;

  ieee754.write(buf, value, offset, littleEndian, 23, 4);
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert);
};

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert);
};

function _writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value');
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 7 < buf.length, 'Trying to write beyond buffer length');
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  var len = buf.length;
  if (offset >= len) return;

  ieee754.write(buf, value, offset, littleEndian, 52, 8);
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert);
};

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert);
};

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0;
  if (!start) start = 0;
  if (!end) end = this.length;

  if (typeof value === 'string') {
    value = value.charCodeAt(0);
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number');
  assert(end >= start, 'end < start');

  // Fill 0 bytes; we're done
  if (end === start) return;
  if (this.length === 0) return;

  assert(start >= 0 && start < this.length, 'start out of bounds');
  assert(end >= 0 && end <= this.length, 'end out of bounds');

  for (var i = start; i < end; i++) {
    this[i] = value;
  }
};

Buffer.prototype.inspect = function () {
  var out = [];
  var len = this.length;
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i]);
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }
  return '<Buffer ' + out.join(' ') + '>';
};

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return new Buffer(this).buffer;
    } else {
      var buf = new Uint8Array(this.length);
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i];
      }return buf.buffer;
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser');
  }
};

// HELPER FUNCTIONS
// ================

function stringtrim(str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
}

var BP = Buffer.prototype;

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true;

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get;
  arr._set = arr.set;

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get;
  arr.set = BP.set;

  arr.write = BP.write;
  arr.toString = BP.toString;
  arr.toLocaleString = BP.toString;
  arr.toJSON = BP.toJSON;
  arr.copy = BP.copy;
  arr.slice = BP.slice;
  arr.readUInt8 = BP.readUInt8;
  arr.readUInt16LE = BP.readUInt16LE;
  arr.readUInt16BE = BP.readUInt16BE;
  arr.readUInt32LE = BP.readUInt32LE;
  arr.readUInt32BE = BP.readUInt32BE;
  arr.readInt8 = BP.readInt8;
  arr.readInt16LE = BP.readInt16LE;
  arr.readInt16BE = BP.readInt16BE;
  arr.readInt32LE = BP.readInt32LE;
  arr.readInt32BE = BP.readInt32BE;
  arr.readFloatLE = BP.readFloatLE;
  arr.readFloatBE = BP.readFloatBE;
  arr.readDoubleLE = BP.readDoubleLE;
  arr.readDoubleBE = BP.readDoubleBE;
  arr.writeUInt8 = BP.writeUInt8;
  arr.writeUInt16LE = BP.writeUInt16LE;
  arr.writeUInt16BE = BP.writeUInt16BE;
  arr.writeUInt32LE = BP.writeUInt32LE;
  arr.writeUInt32BE = BP.writeUInt32BE;
  arr.writeInt8 = BP.writeInt8;
  arr.writeInt16LE = BP.writeInt16LE;
  arr.writeInt16BE = BP.writeInt16BE;
  arr.writeInt32LE = BP.writeInt32LE;
  arr.writeInt32BE = BP.writeInt32BE;
  arr.writeFloatLE = BP.writeFloatLE;
  arr.writeFloatBE = BP.writeFloatBE;
  arr.writeDoubleLE = BP.writeDoubleLE;
  arr.writeDoubleBE = BP.writeDoubleBE;
  arr.fill = BP.fill;
  arr.inspect = BP.inspect;
  arr.toArrayBuffer = BP.toArrayBuffer;

  return arr;
};

// slice(start, end)
function clamp(index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue;
  index = ~~index; // Coerce to integer.
  if (index >= len) return len;
  if (index >= 0) return index;
  index += len;
  if (index >= 0) return index;
  return 0;
}

function coerce(length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length);
  return length < 0 ? 0 : length;
}

function isArray(subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]';
  })(subject);
}

function isArrayish(subject) {
  return isArray(subject) || Buffer.isBuffer(subject) || subject && (typeof subject === 'undefined' ? 'undefined' : _typeof(subject)) === 'object' && typeof subject.length === 'number';
}

function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i);
    if (b <= 0x7F) byteArray.push(str.charCodeAt(i));else {
      var start = i;
      if (b >= 0xD800 && b <= 0xDFFF) i++;
      var h = encodeURIComponent(str.slice(start, i + 1)).substr(1).split('%');
      for (var j = 0; j < h.length; j++) {
        byteArray.push(parseInt(h[j], 16));
      }
    }
  }
  return byteArray;
}

function asciiToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray;
}

function utf16leToBytes(str) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray;
}

function base64ToBytes(str) {
  return base64.toByteArray(str);
}

function blitBuffer(src, dst, offset, length) {
  var pos;
  for (var i = 0; i < length; i++) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }
  return i;
}

function decodeUtf8Char(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint(value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number');
  assert(value >= 0, 'specified a negative value for writing an unsigned value');
  assert(value <= max, 'value is larger than maximum value for type');
  assert(Math.floor(value) === value, 'value has a fractional component');
}

function verifsint(value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number');
  assert(value <= max, 'value larger than maximum allowed value');
  assert(value >= min, 'value smaller than minimum allowed value');
  assert(Math.floor(value) === value, 'value has a fractional component');
}

function verifIEEE754(value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number');
  assert(value <= max, 'value larger than maximum allowed value');
  assert(value >= min, 'value smaller than minimum allowed value');
}

function assert(test, message) {
  if (!test) throw new Error(message || 'Failed assertion');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImJhc2U2NCIsInJlcXVpcmUiLCJpZWVlNzU0IiwiZXhwb3J0cyIsIkJ1ZmZlciIsIlNsb3dCdWZmZXIiLCJJTlNQRUNUX01BWF9CWVRFUyIsInBvb2xTaXplIiwiX3VzZVR5cGVkQXJyYXlzIiwiYnVmIiwiQXJyYXlCdWZmZXIiLCJhcnIiLCJVaW50OEFycmF5IiwiZm9vIiwic3ViYXJyYXkiLCJlIiwic3ViamVjdCIsImVuY29kaW5nIiwibm9aZXJvIiwidHlwZSIsInN0cmluZ3RyaW0iLCJsZW5ndGgiLCJjb2VyY2UiLCJieXRlTGVuZ3RoIiwiRXJyb3IiLCJfYXVnbWVudCIsIl9pc0J1ZmZlciIsImkiLCJfc2V0IiwiaXNBcnJheWlzaCIsImlzQnVmZmVyIiwicmVhZFVJbnQ4Iiwid3JpdGUiLCJpc0VuY29kaW5nIiwiU3RyaW5nIiwidG9Mb3dlckNhc2UiLCJiIiwidW5kZWZpbmVkIiwic3RyIiwicmV0IiwidXRmOFRvQnl0ZXMiLCJiYXNlNjRUb0J5dGVzIiwiY29uY2F0IiwibGlzdCIsInRvdGFsTGVuZ3RoIiwiYXNzZXJ0IiwiaXNBcnJheSIsInBvcyIsIml0ZW0iLCJjb3B5IiwiX2hleFdyaXRlIiwic3RyaW5nIiwib2Zmc2V0IiwiTnVtYmVyIiwicmVtYWluaW5nIiwic3RyTGVuIiwiYnl0ZSIsInBhcnNlSW50Iiwic3Vic3RyIiwiaXNOYU4iLCJfY2hhcnNXcml0dGVuIiwiX3V0ZjhXcml0ZSIsImNoYXJzV3JpdHRlbiIsImJsaXRCdWZmZXIiLCJfYXNjaWlXcml0ZSIsImFzY2lpVG9CeXRlcyIsIl9iaW5hcnlXcml0ZSIsIl9iYXNlNjRXcml0ZSIsIl91dGYxNmxlV3JpdGUiLCJ1dGYxNmxlVG9CeXRlcyIsInByb3RvdHlwZSIsImlzRmluaXRlIiwic3dhcCIsInRvU3RyaW5nIiwic3RhcnQiLCJlbmQiLCJzZWxmIiwiX2hleFNsaWNlIiwiX3V0ZjhTbGljZSIsIl9hc2NpaVNsaWNlIiwiX2JpbmFyeVNsaWNlIiwiX2Jhc2U2NFNsaWNlIiwiX3V0ZjE2bGVTbGljZSIsInRvSlNPTiIsImRhdGEiLCJBcnJheSIsInNsaWNlIiwiY2FsbCIsIl9hcnIiLCJ0YXJnZXQiLCJ0YXJnZXRfc3RhcnQiLCJzb3VyY2UiLCJsZW4iLCJmcm9tQnl0ZUFycmF5IiwicmVzIiwidG1wIiwiTWF0aCIsIm1pbiIsImRlY29kZVV0ZjhDaGFyIiwiZnJvbUNoYXJDb2RlIiwib3V0IiwidG9IZXgiLCJieXRlcyIsImNsYW1wIiwic2xpY2VMZW4iLCJuZXdCdWYiLCJnZXQiLCJjb25zb2xlIiwibG9nIiwic2V0IiwidiIsIndyaXRlVUludDgiLCJub0Fzc2VydCIsIl9yZWFkVUludDE2IiwibGl0dGxlRW5kaWFuIiwidmFsIiwicmVhZFVJbnQxNkxFIiwicmVhZFVJbnQxNkJFIiwiX3JlYWRVSW50MzIiLCJyZWFkVUludDMyTEUiLCJyZWFkVUludDMyQkUiLCJyZWFkSW50OCIsIm5lZyIsIl9yZWFkSW50MTYiLCJyZWFkSW50MTZMRSIsInJlYWRJbnQxNkJFIiwiX3JlYWRJbnQzMiIsInJlYWRJbnQzMkxFIiwicmVhZEludDMyQkUiLCJfcmVhZEZsb2F0IiwicmVhZCIsInJlYWRGbG9hdExFIiwicmVhZEZsb2F0QkUiLCJfcmVhZERvdWJsZSIsInJlYWREb3VibGVMRSIsInJlYWREb3VibGVCRSIsInZhbHVlIiwidmVyaWZ1aW50IiwiX3dyaXRlVUludDE2IiwiaiIsIndyaXRlVUludDE2TEUiLCJ3cml0ZVVJbnQxNkJFIiwiX3dyaXRlVUludDMyIiwid3JpdGVVSW50MzJMRSIsIndyaXRlVUludDMyQkUiLCJ3cml0ZUludDgiLCJ2ZXJpZnNpbnQiLCJfd3JpdGVJbnQxNiIsIndyaXRlSW50MTZMRSIsIndyaXRlSW50MTZCRSIsIl93cml0ZUludDMyIiwid3JpdGVJbnQzMkxFIiwid3JpdGVJbnQzMkJFIiwiX3dyaXRlRmxvYXQiLCJ2ZXJpZklFRUU3NTQiLCJ3cml0ZUZsb2F0TEUiLCJ3cml0ZUZsb2F0QkUiLCJfd3JpdGVEb3VibGUiLCJ3cml0ZURvdWJsZUxFIiwid3JpdGVEb3VibGVCRSIsImZpbGwiLCJjaGFyQ29kZUF0IiwiaW5zcGVjdCIsImpvaW4iLCJ0b0FycmF5QnVmZmVyIiwiYnVmZmVyIiwidHJpbSIsInJlcGxhY2UiLCJCUCIsIl9nZXQiLCJ0b0xvY2FsZVN0cmluZyIsImluZGV4IiwiZGVmYXVsdFZhbHVlIiwiY2VpbCIsIk9iamVjdCIsIm4iLCJieXRlQXJyYXkiLCJwdXNoIiwiaCIsImVuY29kZVVSSUNvbXBvbmVudCIsInNwbGl0IiwiYyIsImhpIiwibG8iLCJ0b0J5dGVBcnJheSIsInNyYyIsImRzdCIsImRlY29kZVVSSUNvbXBvbmVudCIsImVyciIsIm1heCIsImZsb29yIiwidGVzdCIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7OztBQU9BLElBQUlBLFNBQVNDLFFBQVEsV0FBUixDQUFiO0FBQ0EsSUFBSUMsVUFBVUQsUUFBUSxTQUFSLENBQWQ7O0FBRUFFLFFBQVFDLE1BQVIsR0FBaUJBLE1BQWpCO0FBQ0FELFFBQVFFLFVBQVIsR0FBcUJELE1BQXJCO0FBQ0FELFFBQVFHLGlCQUFSLEdBQTRCLEVBQTVCO0FBQ0FGLE9BQU9HLFFBQVAsR0FBa0IsSUFBbEI7O0FBRUE7Ozs7O0FBS0FILE9BQU9JLGVBQVAsR0FBMEIsWUFBWTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSTtBQUNGLFFBQUlDLE1BQU0sSUFBSUMsV0FBSixDQUFnQixDQUFoQixDQUFWO0FBQ0EsUUFBSUMsTUFBTSxJQUFJQyxVQUFKLENBQWVILEdBQWYsQ0FBVjtBQUNBRSxRQUFJRSxHQUFKLEdBQVUsWUFBWTtBQUFFLGFBQU8sRUFBUDtBQUFXLEtBQW5DO0FBQ0EsV0FBTyxPQUFPRixJQUFJRSxHQUFKLEVBQVAsSUFDSCxPQUFPRixJQUFJRyxRQUFYLEtBQXdCLFVBRDVCLENBSkUsQ0FLcUM7QUFDeEMsR0FORCxDQU1FLE9BQU9DLENBQVAsRUFBVTtBQUNWLFdBQU8sS0FBUDtBQUNEO0FBQ0YsQ0Fmd0IsRUFBekI7O0FBaUJBOzs7Ozs7Ozs7Ozs7QUFZQSxTQUFTWCxNQUFULENBQWlCWSxPQUFqQixFQUEwQkMsUUFBMUIsRUFBb0NDLE1BQXBDLEVBQTRDO0FBQzFDLE1BQUksRUFBRSxnQkFBZ0JkLE1BQWxCLENBQUosRUFDRSxPQUFPLElBQUlBLE1BQUosQ0FBV1ksT0FBWCxFQUFvQkMsUUFBcEIsRUFBOEJDLE1BQTlCLENBQVA7O0FBRUYsTUFBSUMsY0FBY0gsT0FBZCx5Q0FBY0EsT0FBZCxDQUFKOztBQUVBO0FBQ0E7QUFDQSxNQUFJQyxhQUFhLFFBQWIsSUFBeUJFLFNBQVMsUUFBdEMsRUFBZ0Q7QUFDOUNILGNBQVVJLFdBQVdKLE9BQVgsQ0FBVjtBQUNBLFdBQU9BLFFBQVFLLE1BQVIsR0FBaUIsQ0FBakIsS0FBdUIsQ0FBOUIsRUFBaUM7QUFDL0JMLGdCQUFVQSxVQUFVLEdBQXBCO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLE1BQUlLLE1BQUo7QUFDQSxNQUFJRixTQUFTLFFBQWIsRUFDRUUsU0FBU0MsT0FBT04sT0FBUCxDQUFULENBREYsS0FFSyxJQUFJRyxTQUFTLFFBQWIsRUFDSEUsU0FBU2pCLE9BQU9tQixVQUFQLENBQWtCUCxPQUFsQixFQUEyQkMsUUFBM0IsQ0FBVCxDQURHLEtBRUEsSUFBSUUsU0FBUyxRQUFiLEVBQ0hFLFNBQVNDLE9BQU9OLFFBQVFLLE1BQWYsQ0FBVCxDQURHLENBQzZCO0FBRDdCLE9BR0gsTUFBTSxJQUFJRyxLQUFKLENBQVUsdURBQVYsQ0FBTjs7QUFFRixNQUFJZixHQUFKO0FBQ0EsTUFBSUwsT0FBT0ksZUFBWCxFQUE0QjtBQUMxQjtBQUNBQyxVQUFNTCxPQUFPcUIsUUFBUCxDQUFnQixJQUFJYixVQUFKLENBQWVTLE1BQWYsQ0FBaEIsQ0FBTjtBQUNELEdBSEQsTUFHTztBQUNMO0FBQ0FaLFVBQU0sSUFBTjtBQUNBQSxRQUFJWSxNQUFKLEdBQWFBLE1BQWI7QUFDQVosUUFBSWlCLFNBQUosR0FBZ0IsSUFBaEI7QUFDRDs7QUFFRCxNQUFJQyxDQUFKO0FBQ0EsTUFBSXZCLE9BQU9JLGVBQVAsSUFBMEIsT0FBT1EsUUFBUU8sVUFBZixLQUE4QixRQUE1RCxFQUFzRTtBQUNwRTtBQUNBZCxRQUFJbUIsSUFBSixDQUFTWixPQUFUO0FBQ0QsR0FIRCxNQUdPLElBQUlhLFdBQVdiLE9BQVgsQ0FBSixFQUF5QjtBQUM5QjtBQUNBLFNBQUtXLElBQUksQ0FBVCxFQUFZQSxJQUFJTixNQUFoQixFQUF3Qk0sR0FBeEIsRUFBNkI7QUFDM0IsVUFBSXZCLE9BQU8wQixRQUFQLENBQWdCZCxPQUFoQixDQUFKLEVBQ0VQLElBQUlrQixDQUFKLElBQVNYLFFBQVFlLFNBQVIsQ0FBa0JKLENBQWxCLENBQVQsQ0FERixLQUdFbEIsSUFBSWtCLENBQUosSUFBU1gsUUFBUVcsQ0FBUixDQUFUO0FBQ0g7QUFDRixHQVJNLE1BUUEsSUFBSVIsU0FBUyxRQUFiLEVBQXVCO0FBQzVCVixRQUFJdUIsS0FBSixDQUFVaEIsT0FBVixFQUFtQixDQUFuQixFQUFzQkMsUUFBdEI7QUFDRCxHQUZNLE1BRUEsSUFBSUUsU0FBUyxRQUFULElBQXFCLENBQUNmLE9BQU9JLGVBQTdCLElBQWdELENBQUNVLE1BQXJELEVBQTZEO0FBQ2xFLFNBQUtTLElBQUksQ0FBVCxFQUFZQSxJQUFJTixNQUFoQixFQUF3Qk0sR0FBeEIsRUFBNkI7QUFDM0JsQixVQUFJa0IsQ0FBSixJQUFTLENBQVQ7QUFDRDtBQUNGOztBQUVELFNBQU9sQixHQUFQO0FBQ0Q7O0FBRUQ7QUFDQTs7QUFFQUwsT0FBTzZCLFVBQVAsR0FBb0IsVUFBVWhCLFFBQVYsRUFBb0I7QUFDdEMsVUFBUWlCLE9BQU9qQixRQUFQLEVBQWlCa0IsV0FBakIsRUFBUjtBQUNFLFNBQUssS0FBTDtBQUNBLFNBQUssTUFBTDtBQUNBLFNBQUssT0FBTDtBQUNBLFNBQUssT0FBTDtBQUNBLFNBQUssUUFBTDtBQUNBLFNBQUssUUFBTDtBQUNBLFNBQUssS0FBTDtBQUNBLFNBQUssTUFBTDtBQUNBLFNBQUssT0FBTDtBQUNBLFNBQUssU0FBTDtBQUNBLFNBQUssVUFBTDtBQUNFLGFBQU8sSUFBUDtBQUNGO0FBQ0UsYUFBTyxLQUFQO0FBZEo7QUFnQkQsQ0FqQkQ7O0FBbUJBL0IsT0FBTzBCLFFBQVAsR0FBa0IsVUFBVU0sQ0FBVixFQUFhO0FBQzdCLFNBQU8sQ0FBQyxFQUFFQSxNQUFNLElBQU4sSUFBY0EsTUFBTUMsU0FBcEIsSUFBaUNELEVBQUVWLFNBQXJDLENBQVI7QUFDRCxDQUZEOztBQUlBdEIsT0FBT21CLFVBQVAsR0FBb0IsVUFBVWUsR0FBVixFQUFlckIsUUFBZixFQUF5QjtBQUMzQyxNQUFJc0IsR0FBSjtBQUNBRCxRQUFNQSxNQUFNLEVBQVo7QUFDQSxVQUFRckIsWUFBWSxNQUFwQjtBQUNFLFNBQUssS0FBTDtBQUNFc0IsWUFBTUQsSUFBSWpCLE1BQUosR0FBYSxDQUFuQjtBQUNBO0FBQ0YsU0FBSyxNQUFMO0FBQ0EsU0FBSyxPQUFMO0FBQ0VrQixZQUFNQyxZQUFZRixHQUFaLEVBQWlCakIsTUFBdkI7QUFDQTtBQUNGLFNBQUssT0FBTDtBQUNBLFNBQUssUUFBTDtBQUNBLFNBQUssS0FBTDtBQUNFa0IsWUFBTUQsSUFBSWpCLE1BQVY7QUFDQTtBQUNGLFNBQUssUUFBTDtBQUNFa0IsWUFBTUUsY0FBY0gsR0FBZCxFQUFtQmpCLE1BQXpCO0FBQ0E7QUFDRixTQUFLLE1BQUw7QUFDQSxTQUFLLE9BQUw7QUFDQSxTQUFLLFNBQUw7QUFDQSxTQUFLLFVBQUw7QUFDRWtCLFlBQU1ELElBQUlqQixNQUFKLEdBQWEsQ0FBbkI7QUFDQTtBQUNGO0FBQ0UsWUFBTSxJQUFJRyxLQUFKLENBQVUsa0JBQVYsQ0FBTjtBQXZCSjtBQXlCQSxTQUFPZSxHQUFQO0FBQ0QsQ0E3QkQ7O0FBK0JBbkMsT0FBT3NDLE1BQVAsR0FBZ0IsVUFBVUMsSUFBVixFQUFnQkMsV0FBaEIsRUFBNkI7QUFDM0NDLFNBQU9DLFFBQVFILElBQVIsQ0FBUCxFQUFzQixnREFDbEIsMEJBREo7O0FBR0EsTUFBSUEsS0FBS3RCLE1BQUwsS0FBZ0IsQ0FBcEIsRUFBdUI7QUFDckIsV0FBTyxJQUFJakIsTUFBSixDQUFXLENBQVgsQ0FBUDtBQUNELEdBRkQsTUFFTyxJQUFJdUMsS0FBS3RCLE1BQUwsS0FBZ0IsQ0FBcEIsRUFBdUI7QUFDNUIsV0FBT3NCLEtBQUssQ0FBTCxDQUFQO0FBQ0Q7O0FBRUQsTUFBSWhCLENBQUo7QUFDQSxNQUFJLE9BQU9pQixXQUFQLEtBQXVCLFFBQTNCLEVBQXFDO0FBQ25DQSxrQkFBYyxDQUFkO0FBQ0EsU0FBS2pCLElBQUksQ0FBVCxFQUFZQSxJQUFJZ0IsS0FBS3RCLE1BQXJCLEVBQTZCTSxHQUE3QixFQUFrQztBQUNoQ2lCLHFCQUFlRCxLQUFLaEIsQ0FBTCxFQUFRTixNQUF2QjtBQUNEO0FBQ0Y7O0FBRUQsTUFBSVosTUFBTSxJQUFJTCxNQUFKLENBQVd3QyxXQUFYLENBQVY7QUFDQSxNQUFJRyxNQUFNLENBQVY7QUFDQSxPQUFLcEIsSUFBSSxDQUFULEVBQVlBLElBQUlnQixLQUFLdEIsTUFBckIsRUFBNkJNLEdBQTdCLEVBQWtDO0FBQ2hDLFFBQUlxQixPQUFPTCxLQUFLaEIsQ0FBTCxDQUFYO0FBQ0FxQixTQUFLQyxJQUFMLENBQVV4QyxHQUFWLEVBQWVzQyxHQUFmO0FBQ0FBLFdBQU9DLEtBQUszQixNQUFaO0FBQ0Q7QUFDRCxTQUFPWixHQUFQO0FBQ0QsQ0ExQkQ7O0FBNEJBO0FBQ0E7O0FBRUEsU0FBU3lDLFNBQVQsQ0FBb0J6QyxHQUFwQixFQUF5QjBDLE1BQXpCLEVBQWlDQyxNQUFqQyxFQUF5Qy9CLE1BQXpDLEVBQWlEO0FBQy9DK0IsV0FBU0MsT0FBT0QsTUFBUCxLQUFrQixDQUEzQjtBQUNBLE1BQUlFLFlBQVk3QyxJQUFJWSxNQUFKLEdBQWErQixNQUE3QjtBQUNBLE1BQUksQ0FBQy9CLE1BQUwsRUFBYTtBQUNYQSxhQUFTaUMsU0FBVDtBQUNELEdBRkQsTUFFTztBQUNMakMsYUFBU2dDLE9BQU9oQyxNQUFQLENBQVQ7QUFDQSxRQUFJQSxTQUFTaUMsU0FBYixFQUF3QjtBQUN0QmpDLGVBQVNpQyxTQUFUO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLE1BQUlDLFNBQVNKLE9BQU85QixNQUFwQjtBQUNBd0IsU0FBT1UsU0FBUyxDQUFULEtBQWUsQ0FBdEIsRUFBeUIsb0JBQXpCOztBQUVBLE1BQUlsQyxTQUFTa0MsU0FBUyxDQUF0QixFQUF5QjtBQUN2QmxDLGFBQVNrQyxTQUFTLENBQWxCO0FBQ0Q7QUFDRCxPQUFLLElBQUk1QixJQUFJLENBQWIsRUFBZ0JBLElBQUlOLE1BQXBCLEVBQTRCTSxHQUE1QixFQUFpQztBQUMvQixRQUFJNkIsT0FBT0MsU0FBU04sT0FBT08sTUFBUCxDQUFjL0IsSUFBSSxDQUFsQixFQUFxQixDQUFyQixDQUFULEVBQWtDLEVBQWxDLENBQVg7QUFDQWtCLFdBQU8sQ0FBQ2MsTUFBTUgsSUFBTixDQUFSLEVBQXFCLG9CQUFyQjtBQUNBL0MsUUFBSTJDLFNBQVN6QixDQUFiLElBQWtCNkIsSUFBbEI7QUFDRDtBQUNEcEQsU0FBT3dELGFBQVAsR0FBdUJqQyxJQUFJLENBQTNCO0FBQ0EsU0FBT0EsQ0FBUDtBQUNEOztBQUVELFNBQVNrQyxVQUFULENBQXFCcEQsR0FBckIsRUFBMEIwQyxNQUExQixFQUFrQ0MsTUFBbEMsRUFBMEMvQixNQUExQyxFQUFrRDtBQUNoRCxNQUFJeUMsZUFBZTFELE9BQU93RCxhQUFQLEdBQ2pCRyxXQUFXdkIsWUFBWVcsTUFBWixDQUFYLEVBQWdDMUMsR0FBaEMsRUFBcUMyQyxNQUFyQyxFQUE2Qy9CLE1BQTdDLENBREY7QUFFQSxTQUFPeUMsWUFBUDtBQUNEOztBQUVELFNBQVNFLFdBQVQsQ0FBc0J2RCxHQUF0QixFQUEyQjBDLE1BQTNCLEVBQW1DQyxNQUFuQyxFQUEyQy9CLE1BQTNDLEVBQW1EO0FBQ2pELE1BQUl5QyxlQUFlMUQsT0FBT3dELGFBQVAsR0FDakJHLFdBQVdFLGFBQWFkLE1BQWIsQ0FBWCxFQUFpQzFDLEdBQWpDLEVBQXNDMkMsTUFBdEMsRUFBOEMvQixNQUE5QyxDQURGO0FBRUEsU0FBT3lDLFlBQVA7QUFDRDs7QUFFRCxTQUFTSSxZQUFULENBQXVCekQsR0FBdkIsRUFBNEIwQyxNQUE1QixFQUFvQ0MsTUFBcEMsRUFBNEMvQixNQUE1QyxFQUFvRDtBQUNsRCxTQUFPMkMsWUFBWXZELEdBQVosRUFBaUIwQyxNQUFqQixFQUF5QkMsTUFBekIsRUFBaUMvQixNQUFqQyxDQUFQO0FBQ0Q7O0FBRUQsU0FBUzhDLFlBQVQsQ0FBdUIxRCxHQUF2QixFQUE0QjBDLE1BQTVCLEVBQW9DQyxNQUFwQyxFQUE0Qy9CLE1BQTVDLEVBQW9EO0FBQ2xELE1BQUl5QyxlQUFlMUQsT0FBT3dELGFBQVAsR0FDakJHLFdBQVd0QixjQUFjVSxNQUFkLENBQVgsRUFBa0MxQyxHQUFsQyxFQUF1QzJDLE1BQXZDLEVBQStDL0IsTUFBL0MsQ0FERjtBQUVBLFNBQU95QyxZQUFQO0FBQ0Q7O0FBRUQsU0FBU00sYUFBVCxDQUF3QjNELEdBQXhCLEVBQTZCMEMsTUFBN0IsRUFBcUNDLE1BQXJDLEVBQTZDL0IsTUFBN0MsRUFBcUQ7QUFDbkQsTUFBSXlDLGVBQWUxRCxPQUFPd0QsYUFBUCxHQUNqQkcsV0FBV00sZUFBZWxCLE1BQWYsQ0FBWCxFQUFtQzFDLEdBQW5DLEVBQXdDMkMsTUFBeEMsRUFBZ0QvQixNQUFoRCxDQURGO0FBRUEsU0FBT3lDLFlBQVA7QUFDRDs7QUFFRDFELE9BQU9rRSxTQUFQLENBQWlCdEMsS0FBakIsR0FBeUIsVUFBVW1CLE1BQVYsRUFBa0JDLE1BQWxCLEVBQTBCL0IsTUFBMUIsRUFBa0NKLFFBQWxDLEVBQTRDO0FBQ25FO0FBQ0E7QUFDQSxNQUFJc0QsU0FBU25CLE1BQVQsQ0FBSixFQUFzQjtBQUNwQixRQUFJLENBQUNtQixTQUFTbEQsTUFBVCxDQUFMLEVBQXVCO0FBQ3JCSixpQkFBV0ksTUFBWDtBQUNBQSxlQUFTZ0IsU0FBVDtBQUNEO0FBQ0YsR0FMRCxNQUtPO0FBQUc7QUFDUixRQUFJbUMsT0FBT3ZELFFBQVg7QUFDQUEsZUFBV21DLE1BQVg7QUFDQUEsYUFBUy9CLE1BQVQ7QUFDQUEsYUFBU21ELElBQVQ7QUFDRDs7QUFFRHBCLFdBQVNDLE9BQU9ELE1BQVAsS0FBa0IsQ0FBM0I7QUFDQSxNQUFJRSxZQUFZLEtBQUtqQyxNQUFMLEdBQWMrQixNQUE5QjtBQUNBLE1BQUksQ0FBQy9CLE1BQUwsRUFBYTtBQUNYQSxhQUFTaUMsU0FBVDtBQUNELEdBRkQsTUFFTztBQUNMakMsYUFBU2dDLE9BQU9oQyxNQUFQLENBQVQ7QUFDQSxRQUFJQSxTQUFTaUMsU0FBYixFQUF3QjtBQUN0QmpDLGVBQVNpQyxTQUFUO0FBQ0Q7QUFDRjtBQUNEckMsYUFBV2lCLE9BQU9qQixZQUFZLE1BQW5CLEVBQTJCa0IsV0FBM0IsRUFBWDs7QUFFQSxNQUFJSSxHQUFKO0FBQ0EsVUFBUXRCLFFBQVI7QUFDRSxTQUFLLEtBQUw7QUFDRXNCLFlBQU1XLFVBQVUsSUFBVixFQUFnQkMsTUFBaEIsRUFBd0JDLE1BQXhCLEVBQWdDL0IsTUFBaEMsQ0FBTjtBQUNBO0FBQ0YsU0FBSyxNQUFMO0FBQ0EsU0FBSyxPQUFMO0FBQ0VrQixZQUFNc0IsV0FBVyxJQUFYLEVBQWlCVixNQUFqQixFQUF5QkMsTUFBekIsRUFBaUMvQixNQUFqQyxDQUFOO0FBQ0E7QUFDRixTQUFLLE9BQUw7QUFDRWtCLFlBQU15QixZQUFZLElBQVosRUFBa0JiLE1BQWxCLEVBQTBCQyxNQUExQixFQUFrQy9CLE1BQWxDLENBQU47QUFDQTtBQUNGLFNBQUssUUFBTDtBQUNFa0IsWUFBTTJCLGFBQWEsSUFBYixFQUFtQmYsTUFBbkIsRUFBMkJDLE1BQTNCLEVBQW1DL0IsTUFBbkMsQ0FBTjtBQUNBO0FBQ0YsU0FBSyxRQUFMO0FBQ0VrQixZQUFNNEIsYUFBYSxJQUFiLEVBQW1CaEIsTUFBbkIsRUFBMkJDLE1BQTNCLEVBQW1DL0IsTUFBbkMsQ0FBTjtBQUNBO0FBQ0YsU0FBSyxNQUFMO0FBQ0EsU0FBSyxPQUFMO0FBQ0EsU0FBSyxTQUFMO0FBQ0EsU0FBSyxVQUFMO0FBQ0VrQixZQUFNNkIsY0FBYyxJQUFkLEVBQW9CakIsTUFBcEIsRUFBNEJDLE1BQTVCLEVBQW9DL0IsTUFBcEMsQ0FBTjtBQUNBO0FBQ0Y7QUFDRSxZQUFNLElBQUlHLEtBQUosQ0FBVSxrQkFBVixDQUFOO0FBeEJKO0FBMEJBLFNBQU9lLEdBQVA7QUFDRCxDQXZERDs7QUF5REFuQyxPQUFPa0UsU0FBUCxDQUFpQkcsUUFBakIsR0FBNEIsVUFBVXhELFFBQVYsRUFBb0J5RCxLQUFwQixFQUEyQkMsR0FBM0IsRUFBZ0M7QUFDMUQsTUFBSUMsT0FBTyxJQUFYOztBQUVBM0QsYUFBV2lCLE9BQU9qQixZQUFZLE1BQW5CLEVBQTJCa0IsV0FBM0IsRUFBWDtBQUNBdUMsVUFBUXJCLE9BQU9xQixLQUFQLEtBQWlCLENBQXpCO0FBQ0FDLFFBQU9BLFFBQVF0QyxTQUFULEdBQ0ZnQixPQUFPc0IsR0FBUCxDQURFLEdBRUZBLE1BQU1DLEtBQUt2RCxNQUZmOztBQUlBO0FBQ0EsTUFBSXNELFFBQVFELEtBQVosRUFDRSxPQUFPLEVBQVA7O0FBRUYsTUFBSW5DLEdBQUo7QUFDQSxVQUFRdEIsUUFBUjtBQUNFLFNBQUssS0FBTDtBQUNFc0IsWUFBTXNDLFVBQVVELElBQVYsRUFBZ0JGLEtBQWhCLEVBQXVCQyxHQUF2QixDQUFOO0FBQ0E7QUFDRixTQUFLLE1BQUw7QUFDQSxTQUFLLE9BQUw7QUFDRXBDLFlBQU11QyxXQUFXRixJQUFYLEVBQWlCRixLQUFqQixFQUF3QkMsR0FBeEIsQ0FBTjtBQUNBO0FBQ0YsU0FBSyxPQUFMO0FBQ0VwQyxZQUFNd0MsWUFBWUgsSUFBWixFQUFrQkYsS0FBbEIsRUFBeUJDLEdBQXpCLENBQU47QUFDQTtBQUNGLFNBQUssUUFBTDtBQUNFcEMsWUFBTXlDLGFBQWFKLElBQWIsRUFBbUJGLEtBQW5CLEVBQTBCQyxHQUExQixDQUFOO0FBQ0E7QUFDRixTQUFLLFFBQUw7QUFDRXBDLFlBQU0wQyxhQUFhTCxJQUFiLEVBQW1CRixLQUFuQixFQUEwQkMsR0FBMUIsQ0FBTjtBQUNBO0FBQ0YsU0FBSyxNQUFMO0FBQ0EsU0FBSyxPQUFMO0FBQ0EsU0FBSyxTQUFMO0FBQ0EsU0FBSyxVQUFMO0FBQ0VwQyxZQUFNMkMsY0FBY04sSUFBZCxFQUFvQkYsS0FBcEIsRUFBMkJDLEdBQTNCLENBQU47QUFDQTtBQUNGO0FBQ0UsWUFBTSxJQUFJbkQsS0FBSixDQUFVLGtCQUFWLENBQU47QUF4Qko7QUEwQkEsU0FBT2UsR0FBUDtBQUNELENBekNEOztBQTJDQW5DLE9BQU9rRSxTQUFQLENBQWlCYSxNQUFqQixHQUEwQixZQUFZO0FBQ3BDLFNBQU87QUFDTGhFLFVBQU0sUUFERDtBQUVMaUUsVUFBTUMsTUFBTWYsU0FBTixDQUFnQmdCLEtBQWhCLENBQXNCQyxJQUF0QixDQUEyQixLQUFLQyxJQUFMLElBQWEsSUFBeEMsRUFBOEMsQ0FBOUM7QUFGRCxHQUFQO0FBSUQsQ0FMRDs7QUFPQTtBQUNBcEYsT0FBT2tFLFNBQVAsQ0FBaUJyQixJQUFqQixHQUF3QixVQUFVd0MsTUFBVixFQUFrQkMsWUFBbEIsRUFBZ0NoQixLQUFoQyxFQUF1Q0MsR0FBdkMsRUFBNEM7QUFDbEUsTUFBSWdCLFNBQVMsSUFBYjs7QUFFQSxNQUFJLENBQUNqQixLQUFMLEVBQVlBLFFBQVEsQ0FBUjtBQUNaLE1BQUksQ0FBQ0MsR0FBRCxJQUFRQSxRQUFRLENBQXBCLEVBQXVCQSxNQUFNLEtBQUt0RCxNQUFYO0FBQ3ZCLE1BQUksQ0FBQ3FFLFlBQUwsRUFBbUJBLGVBQWUsQ0FBZjs7QUFFbkI7QUFDQSxNQUFJZixRQUFRRCxLQUFaLEVBQW1CO0FBQ25CLE1BQUllLE9BQU9wRSxNQUFQLEtBQWtCLENBQWxCLElBQXVCc0UsT0FBT3RFLE1BQVAsS0FBa0IsQ0FBN0MsRUFBZ0Q7O0FBRWhEO0FBQ0F3QixTQUFPOEIsT0FBT0QsS0FBZCxFQUFxQix5QkFBckI7QUFDQTdCLFNBQU82QyxnQkFBZ0IsQ0FBaEIsSUFBcUJBLGVBQWVELE9BQU9wRSxNQUFsRCxFQUNJLDJCQURKO0FBRUF3QixTQUFPNkIsU0FBUyxDQUFULElBQWNBLFFBQVFpQixPQUFPdEUsTUFBcEMsRUFBNEMsMkJBQTVDO0FBQ0F3QixTQUFPOEIsT0FBTyxDQUFQLElBQVlBLE9BQU9nQixPQUFPdEUsTUFBakMsRUFBeUMseUJBQXpDOztBQUVBO0FBQ0EsTUFBSXNELE1BQU0sS0FBS3RELE1BQWYsRUFDRXNELE1BQU0sS0FBS3RELE1BQVg7QUFDRixNQUFJb0UsT0FBT3BFLE1BQVAsR0FBZ0JxRSxZQUFoQixHQUErQmYsTUFBTUQsS0FBekMsRUFDRUMsTUFBTWMsT0FBT3BFLE1BQVAsR0FBZ0JxRSxZQUFoQixHQUErQmhCLEtBQXJDOztBQUVGLE1BQUlrQixNQUFNakIsTUFBTUQsS0FBaEI7O0FBRUEsTUFBSWtCLE1BQU0sR0FBTixJQUFhLENBQUN4RixPQUFPSSxlQUF6QixFQUEwQztBQUN4QyxTQUFLLElBQUltQixJQUFJLENBQWIsRUFBZ0JBLElBQUlpRSxHQUFwQixFQUF5QmpFLEdBQXpCO0FBQ0U4RCxhQUFPOUQsSUFBSStELFlBQVgsSUFBMkIsS0FBSy9ELElBQUkrQyxLQUFULENBQTNCO0FBREY7QUFFRCxHQUhELE1BR087QUFDTGUsV0FBTzdELElBQVAsQ0FBWSxLQUFLZCxRQUFMLENBQWM0RCxLQUFkLEVBQXFCQSxRQUFRa0IsR0FBN0IsQ0FBWixFQUErQ0YsWUFBL0M7QUFDRDtBQUNGLENBaENEOztBQWtDQSxTQUFTVCxZQUFULENBQXVCeEUsR0FBdkIsRUFBNEJpRSxLQUE1QixFQUFtQ0MsR0FBbkMsRUFBd0M7QUFDdEMsTUFBSUQsVUFBVSxDQUFWLElBQWVDLFFBQVFsRSxJQUFJWSxNQUEvQixFQUF1QztBQUNyQyxXQUFPckIsT0FBTzZGLGFBQVAsQ0FBcUJwRixHQUFyQixDQUFQO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsV0FBT1QsT0FBTzZGLGFBQVAsQ0FBcUJwRixJQUFJNkUsS0FBSixDQUFVWixLQUFWLEVBQWlCQyxHQUFqQixDQUFyQixDQUFQO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTRyxVQUFULENBQXFCckUsR0FBckIsRUFBMEJpRSxLQUExQixFQUFpQ0MsR0FBakMsRUFBc0M7QUFDcEMsTUFBSW1CLE1BQU0sRUFBVjtBQUNBLE1BQUlDLE1BQU0sRUFBVjtBQUNBcEIsUUFBTXFCLEtBQUtDLEdBQUwsQ0FBU3hGLElBQUlZLE1BQWIsRUFBcUJzRCxHQUFyQixDQUFOOztBQUVBLE9BQUssSUFBSWhELElBQUkrQyxLQUFiLEVBQW9CL0MsSUFBSWdELEdBQXhCLEVBQTZCaEQsR0FBN0IsRUFBa0M7QUFDaEMsUUFBSWxCLElBQUlrQixDQUFKLEtBQVUsSUFBZCxFQUFvQjtBQUNsQm1FLGFBQU9JLGVBQWVILEdBQWYsSUFBc0I3RCxPQUFPaUUsWUFBUCxDQUFvQjFGLElBQUlrQixDQUFKLENBQXBCLENBQTdCO0FBQ0FvRSxZQUFNLEVBQU47QUFDRCxLQUhELE1BR087QUFDTEEsYUFBTyxNQUFNdEYsSUFBSWtCLENBQUosRUFBTzhDLFFBQVAsQ0FBZ0IsRUFBaEIsQ0FBYjtBQUNEO0FBQ0Y7O0FBRUQsU0FBT3FCLE1BQU1JLGVBQWVILEdBQWYsQ0FBYjtBQUNEOztBQUVELFNBQVNoQixXQUFULENBQXNCdEUsR0FBdEIsRUFBMkJpRSxLQUEzQixFQUFrQ0MsR0FBbEMsRUFBdUM7QUFDckMsTUFBSXBDLE1BQU0sRUFBVjtBQUNBb0MsUUFBTXFCLEtBQUtDLEdBQUwsQ0FBU3hGLElBQUlZLE1BQWIsRUFBcUJzRCxHQUFyQixDQUFOOztBQUVBLE9BQUssSUFBSWhELElBQUkrQyxLQUFiLEVBQW9CL0MsSUFBSWdELEdBQXhCLEVBQTZCaEQsR0FBN0I7QUFDRVksV0FBT0wsT0FBT2lFLFlBQVAsQ0FBb0IxRixJQUFJa0IsQ0FBSixDQUFwQixDQUFQO0FBREYsR0FFQSxPQUFPWSxHQUFQO0FBQ0Q7O0FBRUQsU0FBU3lDLFlBQVQsQ0FBdUJ2RSxHQUF2QixFQUE0QmlFLEtBQTVCLEVBQW1DQyxHQUFuQyxFQUF3QztBQUN0QyxTQUFPSSxZQUFZdEUsR0FBWixFQUFpQmlFLEtBQWpCLEVBQXdCQyxHQUF4QixDQUFQO0FBQ0Q7O0FBRUQsU0FBU0UsU0FBVCxDQUFvQnBFLEdBQXBCLEVBQXlCaUUsS0FBekIsRUFBZ0NDLEdBQWhDLEVBQXFDO0FBQ25DLE1BQUlpQixNQUFNbkYsSUFBSVksTUFBZDs7QUFFQSxNQUFJLENBQUNxRCxLQUFELElBQVVBLFFBQVEsQ0FBdEIsRUFBeUJBLFFBQVEsQ0FBUjtBQUN6QixNQUFJLENBQUNDLEdBQUQsSUFBUUEsTUFBTSxDQUFkLElBQW1CQSxNQUFNaUIsR0FBN0IsRUFBa0NqQixNQUFNaUIsR0FBTjs7QUFFbEMsTUFBSVEsTUFBTSxFQUFWO0FBQ0EsT0FBSyxJQUFJekUsSUFBSStDLEtBQWIsRUFBb0IvQyxJQUFJZ0QsR0FBeEIsRUFBNkJoRCxHQUE3QixFQUFrQztBQUNoQ3lFLFdBQU9DLE1BQU01RixJQUFJa0IsQ0FBSixDQUFOLENBQVA7QUFDRDtBQUNELFNBQU95RSxHQUFQO0FBQ0Q7O0FBRUQsU0FBU2xCLGFBQVQsQ0FBd0J6RSxHQUF4QixFQUE2QmlFLEtBQTdCLEVBQW9DQyxHQUFwQyxFQUF5QztBQUN2QyxNQUFJMkIsUUFBUTdGLElBQUk2RSxLQUFKLENBQVVaLEtBQVYsRUFBaUJDLEdBQWpCLENBQVo7QUFDQSxNQUFJbUIsTUFBTSxFQUFWO0FBQ0EsT0FBSyxJQUFJbkUsSUFBSSxDQUFiLEVBQWdCQSxJQUFJMkUsTUFBTWpGLE1BQTFCLEVBQWtDTSxLQUFLLENBQXZDLEVBQTBDO0FBQ3hDbUUsV0FBTzVELE9BQU9pRSxZQUFQLENBQW9CRyxNQUFNM0UsQ0FBTixJQUFXMkUsTUFBTTNFLElBQUUsQ0FBUixJQUFhLEdBQTVDLENBQVA7QUFDRDtBQUNELFNBQU9tRSxHQUFQO0FBQ0Q7O0FBRUQxRixPQUFPa0UsU0FBUCxDQUFpQmdCLEtBQWpCLEdBQXlCLFVBQVVaLEtBQVYsRUFBaUJDLEdBQWpCLEVBQXNCO0FBQzdDLE1BQUlpQixNQUFNLEtBQUt2RSxNQUFmO0FBQ0FxRCxVQUFRNkIsTUFBTTdCLEtBQU4sRUFBYWtCLEdBQWIsRUFBa0IsQ0FBbEIsQ0FBUjtBQUNBakIsUUFBTTRCLE1BQU01QixHQUFOLEVBQVdpQixHQUFYLEVBQWdCQSxHQUFoQixDQUFOOztBQUVBLE1BQUl4RixPQUFPSSxlQUFYLEVBQTRCO0FBQzFCLFdBQU9KLE9BQU9xQixRQUFQLENBQWdCLEtBQUtYLFFBQUwsQ0FBYzRELEtBQWQsRUFBcUJDLEdBQXJCLENBQWhCLENBQVA7QUFDRCxHQUZELE1BRU87QUFDTCxRQUFJNkIsV0FBVzdCLE1BQU1ELEtBQXJCO0FBQ0EsUUFBSStCLFNBQVMsSUFBSXJHLE1BQUosQ0FBV29HLFFBQVgsRUFBcUJuRSxTQUFyQixFQUFnQyxJQUFoQyxDQUFiO0FBQ0EsU0FBSyxJQUFJVixJQUFJLENBQWIsRUFBZ0JBLElBQUk2RSxRQUFwQixFQUE4QjdFLEdBQTlCLEVBQW1DO0FBQ2pDOEUsYUFBTzlFLENBQVAsSUFBWSxLQUFLQSxJQUFJK0MsS0FBVCxDQUFaO0FBQ0Q7QUFDRCxXQUFPK0IsTUFBUDtBQUNEO0FBQ0YsQ0FmRDs7QUFpQkE7QUFDQXJHLE9BQU9rRSxTQUFQLENBQWlCb0MsR0FBakIsR0FBdUIsVUFBVXRELE1BQVYsRUFBa0I7QUFDdkN1RCxVQUFRQyxHQUFSLENBQVksMkRBQVo7QUFDQSxTQUFPLEtBQUs3RSxTQUFMLENBQWVxQixNQUFmLENBQVA7QUFDRCxDQUhEOztBQUtBO0FBQ0FoRCxPQUFPa0UsU0FBUCxDQUFpQnVDLEdBQWpCLEdBQXVCLFVBQVVDLENBQVYsRUFBYTFELE1BQWIsRUFBcUI7QUFDMUN1RCxVQUFRQyxHQUFSLENBQVksMkRBQVo7QUFDQSxTQUFPLEtBQUtHLFVBQUwsQ0FBZ0JELENBQWhCLEVBQW1CMUQsTUFBbkIsQ0FBUDtBQUNELENBSEQ7O0FBS0FoRCxPQUFPa0UsU0FBUCxDQUFpQnZDLFNBQWpCLEdBQTZCLFVBQVVxQixNQUFWLEVBQWtCNEQsUUFBbEIsRUFBNEI7QUFDdkQsTUFBSSxDQUFDQSxRQUFMLEVBQWU7QUFDYm5FLFdBQU9PLFdBQVdmLFNBQVgsSUFBd0JlLFdBQVcsSUFBMUMsRUFBZ0QsZ0JBQWhEO0FBQ0FQLFdBQU9PLFNBQVMsS0FBSy9CLE1BQXJCLEVBQTZCLHFDQUE3QjtBQUNEOztBQUVELE1BQUkrQixVQUFVLEtBQUsvQixNQUFuQixFQUNFOztBQUVGLFNBQU8sS0FBSytCLE1BQUwsQ0FBUDtBQUNELENBVkQ7O0FBWUEsU0FBUzZELFdBQVQsQ0FBc0J4RyxHQUF0QixFQUEyQjJDLE1BQTNCLEVBQW1DOEQsWUFBbkMsRUFBaURGLFFBQWpELEVBQTJEO0FBQ3pELE1BQUksQ0FBQ0EsUUFBTCxFQUFlO0FBQ2JuRSxXQUFPLE9BQU9xRSxZQUFQLEtBQXdCLFNBQS9CLEVBQTBDLDJCQUExQztBQUNBckUsV0FBT08sV0FBV2YsU0FBWCxJQUF3QmUsV0FBVyxJQUExQyxFQUFnRCxnQkFBaEQ7QUFDQVAsV0FBT08sU0FBUyxDQUFULEdBQWEzQyxJQUFJWSxNQUF4QixFQUFnQyxxQ0FBaEM7QUFDRDs7QUFFRCxNQUFJdUUsTUFBTW5GLElBQUlZLE1BQWQ7QUFDQSxNQUFJK0IsVUFBVXdDLEdBQWQsRUFDRTs7QUFFRixNQUFJdUIsR0FBSjtBQUNBLE1BQUlELFlBQUosRUFBa0I7QUFDaEJDLFVBQU0xRyxJQUFJMkMsTUFBSixDQUFOO0FBQ0EsUUFBSUEsU0FBUyxDQUFULEdBQWF3QyxHQUFqQixFQUNFdUIsT0FBTzFHLElBQUkyQyxTQUFTLENBQWIsS0FBbUIsQ0FBMUI7QUFDSCxHQUpELE1BSU87QUFDTCtELFVBQU0xRyxJQUFJMkMsTUFBSixLQUFlLENBQXJCO0FBQ0EsUUFBSUEsU0FBUyxDQUFULEdBQWF3QyxHQUFqQixFQUNFdUIsT0FBTzFHLElBQUkyQyxTQUFTLENBQWIsQ0FBUDtBQUNIO0FBQ0QsU0FBTytELEdBQVA7QUFDRDs7QUFFRC9HLE9BQU9rRSxTQUFQLENBQWlCOEMsWUFBakIsR0FBZ0MsVUFBVWhFLE1BQVYsRUFBa0I0RCxRQUFsQixFQUE0QjtBQUMxRCxTQUFPQyxZQUFZLElBQVosRUFBa0I3RCxNQUFsQixFQUEwQixJQUExQixFQUFnQzRELFFBQWhDLENBQVA7QUFDRCxDQUZEOztBQUlBNUcsT0FBT2tFLFNBQVAsQ0FBaUIrQyxZQUFqQixHQUFnQyxVQUFVakUsTUFBVixFQUFrQjRELFFBQWxCLEVBQTRCO0FBQzFELFNBQU9DLFlBQVksSUFBWixFQUFrQjdELE1BQWxCLEVBQTBCLEtBQTFCLEVBQWlDNEQsUUFBakMsQ0FBUDtBQUNELENBRkQ7O0FBSUEsU0FBU00sV0FBVCxDQUFzQjdHLEdBQXRCLEVBQTJCMkMsTUFBM0IsRUFBbUM4RCxZQUFuQyxFQUFpREYsUUFBakQsRUFBMkQ7QUFDekQsTUFBSSxDQUFDQSxRQUFMLEVBQWU7QUFDYm5FLFdBQU8sT0FBT3FFLFlBQVAsS0FBd0IsU0FBL0IsRUFBMEMsMkJBQTFDO0FBQ0FyRSxXQUFPTyxXQUFXZixTQUFYLElBQXdCZSxXQUFXLElBQTFDLEVBQWdELGdCQUFoRDtBQUNBUCxXQUFPTyxTQUFTLENBQVQsR0FBYTNDLElBQUlZLE1BQXhCLEVBQWdDLHFDQUFoQztBQUNEOztBQUVELE1BQUl1RSxNQUFNbkYsSUFBSVksTUFBZDtBQUNBLE1BQUkrQixVQUFVd0MsR0FBZCxFQUNFOztBQUVGLE1BQUl1QixHQUFKO0FBQ0EsTUFBSUQsWUFBSixFQUFrQjtBQUNoQixRQUFJOUQsU0FBUyxDQUFULEdBQWF3QyxHQUFqQixFQUNFdUIsTUFBTTFHLElBQUkyQyxTQUFTLENBQWIsS0FBbUIsRUFBekI7QUFDRixRQUFJQSxTQUFTLENBQVQsR0FBYXdDLEdBQWpCLEVBQ0V1QixPQUFPMUcsSUFBSTJDLFNBQVMsQ0FBYixLQUFtQixDQUExQjtBQUNGK0QsV0FBTzFHLElBQUkyQyxNQUFKLENBQVA7QUFDQSxRQUFJQSxTQUFTLENBQVQsR0FBYXdDLEdBQWpCLEVBQ0V1QixNQUFNQSxPQUFPMUcsSUFBSTJDLFNBQVMsQ0FBYixLQUFtQixFQUFuQixLQUEwQixDQUFqQyxDQUFOO0FBQ0gsR0FSRCxNQVFPO0FBQ0wsUUFBSUEsU0FBUyxDQUFULEdBQWF3QyxHQUFqQixFQUNFdUIsTUFBTTFHLElBQUkyQyxTQUFTLENBQWIsS0FBbUIsRUFBekI7QUFDRixRQUFJQSxTQUFTLENBQVQsR0FBYXdDLEdBQWpCLEVBQ0V1QixPQUFPMUcsSUFBSTJDLFNBQVMsQ0FBYixLQUFtQixDQUExQjtBQUNGLFFBQUlBLFNBQVMsQ0FBVCxHQUFhd0MsR0FBakIsRUFDRXVCLE9BQU8xRyxJQUFJMkMsU0FBUyxDQUFiLENBQVA7QUFDRitELFVBQU1BLE9BQU8xRyxJQUFJMkMsTUFBSixLQUFlLEVBQWYsS0FBc0IsQ0FBN0IsQ0FBTjtBQUNEO0FBQ0QsU0FBTytELEdBQVA7QUFDRDs7QUFFRC9HLE9BQU9rRSxTQUFQLENBQWlCaUQsWUFBakIsR0FBZ0MsVUFBVW5FLE1BQVYsRUFBa0I0RCxRQUFsQixFQUE0QjtBQUMxRCxTQUFPTSxZQUFZLElBQVosRUFBa0JsRSxNQUFsQixFQUEwQixJQUExQixFQUFnQzRELFFBQWhDLENBQVA7QUFDRCxDQUZEOztBQUlBNUcsT0FBT2tFLFNBQVAsQ0FBaUJrRCxZQUFqQixHQUFnQyxVQUFVcEUsTUFBVixFQUFrQjRELFFBQWxCLEVBQTRCO0FBQzFELFNBQU9NLFlBQVksSUFBWixFQUFrQmxFLE1BQWxCLEVBQTBCLEtBQTFCLEVBQWlDNEQsUUFBakMsQ0FBUDtBQUNELENBRkQ7O0FBSUE1RyxPQUFPa0UsU0FBUCxDQUFpQm1ELFFBQWpCLEdBQTRCLFVBQVVyRSxNQUFWLEVBQWtCNEQsUUFBbEIsRUFBNEI7QUFDdEQsTUFBSSxDQUFDQSxRQUFMLEVBQWU7QUFDYm5FLFdBQU9PLFdBQVdmLFNBQVgsSUFBd0JlLFdBQVcsSUFBMUMsRUFDSSxnQkFESjtBQUVBUCxXQUFPTyxTQUFTLEtBQUsvQixNQUFyQixFQUE2QixxQ0FBN0I7QUFDRDs7QUFFRCxNQUFJK0IsVUFBVSxLQUFLL0IsTUFBbkIsRUFDRTs7QUFFRixNQUFJcUcsTUFBTSxLQUFLdEUsTUFBTCxJQUFlLElBQXpCO0FBQ0EsTUFBSXNFLEdBQUosRUFDRSxPQUFPLENBQUMsT0FBTyxLQUFLdEUsTUFBTCxDQUFQLEdBQXNCLENBQXZCLElBQTRCLENBQUMsQ0FBcEMsQ0FERixLQUdFLE9BQU8sS0FBS0EsTUFBTCxDQUFQO0FBQ0gsQ0FmRDs7QUFpQkEsU0FBU3VFLFVBQVQsQ0FBcUJsSCxHQUFyQixFQUEwQjJDLE1BQTFCLEVBQWtDOEQsWUFBbEMsRUFBZ0RGLFFBQWhELEVBQTBEO0FBQ3hELE1BQUksQ0FBQ0EsUUFBTCxFQUFlO0FBQ2JuRSxXQUFPLE9BQU9xRSxZQUFQLEtBQXdCLFNBQS9CLEVBQTBDLDJCQUExQztBQUNBckUsV0FBT08sV0FBV2YsU0FBWCxJQUF3QmUsV0FBVyxJQUExQyxFQUFnRCxnQkFBaEQ7QUFDQVAsV0FBT08sU0FBUyxDQUFULEdBQWEzQyxJQUFJWSxNQUF4QixFQUFnQyxxQ0FBaEM7QUFDRDs7QUFFRCxNQUFJdUUsTUFBTW5GLElBQUlZLE1BQWQ7QUFDQSxNQUFJK0IsVUFBVXdDLEdBQWQsRUFDRTs7QUFFRixNQUFJdUIsTUFBTUYsWUFBWXhHLEdBQVosRUFBaUIyQyxNQUFqQixFQUF5QjhELFlBQXpCLEVBQXVDLElBQXZDLENBQVY7QUFDQSxNQUFJUSxNQUFNUCxNQUFNLE1BQWhCO0FBQ0EsTUFBSU8sR0FBSixFQUNFLE9BQU8sQ0FBQyxTQUFTUCxHQUFULEdBQWUsQ0FBaEIsSUFBcUIsQ0FBQyxDQUE3QixDQURGLEtBR0UsT0FBT0EsR0FBUDtBQUNIOztBQUVEL0csT0FBT2tFLFNBQVAsQ0FBaUJzRCxXQUFqQixHQUErQixVQUFVeEUsTUFBVixFQUFrQjRELFFBQWxCLEVBQTRCO0FBQ3pELFNBQU9XLFdBQVcsSUFBWCxFQUFpQnZFLE1BQWpCLEVBQXlCLElBQXpCLEVBQStCNEQsUUFBL0IsQ0FBUDtBQUNELENBRkQ7O0FBSUE1RyxPQUFPa0UsU0FBUCxDQUFpQnVELFdBQWpCLEdBQStCLFVBQVV6RSxNQUFWLEVBQWtCNEQsUUFBbEIsRUFBNEI7QUFDekQsU0FBT1csV0FBVyxJQUFYLEVBQWlCdkUsTUFBakIsRUFBeUIsS0FBekIsRUFBZ0M0RCxRQUFoQyxDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxTQUFTYyxVQUFULENBQXFCckgsR0FBckIsRUFBMEIyQyxNQUExQixFQUFrQzhELFlBQWxDLEVBQWdERixRQUFoRCxFQUEwRDtBQUN4RCxNQUFJLENBQUNBLFFBQUwsRUFBZTtBQUNibkUsV0FBTyxPQUFPcUUsWUFBUCxLQUF3QixTQUEvQixFQUEwQywyQkFBMUM7QUFDQXJFLFdBQU9PLFdBQVdmLFNBQVgsSUFBd0JlLFdBQVcsSUFBMUMsRUFBZ0QsZ0JBQWhEO0FBQ0FQLFdBQU9PLFNBQVMsQ0FBVCxHQUFhM0MsSUFBSVksTUFBeEIsRUFBZ0MscUNBQWhDO0FBQ0Q7O0FBRUQsTUFBSXVFLE1BQU1uRixJQUFJWSxNQUFkO0FBQ0EsTUFBSStCLFVBQVV3QyxHQUFkLEVBQ0U7O0FBRUYsTUFBSXVCLE1BQU1HLFlBQVk3RyxHQUFaLEVBQWlCMkMsTUFBakIsRUFBeUI4RCxZQUF6QixFQUF1QyxJQUF2QyxDQUFWO0FBQ0EsTUFBSVEsTUFBTVAsTUFBTSxVQUFoQjtBQUNBLE1BQUlPLEdBQUosRUFDRSxPQUFPLENBQUMsYUFBYVAsR0FBYixHQUFtQixDQUFwQixJQUF5QixDQUFDLENBQWpDLENBREYsS0FHRSxPQUFPQSxHQUFQO0FBQ0g7O0FBRUQvRyxPQUFPa0UsU0FBUCxDQUFpQnlELFdBQWpCLEdBQStCLFVBQVUzRSxNQUFWLEVBQWtCNEQsUUFBbEIsRUFBNEI7QUFDekQsU0FBT2MsV0FBVyxJQUFYLEVBQWlCMUUsTUFBakIsRUFBeUIsSUFBekIsRUFBK0I0RCxRQUEvQixDQUFQO0FBQ0QsQ0FGRDs7QUFJQTVHLE9BQU9rRSxTQUFQLENBQWlCMEQsV0FBakIsR0FBK0IsVUFBVTVFLE1BQVYsRUFBa0I0RCxRQUFsQixFQUE0QjtBQUN6RCxTQUFPYyxXQUFXLElBQVgsRUFBaUIxRSxNQUFqQixFQUF5QixLQUF6QixFQUFnQzRELFFBQWhDLENBQVA7QUFDRCxDQUZEOztBQUlBLFNBQVNpQixVQUFULENBQXFCeEgsR0FBckIsRUFBMEIyQyxNQUExQixFQUFrQzhELFlBQWxDLEVBQWdERixRQUFoRCxFQUEwRDtBQUN4RCxNQUFJLENBQUNBLFFBQUwsRUFBZTtBQUNibkUsV0FBTyxPQUFPcUUsWUFBUCxLQUF3QixTQUEvQixFQUEwQywyQkFBMUM7QUFDQXJFLFdBQU9PLFNBQVMsQ0FBVCxHQUFhM0MsSUFBSVksTUFBeEIsRUFBZ0MscUNBQWhDO0FBQ0Q7O0FBRUQsU0FBT25CLFFBQVFnSSxJQUFSLENBQWF6SCxHQUFiLEVBQWtCMkMsTUFBbEIsRUFBMEI4RCxZQUExQixFQUF3QyxFQUF4QyxFQUE0QyxDQUE1QyxDQUFQO0FBQ0Q7O0FBRUQ5RyxPQUFPa0UsU0FBUCxDQUFpQjZELFdBQWpCLEdBQStCLFVBQVUvRSxNQUFWLEVBQWtCNEQsUUFBbEIsRUFBNEI7QUFDekQsU0FBT2lCLFdBQVcsSUFBWCxFQUFpQjdFLE1BQWpCLEVBQXlCLElBQXpCLEVBQStCNEQsUUFBL0IsQ0FBUDtBQUNELENBRkQ7O0FBSUE1RyxPQUFPa0UsU0FBUCxDQUFpQjhELFdBQWpCLEdBQStCLFVBQVVoRixNQUFWLEVBQWtCNEQsUUFBbEIsRUFBNEI7QUFDekQsU0FBT2lCLFdBQVcsSUFBWCxFQUFpQjdFLE1BQWpCLEVBQXlCLEtBQXpCLEVBQWdDNEQsUUFBaEMsQ0FBUDtBQUNELENBRkQ7O0FBSUEsU0FBU3FCLFdBQVQsQ0FBc0I1SCxHQUF0QixFQUEyQjJDLE1BQTNCLEVBQW1DOEQsWUFBbkMsRUFBaURGLFFBQWpELEVBQTJEO0FBQ3pELE1BQUksQ0FBQ0EsUUFBTCxFQUFlO0FBQ2JuRSxXQUFPLE9BQU9xRSxZQUFQLEtBQXdCLFNBQS9CLEVBQTBDLDJCQUExQztBQUNBckUsV0FBT08sU0FBUyxDQUFULEdBQWEzQyxJQUFJWSxNQUF4QixFQUFnQyxxQ0FBaEM7QUFDRDs7QUFFRCxTQUFPbkIsUUFBUWdJLElBQVIsQ0FBYXpILEdBQWIsRUFBa0IyQyxNQUFsQixFQUEwQjhELFlBQTFCLEVBQXdDLEVBQXhDLEVBQTRDLENBQTVDLENBQVA7QUFDRDs7QUFFRDlHLE9BQU9rRSxTQUFQLENBQWlCZ0UsWUFBakIsR0FBZ0MsVUFBVWxGLE1BQVYsRUFBa0I0RCxRQUFsQixFQUE0QjtBQUMxRCxTQUFPcUIsWUFBWSxJQUFaLEVBQWtCakYsTUFBbEIsRUFBMEIsSUFBMUIsRUFBZ0M0RCxRQUFoQyxDQUFQO0FBQ0QsQ0FGRDs7QUFJQTVHLE9BQU9rRSxTQUFQLENBQWlCaUUsWUFBakIsR0FBZ0MsVUFBVW5GLE1BQVYsRUFBa0I0RCxRQUFsQixFQUE0QjtBQUMxRCxTQUFPcUIsWUFBWSxJQUFaLEVBQWtCakYsTUFBbEIsRUFBMEIsS0FBMUIsRUFBaUM0RCxRQUFqQyxDQUFQO0FBQ0QsQ0FGRDs7QUFJQTVHLE9BQU9rRSxTQUFQLENBQWlCeUMsVUFBakIsR0FBOEIsVUFBVXlCLEtBQVYsRUFBaUJwRixNQUFqQixFQUF5QjRELFFBQXpCLEVBQW1DO0FBQy9ELE1BQUksQ0FBQ0EsUUFBTCxFQUFlO0FBQ2JuRSxXQUFPMkYsVUFBVW5HLFNBQVYsSUFBdUJtRyxVQUFVLElBQXhDLEVBQThDLGVBQTlDO0FBQ0EzRixXQUFPTyxXQUFXZixTQUFYLElBQXdCZSxXQUFXLElBQTFDLEVBQWdELGdCQUFoRDtBQUNBUCxXQUFPTyxTQUFTLEtBQUsvQixNQUFyQixFQUE2QixzQ0FBN0I7QUFDQW9ILGNBQVVELEtBQVYsRUFBaUIsSUFBakI7QUFDRDs7QUFFRCxNQUFJcEYsVUFBVSxLQUFLL0IsTUFBbkIsRUFBMkI7O0FBRTNCLE9BQUsrQixNQUFMLElBQWVvRixLQUFmO0FBQ0QsQ0FYRDs7QUFhQSxTQUFTRSxZQUFULENBQXVCakksR0FBdkIsRUFBNEIrSCxLQUE1QixFQUFtQ3BGLE1BQW5DLEVBQTJDOEQsWUFBM0MsRUFBeURGLFFBQXpELEVBQW1FO0FBQ2pFLE1BQUksQ0FBQ0EsUUFBTCxFQUFlO0FBQ2JuRSxXQUFPMkYsVUFBVW5HLFNBQVYsSUFBdUJtRyxVQUFVLElBQXhDLEVBQThDLGVBQTlDO0FBQ0EzRixXQUFPLE9BQU9xRSxZQUFQLEtBQXdCLFNBQS9CLEVBQTBDLDJCQUExQztBQUNBckUsV0FBT08sV0FBV2YsU0FBWCxJQUF3QmUsV0FBVyxJQUExQyxFQUFnRCxnQkFBaEQ7QUFDQVAsV0FBT08sU0FBUyxDQUFULEdBQWEzQyxJQUFJWSxNQUF4QixFQUFnQyxzQ0FBaEM7QUFDQW9ILGNBQVVELEtBQVYsRUFBaUIsTUFBakI7QUFDRDs7QUFFRCxNQUFJNUMsTUFBTW5GLElBQUlZLE1BQWQ7QUFDQSxNQUFJK0IsVUFBVXdDLEdBQWQsRUFDRTs7QUFFRixPQUFLLElBQUlqRSxJQUFJLENBQVIsRUFBV2dILElBQUkzQyxLQUFLQyxHQUFMLENBQVNMLE1BQU14QyxNQUFmLEVBQXVCLENBQXZCLENBQXBCLEVBQStDekIsSUFBSWdILENBQW5ELEVBQXNEaEgsR0FBdEQsRUFBMkQ7QUFDekRsQixRQUFJMkMsU0FBU3pCLENBQWIsSUFDSSxDQUFDNkcsUUFBUyxRQUFTLEtBQUt0QixlQUFldkYsQ0FBZixHQUFtQixJQUFJQSxDQUE1QixDQUFuQixNQUNJLENBQUN1RixlQUFldkYsQ0FBZixHQUFtQixJQUFJQSxDQUF4QixJQUE2QixDQUZyQztBQUdEO0FBQ0Y7O0FBRUR2QixPQUFPa0UsU0FBUCxDQUFpQnNFLGFBQWpCLEdBQWlDLFVBQVVKLEtBQVYsRUFBaUJwRixNQUFqQixFQUF5QjRELFFBQXpCLEVBQW1DO0FBQ2xFMEIsZUFBYSxJQUFiLEVBQW1CRixLQUFuQixFQUEwQnBGLE1BQTFCLEVBQWtDLElBQWxDLEVBQXdDNEQsUUFBeEM7QUFDRCxDQUZEOztBQUlBNUcsT0FBT2tFLFNBQVAsQ0FBaUJ1RSxhQUFqQixHQUFpQyxVQUFVTCxLQUFWLEVBQWlCcEYsTUFBakIsRUFBeUI0RCxRQUF6QixFQUFtQztBQUNsRTBCLGVBQWEsSUFBYixFQUFtQkYsS0FBbkIsRUFBMEJwRixNQUExQixFQUFrQyxLQUFsQyxFQUF5QzRELFFBQXpDO0FBQ0QsQ0FGRDs7QUFJQSxTQUFTOEIsWUFBVCxDQUF1QnJJLEdBQXZCLEVBQTRCK0gsS0FBNUIsRUFBbUNwRixNQUFuQyxFQUEyQzhELFlBQTNDLEVBQXlERixRQUF6RCxFQUFtRTtBQUNqRSxNQUFJLENBQUNBLFFBQUwsRUFBZTtBQUNibkUsV0FBTzJGLFVBQVVuRyxTQUFWLElBQXVCbUcsVUFBVSxJQUF4QyxFQUE4QyxlQUE5QztBQUNBM0YsV0FBTyxPQUFPcUUsWUFBUCxLQUF3QixTQUEvQixFQUEwQywyQkFBMUM7QUFDQXJFLFdBQU9PLFdBQVdmLFNBQVgsSUFBd0JlLFdBQVcsSUFBMUMsRUFBZ0QsZ0JBQWhEO0FBQ0FQLFdBQU9PLFNBQVMsQ0FBVCxHQUFhM0MsSUFBSVksTUFBeEIsRUFBZ0Msc0NBQWhDO0FBQ0FvSCxjQUFVRCxLQUFWLEVBQWlCLFVBQWpCO0FBQ0Q7O0FBRUQsTUFBSTVDLE1BQU1uRixJQUFJWSxNQUFkO0FBQ0EsTUFBSStCLFVBQVV3QyxHQUFkLEVBQ0U7O0FBRUYsT0FBSyxJQUFJakUsSUFBSSxDQUFSLEVBQVdnSCxJQUFJM0MsS0FBS0MsR0FBTCxDQUFTTCxNQUFNeEMsTUFBZixFQUF1QixDQUF2QixDQUFwQixFQUErQ3pCLElBQUlnSCxDQUFuRCxFQUFzRGhILEdBQXRELEVBQTJEO0FBQ3pEbEIsUUFBSTJDLFNBQVN6QixDQUFiLElBQ0s2RyxVQUFVLENBQUN0QixlQUFldkYsQ0FBZixHQUFtQixJQUFJQSxDQUF4QixJQUE2QixDQUF4QyxHQUE2QyxJQURqRDtBQUVEO0FBQ0Y7O0FBRUR2QixPQUFPa0UsU0FBUCxDQUFpQnlFLGFBQWpCLEdBQWlDLFVBQVVQLEtBQVYsRUFBaUJwRixNQUFqQixFQUF5QjRELFFBQXpCLEVBQW1DO0FBQ2xFOEIsZUFBYSxJQUFiLEVBQW1CTixLQUFuQixFQUEwQnBGLE1BQTFCLEVBQWtDLElBQWxDLEVBQXdDNEQsUUFBeEM7QUFDRCxDQUZEOztBQUlBNUcsT0FBT2tFLFNBQVAsQ0FBaUIwRSxhQUFqQixHQUFpQyxVQUFVUixLQUFWLEVBQWlCcEYsTUFBakIsRUFBeUI0RCxRQUF6QixFQUFtQztBQUNsRThCLGVBQWEsSUFBYixFQUFtQk4sS0FBbkIsRUFBMEJwRixNQUExQixFQUFrQyxLQUFsQyxFQUF5QzRELFFBQXpDO0FBQ0QsQ0FGRDs7QUFJQTVHLE9BQU9rRSxTQUFQLENBQWlCMkUsU0FBakIsR0FBNkIsVUFBVVQsS0FBVixFQUFpQnBGLE1BQWpCLEVBQXlCNEQsUUFBekIsRUFBbUM7QUFDOUQsTUFBSSxDQUFDQSxRQUFMLEVBQWU7QUFDYm5FLFdBQU8yRixVQUFVbkcsU0FBVixJQUF1Qm1HLFVBQVUsSUFBeEMsRUFBOEMsZUFBOUM7QUFDQTNGLFdBQU9PLFdBQVdmLFNBQVgsSUFBd0JlLFdBQVcsSUFBMUMsRUFBZ0QsZ0JBQWhEO0FBQ0FQLFdBQU9PLFNBQVMsS0FBSy9CLE1BQXJCLEVBQTZCLHNDQUE3QjtBQUNBNkgsY0FBVVYsS0FBVixFQUFpQixJQUFqQixFQUF1QixDQUFDLElBQXhCO0FBQ0Q7O0FBRUQsTUFBSXBGLFVBQVUsS0FBSy9CLE1BQW5CLEVBQ0U7O0FBRUYsTUFBSW1ILFNBQVMsQ0FBYixFQUNFLEtBQUt6QixVQUFMLENBQWdCeUIsS0FBaEIsRUFBdUJwRixNQUF2QixFQUErQjRELFFBQS9CLEVBREYsS0FHRSxLQUFLRCxVQUFMLENBQWdCLE9BQU95QixLQUFQLEdBQWUsQ0FBL0IsRUFBa0NwRixNQUFsQyxFQUEwQzRELFFBQTFDO0FBQ0gsQ0FmRDs7QUFpQkEsU0FBU21DLFdBQVQsQ0FBc0IxSSxHQUF0QixFQUEyQitILEtBQTNCLEVBQWtDcEYsTUFBbEMsRUFBMEM4RCxZQUExQyxFQUF3REYsUUFBeEQsRUFBa0U7QUFDaEUsTUFBSSxDQUFDQSxRQUFMLEVBQWU7QUFDYm5FLFdBQU8yRixVQUFVbkcsU0FBVixJQUF1Qm1HLFVBQVUsSUFBeEMsRUFBOEMsZUFBOUM7QUFDQTNGLFdBQU8sT0FBT3FFLFlBQVAsS0FBd0IsU0FBL0IsRUFBMEMsMkJBQTFDO0FBQ0FyRSxXQUFPTyxXQUFXZixTQUFYLElBQXdCZSxXQUFXLElBQTFDLEVBQWdELGdCQUFoRDtBQUNBUCxXQUFPTyxTQUFTLENBQVQsR0FBYTNDLElBQUlZLE1BQXhCLEVBQWdDLHNDQUFoQztBQUNBNkgsY0FBVVYsS0FBVixFQUFpQixNQUFqQixFQUF5QixDQUFDLE1BQTFCO0FBQ0Q7O0FBRUQsTUFBSTVDLE1BQU1uRixJQUFJWSxNQUFkO0FBQ0EsTUFBSStCLFVBQVV3QyxHQUFkLEVBQ0U7O0FBRUYsTUFBSTRDLFNBQVMsQ0FBYixFQUNFRSxhQUFhakksR0FBYixFQUFrQitILEtBQWxCLEVBQXlCcEYsTUFBekIsRUFBaUM4RCxZQUFqQyxFQUErQ0YsUUFBL0MsRUFERixLQUdFMEIsYUFBYWpJLEdBQWIsRUFBa0IsU0FBUytILEtBQVQsR0FBaUIsQ0FBbkMsRUFBc0NwRixNQUF0QyxFQUE4QzhELFlBQTlDLEVBQTRERixRQUE1RDtBQUNIOztBQUVENUcsT0FBT2tFLFNBQVAsQ0FBaUI4RSxZQUFqQixHQUFnQyxVQUFVWixLQUFWLEVBQWlCcEYsTUFBakIsRUFBeUI0RCxRQUF6QixFQUFtQztBQUNqRW1DLGNBQVksSUFBWixFQUFrQlgsS0FBbEIsRUFBeUJwRixNQUF6QixFQUFpQyxJQUFqQyxFQUF1QzRELFFBQXZDO0FBQ0QsQ0FGRDs7QUFJQTVHLE9BQU9rRSxTQUFQLENBQWlCK0UsWUFBakIsR0FBZ0MsVUFBVWIsS0FBVixFQUFpQnBGLE1BQWpCLEVBQXlCNEQsUUFBekIsRUFBbUM7QUFDakVtQyxjQUFZLElBQVosRUFBa0JYLEtBQWxCLEVBQXlCcEYsTUFBekIsRUFBaUMsS0FBakMsRUFBd0M0RCxRQUF4QztBQUNELENBRkQ7O0FBSUEsU0FBU3NDLFdBQVQsQ0FBc0I3SSxHQUF0QixFQUEyQitILEtBQTNCLEVBQWtDcEYsTUFBbEMsRUFBMEM4RCxZQUExQyxFQUF3REYsUUFBeEQsRUFBa0U7QUFDaEUsTUFBSSxDQUFDQSxRQUFMLEVBQWU7QUFDYm5FLFdBQU8yRixVQUFVbkcsU0FBVixJQUF1Qm1HLFVBQVUsSUFBeEMsRUFBOEMsZUFBOUM7QUFDQTNGLFdBQU8sT0FBT3FFLFlBQVAsS0FBd0IsU0FBL0IsRUFBMEMsMkJBQTFDO0FBQ0FyRSxXQUFPTyxXQUFXZixTQUFYLElBQXdCZSxXQUFXLElBQTFDLEVBQWdELGdCQUFoRDtBQUNBUCxXQUFPTyxTQUFTLENBQVQsR0FBYTNDLElBQUlZLE1BQXhCLEVBQWdDLHNDQUFoQztBQUNBNkgsY0FBVVYsS0FBVixFQUFpQixVQUFqQixFQUE2QixDQUFDLFVBQTlCO0FBQ0Q7O0FBRUQsTUFBSTVDLE1BQU1uRixJQUFJWSxNQUFkO0FBQ0EsTUFBSStCLFVBQVV3QyxHQUFkLEVBQ0U7O0FBRUYsTUFBSTRDLFNBQVMsQ0FBYixFQUNFTSxhQUFhckksR0FBYixFQUFrQitILEtBQWxCLEVBQXlCcEYsTUFBekIsRUFBaUM4RCxZQUFqQyxFQUErQ0YsUUFBL0MsRUFERixLQUdFOEIsYUFBYXJJLEdBQWIsRUFBa0IsYUFBYStILEtBQWIsR0FBcUIsQ0FBdkMsRUFBMENwRixNQUExQyxFQUFrRDhELFlBQWxELEVBQWdFRixRQUFoRTtBQUNIOztBQUVENUcsT0FBT2tFLFNBQVAsQ0FBaUJpRixZQUFqQixHQUFnQyxVQUFVZixLQUFWLEVBQWlCcEYsTUFBakIsRUFBeUI0RCxRQUF6QixFQUFtQztBQUNqRXNDLGNBQVksSUFBWixFQUFrQmQsS0FBbEIsRUFBeUJwRixNQUF6QixFQUFpQyxJQUFqQyxFQUF1QzRELFFBQXZDO0FBQ0QsQ0FGRDs7QUFJQTVHLE9BQU9rRSxTQUFQLENBQWlCa0YsWUFBakIsR0FBZ0MsVUFBVWhCLEtBQVYsRUFBaUJwRixNQUFqQixFQUF5QjRELFFBQXpCLEVBQW1DO0FBQ2pFc0MsY0FBWSxJQUFaLEVBQWtCZCxLQUFsQixFQUF5QnBGLE1BQXpCLEVBQWlDLEtBQWpDLEVBQXdDNEQsUUFBeEM7QUFDRCxDQUZEOztBQUlBLFNBQVN5QyxXQUFULENBQXNCaEosR0FBdEIsRUFBMkIrSCxLQUEzQixFQUFrQ3BGLE1BQWxDLEVBQTBDOEQsWUFBMUMsRUFBd0RGLFFBQXhELEVBQWtFO0FBQ2hFLE1BQUksQ0FBQ0EsUUFBTCxFQUFlO0FBQ2JuRSxXQUFPMkYsVUFBVW5HLFNBQVYsSUFBdUJtRyxVQUFVLElBQXhDLEVBQThDLGVBQTlDO0FBQ0EzRixXQUFPLE9BQU9xRSxZQUFQLEtBQXdCLFNBQS9CLEVBQTBDLDJCQUExQztBQUNBckUsV0FBT08sV0FBV2YsU0FBWCxJQUF3QmUsV0FBVyxJQUExQyxFQUFnRCxnQkFBaEQ7QUFDQVAsV0FBT08sU0FBUyxDQUFULEdBQWEzQyxJQUFJWSxNQUF4QixFQUFnQyxzQ0FBaEM7QUFDQXFJLGlCQUFhbEIsS0FBYixFQUFvQixzQkFBcEIsRUFBNEMsQ0FBQyxzQkFBN0M7QUFDRDs7QUFFRCxNQUFJNUMsTUFBTW5GLElBQUlZLE1BQWQ7QUFDQSxNQUFJK0IsVUFBVXdDLEdBQWQsRUFDRTs7QUFFRjFGLFVBQVE4QixLQUFSLENBQWN2QixHQUFkLEVBQW1CK0gsS0FBbkIsRUFBMEJwRixNQUExQixFQUFrQzhELFlBQWxDLEVBQWdELEVBQWhELEVBQW9ELENBQXBEO0FBQ0Q7O0FBRUQ5RyxPQUFPa0UsU0FBUCxDQUFpQnFGLFlBQWpCLEdBQWdDLFVBQVVuQixLQUFWLEVBQWlCcEYsTUFBakIsRUFBeUI0RCxRQUF6QixFQUFtQztBQUNqRXlDLGNBQVksSUFBWixFQUFrQmpCLEtBQWxCLEVBQXlCcEYsTUFBekIsRUFBaUMsSUFBakMsRUFBdUM0RCxRQUF2QztBQUNELENBRkQ7O0FBSUE1RyxPQUFPa0UsU0FBUCxDQUFpQnNGLFlBQWpCLEdBQWdDLFVBQVVwQixLQUFWLEVBQWlCcEYsTUFBakIsRUFBeUI0RCxRQUF6QixFQUFtQztBQUNqRXlDLGNBQVksSUFBWixFQUFrQmpCLEtBQWxCLEVBQXlCcEYsTUFBekIsRUFBaUMsS0FBakMsRUFBd0M0RCxRQUF4QztBQUNELENBRkQ7O0FBSUEsU0FBUzZDLFlBQVQsQ0FBdUJwSixHQUF2QixFQUE0QitILEtBQTVCLEVBQW1DcEYsTUFBbkMsRUFBMkM4RCxZQUEzQyxFQUF5REYsUUFBekQsRUFBbUU7QUFDakUsTUFBSSxDQUFDQSxRQUFMLEVBQWU7QUFDYm5FLFdBQU8yRixVQUFVbkcsU0FBVixJQUF1Qm1HLFVBQVUsSUFBeEMsRUFBOEMsZUFBOUM7QUFDQTNGLFdBQU8sT0FBT3FFLFlBQVAsS0FBd0IsU0FBL0IsRUFBMEMsMkJBQTFDO0FBQ0FyRSxXQUFPTyxXQUFXZixTQUFYLElBQXdCZSxXQUFXLElBQTFDLEVBQWdELGdCQUFoRDtBQUNBUCxXQUFPTyxTQUFTLENBQVQsR0FBYTNDLElBQUlZLE1BQXhCLEVBQ0ksc0NBREo7QUFFQXFJLGlCQUFhbEIsS0FBYixFQUFvQix1QkFBcEIsRUFBNkMsQ0FBQyx1QkFBOUM7QUFDRDs7QUFFRCxNQUFJNUMsTUFBTW5GLElBQUlZLE1BQWQ7QUFDQSxNQUFJK0IsVUFBVXdDLEdBQWQsRUFDRTs7QUFFRjFGLFVBQVE4QixLQUFSLENBQWN2QixHQUFkLEVBQW1CK0gsS0FBbkIsRUFBMEJwRixNQUExQixFQUFrQzhELFlBQWxDLEVBQWdELEVBQWhELEVBQW9ELENBQXBEO0FBQ0Q7O0FBRUQ5RyxPQUFPa0UsU0FBUCxDQUFpQndGLGFBQWpCLEdBQWlDLFVBQVV0QixLQUFWLEVBQWlCcEYsTUFBakIsRUFBeUI0RCxRQUF6QixFQUFtQztBQUNsRTZDLGVBQWEsSUFBYixFQUFtQnJCLEtBQW5CLEVBQTBCcEYsTUFBMUIsRUFBa0MsSUFBbEMsRUFBd0M0RCxRQUF4QztBQUNELENBRkQ7O0FBSUE1RyxPQUFPa0UsU0FBUCxDQUFpQnlGLGFBQWpCLEdBQWlDLFVBQVV2QixLQUFWLEVBQWlCcEYsTUFBakIsRUFBeUI0RCxRQUF6QixFQUFtQztBQUNsRTZDLGVBQWEsSUFBYixFQUFtQnJCLEtBQW5CLEVBQTBCcEYsTUFBMUIsRUFBa0MsS0FBbEMsRUFBeUM0RCxRQUF6QztBQUNELENBRkQ7O0FBSUE7QUFDQTVHLE9BQU9rRSxTQUFQLENBQWlCMEYsSUFBakIsR0FBd0IsVUFBVXhCLEtBQVYsRUFBaUI5RCxLQUFqQixFQUF3QkMsR0FBeEIsRUFBNkI7QUFDbkQsTUFBSSxDQUFDNkQsS0FBTCxFQUFZQSxRQUFRLENBQVI7QUFDWixNQUFJLENBQUM5RCxLQUFMLEVBQVlBLFFBQVEsQ0FBUjtBQUNaLE1BQUksQ0FBQ0MsR0FBTCxFQUFVQSxNQUFNLEtBQUt0RCxNQUFYOztBQUVWLE1BQUksT0FBT21ILEtBQVAsS0FBaUIsUUFBckIsRUFBK0I7QUFDN0JBLFlBQVFBLE1BQU15QixVQUFOLENBQWlCLENBQWpCLENBQVI7QUFDRDs7QUFFRHBILFNBQU8sT0FBTzJGLEtBQVAsS0FBaUIsUUFBakIsSUFBNkIsQ0FBQzdFLE1BQU02RSxLQUFOLENBQXJDLEVBQW1ELHVCQUFuRDtBQUNBM0YsU0FBTzhCLE9BQU9ELEtBQWQsRUFBcUIsYUFBckI7O0FBRUE7QUFDQSxNQUFJQyxRQUFRRCxLQUFaLEVBQW1CO0FBQ25CLE1BQUksS0FBS3JELE1BQUwsS0FBZ0IsQ0FBcEIsRUFBdUI7O0FBRXZCd0IsU0FBTzZCLFNBQVMsQ0FBVCxJQUFjQSxRQUFRLEtBQUtyRCxNQUFsQyxFQUEwQyxxQkFBMUM7QUFDQXdCLFNBQU84QixPQUFPLENBQVAsSUFBWUEsT0FBTyxLQUFLdEQsTUFBL0IsRUFBdUMsbUJBQXZDOztBQUVBLE9BQUssSUFBSU0sSUFBSStDLEtBQWIsRUFBb0IvQyxJQUFJZ0QsR0FBeEIsRUFBNkJoRCxHQUE3QixFQUFrQztBQUNoQyxTQUFLQSxDQUFMLElBQVU2RyxLQUFWO0FBQ0Q7QUFDRixDQXRCRDs7QUF3QkFwSSxPQUFPa0UsU0FBUCxDQUFpQjRGLE9BQWpCLEdBQTJCLFlBQVk7QUFDckMsTUFBSTlELE1BQU0sRUFBVjtBQUNBLE1BQUlSLE1BQU0sS0FBS3ZFLE1BQWY7QUFDQSxPQUFLLElBQUlNLElBQUksQ0FBYixFQUFnQkEsSUFBSWlFLEdBQXBCLEVBQXlCakUsR0FBekIsRUFBOEI7QUFDNUJ5RSxRQUFJekUsQ0FBSixJQUFTMEUsTUFBTSxLQUFLMUUsQ0FBTCxDQUFOLENBQVQ7QUFDQSxRQUFJQSxNQUFNeEIsUUFBUUcsaUJBQWxCLEVBQXFDO0FBQ25DOEYsVUFBSXpFLElBQUksQ0FBUixJQUFhLEtBQWI7QUFDQTtBQUNEO0FBQ0Y7QUFDRCxTQUFPLGFBQWF5RSxJQUFJK0QsSUFBSixDQUFTLEdBQVQsQ0FBYixHQUE2QixHQUFwQztBQUNELENBWEQ7O0FBYUE7Ozs7QUFJQS9KLE9BQU9rRSxTQUFQLENBQWlCOEYsYUFBakIsR0FBaUMsWUFBWTtBQUMzQyxNQUFJLE9BQU94SixVQUFQLEtBQXNCLFdBQTFCLEVBQXVDO0FBQ3JDLFFBQUlSLE9BQU9JLGVBQVgsRUFBNEI7QUFDMUIsYUFBUSxJQUFJSixNQUFKLENBQVcsSUFBWCxDQUFELENBQW1CaUssTUFBMUI7QUFDRCxLQUZELE1BRU87QUFDTCxVQUFJNUosTUFBTSxJQUFJRyxVQUFKLENBQWUsS0FBS1MsTUFBcEIsQ0FBVjtBQUNBLFdBQUssSUFBSU0sSUFBSSxDQUFSLEVBQVdpRSxNQUFNbkYsSUFBSVksTUFBMUIsRUFBa0NNLElBQUlpRSxHQUF0QyxFQUEyQ2pFLEtBQUssQ0FBaEQ7QUFDRWxCLFlBQUlrQixDQUFKLElBQVMsS0FBS0EsQ0FBTCxDQUFUO0FBREYsT0FFQSxPQUFPbEIsSUFBSTRKLE1BQVg7QUFDRDtBQUNGLEdBVEQsTUFTTztBQUNMLFVBQU0sSUFBSTdJLEtBQUosQ0FBVSxvREFBVixDQUFOO0FBQ0Q7QUFDRixDQWJEOztBQWVBO0FBQ0E7O0FBRUEsU0FBU0osVUFBVCxDQUFxQmtCLEdBQXJCLEVBQTBCO0FBQ3hCLE1BQUlBLElBQUlnSSxJQUFSLEVBQWMsT0FBT2hJLElBQUlnSSxJQUFKLEVBQVA7QUFDZCxTQUFPaEksSUFBSWlJLE9BQUosQ0FBWSxZQUFaLEVBQTBCLEVBQTFCLENBQVA7QUFDRDs7QUFFRCxJQUFJQyxLQUFLcEssT0FBT2tFLFNBQWhCOztBQUVBOzs7QUFHQWxFLE9BQU9xQixRQUFQLEdBQWtCLFVBQVVkLEdBQVYsRUFBZTtBQUMvQkEsTUFBSWUsU0FBSixHQUFnQixJQUFoQjs7QUFFQTtBQUNBZixNQUFJOEosSUFBSixHQUFXOUosSUFBSStGLEdBQWY7QUFDQS9GLE1BQUlpQixJQUFKLEdBQVdqQixJQUFJa0csR0FBZjs7QUFFQTtBQUNBbEcsTUFBSStGLEdBQUosR0FBVThELEdBQUc5RCxHQUFiO0FBQ0EvRixNQUFJa0csR0FBSixHQUFVMkQsR0FBRzNELEdBQWI7O0FBRUFsRyxNQUFJcUIsS0FBSixHQUFZd0ksR0FBR3hJLEtBQWY7QUFDQXJCLE1BQUk4RCxRQUFKLEdBQWUrRixHQUFHL0YsUUFBbEI7QUFDQTlELE1BQUkrSixjQUFKLEdBQXFCRixHQUFHL0YsUUFBeEI7QUFDQTlELE1BQUl3RSxNQUFKLEdBQWFxRixHQUFHckYsTUFBaEI7QUFDQXhFLE1BQUlzQyxJQUFKLEdBQVd1SCxHQUFHdkgsSUFBZDtBQUNBdEMsTUFBSTJFLEtBQUosR0FBWWtGLEdBQUdsRixLQUFmO0FBQ0EzRSxNQUFJb0IsU0FBSixHQUFnQnlJLEdBQUd6SSxTQUFuQjtBQUNBcEIsTUFBSXlHLFlBQUosR0FBbUJvRCxHQUFHcEQsWUFBdEI7QUFDQXpHLE1BQUkwRyxZQUFKLEdBQW1CbUQsR0FBR25ELFlBQXRCO0FBQ0ExRyxNQUFJNEcsWUFBSixHQUFtQmlELEdBQUdqRCxZQUF0QjtBQUNBNUcsTUFBSTZHLFlBQUosR0FBbUJnRCxHQUFHaEQsWUFBdEI7QUFDQTdHLE1BQUk4RyxRQUFKLEdBQWUrQyxHQUFHL0MsUUFBbEI7QUFDQTlHLE1BQUlpSCxXQUFKLEdBQWtCNEMsR0FBRzVDLFdBQXJCO0FBQ0FqSCxNQUFJa0gsV0FBSixHQUFrQjJDLEdBQUczQyxXQUFyQjtBQUNBbEgsTUFBSW9ILFdBQUosR0FBa0J5QyxHQUFHekMsV0FBckI7QUFDQXBILE1BQUlxSCxXQUFKLEdBQWtCd0MsR0FBR3hDLFdBQXJCO0FBQ0FySCxNQUFJd0gsV0FBSixHQUFrQnFDLEdBQUdyQyxXQUFyQjtBQUNBeEgsTUFBSXlILFdBQUosR0FBa0JvQyxHQUFHcEMsV0FBckI7QUFDQXpILE1BQUkySCxZQUFKLEdBQW1Ca0MsR0FBR2xDLFlBQXRCO0FBQ0EzSCxNQUFJNEgsWUFBSixHQUFtQmlDLEdBQUdqQyxZQUF0QjtBQUNBNUgsTUFBSW9HLFVBQUosR0FBaUJ5RCxHQUFHekQsVUFBcEI7QUFDQXBHLE1BQUlpSSxhQUFKLEdBQW9CNEIsR0FBRzVCLGFBQXZCO0FBQ0FqSSxNQUFJa0ksYUFBSixHQUFvQjJCLEdBQUczQixhQUF2QjtBQUNBbEksTUFBSW9JLGFBQUosR0FBb0J5QixHQUFHekIsYUFBdkI7QUFDQXBJLE1BQUlxSSxhQUFKLEdBQW9Cd0IsR0FBR3hCLGFBQXZCO0FBQ0FySSxNQUFJc0ksU0FBSixHQUFnQnVCLEdBQUd2QixTQUFuQjtBQUNBdEksTUFBSXlJLFlBQUosR0FBbUJvQixHQUFHcEIsWUFBdEI7QUFDQXpJLE1BQUkwSSxZQUFKLEdBQW1CbUIsR0FBR25CLFlBQXRCO0FBQ0ExSSxNQUFJNEksWUFBSixHQUFtQmlCLEdBQUdqQixZQUF0QjtBQUNBNUksTUFBSTZJLFlBQUosR0FBbUJnQixHQUFHaEIsWUFBdEI7QUFDQTdJLE1BQUlnSixZQUFKLEdBQW1CYSxHQUFHYixZQUF0QjtBQUNBaEosTUFBSWlKLFlBQUosR0FBbUJZLEdBQUdaLFlBQXRCO0FBQ0FqSixNQUFJbUosYUFBSixHQUFvQlUsR0FBR1YsYUFBdkI7QUFDQW5KLE1BQUlvSixhQUFKLEdBQW9CUyxHQUFHVCxhQUF2QjtBQUNBcEosTUFBSXFKLElBQUosR0FBV1EsR0FBR1IsSUFBZDtBQUNBckosTUFBSXVKLE9BQUosR0FBY00sR0FBR04sT0FBakI7QUFDQXZKLE1BQUl5SixhQUFKLEdBQW9CSSxHQUFHSixhQUF2Qjs7QUFFQSxTQUFPekosR0FBUDtBQUNELENBbEREOztBQW9EQTtBQUNBLFNBQVM0RixLQUFULENBQWdCb0UsS0FBaEIsRUFBdUIvRSxHQUF2QixFQUE0QmdGLFlBQTVCLEVBQTBDO0FBQ3hDLE1BQUksT0FBT0QsS0FBUCxLQUFpQixRQUFyQixFQUErQixPQUFPQyxZQUFQO0FBQy9CRCxVQUFRLENBQUMsQ0FBQ0EsS0FBVixDQUZ3QyxDQUV0QjtBQUNsQixNQUFJQSxTQUFTL0UsR0FBYixFQUFrQixPQUFPQSxHQUFQO0FBQ2xCLE1BQUkrRSxTQUFTLENBQWIsRUFBZ0IsT0FBT0EsS0FBUDtBQUNoQkEsV0FBUy9FLEdBQVQ7QUFDQSxNQUFJK0UsU0FBUyxDQUFiLEVBQWdCLE9BQU9BLEtBQVA7QUFDaEIsU0FBTyxDQUFQO0FBQ0Q7O0FBRUQsU0FBU3JKLE1BQVQsQ0FBaUJELE1BQWpCLEVBQXlCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBQSxXQUFTLENBQUMsQ0FBQzJFLEtBQUs2RSxJQUFMLENBQVUsQ0FBQ3hKLE1BQVgsQ0FBWDtBQUNBLFNBQU9BLFNBQVMsQ0FBVCxHQUFhLENBQWIsR0FBaUJBLE1BQXhCO0FBQ0Q7O0FBRUQsU0FBU3lCLE9BQVQsQ0FBa0I5QixPQUFsQixFQUEyQjtBQUN6QixTQUFPLENBQUNxRSxNQUFNdkMsT0FBTixJQUFpQixVQUFVOUIsT0FBVixFQUFtQjtBQUMxQyxXQUFPOEosT0FBT3hHLFNBQVAsQ0FBaUJHLFFBQWpCLENBQTBCYyxJQUExQixDQUErQnZFLE9BQS9CLE1BQTRDLGdCQUFuRDtBQUNELEdBRk0sRUFFSkEsT0FGSSxDQUFQO0FBR0Q7O0FBRUQsU0FBU2EsVUFBVCxDQUFxQmIsT0FBckIsRUFBOEI7QUFDNUIsU0FBTzhCLFFBQVE5QixPQUFSLEtBQW9CWixPQUFPMEIsUUFBUCxDQUFnQmQsT0FBaEIsQ0FBcEIsSUFDSEEsV0FBVyxRQUFPQSxPQUFQLHlDQUFPQSxPQUFQLE9BQW1CLFFBQTlCLElBQ0EsT0FBT0EsUUFBUUssTUFBZixLQUEwQixRQUY5QjtBQUdEOztBQUVELFNBQVNnRixLQUFULENBQWdCMEUsQ0FBaEIsRUFBbUI7QUFDakIsTUFBSUEsSUFBSSxFQUFSLEVBQVksT0FBTyxNQUFNQSxFQUFFdEcsUUFBRixDQUFXLEVBQVgsQ0FBYjtBQUNaLFNBQU9zRyxFQUFFdEcsUUFBRixDQUFXLEVBQVgsQ0FBUDtBQUNEOztBQUVELFNBQVNqQyxXQUFULENBQXNCRixHQUF0QixFQUEyQjtBQUN6QixNQUFJMEksWUFBWSxFQUFoQjtBQUNBLE9BQUssSUFBSXJKLElBQUksQ0FBYixFQUFnQkEsSUFBSVcsSUFBSWpCLE1BQXhCLEVBQWdDTSxHQUFoQyxFQUFxQztBQUNuQyxRQUFJUyxJQUFJRSxJQUFJMkgsVUFBSixDQUFldEksQ0FBZixDQUFSO0FBQ0EsUUFBSVMsS0FBSyxJQUFULEVBQ0U0SSxVQUFVQyxJQUFWLENBQWUzSSxJQUFJMkgsVUFBSixDQUFldEksQ0FBZixDQUFmLEVBREYsS0FFSztBQUNILFVBQUkrQyxRQUFRL0MsQ0FBWjtBQUNBLFVBQUlTLEtBQUssTUFBTCxJQUFlQSxLQUFLLE1BQXhCLEVBQWdDVDtBQUNoQyxVQUFJdUosSUFBSUMsbUJBQW1CN0ksSUFBSWdELEtBQUosQ0FBVVosS0FBVixFQUFpQi9DLElBQUUsQ0FBbkIsQ0FBbkIsRUFBMEMrQixNQUExQyxDQUFpRCxDQUFqRCxFQUFvRDBILEtBQXBELENBQTBELEdBQTFELENBQVI7QUFDQSxXQUFLLElBQUl6QyxJQUFJLENBQWIsRUFBZ0JBLElBQUl1QyxFQUFFN0osTUFBdEIsRUFBOEJzSCxHQUE5QjtBQUNFcUMsa0JBQVVDLElBQVYsQ0FBZXhILFNBQVN5SCxFQUFFdkMsQ0FBRixDQUFULEVBQWUsRUFBZixDQUFmO0FBREY7QUFFRDtBQUNGO0FBQ0QsU0FBT3FDLFNBQVA7QUFDRDs7QUFFRCxTQUFTL0csWUFBVCxDQUF1QjNCLEdBQXZCLEVBQTRCO0FBQzFCLE1BQUkwSSxZQUFZLEVBQWhCO0FBQ0EsT0FBSyxJQUFJckosSUFBSSxDQUFiLEVBQWdCQSxJQUFJVyxJQUFJakIsTUFBeEIsRUFBZ0NNLEdBQWhDLEVBQXFDO0FBQ25DO0FBQ0FxSixjQUFVQyxJQUFWLENBQWUzSSxJQUFJMkgsVUFBSixDQUFldEksQ0FBZixJQUFvQixJQUFuQztBQUNEO0FBQ0QsU0FBT3FKLFNBQVA7QUFDRDs7QUFFRCxTQUFTM0csY0FBVCxDQUF5Qi9CLEdBQXpCLEVBQThCO0FBQzVCLE1BQUkrSSxDQUFKLEVBQU9DLEVBQVAsRUFBV0MsRUFBWDtBQUNBLE1BQUlQLFlBQVksRUFBaEI7QUFDQSxPQUFLLElBQUlySixJQUFJLENBQWIsRUFBZ0JBLElBQUlXLElBQUlqQixNQUF4QixFQUFnQ00sR0FBaEMsRUFBcUM7QUFDbkMwSixRQUFJL0ksSUFBSTJILFVBQUosQ0FBZXRJLENBQWYsQ0FBSjtBQUNBMkosU0FBS0QsS0FBSyxDQUFWO0FBQ0FFLFNBQUtGLElBQUksR0FBVDtBQUNBTCxjQUFVQyxJQUFWLENBQWVNLEVBQWY7QUFDQVAsY0FBVUMsSUFBVixDQUFlSyxFQUFmO0FBQ0Q7O0FBRUQsU0FBT04sU0FBUDtBQUNEOztBQUVELFNBQVN2SSxhQUFULENBQXdCSCxHQUF4QixFQUE2QjtBQUMzQixTQUFPdEMsT0FBT3dMLFdBQVAsQ0FBbUJsSixHQUFuQixDQUFQO0FBQ0Q7O0FBRUQsU0FBU3lCLFVBQVQsQ0FBcUIwSCxHQUFyQixFQUEwQkMsR0FBMUIsRUFBK0J0SSxNQUEvQixFQUF1Qy9CLE1BQXZDLEVBQStDO0FBQzdDLE1BQUkwQixHQUFKO0FBQ0EsT0FBSyxJQUFJcEIsSUFBSSxDQUFiLEVBQWdCQSxJQUFJTixNQUFwQixFQUE0Qk0sR0FBNUIsRUFBaUM7QUFDL0IsUUFBS0EsSUFBSXlCLE1BQUosSUFBY3NJLElBQUlySyxNQUFuQixJQUErQk0sS0FBSzhKLElBQUlwSyxNQUE1QyxFQUNFO0FBQ0ZxSyxRQUFJL0osSUFBSXlCLE1BQVIsSUFBa0JxSSxJQUFJOUosQ0FBSixDQUFsQjtBQUNEO0FBQ0QsU0FBT0EsQ0FBUDtBQUNEOztBQUVELFNBQVN1RSxjQUFULENBQXlCNUQsR0FBekIsRUFBOEI7QUFDNUIsTUFBSTtBQUNGLFdBQU9xSixtQkFBbUJySixHQUFuQixDQUFQO0FBQ0QsR0FGRCxDQUVFLE9BQU9zSixHQUFQLEVBQVk7QUFDWixXQUFPMUosT0FBT2lFLFlBQVAsQ0FBb0IsTUFBcEIsQ0FBUCxDQURZLENBQ3VCO0FBQ3BDO0FBQ0Y7O0FBRUQ7Ozs7O0FBS0EsU0FBU3NDLFNBQVQsQ0FBb0JELEtBQXBCLEVBQTJCcUQsR0FBM0IsRUFBZ0M7QUFDOUJoSixTQUFPLE9BQU8yRixLQUFQLEtBQWlCLFFBQXhCLEVBQWtDLHVDQUFsQztBQUNBM0YsU0FBTzJGLFNBQVMsQ0FBaEIsRUFBbUIsMERBQW5CO0FBQ0EzRixTQUFPMkYsU0FBU3FELEdBQWhCLEVBQXFCLDZDQUFyQjtBQUNBaEosU0FBT21ELEtBQUs4RixLQUFMLENBQVd0RCxLQUFYLE1BQXNCQSxLQUE3QixFQUFvQyxrQ0FBcEM7QUFDRDs7QUFFRCxTQUFTVSxTQUFULENBQW9CVixLQUFwQixFQUEyQnFELEdBQTNCLEVBQWdDNUYsR0FBaEMsRUFBcUM7QUFDbkNwRCxTQUFPLE9BQU8yRixLQUFQLEtBQWlCLFFBQXhCLEVBQWtDLHVDQUFsQztBQUNBM0YsU0FBTzJGLFNBQVNxRCxHQUFoQixFQUFxQix5Q0FBckI7QUFDQWhKLFNBQU8yRixTQUFTdkMsR0FBaEIsRUFBcUIsMENBQXJCO0FBQ0FwRCxTQUFPbUQsS0FBSzhGLEtBQUwsQ0FBV3RELEtBQVgsTUFBc0JBLEtBQTdCLEVBQW9DLGtDQUFwQztBQUNEOztBQUVELFNBQVNrQixZQUFULENBQXVCbEIsS0FBdkIsRUFBOEJxRCxHQUE5QixFQUFtQzVGLEdBQW5DLEVBQXdDO0FBQ3RDcEQsU0FBTyxPQUFPMkYsS0FBUCxLQUFpQixRQUF4QixFQUFrQyx1Q0FBbEM7QUFDQTNGLFNBQU8yRixTQUFTcUQsR0FBaEIsRUFBcUIseUNBQXJCO0FBQ0FoSixTQUFPMkYsU0FBU3ZDLEdBQWhCLEVBQXFCLDBDQUFyQjtBQUNEOztBQUVELFNBQVNwRCxNQUFULENBQWlCa0osSUFBakIsRUFBdUJDLE9BQXZCLEVBQWdDO0FBQzlCLE1BQUksQ0FBQ0QsSUFBTCxFQUFXLE1BQU0sSUFBSXZLLEtBQUosQ0FBVXdLLFdBQVcsa0JBQXJCLENBQU47QUFDWiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTJcblxuLyoqXG4gKiBJZiBgQnVmZmVyLl91c2VUeXBlZEFycmF5c2A6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChjb21wYXRpYmxlIGRvd24gdG8gSUU2KVxuICovXG5CdWZmZXIuX3VzZVR5cGVkQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gRGV0ZWN0IGlmIGJyb3dzZXIgc3VwcG9ydHMgVHlwZWQgQXJyYXlzLiBTdXBwb3J0ZWQgYnJvd3NlcnMgYXJlIElFIDEwKywgRmlyZWZveCA0KyxcbiAgLy8gQ2hyb21lIDcrLCBTYWZhcmkgNS4xKywgT3BlcmEgMTEuNissIGlPUyA0LjIrLiBJZiB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGFkZGluZ1xuICAvLyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsIHRoZW4gdGhhdCdzIHRoZSBzYW1lIGFzIG5vIGBVaW50OEFycmF5YCBzdXBwb3J0XG4gIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBiZSBhYmxlIHRvIGFkZCBhbGwgdGhlIG5vZGUgQnVmZmVyIEFQSSBtZXRob2RzLiBUaGlzIGlzIGFuIGlzc3VlXG4gIC8vIGluIEZpcmVmb3ggNC0yOS4gTm93IGZpeGVkOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzhcbiAgdHJ5IHtcbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKDApXG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAgIHJldHVybiA0MiA9PT0gYXJyLmZvbygpICYmXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgLy8gQ2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufSkoKVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pXG5cbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3ViamVjdFxuXG4gIC8vIFdvcmthcm91bmQ6IG5vZGUncyBiYXNlNjQgaW1wbGVtZW50YXRpb24gYWxsb3dzIGZvciBub24tcGFkZGVkIHN0cmluZ3NcbiAgLy8gd2hpbGUgYmFzZTY0LWpzIGRvZXMgbm90LlxuICBpZiAoZW5jb2RpbmcgPT09ICdiYXNlNjQnICYmIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgc3ViamVjdCA9IHN0cmluZ3RyaW0oc3ViamVjdClcbiAgICB3aGlsZSAoc3ViamVjdC5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgICBzdWJqZWN0ID0gc3ViamVjdCArICc9J1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGxlbmd0aFxuICB2YXIgbGVuZ3RoXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdClcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpXG4gICAgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoc3ViamVjdCwgZW5jb2RpbmcpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0Lmxlbmd0aCkgLy8gYXNzdW1lIHRoYXQgb2JqZWN0IGlzIGFycmF5LWxpa2VcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgbmVlZHMgdG8gYmUgYSBudW1iZXIsIGFycmF5IG9yIHN0cmluZy4nKVxuXG4gIHZhciBidWZcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAvLyBQcmVmZXJyZWQ6IFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgYnVmID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGxlbmd0aCkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBUSElTIGluc3RhbmNlIG9mIEJ1ZmZlciAoY3JlYXRlZCBieSBgbmV3YClcbiAgICBidWYgPSB0aGlzXG4gICAgYnVmLmxlbmd0aCA9IGxlbmd0aFxuICAgIGJ1Zi5faXNCdWZmZXIgPSB0cnVlXG4gIH1cblxuICB2YXIgaVxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiB0eXBlb2Ygc3ViamVjdC5ieXRlTGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgIC8vIFNwZWVkIG9wdGltaXphdGlvbiAtLSB1c2Ugc2V0IGlmIHdlJ3JlIGNvcHlpbmcgZnJvbSBhIHR5cGVkIGFycmF5XG4gICAgYnVmLl9zZXQoc3ViamVjdClcbiAgfSBlbHNlIGlmIChpc0FycmF5aXNoKHN1YmplY3QpKSB7XG4gICAgLy8gVHJlYXQgYXJyYXktaXNoIG9iamVjdHMgYXMgYSBieXRlIGFycmF5XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpKVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0LnJlYWRVSW50OChpKVxuICAgICAgZWxzZVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0W2ldXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgYnVmLndyaXRlKHN1YmplY3QsIDAsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmICFub1plcm8pIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZltpXSA9IDBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbi8vIFNUQVRJQyBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAncmF3JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gKGIpIHtcbiAgcmV0dXJuICEhKGIgIT09IG51bGwgJiYgYiAhPT0gdW5kZWZpbmVkICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHZhciByZXRcbiAgc3RyID0gc3RyICsgJydcbiAgc3dpdGNoIChlbmNvZGluZyB8fCAndXRmOCcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAvIDJcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAncmF3JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IGJhc2U2NFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggKiAyXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBhc3NlcnQoaXNBcnJheShsaXN0KSwgJ1VzYWdlOiBCdWZmZXIuY29uY2F0KGxpc3QsIFt0b3RhbExlbmd0aF0pXFxuJyArXG4gICAgICAnbGlzdCBzaG91bGQgYmUgYW4gQXJyYXkuJylcblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKVxuICB9IGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGxpc3RbMF1cbiAgfVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdG90YWxMZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdG90YWxMZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRvdGFsTGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIodG90YWxMZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldXG4gICAgaXRlbS5jb3B5KGJ1ZiwgcG9zKVxuICAgIHBvcyArPSBpdGVtLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZcbn1cblxuLy8gQlVGRkVSIElOU1RBTkNFIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIF9oZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGFzc2VydChzdHJMZW4gJSAyID09PSAwLCAnSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgYXNzZXJ0KCFpc05hTihieXRlKSwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gYnl0ZVxuICB9XG4gIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gaSAqIDJcbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gX3V0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBfYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2RpbmdcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIG9mZnNldCA9IGxlbmd0aFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG4gIHN0YXJ0ID0gTnVtYmVyKHN0YXJ0KSB8fCAwXG4gIGVuZCA9IChlbmQgIT09IHVuZGVmaW5lZClcbiAgICA/IE51bWJlcihlbmQpXG4gICAgOiBlbmQgPSBzZWxmLmxlbmd0aFxuXG4gIC8vIEZhc3RwYXRoIGVtcHR5IHN0cmluZ3NcbiAgaWYgKGVuZCA9PT0gc3RhcnQpXG4gICAgcmV0dXJuICcnXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh0YXJnZXQsIHRhcmdldF9zdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgc291cmNlID0gdGhpc1xuXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICghdGFyZ2V0X3N0YXJ0KSB0YXJnZXRfc3RhcnQgPSAwXG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgc291cmNlLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnc291cmNlRW5kIDwgc291cmNlU3RhcnQnKVxuICBhc3NlcnQodGFyZ2V0X3N0YXJ0ID49IDAgJiYgdGFyZ2V0X3N0YXJ0IDwgdGFyZ2V0Lmxlbmd0aCxcbiAgICAgICd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCBzb3VyY2UubGVuZ3RoLCAnc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gc291cmNlLmxlbmd0aCwgJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpXG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgPCBlbmQgLSBzdGFydClcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnRcblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAobGVuIDwgMTAwIHx8ICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0X3N0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5fc2V0KHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSwgdGFyZ2V0X3N0YXJ0KVxuICB9XG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gX3V0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXMgPSAnJ1xuICB2YXIgdG1wID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA8PSAweDdGKSB7XG4gICAgICByZXMgKz0gZGVjb2RlVXRmOENoYXIodG1wKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICAgICAgdG1wID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdG1wICs9ICclJyArIGJ1ZltpXS50b1N0cmluZygxNilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzICsgZGVjb2RlVXRmOENoYXIodG1wKVxufVxuXG5mdW5jdGlvbiBfYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspXG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfYXNjaWlTbGljZShidWYsIHN0YXJ0LCBlbmQpXG59XG5cbmZ1bmN0aW9uIF9oZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2krMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gY2xhbXAoc3RhcnQsIGxlbiwgMClcbiAgZW5kID0gY2xhbXAoZW5kLCBsZW4sIGxlbilcblxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIHJldHVybiBCdWZmZXIuX2F1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIHZhciBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQsIHRydWUpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0J1ZlxuICB9XG59XG5cbi8vIGBnZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5nZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLnJlYWRVSW50OChvZmZzZXQpXG59XG5cbi8vIGBzZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh2LCBvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5zZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLndyaXRlVUludDgodiwgb2Zmc2V0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgfSBlbHNlIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAyXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gICAgdmFsIHw9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldCArIDNdIDw8IDI0ID4+PiAwKVxuICB9IGVsc2Uge1xuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDFdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDJdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgM11cbiAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldF0gPDwgMjQgPj4+IDApXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgdmFyIG5lZyA9IHRoaXNbb2Zmc2V0XSAmIDB4ODBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MTYoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDMyKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDAwMDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmZmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEZsb2F0IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRG91YmxlIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZilcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpIHJldHVyblxuXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmZmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmLCAtMHg4MClcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgdGhpcy53cml0ZVVJbnQ4KHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgdGhpcy53cml0ZVVJbnQ4KDB4ZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZiwgLTB4ODAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQxNihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MTYoYnVmLCAweGZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MzIoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgMHhmZmZmZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gdmFsdWUuY2hhckNvZGVBdCgwKVxuICB9XG5cbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKSwgJ3ZhbHVlIGlzIG5vdCBhIG51bWJlcicpXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHRoaXMubGVuZ3RoLCAnc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gdGhpcy5sZW5ndGgsICdlbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB0aGlzW2ldID0gdmFsdWVcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvdXQgPSBbXVxuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG91dFtpXSA9IHRvSGV4KHRoaXNbaV0pXG4gICAgaWYgKGkgPT09IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMpIHtcbiAgICAgIG91dFtpICsgMV0gPSAnLi4uJ1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBvdXQuam9pbignICcpICsgJz4nXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKVxuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IGEgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIFVpbnQ4QXJyYXkgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9pc0J1ZmZlciA9IHRydWVcblxuICAvLyBzYXZlIHJlZmVyZW5jZSB0byBvcmlnaW5hbCBVaW50OEFycmF5IGdldC9zZXQgbWV0aG9kcyBiZWZvcmUgb3ZlcndyaXRpbmdcbiAgYXJyLl9nZXQgPSBhcnIuZ2V0XG4gIGFyci5fc2V0ID0gYXJyLnNldFxuXG4gIC8vIGRlcHJlY2F0ZWQsIHdpbGwgYmUgcmVtb3ZlZCBpbiBub2RlIDAuMTMrXG4gIGFyci5nZXQgPSBCUC5nZXRcbiAgYXJyLnNldCA9IEJQLnNldFxuXG4gIGFyci53cml0ZSA9IEJQLndyaXRlXG4gIGFyci50b1N0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0xvY2FsZVN0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0pTT04gPSBCUC50b0pTT05cbiAgYXJyLmNvcHkgPSBCUC5jb3B5XG4gIGFyci5zbGljZSA9IEJQLnNsaWNlXG4gIGFyci5yZWFkVUludDggPSBCUC5yZWFkVUludDhcbiAgYXJyLnJlYWRVSW50MTZMRSA9IEJQLnJlYWRVSW50MTZMRVxuICBhcnIucmVhZFVJbnQxNkJFID0gQlAucmVhZFVJbnQxNkJFXG4gIGFyci5yZWFkVUludDMyTEUgPSBCUC5yZWFkVUludDMyTEVcbiAgYXJyLnJlYWRVSW50MzJCRSA9IEJQLnJlYWRVSW50MzJCRVxuICBhcnIucmVhZEludDggPSBCUC5yZWFkSW50OFxuICBhcnIucmVhZEludDE2TEUgPSBCUC5yZWFkSW50MTZMRVxuICBhcnIucmVhZEludDE2QkUgPSBCUC5yZWFkSW50MTZCRVxuICBhcnIucmVhZEludDMyTEUgPSBCUC5yZWFkSW50MzJMRVxuICBhcnIucmVhZEludDMyQkUgPSBCUC5yZWFkSW50MzJCRVxuICBhcnIucmVhZEZsb2F0TEUgPSBCUC5yZWFkRmxvYXRMRVxuICBhcnIucmVhZEZsb2F0QkUgPSBCUC5yZWFkRmxvYXRCRVxuICBhcnIucmVhZERvdWJsZUxFID0gQlAucmVhZERvdWJsZUxFXG4gIGFyci5yZWFkRG91YmxlQkUgPSBCUC5yZWFkRG91YmxlQkVcbiAgYXJyLndyaXRlVUludDggPSBCUC53cml0ZVVJbnQ4XG4gIGFyci53cml0ZVVJbnQxNkxFID0gQlAud3JpdGVVSW50MTZMRVxuICBhcnIud3JpdGVVSW50MTZCRSA9IEJQLndyaXRlVUludDE2QkVcbiAgYXJyLndyaXRlVUludDMyTEUgPSBCUC53cml0ZVVJbnQzMkxFXG4gIGFyci53cml0ZVVJbnQzMkJFID0gQlAud3JpdGVVSW50MzJCRVxuICBhcnIud3JpdGVJbnQ4ID0gQlAud3JpdGVJbnQ4XG4gIGFyci53cml0ZUludDE2TEUgPSBCUC53cml0ZUludDE2TEVcbiAgYXJyLndyaXRlSW50MTZCRSA9IEJQLndyaXRlSW50MTZCRVxuICBhcnIud3JpdGVJbnQzMkxFID0gQlAud3JpdGVJbnQzMkxFXG4gIGFyci53cml0ZUludDMyQkUgPSBCUC53cml0ZUludDMyQkVcbiAgYXJyLndyaXRlRmxvYXRMRSA9IEJQLndyaXRlRmxvYXRMRVxuICBhcnIud3JpdGVGbG9hdEJFID0gQlAud3JpdGVGbG9hdEJFXG4gIGFyci53cml0ZURvdWJsZUxFID0gQlAud3JpdGVEb3VibGVMRVxuICBhcnIud3JpdGVEb3VibGVCRSA9IEJQLndyaXRlRG91YmxlQkVcbiAgYXJyLmZpbGwgPSBCUC5maWxsXG4gIGFyci5pbnNwZWN0ID0gQlAuaW5zcGVjdFxuICBhcnIudG9BcnJheUJ1ZmZlciA9IEJQLnRvQXJyYXlCdWZmZXJcblxuICByZXR1cm4gYXJyXG59XG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5mdW5jdGlvbiBjbGFtcCAoaW5kZXgsIGxlbiwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm4gZGVmYXVsdFZhbHVlXG4gIGluZGV4ID0gfn5pbmRleDsgIC8vIENvZXJjZSB0byBpbnRlZ2VyLlxuICBpZiAoaW5kZXggPj0gbGVuKSByZXR1cm4gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgaW5kZXggKz0gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gY29lcmNlIChsZW5ndGgpIHtcbiAgLy8gQ29lcmNlIGxlbmd0aCB0byBhIG51bWJlciAocG9zc2libHkgTmFOKSwgcm91bmQgdXBcbiAgLy8gaW4gY2FzZSBpdCdzIGZyYWN0aW9uYWwgKGUuZy4gMTIzLjQ1NikgdGhlbiBkbyBhXG4gIC8vIGRvdWJsZSBuZWdhdGUgdG8gY29lcmNlIGEgTmFOIHRvIDAuIEVhc3ksIHJpZ2h0P1xuICBsZW5ndGggPSB+fk1hdGguY2VpbCgrbGVuZ3RoKVxuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGhcbn1cblxuZnVuY3Rpb24gaXNBcnJheSAoc3ViamVjdCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHN1YmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN1YmplY3QpID09PSAnW29iamVjdCBBcnJheV0nXG4gIH0pKHN1YmplY3QpXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXlpc2ggKHN1YmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXkoc3ViamVjdCkgfHwgQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpIHx8XG4gICAgICBzdWJqZWN0ICYmIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIHN1YmplY3QubGVuZ3RoID09PSAnbnVtYmVyJ1xufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGIgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChiIDw9IDB4N0YpXG4gICAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBzdGFydCA9IGlcbiAgICAgIGlmIChiID49IDB4RDgwMCAmJiBiIDw9IDB4REZGRikgaSsrXG4gICAgICB2YXIgaCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuc2xpY2Uoc3RhcnQsIGkrMSkpLnN1YnN0cigxKS5zcGxpdCgnJScpXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoc3RyKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBkZWNvZGVVdGY4Q2hhciAoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkZGRCkgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cblxuLypcbiAqIFdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHZhbHVlIGlzIGEgdmFsaWQgaW50ZWdlci4gVGhpcyBtZWFucyB0aGF0IGl0XG4gKiBpcyBub24tbmVnYXRpdmUuIEl0IGhhcyBubyBmcmFjdGlvbmFsIGNvbXBvbmVudCBhbmQgdGhhdCBpdCBkb2VzIG5vdFxuICogZXhjZWVkIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHZlcmlmdWludCAodmFsdWUsIG1heCkge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPj0gMCwgJ3NwZWNpZmllZCBhIG5lZ2F0aXZlIHZhbHVlIGZvciB3cml0aW5nIGFuIHVuc2lnbmVkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGlzIGxhcmdlciB0aGFuIG1heGltdW0gdmFsdWUgZm9yIHR5cGUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZnNpbnQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZklFRUU3NTQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxufVxuXG5mdW5jdGlvbiBhc3NlcnQgKHRlc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKCF0ZXN0KSB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnRmFpbGVkIGFzc2VydGlvbicpXG59XG4iXX0=
}).call(this,require("U9cQDF"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\..\\Óli Tómas\\jobs\\kennitalajs\\node_modules\\buffer\\index.js","/..\\..\\..\\..\\Óli Tómas\\jobs\\kennitalajs\\node_modules\\buffer")
},{"U9cQDF":3,"base64-js":2,"buffer":4,"ieee754":5}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
"use strict";

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImV4cG9ydHMiLCJyZWFkIiwiYnVmZmVyIiwib2Zmc2V0IiwiaXNMRSIsIm1MZW4iLCJuQnl0ZXMiLCJlIiwibSIsImVMZW4iLCJlTWF4IiwiZUJpYXMiLCJuQml0cyIsImkiLCJkIiwicyIsIk5hTiIsIkluZmluaXR5IiwiTWF0aCIsInBvdyIsIndyaXRlIiwidmFsdWUiLCJjIiwicnQiLCJhYnMiLCJpc05hTiIsImZsb29yIiwibG9nIiwiTE4yIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxJQUFSLEdBQWUsVUFBVUMsTUFBVixFQUFrQkMsTUFBbEIsRUFBMEJDLElBQTFCLEVBQWdDQyxJQUFoQyxFQUFzQ0MsTUFBdEMsRUFBOEM7QUFDM0QsTUFBSUMsQ0FBSixFQUFPQyxDQUFQO0FBQ0EsTUFBSUMsT0FBUUgsU0FBUyxDQUFWLEdBQWVELElBQWYsR0FBc0IsQ0FBakM7QUFDQSxNQUFJSyxPQUFPLENBQUMsS0FBS0QsSUFBTixJQUFjLENBQXpCO0FBQ0EsTUFBSUUsUUFBUUQsUUFBUSxDQUFwQjtBQUNBLE1BQUlFLFFBQVEsQ0FBQyxDQUFiO0FBQ0EsTUFBSUMsSUFBSVQsT0FBUUUsU0FBUyxDQUFqQixHQUFzQixDQUE5QjtBQUNBLE1BQUlRLElBQUlWLE9BQU8sQ0FBQyxDQUFSLEdBQVksQ0FBcEI7QUFDQSxNQUFJVyxJQUFJYixPQUFPQyxTQUFTVSxDQUFoQixDQUFSOztBQUVBQSxPQUFLQyxDQUFMOztBQUVBUCxNQUFJUSxJQUFLLENBQUMsS0FBTSxDQUFDSCxLQUFSLElBQWtCLENBQTNCO0FBQ0FHLFFBQU8sQ0FBQ0gsS0FBUjtBQUNBQSxXQUFTSCxJQUFUO0FBQ0EsU0FBT0csUUFBUSxDQUFmLEVBQWtCTCxJQUFLQSxJQUFJLEdBQUwsR0FBWUwsT0FBT0MsU0FBU1UsQ0FBaEIsQ0FBaEIsRUFBb0NBLEtBQUtDLENBQXpDLEVBQTRDRixTQUFTLENBQXZFLEVBQTBFLENBQUU7O0FBRTVFSixNQUFJRCxJQUFL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QUdPLElBQUlILElBQUlJLEtBQUosSUFBYSxDQUFqQixFQUFvQjtBQUN6QkgsVUFBSSxDQUFFYSxRQUFRQyxDQUFULEdBQWMsQ0FBZixJQUFvQkosS0FBS0MsR0FBTCxDQUFTLENBQVQsRUFBWWQsSUFBWixDQUF4QjtBQUNBRSxVQUFJQSxJQUFJSSxLQUFSO0FBQ0QsS0FITSxNQUdBO0FBQ0xILFVBQUlhLFFBQVFILEtBQUtDLEdBQUwsQ0FBUyxDQUFULEVBQVlSLFFBQVEsQ0FBcEIsQ0FBUixHQUFpQ08sS0FBS0MsR0FBTCxDQUFTLENBQVQsRUFBWWQsSUFBWixDQUFyQztBQUNBRSxVQUFJLENBQUo7QUFDRDtBQUNGOztBQUVELFNBQU9GLFFBQVEsQ0FBZixFQUFrQkgsT0FBT0MsU0FBU1UsQ0FBaEIsSUFBcUJMLElBQUksSUFBekIsRUFBK0JLLEtBQUtDLENBQXBDLEVBQXVDTixLQUFLLEdBQTVDLEVBQWlESCxRQUFRLENBQTNFLEVBQThFLENBQUU7O0FBRWhGRSxNQUFLQSxLQUFLRixJQUFOLEdBQWNHLENBQWxCO0FBQ0FDLFVBQVFKLElBQVI7QUFDQSxTQUFPSSxPQUFPLENBQWQsRUFBaUJQLE9BQU9DLFNBQVNVLENBQWhCLElBQXFCTixJQUFJLElBQXpCLEVBQStCTSxLQUFLQyxDQUFwQyxFQUF1Q1AsS0FBSyxHQUE1QyxFQUFpREUsUUFBUSxDQUExRSxFQUE2RSxDQUFFOztBQUUvRVAsU0FBT0MsU0FBU1UsQ0FBVCxHQUFhQyxDQUFwQixLQUEwQkMsSUFBSSxHQUE5QjtBQUNELENBbEREIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSAoZSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSAobSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICgodmFsdWUgKiBjKSAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuIl19
}).call(this,require("U9cQDF"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\..\\Óli Tómas\\jobs\\kennitalajs\\node_modules\\ieee754\\index.js","/..\\..\\..\\..\\Óli Tómas\\jobs\\kennitalajs\\node_modules\\ieee754")
},{"U9cQDF":3,"buffer":4}]},{},[1])