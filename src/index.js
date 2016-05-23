class Kennitala{
    constructor(kennitala) {
        let kt = kennitala.toString();
        kt = kt.replace(/-/g, '');
        const validate = this.isValid(kt);

        if(validate.valid){
            this.type = this.getType(kt);
            const age = this.getAge(kt);

            return{
                valid: validate.valid,
                type: this.type,
                age: age.years,
                msAge: age.msAge,
                birthdayToday: age.birthdayToday,
                kt: parseInt(kt, 10)
            }
        }else{
            return{
                valid: validate.valid,
                reason: validate.reason,
                errorCode: validate.errorCode
            }
        }
    }

    existanceInYears(birthday) {
        var today = new Date();
        var age = today.getUTCFullYear() - birthday.getUTCFullYear();
        var m = today.getUTCMonth() - birthday.getUTCMonth();
        if (m < 0 || (m === 0 && today.getUTCDate() < birthday.getUTCDate())) {
            age--;
        }
        return age;
    }

    getAge(kt) {
        // This function returns persons age in years and in millisecond along with a boolean
        // stating if the kennitala owner has a birthday today
        const list = kt.split('');

        let century;

        if(list[9] === '0'){
            century = 20;
        }else if(list[9] === '9'){
            century = 19;
        }else if(list[9] === '8'){
            century = 18;
        }

        const now = new Date();
        const nowMonth = now.getUTCMonth(); //Javascript month (actual month - 1)
        const nowDay = now.getUTCDate();

        const month = parseInt(list[2] + list[3], 10) - 1; //Javascript month (actual month - 1)
        const day = this.type === 'person' ? parseInt(list[0] + list[1], 10) : parseInt((list[0] - 4) + list[1], 10);
        const birthday = new Date(parseInt(century + list[4] + list[5], 10), month, day);

        const birthdayToday = (nowMonth === month && nowDay === day) ? true : false;

        return {
            years: this.existanceInYears(birthday),
            msAge: now - birthday,
            birthdayToday
        };
    }

    getType(kt) {
        const list = kt.split('');

        // Checking if first two digits are between 41 and 71
        // if so then this kennitala is a compnay kennitala
        const dd = parseInt(list[0] + list[1], 10);
        if(dd > 40 && dd < 72) return 'company';

        return 'person';
    }

    isValid(kt) {
        if(kt.length !== 10) return {valid: false, reason: 'Kennitala is too short', errorCode: 1};

        const list = kt.split('');

        // Validating digits 1 and 2
        const dd = parseInt(list[0] + list[1], 10);
        if(!(dd > 0 && dd < 72) || (dd > 31 && dd < 42)) return {valid: false, reason: 'Birthdate is out of range (digits 1 and 2)', errorCode: 2};

        // Validating digits 3 and 4
        const mm = parseInt(list[2] + list[3], 10);
        if(!(mm > 0 && mm < 13)) return {valid: false, reason: 'Month digits are out of range (digits 3 and 4)', errorCode: 3};

        //Digits 5,6,7 and 8 can be anything so we cant validate them

        // We are storing this in a variable because we need to increement this
        // if the calculated "vartala" is 10 and then recalculate with the incremented value
        this.currentRadtala = parseInt(list[6] + list[7], 10);

        // Turning list of numbers to int (from string)
        // since we will be working with ints from now on
        list.map((value)=> {
            return parseInt(value, 10);
        });

        //Validating digit 9
        if(this.validateNine(list) === false) return {valid: false, reason: 'Digit 9 is not valid. Read about "Níundi stafurinn" here: https://is.wikipedia.org/wiki/Kennitala', errorCode: 4};

        //Validating digit 10
        const lastDigit = parseInt(list[9], 10);
        if(!(lastDigit === 0 || lastDigit === 8 || lastDigit ===9)) return {valid: false, reason: 'Century digit out of range (digit 10)', errorCode: 5};

        return {valid: true};
    }

    calculateVartala(list, incrementRadtala) {
        // Vartala is digit number 9
        // This url explains how its calculated: https://is.wikipedia.org/wiki/Kennitala'

        if(incrementRadtala){
            this.currentRadtala++;
        }

        const radtala = ('0' + this.currentRadtala.toString()).slice(-2).split('');

        const radtalaOne = parseInt(radtala[0], 10);
        const radtalaTwo = parseInt(radtala[1], 10);

        const sum = (list[0] * 3) +(list[1] * 2) + (list[2] * 7) + (list[3] * 6) + (list[4] * 5) + (list[5] * 4) + (radtalaOne * 3) + (radtalaTwo * 2);

        const vartala = 11 - (sum % 11);
        return vartala;
    }

    validateNine(list) {

        let vartala = this.calculateVartala(list);

        if(vartala === 10){
            while (v === 10) {
                const calcAgain = calculateVartala(list, true);
                if(calcAgain !== 10) vartala = calcAgain;
                v = calcAgain;
            }
        }

        if(vartala === 11) vartala = 0;

        if(vartala === parseInt(list[8], 10)){
            return true;
        }

        return false;
    }
}

global.Kennitala = Kennitala;